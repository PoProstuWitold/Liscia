/* eslint-disable indent */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { GuildMember, Interaction, Message, MessageComponentInteraction, Collection } from 'discord.js'
import { botConfig } from '../config'
import { ArgsNotEmpty, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'
import { songButtonCollector } from '../events/songButtonCollector'
import { row, row2, row3 } from '../utils/button-rows'

@DefineCommand({
	aliases: ['p', 'pley', 'paly'],
	description: 'Plays a song or playlist in your voice channel',
	name: 'play',
	usage: `${botConfig.prefix}play <youtube video or playlist link>`,
	cooldown: 2,
	permissions: ['ADMINISTRATOR']
})
export class PlayCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @ArgsNotEmpty()
	public async execute(message: Message, args: string[]): Promise<void> {
		try {

			const {
				member,
				channelId,
				guildId
			} = message;
			const {
				//@ts-ignore
				guild
			} = member;
			const {
				channel
				//@ts-ignore
			} = member.voice

			const song = args.join(' ')
			const newmsg: any = await message.reply({
				embeds: [createMessageEmbed({
					title: '🔍 Searching... ',
					description: `\`\`\`${song}\`\`\``
				})],
			}).catch(e => {
				console.log(e)
			})
			
			try {
				await message.client.distube.playVoiceChannel(channel!, song, {
					member: member as GuildMember,
					message: message,
					textChannel: guild.channels.cache.get(channelId)
				})
				let queue = message.client.distube.getQueue(guildId!)
				//Edit the reply


				await newmsg.edit(
					{
					//@ts-ignore
						embeds: [createMessageEmbed({ title: `${queue?.songs?.length > 1 ? '👍 Added' : '🎶 Now Playing'}`, 
							description: ` 
                            \`\`\`css\n${song}\n\`\`\`
                        ` })],
				    }
				).catch((err: any)=> {
					console.log(err)
				})
				
				setInterval(async () => {
                    

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

					// collector.on('collect', (m: MessageComponentInteraction) => {
					// 	console.log(`Collected ${m.message.content}`)
					// })
                    
					collector.on('end', (collected: Collection<string, MessageComponentInteraction>) => {
                        songButtonCollector(collected, message)
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
				// console.log(err.stack ? err.stack : err)
				message.reply({
					content: ' Error: ',
					embeds: [
						createMessageEmbed({ title: 'Error', description: `\`\`\`${err}\`\`\`` })
					],

				})
			}


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
