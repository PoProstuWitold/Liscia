/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import axios from 'axios'

@DefineCommand({
	aliases: ['lyrisc', 'ly'],
	description: 'Send the lyrics for the current song',
	name: 'lyrics',
	usage: `${botConfig.prefix}lyrics <title?>`,
	cooldown: 4,
	permissions: [],
	disable: true
})
export class LyricsCommand extends BaseCommand {
	public async execute(message: Message, args: string[]): Promise<void> {

		const substring = (length: number, value: string) => {
			const replaced: any = value.replace(/\n/g, '--')
			const regex =`.{1,${length}}`
			const lines = replaced
				.match(new RegExp(regex, 'g'))
				.map((line: string) => line.replace('--', '\n'))

			return lines
		}

		const queue = message.client.distube.getQueue(message)
		let songTitle: string
		if(!queue) {
			songTitle = args.join(' ')
		} else {
			//@ts-ignore
			songTitle = args.join(' ') = args.join(' ') || queue.songs[0].name
		}

		if(!queue && !args) {
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Warning',
						description: 'Either play song or type its name'
					})
				]
			})
		}

		const url = new URL('https://some-random-api.ml/lyrics')
		url.searchParams.append('title', songTitle)

		try {
			const { data } = await axios.get(url.href)

			const embeds = substring(500, data.lyrics).map((value: string, index: number) => {
				const isFirst = index === 0

				return createMessageEmbed({ title: isFirst ? `${data.title} - ${data.author}` : '', description: value})
					.setThumbnail(isFirst ? data.thumbnail.genius : null)
			})

			await message.channel.send({
				embeds
			})
		} catch (err) {
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Error',
						description: 'Sorry I couldn\'t find that song\'s lyrics'
					})
				]
			})
		}
	}
}
