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
	}
}
