/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMessageEmbed } from '../createEmbedMessage'
import { Inhibit } from './inhibit'
import { VoiceChannel } from 'discord.js'

export function isMusicQueueExists(): any {
	return Inhibit(message => {
		if (message.guild?.queue === null) return message.channel.send({
			embeds: [createMessageEmbed({ title:'warn', description: 'There is nothing playing.'
			})] })
	})
}

export function isSameVoiceChannel(): any {
	return Inhibit(message => {
		if (!message.guild?.me?.voice.channel) return undefined;
		const botVoiceChannel = message.guild.queue?.voiceChannel?.id ?? message.guild.me.voice.channel.id;
		if (message.member?.voice.channel?.id !== botVoiceChannel) {
			return message.channel.send({
				embeds: [createMessageEmbed({title: 'warn', description: 'You need to be in the same voice channel as mine'})]
			})
		}
	})
}

export function isUserInTheVoiceChannel(): any {
	return Inhibit(message => {
		if (!message.member?.voice.channel) {
			return message.channel.send({
				embeds: [createMessageEmbed({title:'warn', description: 'Sorry, but you need to be in a voice channel to do that'})]
			})
		}
	})
}

export function isValidVoiceChannel(): any {
	return Inhibit(message => {
		const voiceChannel = message.member?.voice.channel;
		if (voiceChannel?.id === message.guild?.me?.voice.channel?.id) return undefined;
		if (!voiceChannel?.joinable) {
			return message.channel.send({ embeds: [createMessageEmbed({title: 'error', description: 'Sorry, but I need **`CONNECT`** permission to do this'})] });
		}
		if (!(voiceChannel as VoiceChannel).speakable) {
			return message.channel.send({ embeds: [createMessageEmbed({title: 'error', description: 'Sorry, but I need **`SPEAK`** permission to do this'})] });
		}
	})
}