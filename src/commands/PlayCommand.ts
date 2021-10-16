/* eslint-disable indent */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { GuildMember, Interaction, Message, MessageActionRow, MessageButton, MessageComponentInteraction, Collection } from 'discord.js'
import { botConfig } from '../config'
import { ArgsNotEmpty, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'
import { songButtonCollector } from '../events/songButtonCollector'

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

					const row = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('pause')
								.setLabel('Pause')
								.setStyle('SUCCESS'),
							new MessageButton()
								.setCustomId('resume')
								.setLabel('Resume')
								.setStyle('SUCCESS'),
							new MessageButton()
								.setCustomId('stop')
								.setLabel('Stop')
								.setStyle('DANGER'),
							new MessageButton()
								.setCustomId('skip')
								.setLabel('Skip')
								.setStyle('SECONDARY'),
							new MessageButton()
								.setCustomId('previous')
								.setLabel('Previous')
								.setStyle('SECONDARY')						
						)

					const row2 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('volume-up')
								.setLabel('Boost volume')
								.setStyle('PRIMARY'),
							new MessageButton()
								.setCustomId('volume-down')
								.setLabel('Reduce volume')
								.setStyle('PRIMARY'),
							new MessageButton()
								.setLabel('GitHub')
								.setStyle('LINK')
								.setURL('https://github.com/PoProstuWitold')
						)
                    

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
								],
								components: [
									row, row2
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
