import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import { DoesMusicQueueExist, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'

@DefineCommand({
	aliases: ['previous', 'previosu', 'pre'],
	description: 'Plays previous song',
	name: 'previous',
	usage: `${botConfig.prefix}previous`,
	cooldown: 2,
	permissions: []
})
export class PreviousCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist()
	public async execute(message: Message): Promise<void> {
		const queue = message.client.distube.getQueue(message)

		if(!queue) {
			return undefined
		}

		try {
			const song = await queue.previous()
			await message.channel.send({
				embeds: [createMessageEmbed({ title: `🎶 Playing previous song - ${song.name}`, 
					description: 
					` 
                        \`\`\`\n${song.url}\n\`\`\`
                    ` 
				})]
			})
		} catch (err) {
			console.log(err)
			message.channel.send({
				embeds: [
					createMessageEmbed({
						title: 'Error',
						description: 'There is no previous song in this queue'
					})
				]
			})
		}
	}
}
