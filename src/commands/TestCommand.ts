/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { Message } from 'discord.js'
import { botConfig } from '../config'

@DefineCommand({
	aliases: [],
	description: 'Gówno w dupsku',
	name: 'tescik',
	usage: `${botConfig.prefix}tescik`,
	cooldown: 4,
	permissions: []
})
export class TestCommand extends BaseCommand {
	public async execute(message: Message, args: string[]): Promise<void> {
		const string = args.join(' ')
		if (!string) message.channel.send(' Please enter a song url or query to search.')
		try {
			// console.log('queues', message.client.distube.queues)
			return message.client.distube.play(message, string)
		} catch (e) {
			message.channel.send(`Error: \`${e}\``)
		}
	}
}
