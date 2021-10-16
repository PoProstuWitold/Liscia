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
import { ArgsNotEmpty, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'

@DefineCommand({
	aliases: ['sekk', 'see'],
	description: 'Seek to given time',
	name: 'seek',
	usage: `${botConfig.prefix}seek <time in seconds>`,
	cooldown: 2,
	permissions: ['ADMINISTRATOR']
})
export class SeekCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @ArgsNotEmpty()
	public async execute(message: Message, args: string[]): Promise<void> {
		const queue = message.client.distube.getQueue(message)
		if(!args[0]) {
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Error',
						description: 'Please provide position (in seconds) to seek!'
					})
				]
			})
		}

		const time = Number(args[0])

		if (isNaN(time)) message.channel.send({
			embeds: [
				createMessageEmbed({
					title: 'Error',
					description: 'Please, enter a valid number'
				})
			]
		})
		queue!.seek(time)
		message.channel.send({
        	embeds: [
        		createMessageEmbed({
        			title: 'Success',
        			description: `Seeked about \`${time}s\``
        		})
        	]
		})
	}
}
