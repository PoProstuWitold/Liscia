/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import { DoesMusicQueueExist, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'

@DefineCommand({
	aliases: ['pasaue', 'pasue', 'paseu'],
	description: 'Pauses song',
	name: 'pause',
	usage: `${botConfig.prefix}pause`,
	cooldown: 2,
	permissions: ['ADMINISTRATOR']
})
export class PauseCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist()
	public async execute(message: Message): Promise<void> {
		const queue = message.client.distube.getQueue(message)
		if (queue!.paused) {
			queue!.resume()
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Success',
						description: 'Song resumed :D'
					})
				]
			})
			return
		}
        
		queue!.pause()
		message.channel.send({
			embeds: [
				createMessageEmbed({
					title: 'Success',
					description: 'Song paused :d'
				})
			]
		})
	}
}
