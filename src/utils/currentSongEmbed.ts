import { MessageEmbed } from 'discord.js'
import { Queue } from 'distube'
import { createMessageEmbed } from './createEmbedMessage'

export const currentSongEmbed = (
	queue: Queue | undefined, 
	nextSong: string | undefined | null, 
	previousSong: string | undefined | null
): MessageEmbed => {
	return createMessageEmbed({ title: '**Music info**', description:
        `**There are **\`${queue?.songs.length}\`** songs in queue**`}).setImage(`${queue?.songs[0].thumbnail}`)
		.addField('**Name**', `***${queue?.songs[0].name}***`)
		.addField('**Volume**', `**\`${queue?.volume}\`**`, true)
		.addField('**Song duration**', `**\`${queue?.songs[0].formattedDuration}\`**`, true)
		.addField('**Queue duration**', `**\`${queue?.formattedDuration}\`**`, true)
		.addField('**Source**', `**${queue?.songs[0].source.toUpperCase()}**`, true)
		.addField('**StreamURL**', `**[Download](${queue?.songs[0].streamURL})**`, true)
		.addField('**Url**', `**[Link](${queue?.songs[0].url})**`, true)
		.addField('Next', `*${nextSong}*`)
		.addField('Current', `*${queue?.songs[0].name}*`)
		.addField('Previous', `*${previousSong}*`)
}