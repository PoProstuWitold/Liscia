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
	aliases: ['set-volume', 'set', 'vol'],
	description: 'Changes volume',
	name: 'volume',
	usage: `${botConfig.prefix}volume <number between 1-100>`,
	cooldown: 2,
	permissions: ['ADMINISTRATOR']
})
export class VolumeCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @ArgsNotEmpty()
	public async execute(message: Message, args: string[]): Promise<void> {
		const queue = message.client.distube.getQueue(message)
		const volume = parseInt(args[0])
		if (isNaN(volume)) message.channel.send({
			embeds: [
				createMessageEmbed({
					title: 'Error',
					description: 'Please, enter a valid number'
				})
			]
		})
        queue!.setVolume(volume)
        message.channel.send({
        	embeds: [
        		createMessageEmbed({
        			title: 'Success',
        			description: `Volume set to \`${volume}\``
        		})
        	]
        })
	}
}
