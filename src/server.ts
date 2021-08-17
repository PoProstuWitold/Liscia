import { config } from 'dotenv'
config()
import { Client, Message, Intents } from 'discord.js'
import { CommandHandler } from './command-handler'
import { botConfig, BotConfigInterface } from './config/config'

/** VALIDATION OF BOT CONFIG */
function validateConfig(botConfig: BotConfigInterface) {
	if (!botConfig.token) {
		throw new Error('You need to specify your Discord bot token!')
	}
}validateConfig(botConfig)

const commandHandler = new CommandHandler(botConfig.prefix)

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]})

client.once('ready', () => {
	console.log(`Logged in as ${client.user?.tag}! GLHF!`)
	client.user?.setActivity('Nekopara')
})

client.on('messageCreate', (message: Message) => {
	commandHandler.handleMessage(message)
})

client.on('interactionCreate', interaction => {
	console.log(interaction)
})

client.on('error', (err) => {
	console.error('Discord client error!', err)
})

client.login(botConfig.token)