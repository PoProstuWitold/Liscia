import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import axios from 'axios'

@DefineCommand({
	aliases: ['jk'],
	description: 'Send random joke',
	name: 'joke',
	usage: `${botConfig.prefix}joke`,
	cooldown: 4,
	permissions: []
})
export class JokeCommand extends BaseCommand {
	public async execute(message: Message): Promise<void> {

		const { data } = await axios.get('https://some-random-api.ml/joke')

		message.channel.send(`${data.joke}`)
	}
}
