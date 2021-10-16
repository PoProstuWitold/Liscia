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
	aliases: ['step', 'st'],
	description: 'Stops a queue',
	name: 'stop',
	usage: `${botConfig.prefix}stop`,
	cooldown: 2,
	permissions: ['ADMINISTRATOR']
})
export class StopCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist()
	public async execute(message: Message): Promise<void> {
		const queue = message.client.distube.getQueue(message)

		try {
			queue?.stop()
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Stop',
						description: 'Queue has been stopped'
					})
				]
			})

			return
		} catch (e) {
			console.log(e)
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Error',
						description: 'Unexpected error, told Witold as fast as possible'
					})
				]
			})
		}
	}
}
