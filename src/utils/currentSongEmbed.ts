/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from 'discord.js'
import { Queue } from 'distube'
import { createMessageEmbed } from './createEmbedMessage'

const convertHMS = (value: any) => {
	const sec = parseInt(value, 10) // convert value to number if it's string
	let hours: string | number   = Math.floor(sec / 3600) // get hours
	let minutes: string | number = Math.floor((sec - (hours * 3600)) / 60) // get minutes
	let seconds: string | number = sec - (hours * 3600) - (minutes * 60) //  get seconds
	// add 0 if value < 10; Example: 2 => 02
	if (hours   < 10) {hours   = '0'+hours}
	if (minutes < 10) {minutes = '0'+minutes}
	if (seconds < 10) {seconds = '0'+seconds}
	if(hours >= 1) {
		return hours+':'+minutes+':'+seconds // Return is MM : SS
	}
	return minutes+':'+seconds // Return is HH : MM : SS
}

export const currentSongEmbed = (
	queue: Queue | undefined, 
	nextSong: string | undefined | null, 
	previousSong: string | undefined | null
): MessageEmbed => {
	return createMessageEmbed({ title: '**Music info**', description:
	`Requested by <@${queue?.songs[0].user?.id}>`}).setThumbnail(`${queue?.songs[0].thumbnail}`)
		.addField('**Name**', `*${queue?.songs[0].name}*`)
		.addField('**Volume**', `**\`${queue?.volume}\`**`, true)
		.addField('**Duration**', `**\`${convertHMS(queue?.currentTime)}/${queue?.songs[0].formattedDuration}\`**`, true)
		.addField('**Queue**', `${queue?.songs.length} songs - **\`${queue?.formattedDuration}\`**`, true)
		.addField('**Views**', `${queue?.songs[0].views.toLocaleString('en-US')}`, true)
		.addField('**Source**', `**[${queue?.songs[0].source.toUpperCase()}](${queue?.songs[0].url})**`, true)
		.addField('**StreamURL**', `**[Download](${queue?.songs[0].streamURL})**`, true)
		.addField('Next', `*${nextSong}*`)
		.addField('Previous', `*${previousSong}*`)
		.setTitle(`${queue?.paused ? '⏸ Paused' : '▶ Playing'} `)
		.setFooter({ text: 'Powered by Liscia Elfrieden'})
}