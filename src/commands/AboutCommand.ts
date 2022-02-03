import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Message } from 'discord.js'
import { botConfig } from '../config'

@DefineCommand({
	aliases: ['botinfo', 'info', 'stats'],
	description: 'Send the information about the bot',
	name: 'about',
	usage: `${botConfig.prefix}about`,
	cooldown: 4,
	permissions: []
})
export class AboutCommand extends BaseCommand {
	public async execute(message: Message): Promise<void> {
		message.channel.send({
			embeds: [
				createMessageEmbed({ title: 'Basic info', description: 'Bot owner: **PoProstuWitold**' })
					.addField('Server name', `${message.guild?.name}`)
					// TO DO
			]
		})
	}
}
