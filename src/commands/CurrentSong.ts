/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { ButtonInteraction, CacheType, Interaction, InteractionCollector, Message, MessageComponentInteraction, PartialMessage } from 'discord.js'
import { botConfig } from '../config'
import { DoesMusicQueueExist, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'
import { row, row2, row3 } from '../utils/button-rows'
import { editCustomMessage, songButtonCollector } from '../events/songButtonCollector'
import { currentSongEmbed } from '../utils/currentSongEmbed'
import { Queue } from 'distube'
import { debounce } from 'debounce';

@DefineCommand({
	aliases: ['cu', 'now', 'this'],
	description: 'Give the info about currently playing song',
	name: 'current',
	usage: `${botConfig.prefix}current`,
	cooldown: 30,
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

			// console.log('customMessage.id from command', customMessage.id)

			const filter = (interaction: Interaction) => {
				if(interaction.user.id === message.author.id) return true
				return false
			}

			const editInterval = setInterval(async () => {
				queue?.songs[1] ? _nextSong = queue?.songs[1].name : _nextSong = 'No next song'
				queue?.previousSongs[0] ? _previousSong = queue?.previousSongs[queue?.previousSongs.length - 1].name : _previousSong = 'No previous song'
				debounce(await editCustomMessage(customMessage, queue, _nextSong, _previousSong), 1000)
			}, 3000)

			const collector: InteractionCollector<ButtonInteraction<CacheType>> = message.channel.createMessageComponentCollector({
				filter,
				time: 300000, // 5 minutes
				componentType: 'BUTTON',
				max: 100
			})

			setTimeout(() => {
				clearInterval(editInterval)
			}, 295000)

			collector.on('collect', async (reaction: MessageComponentInteraction) => {
				await songButtonCollector(reaction, message, customMessage)
			})

			message.client
				.on('messageDelete', (message: Message<boolean> | PartialMessage)  => {
					if(message.id === customMessage.id) {
						// console.log()
						console.log('Custom message deleted. Clearing interval...')
						clearInterval(editInterval)
						collector.stop();
					}
				})
				.on('messageCreate', async (message: Message) => {
					// const command = this.get(cmd!) ?? this.get(this.aliases.get(cmd!)!)
					const args = message.content.substring(this.client.config.prefix.length).trim().split(/ +/)
					const cmd = args.shift()?.toLowerCase()
					if(!cmd) {
						return undefined
					}
					const command = message.client.commands.get(cmd) ?? message.client.commands.get(message.client.commands.aliases.get(cmd)!)
					console.log(command?.meta.name);
					if(command?.meta.name === 'current') {
						console.log('Command duplication. Clearing interval...')
						customMessage.delete()
						clearInterval(editInterval)
						collector.stop();
					}
				})

			message.client.distube
				.on('disconnect', async () => {
					console.log('Bot disconnected. Clearing interval...')
					clearInterval(editInterval)
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
