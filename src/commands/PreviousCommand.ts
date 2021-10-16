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
	aliases: ['previous', 'previosu', 'pre'],
	description: 'Plays previous song',
	name: 'previous',
	usage: `${botConfig.prefix}previous`,
	cooldown: 2,
	permissions: ['ADMINISTRATOR']
})
export class PreviousCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist()
	public async execute(message: Message): Promise<void> {
		const queue = message.client.distube.getQueue(message)
		try {
			const song = await queue!.previous()
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Success',
						description: `Now playing: ${song.name}`
					})
				]
			})
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
