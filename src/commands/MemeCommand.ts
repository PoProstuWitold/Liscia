import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import axios from 'axios'
import { createMessageEmbed } from '../utils/createEmbedMessage'

@DefineCommand({
	aliases: ['mem'],
	description: 'Send random meme',
	name: 'meme',
	usage: `${botConfig.prefix}meme`,
	cooldown: 4,
	permissions: []
})
export class MemeCommand extends BaseCommand {
	public async execute(message: Message): Promise<void> {

		const { data } = await axios.get('https://some-random-api.ml/meme')

		message.channel.send({
			embeds: [
				createMessageEmbed({
					title: `${data.caption}`,
					description: `**category:** ${data.category}`
				}).setImage(`${data.image}`).setFooter({ text: `ID: ${data.id}` })
			]
		})
	}
}
