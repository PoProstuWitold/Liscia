import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import { DoesMusicQueueExist, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'

@DefineCommand({
	aliases: ['resyume', 'resume', 'res'],
	description: 'Resumes song',
	name: 'resume',
	usage: `${botConfig.prefix}resume`,
	cooldown: 2,
	permissions: []
})
export class ResumeCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist()
	public async execute(message: Message): Promise<void> {
		const queue = message.client.distube.getQueue(message)

		if(!queue) {
			return undefined
		}

		if (!queue.paused) {
			queue.pause()
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Success',
						description: 'Song paused :D'
					})
				]
			})
			return
		}
        
		queue.resume()
		message.channel.send({
			embeds: [
				createMessageEmbed({
					title: 'Success',
					description: 'Song resumed :d'
				})
			]
		})
	}
}
