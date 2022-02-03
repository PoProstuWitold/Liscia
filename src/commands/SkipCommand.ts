import { DefineCommand } from '../utils/decorators/defineCommand'
import { BaseCommand } from '../structures/baseCommand'
import { createMessageEmbed } from '../utils/createEmbedMessage'
import { Message } from 'discord.js'
import { botConfig } from '../config'
import { DoesMusicQueueExist, IsInVoiceChannel, IsValidVoiceChannel } from '../utils/decorators/musicDecorators'

@DefineCommand({
	aliases: ['sk', 's'],
	description: 'Skips a song in your voice channel',
	name: 'skip',
	usage: `${botConfig.prefix}skip`,
	cooldown: 5,
	permissions: []
})
export class SkipCommand extends BaseCommand {
    @IsInVoiceChannel()
    @IsValidVoiceChannel()
    @DoesMusicQueueExist(true)
	public async execute(message: Message): Promise<void> {
		const queue = message.client.distube.getQueue(message)

		if(!queue) {
			return undefined
		}

		try {
			const song = await queue.skip()
			await message.channel.send({
				embeds: [createMessageEmbed({ title: `🎶 Playing next song - ${song.name}`, 
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
						description: 'Unexpected error, tell Witold as fast as possible'
					})
				]
			})
		}
	}
}
