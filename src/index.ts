import { config } from 'dotenv'
config()
import { botConfig } from './config/config'
import { DiscordBot } from './bot'

new DiscordBot(botConfig).start()

process.on('unhandledRejection', err => console.error(err))