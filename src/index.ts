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
import { Intents, Options, Sweepers } from 'discord.js'

const log = createLogger('unhandled-errors', botConfig.debug)

const client = new DiscordBot({
	shards: 'auto',
	partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
	presence: {
		status: 'online',
		activities: [
			{ 
				name: botConfig.status.name, 
				type: 'WATCHING'
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
			sweepFilter: Sweepers.filterByLifetime({
				lifetime: 10800 // 3 Hours
			})
		},
		ThreadManager: { // Sweep threads every 5 minutes, removing threads that have been archived in the last 3 hours
			maxSize: Infinity,
			sweepInterval: 300, // 5 Minutes
			sweepFilter: Sweepers.filterByLifetime({
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
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGES
	]
})

client.setMaxListeners(100)
client.start()

process.on('unhandledRejection', (err: any) => {
	log.error(err)
	// console.log(err) DiscordAPIError: Unknown interaction
	console.log('Unhandled rejection. It may be DiscordAPIError or you may have unsupported NodeJS version')
})

process.on('uncaughtException', err => {
	log.error('UNCAUGHT_EXCEPTION: ', err)
	log.warn('Uncaught Exception detected, restarting...')
	process.exit(1)
})