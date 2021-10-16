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
	aliases: ['qq'],
	description: 'Give the info about songs in server queue',
	name: 'queue',
	usage: `${botConfig.prefix}queue`,
	cooldown: 10,
	permissions: ['ADMINISTRATOR']
})
export class QueueCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist()
	public async execute(message: Message): Promise<void> {
		try {
			const queue = message.client.distube.getQueue(message)


			const q = queue!.songs.map((song, i) => `${i === 0 ? 'Playing:\n' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``).join('\n')
			if(q.length > 1995) {
				message.channel.send({
					embeds: [
						createMessageEmbed({
							title: 'Error',
							description: 'Queue message size exceed maxium Discord message size'
						})
					]
				})

				return
			}
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: '**Server Queue**',
						description: `\n${q}`
					})
				]
			})
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
