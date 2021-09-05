/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Message, Collection, Snowflake, TextChannel } from 'discord.js'
import { promises as fs } from 'fs'
import { parse, resolve } from 'path'
import { DiscordBot } from '../structures/discordBot'
import { reactor } from './reactor'
import { createMessageEmbed } from './createEmbedMessage'
import { ICommandComponent } from '../typings'

/** Handler for bot commands issued by users. */
export class CommandHandler extends Collection<string, ICommandComponent> {
    public readonly aliases: Collection<string, string> = new Collection()
    public readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection()
    public readonly commands: ICommandComponent[] = []
    public constructor(public client: DiscordBot, public readonly path: string) { 
    	super() 
    }
     
    public load(): void {
    	fs.readdir(resolve(this.path))
    		.then(async files => {
    			let disabledCount = 0
    			for (const file of files) {
    				const path = resolve(this.path, file)
    				const command = await this.import(path, this.client, { path })
    				if (command === undefined) throw new Error(`File ${file} is not a valid command file`)
    				command.meta = Object.assign(command.meta, { path })
    				if (Number(command.meta.aliases?.length) > 0) {
    					command.meta.aliases?.forEach(alias => {
    						this.aliases.set(alias, command.meta.name)
    						console.log('alliases', this.aliases)
    					})
    				}
    				this.set(command.meta.name, command)
    				if (command.meta.disable === true) disabledCount++
    			}
    			this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ''} A total of ${files.length} commands has been loaded.`)
    			if (disabledCount !== 0) this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ''} ${disabledCount} out of ${files.length} commands is disabled.`)
    		})
    		.catch(err => this.client.logger.error('COMMAND_HANDLER_ERR:', err))

    	return undefined
    }

    public async handle(message: Message): Promise<any> {

    	// WORKS

    	if (message.author.bot || !this.isCommand(message)) {
    		// For some reasons always get triggered even if command it's valid
    	    // console.log(this.isCommand(message))
    		return
    	}

    	let embed

    	const args = message.content.substring(this.client.config.prefix.length).trim().split(/ +/)
    	const cmd = args.shift()?.toLowerCase()
    	const command = this.get(cmd!) ?? this.get(this.aliases.get(cmd!)!)
    	if (!command || command.meta.disable) return undefined
    	if (!this.cooldowns.has(command.meta.name)) this.cooldowns.set(command.meta.name, new Collection())
        
    	const now = Date.now()
    	const timestamps = this.cooldowns.get(command.meta.name)
    	const cooldownAmount = (command.meta.cooldown ?? 3) * 1000
    	if (timestamps?.has(message.author.id)) {
    		const expirationTime = timestamps.get(message.author.id)! + cooldownAmount
    		if (now < expirationTime) {
    			const timeLeft = (expirationTime - now) / 1000
    			embed = createMessageEmbed({ title: 'Cooldown', description: `You must wait ${timeLeft}s to use this command again` })
    			await message.reply({ embeds: [embed] })
    				.then(msg => {
    					setTimeout(() => msg.delete().catch(e => this.client.logger.error('COMMAND_HANDLER_ERR:', e)), 5000)
    				}).catch(e => this.client.logger.error('COMMAND_HANDLER_ERR:', e))
    			await reactor.failure(message)
    			return undefined
    		}

    		timestamps.set(message.author.id, now);
    		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    	} else {
    		timestamps?.set(message.author.id, now);
    		// if (this.client.config.owners.includes(message.author.id)) timestamps?.delete(message.author.id)
    	}
    	try {
    		return command.execute(message, args)
    	} catch (e) {
    		this.client.logger.error('COMMAND_HANDLER_ERR:', e)
    	} finally {
    		this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ''} ${message.author.tag} is using ` +
    	    `${command.meta.name} command on ${message.guild ? `${message.guild.name} in #${(message.channel as TextChannel).name} channel` : 'DM Channel'}`)
    	}

    	if (message.author.bot || !this.isCommand(message)) {
    		return
    	}
    }

    /** Determines whether or not a message is a user command. */
    private isCommand(message: Message): boolean {
    	return message.content.startsWith(this.client.config.prefix)
    }

    private async import(path: string, ...args: any[]): Promise<ICommandComponent | undefined> {
    	const file = (await import(resolve(path)).then(m => m[parse(path).name]))
    	return file ? new file(...args) : undefined
    }
}