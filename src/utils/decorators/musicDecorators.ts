/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from 'discord.js';
import { createMessageEmbed } from '../../utils/createEmbedMessage'
import { Inhibit } from './inhibit'

export function DoesMusicQueueExist(moreThanOne?: boolean): any {
	return Inhibit((message: Message) => {
		const queue = message.client.distube.getQueue(message)
		if (!queue) return message.channel.send({
			embeds: [ createMessageEmbed({ title: 'Error', description: 'There is nothing in the queue' })]
		})

		if(moreThanOne) {
			if(message.client.distube.getQueue(message)!.songs.length < 2) {
				return message.channel.send({
					embeds: [ createMessageEmbed({ title: 'Error', description: 'There is nothing left in playlist' })]
				})
			} 
		}
	})
}

export function IsInVoiceChannel(): any {
	return Inhibit((message: Message) => {
		if (!message.member?.voice.channel) {
			return message.channel.send({
				embeds: [ createMessageEmbed({ title: 'Error', description: 'Please join voice channel!' })]
			})
		}
	})
}

export function IsValidVoiceChannel(): any {
	return Inhibit((message: Message) => {
		const voiceChannel = message.member?.voice.channel
		if (voiceChannel?.id === message.guild?.me?.voice.channel?.id) return undefined;
		if (!voiceChannel?.joinable) {
			return message.channel.send({ 
				embeds: [ createMessageEmbed({ title: 'Error', 
					description: 'Sorry, but I can\'t **`CONNECT`** to your voice channel, make sure I have the proper permissions.' 
				}) ] })
		}
	})
}

export function ArgsNotEmpty(strings?: string[], count?: number): any {
	return Inhibit((message: Message, args: string[]) => {
		if(strings) {
			console.log(strings, args);
			if(!strings.some(item => args.includes(item))) {
				return message.reply({
					embeds: [
						createMessageEmbed({ title: 'Error', description: `No arg matches any of required: ${strings.toString()}` })
					],
				})	
			}

			if(count) {
				if(count < args.length) {
					return message.reply({
						embeds: [
							createMessageEmbed({ title: 'Error', description: `You must use no more than ${count} args` })
						],
					})
				}
			}
		}
		if(!args[0]) {
			return message.reply({
				embeds: [
					createMessageEmbed({ title: 'Error', description: 'Please add args!' })
				],
			})			
		}
	})
}

// NOT WORKING CORRECTLY
// export function IsBotSomewhereElse(): any {
// 	return Inhibit((message: Message) => {
// 		if(message.member?.voice.channel!.guild.me?.voice.channel && message.member?.voice.channel!.guild.me.voice.channel.id != message.channel!.id) {
// 			return message.reply({
// 				embeds: [
// 					createMessageEmbed({ title: 'Error', description: 'I am already connected somewhere else!' })
// 				]
// 			})
// 		}
// 	})
// }