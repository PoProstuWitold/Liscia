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
				content: `🔍 Searching... \`\`\`${song}\`\`\``,
			}).catch(e => {
				console.log(e)
			})

			try {
				let queue = message.client.distube.getQueue(guildId!)
				let options = {
					member: member as GuildMember,
				}
				//@ts-ignore
				if (!queue) {
					//@ts-ignore
					options.textChannel = guild.channels.cache.get(channelId)
				}
				await message.client.distube.playVoiceChannel(channel, song, {
					member: member as GuildMember,
					message: message,
					textChannel: guild.channels.cache.get(channelId)
				})
				//Edit the reply
				newmsg.edit({
					//@ts-ignore
					content: `${queue?.songs?.length > 0 ? '👍 Added' : '🎶 Now Playing'}: \`\`\`css\n${song}\n\`\`\``,
				}).catch((err: any)=> {
					console.log(err)
				})
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
