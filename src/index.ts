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
const log = createLogger('unhandled-errors', botConfig.debug)

const client = new DiscordBot({
	shards: 'auto',
	partials: ['MESSAGE', 'REACTION'],
	presence: {
		status: 'online',
		activities: [
			{ 
				name: botConfig.status.name, 
				type: botConfig.status.type 
			}
		]
	},
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

process.on('unhandledRejection', err => {
	log.error(err)
})

process.on('uncaughtException', err => {
	log.error('UNCAUGHT_EXCEPTION: ', err)
	log.warn('Uncaught Exception detected, restarting...')
	process.exit(1)
})