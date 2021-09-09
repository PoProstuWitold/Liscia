/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { config } from 'dotenv'
config()

import { createLogger } from './utils/logger'
import { botConfig } from './config'
import { DiscordBot } from './structures/discordBot'
import { Intents, LimitedCollection, Options } from 'discord.js'
import { Playlist, Queue, Song } from 'distube'
const log = createLogger('shardingmanager', botConfig.debug)

const client = new DiscordBot({
	restTimeOffset:  0,
	allowedMentions: { 
		parse: [] 
	},
	makeCache: Options.cacheWithLimits({
		MessageManager: { // Sweep messages every 5 minutes, removing messages that have not been edited or created in the last 3 hours
			maxSize: Infinity,
			sweepInterval: 300, // 5 Minutes
			sweepFilter: LimitedCollection.filterByLifetime({
				lifetime: 10800 // 3 Hours
			})
		},
		ThreadManager: { // Sweep threads every 5 minutes, removing threads that have been archived in the last 3 hours
			maxSize: Infinity,
			sweepInterval: 300, // 5 Minutes
			sweepFilter: LimitedCollection.filterByLifetime({
				lifetime: 10800, // 3 Hours
				getComparisonTimestamp: e => e.archiveTimestamp!,
				excludeFromSweep: e => !e.archived
			})
		}
	}),
	intents: [
		Intents.FLAGS.GUILDS, 
		Intents.FLAGS.GUILD_VOICE_STATES, 
		Intents.FLAGS.GUILD_MESSAGES,
	]
})

client.setMaxListeners(100)
client.start()


client.distube
//@ts-ignore
	.on('playSong', (queue: Queue, song: Song)=> {
		console.log('Playing new Song!', new Date().getMilliseconds(), `queue songs length ${queue.songs.length}`, `song name: ${song.name}`)
	})
//@ts-ignore
	.on('addSong', (queue: Queue, song: Song) => {
		console.log('Added a Song!', new Date().getMilliseconds(), `queue songs length ${queue.songs.length}`, `song name: ${song.name}` )
	})
//@ts-ignore
	.on('playList', (queue: Queue, playlist: Playlist) => {
		console.log('Playlist added', `queue songs length ${queue.songs.length}`, `song name: ${playlist.name}`)
	})
//@ts-ignore
	.on('addList', (queue: Queue, playlist: Playlist) => {
		console.log('Added playlist!', `queue songs length ${queue.songs.length}`, `song name: ${playlist.name}`)
	})
	.on('searchResult', (message, result) => {
		const i = 0;
		console.log(message, '')
	})
// DisTubeOptions.searchSongs = true
	.on('searchCancel', (message) =>  console.log(message, 'Searching canceled')
	)
	.on('error', (message, err) => console.log(message, `An error encountered: ${err}`)
	)
	.on('disconnect', (queue: Queue) => {
		console.log('DISCONNECTED!', new Date().getMilliseconds() /*queue*/)
	})
	.on('finish', (queue: Queue) => {
		console.log('SONG FINISHED!', /*queue.listeners?.error.name*/)
	})
	.on('empty', (queue: Queue) => {
		console.log('Channel is empty!!', /*queue.listeners?.error.name*/)
	})

process.on('unhandledRejection', err => {
	log.error(err)
})

process.on('uncaughtException', err => {
	log.error('UNCAUGHT_EXCEPTION: ', err)
	log.warn('Uncaught Exception detected, restarting...')
	process.exit(1)
})