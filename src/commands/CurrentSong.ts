/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Interaction, Message, MessageComponentInteraction } from 'discord.js'
import { botConfig } from '../config'
import { DoesMusicQueueExist, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'
import { row, row2, row3 } from '../utils/button-rows'
import { editCustomMessage, songButtonCollector } from '../events/songButtonCollector'
import { currentSongEmbed } from '../utils/currentSongEmbed'
import { Queue } from 'distube'
import util from 'util'

const wait = util.promisify(setTimeout)

@DefineCommand({
	aliases: ['cu', 'now', 'this'],
	description: 'Give the info about currently playing song',
	name: 'current',
	usage: `${botConfig.prefix}current`,
	cooldown: 10,
	permissions: []
})
export class CurrentSong extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist()
	public async execute(message: Message): Promise<void> {
		try {
			const queue: Queue | undefined = message.client.distube.getQueue(message)
			let nextSong: string | undefined
			let previousSong: string | undefined
			let _nextSong: string | undefined
			let _previousSong: string | undefined

			queue?.songs[1] ? nextSong = queue?.songs[1].name : nextSong = 'No next song'
			queue?.previousSongs[0] ? previousSong = queue?.previousSongs[queue?.previousSongs.length - 1].name : previousSong = 'No previous song'


			const customMessage: any = await message.reply({
				embeds: [
					currentSongEmbed(queue, nextSong, previousSong)
				],
				components: [
					row, row2, row3
				],
			}).catch(e => {
				console.log(e)
			})

			const filter = (interaction: Interaction) => {
				if(interaction.user.id === message.author.id) return true
				return false
			}

			const collector = message.channel.createMessageComponentCollector({
				filter,
				time: 300000, // 5 minutes
				componentType: 'BUTTON',
				max: 100
			})

			collector.on('collect', async (reaction: MessageComponentInteraction) => {
				await songButtonCollector(reaction, message, customMessage)
			})

			message.client.distube.on('playSong', async () => {
				await wait(3000)

				queue?.songs[1] ? _nextSong = queue?.songs[1].name : _nextSong = 'No next song'
				queue?.previousSongs[0] ? _previousSong = queue?.previousSongs[queue?.previousSongs.length - 1].name : _previousSong = 'No previous song'

				editCustomMessage(customMessage, queue, _nextSong, _previousSong)
			})

		} catch (err) {
			console.log(err)
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Error',
						description: 'Unexpected error, report it to Witold as fast as possible'
					})
				]
			})
		}
	}
}
