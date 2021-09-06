/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Message } from 'discord.js'
import { botConfig } from '../config'
@DefineCommand({
	aliases: ['halp', 'hlep', 'h', 'commands', 'cmds'],
	description: 'Show the commands list',
	name: 'help',
	usage: `${botConfig.prefix}help <command>`,
	cooldown: 4,
	permissions: []
})
export class HelpCommand extends BaseCommand {
	public async execute(message: Message, args: string[]): Promise<void> {
		const command = message.client.commands.get(args[0]) ??
            message.client.commands.get(message.client.commands.aliases.get(args[0])!)

		if (command && !command.meta.disable) {
			message.channel.send({ embeds: [
				createMessageEmbed({ title: `Information for the ${command.meta.name} command`, description: ''})
				//@ts-ignore
					.addFields({ name: 'Name', value: `${command.meta.name}`, inline: false },
						{ name: 'Description', value: command.meta.description, inline: true },
						{ name: 'Aliases', value: `${Number(command.meta.aliases?.length) > 0 ? command.meta.aliases?.map(c => `${c}`).join(', ') as string : 'None.'}`, inline: false },
						{ name: 'Usage', value: `${command.meta.usage}`, inline: true })
			] })
		} else {
			message.channel.send({
				embeds: [
					createMessageEmbed({ title: 'Information for all available commands', description: `
                        ${message.client.commands.filter(cmd => !cmd.meta.disable).map(c => `**\`${c.meta.name}\`**`).join(' ')}
                    ` }).setAuthor(`${message.client.user!.username} - Command List`)
						.setThumbnail(message.client.user?.displayAvatarURL() as string)
						.setFooter(`Use ${message.client.config.prefix}help <command> to get information on a specific command.`)
				]
			})
		}

	}
}
