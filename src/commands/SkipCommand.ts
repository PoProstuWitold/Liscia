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
	aliases: ['sk', 's'],
	description: 'Skips a song in your voice channel',
	name: 'skip',
	usage: `${botConfig.prefix}skip`,
	cooldown: 2,
	permissions: ['ADMINISTRATOR']
})
export class SkipCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist(true)
	public async execute(message: Message): Promise<void> {
		const queue = message.client.distube.getQueue(message)
		if (queue!.songs.length == 1) {
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Error',
						description: 'There is nothing in the queue right now!'
					})
				]
			})

			return
		}

		try {
			const song = await queue!.skip()
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Success',
						description: `Skipped! Now playing:\n${song.name}`
					})
				]
			})
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
