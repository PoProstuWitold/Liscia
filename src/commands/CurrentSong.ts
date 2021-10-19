/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Interaction, Message, MessageComponentInteraction, Collection } from 'discord.js'
import { botConfig } from '../config'
import { DoesMusicQueueExist, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'
import { row, row2, row3 } from '../utils/button-rows'
import { songButtonCollector } from '../events/songButtonCollector'

@DefineCommand({
	aliases: ['cu', 'now', 'this'],
	description: 'Give the info about currently playing song',
	name: 'current',
	usage: `${botConfig.prefix}current`,
	cooldown: 10,
	permissions: ['ADMINISTRATOR']
})
export class CurrentSong extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist()
	public async execute(message: Message): Promise<void> {
		try {
			const queue = message.client.distube.getQueue(message)


			const newmsg: any = await message.reply({
				embeds: [createMessageEmbed({
					title: '🔍 Getting current song info',
					description: 'It may take a while'
				})],
			}).catch(e => {
				console.log(e)
			})

			setInterval(() => {

				const filter = (interaction: Interaction) => {
					if(interaction.user.id === message.author.id) return true
					return false
				}

				const collector = message.channel.createMessageComponentCollector({
					filter,
					time: 10000,
					interactionType: 'MESSAGE_COMPONENT',
					componentType: 'BUTTON',
					max: 1
				})

				collector.on('end', async (collected: Collection<string, MessageComponentInteraction>) => {
					await songButtonCollector(collected, message)
				})

				// console.log(queue?.songs.length)
				let nextSong: string | undefined
				queue?.songs[1] ? nextSong = queue?.songs[1].name : undefined

				let previousSong: string | undefined
				queue?.previousSongs[0] ? previousSong = queue?.previousSongs[queue?.previousSongs.length - 1].name : undefined

				queue?.songs.length === 0 ? undefined :
					newmsg.edit(
						{
						//@ts-ignore
							embeds: [
								createMessageEmbed({ title: 'Music info', description:
                                    `There are ${queue?.songs.length} songs in queue`}).setImage(`${queue?.songs[0].thumbnail}`)
									.addField('**SONG INFO', '')
									.addField('name', `${queue?.songs[0].name}`)
									.addField('duration', `${queue?.songs[0].formattedDuration}`)
									.addField('source', `${queue?.songs[0].source}`, true)
									.addField('download', `**[Download](${queue?.songs[0].streamURL})**`, true)
									.addField('url', `${queue?.songs[0].url}`)
									.addField('**QUEUE INFO**', '')
									.addField('volume', `${queue?.volume}`)
									.addField('duration', `${queue?.formattedDuration}`)
									.addField('next', `${nextSong}`)
									.addField('current', `${queue?.songs[0].name}`)
									.addField('previous', `${previousSong}`)
							],
							components: [
								row, row2, row3
							]
						}
					).catch((err: any)=> {
						console.log(err)    
					})
			}, 5000)
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
