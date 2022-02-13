import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import { ArgsNotEmpty, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'

@DefineCommand({
	aliases: ['sekk', 'see'],
	description: 'Seek to given time',
	name: 'seek',
	usage: `${botConfig.prefix}seek <time in seconds | time in format mm:ss>`,
	cooldown: 10,
	permissions: []
})
export class SeekCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @ArgsNotEmpty()
	public async execute(message: Message, args: string[]): Promise<void> {
		const queue = message.client.distube.getQueue(message)

		if(!queue) {
			return undefined
		}

		if(!args[0]) {
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Error',
						description: 'Please provide position (in seconds) to seek!'
					})
				]
			})
		}

		const minSecRegEx = new RegExp(/^[0-5]?\d:[0-5]\d$/gm)

		let time: number;
		if(args[0].match(minSecRegEx)) {
			const newTime = args[0].split(':')
			console.log(newTime[0], newTime[1])
			const minutes = newTime[0].startsWith('0') ? newTime[0].substring(1) : newTime[0]
			const seconds = newTime[1].startsWith('0') ? newTime[1].substring(1) : newTime[1]
			time = parseInt(minutes) * 60 + parseInt(seconds) * 1
		} else {
			time = Number(args[0])
		}

		

		if (isNaN(time)) message.channel.send({
			embeds: [
				createMessageEmbed({
					title: 'Error',
					description: 'Please, enter a valid number'
				})
			]
		})
		queue.seek(time)
		message.channel.send({
        	embeds: [
        		createMessageEmbed({
        			title: 'Success',
        			description: `Seeked to \`${time}s\``
        		})
        	]
		})
	}
}
