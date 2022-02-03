import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import { DoesMusicQueueExist, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'

@DefineCommand({
	aliases: ['step', 'st'],
	description: 'Stops a queue',
	name: 'stop',
	usage: `${botConfig.prefix}stop`,
	cooldown: 5,
	permissions: []
})
export class StopCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist()
	public async execute(message: Message): Promise<void> {
		const queue = message.client.distube.getQueue(message)

		if(!queue) {
			return undefined
		}

		try {
			queue.stop()
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Stop',
						description: 'Queue has been stopped'
					})
				]
			})

			return
		} catch (err) {
			console.log(err)
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Error',
						description: 'Unexpected error, tell Witold as fast as possible'
					})
				]
			})
		}
	}
}
