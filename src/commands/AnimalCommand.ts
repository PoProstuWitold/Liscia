import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import { ArgsNotEmpty } from '../utils/decorators/musicDecorators'
import axios from 'axios'
import { createMessageEmbed } from '../utils/createEmbedMessage'

@DefineCommand({
	aliases: ['pet'],
	description: 'Send random fact',
	name: 'animal',
	usage: `${botConfig.prefix}animal <dog|cat|panda|fox|bird>`,
	cooldown: 4,
	permissions: []
})
export class AnimalCommand extends BaseCommand {
    @ArgsNotEmpty(['dog', 'cat', 'panda', 'fox', 'bird'], 1)
	public async execute(message: Message, args: string[]): Promise<void> {

		const { data } = await axios.get(`https://some-random-api.ml/animal/${args[0]}`)

		message.channel.send({
			embeds: [
				createMessageEmbed({
					title: `${args[0]} fact`,
					description: `${data.fact}`
				}).setImage(`${data.image}`)
			]
		})
	}
}
