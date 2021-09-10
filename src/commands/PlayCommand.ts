/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { GuildMember, Message } from 'discord.js'
import { botConfig } from '../config'
import emojis from '../utils/emojis'

@DefineCommand({
	aliases: ['p', 'pley', 'paly'],
	description: 'Plays a song or playlist in your voice channel',
	name: 'play',
	usage: `${botConfig.prefix}play <youtube video or playlist link>`,
	cooldown: 2,
	permissions: ['ADMINISTRATOR']
})
export class PlayCommand extends BaseCommand {
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
			// const guild = message.member?.guild
			// const channel = message.member?.voice.channel
			// const voiceChannel = message.member?.guild.me?.voice.channel
			// console.log(args)
			// console.log('channel', channel!.id)
			if(!channel) {
				message.reply({
					embeds: [
						createMessageEmbed({ title: 'Error', description: `${emojis.fail} Please join VoiceChannel First!` })
					]
				})

				return
			}


			if(channel.guild.me?.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				message.reply({
					embeds: [
						createMessageEmbed({ title: 'Error', description: `${emojis.fail} I am already connected somewhere else!` })
					]
				})
                
				return
			}

			if (!args[0]) {
				message.reply({
					embeds: [
						createMessageEmbed({ title: 'Error', description: 'Please add a Search Query!' })
					],
				})

				return
			}

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
				await message.client.distube.playVoiceChannel(channel, song, {
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
				
				setInterval(() => {
					// console.log(queue?.songs.length)
					let nextSong: string | undefined
					queue?.songs[1] ? nextSong = queue?.songs[1].name : undefined

					let previousSong: string | undefined
					queue?.previousSongs[0] ? previousSong = queue?.previousSongs[0].name : undefined

					queue?.songs.length === 0 ? undefined :
						newmsg.edit(
							{
							//@ts-ignore
								embeds: [
									createMessageEmbed({ title: `There are ${queue?.songs.length} songs in queue`, description: `
                                    **SONG INFO**
                                    name: \`\`${queue?.songs[0].name}\`\`
                                    duration: \`\`${queue?.songs[0].formattedDuration}\`\`
                                    source: \`\`${queue?.songs[0].source}\`\`
                                    streamURL: **[Download](${queue?.songs[0].streamURL})**

                                    **GENERAL INFO**
                                    volume: \`\`${queue?.volume}\`\`

                                    **QUEUE INFO**
                                    duration: \`\`${queue?.formattedDuration}\`\`
                                    next: \`\`${nextSong}\`\`
                                    current: \`\`${queue?.songs[0].name}\`\`
                                    previous: \`\`${previousSong}\`\`
                                        ` }).setImage(`${queue?.songs[0].thumbnail}`)
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
			return
		}
	}
}
