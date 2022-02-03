import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import { ArgsNotEmpty } from '../utils/decorators/musicDecorators'
import axios from 'axios'

@DefineCommand({
	aliases: ['ani'],
	description: 'Send random anime gif',
	name: 'anime',
	usage: `${botConfig.prefix}anime <wink|pat|hug>`,
	cooldown: 4,
	permissions: []
})
export class AnimeCommand extends BaseCommand {
    @ArgsNotEmpty(['wink', 'pat', 'hug'], 1)
	public async execute(message: Message, args: string[]): Promise<void> {

		const { data } = await axios.get(`https://some-random-api.ml/animu/${args[0]}`)

		message.channel.send(`${data.link}`)
	}
}
