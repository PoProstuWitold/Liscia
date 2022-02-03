/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { GuildMember, Message, GuildTextBasedChannel } from 'discord.js'
import { botConfig } from '../config'
import { ArgsNotEmpty, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'

@DefineCommand({
	aliases: ['p', 'pley', 'paly'],
	description: 'Plays a song or playlist in your voice channel',
	name: 'play',
	usage: `${botConfig.prefix}play <youtube video or playlist link>`,
	cooldown: 2,
	permissions: []
})
export class PlayCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @ArgsNotEmpty()
	public async execute(message: Message, args: string[]): Promise<void> {
		try {

			const { member, channelId, guildId } = message

			if(!member || !channelId || !guildId) {
				return undefined
			}

			const { guild } = member

			const { channel } = member.voice

			if(!channel) {
				return undefined
			}

			const song = args.join(' ')

			const customMessage: any = await message.reply({
				embeds: [createMessageEmbed({
					title: '🔍 Searching... \n Getting your song(s)',
					description: `\`\`\`${song}\`\`\``
				})],
			}).catch(e => {
				console.log(e)
			})
			
			
			try {
				await message.client.distube.play(channel, song, {
					member: member as GuildMember,
					message,
					textChannel: guild.channels.cache.get(channelId) as GuildTextBasedChannel
				})

				const queue = message.client.distube.getQueue(guildId)


				await customMessage.edit(
					{
						embeds: [createMessageEmbed({ title: `${queue?.songs?.length && queue?.songs?.length > 1 ? '👍 Added' : '🎶 Playing'} \n Type \`\`\`${botConfig.prefix}current\`\`\` to get more info`, 
							description: ` 
                            \`\`\`css\n${song}\n\`\`\`
                        ` })],
				    }
				).catch((err: any)=> {
					console.log(err)
				})
				
				setTimeout(() => {
					customMessage.delete()
				}, 7000)

			} catch (err) {
				message.reply({
					content: ' Error: ',
					embeds: [
						createMessageEmbed({ title: 'Error', description: 'Something went wrong' })
					],

				})
			}


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
