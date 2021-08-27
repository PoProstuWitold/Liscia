import 'reflect-metadata';
import { Client, Intents, Message } from 'discord.js'
import { IBotConfig } from './config/config';
import { CommandHandler } from './command-handler';

export class DiscordBot {

    protected readonly client: Client
    protected readonly commandHandler: CommandHandler

    constructor(
    	protected config: IBotConfig
    ) {
    	this.config = config
    	this.commandHandler = new CommandHandler(this.config.prefix)

    	this.client = new Client({
    		intents: [
    			Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES
    		]
    	})
    }

    public async start(): Promise<void> {

    	this.client.once('ready', () => {
    		console.log(`Logged in as ${this.client.user?.tag}! GLHF!`)
    		this.client.user?.setActivity('Nekopara')
    	})
        
    	await this.addListeners()

    	this.client.login(this.config.token)
    }

    private async addListeners(): Promise<void> {
    	this.client
    		.on('messageCreate', (message: Message) => {
    			this.commandHandler.handleMessage(message)
    		})
    		.on('interactionCreate', interaction => {
    			console.log(interaction)
    		})
    		.on('error', (err) => {
    			console.error('Discord client error!', err)
    		})
    		.on('reconnecting', () => {
    			console.warn('Liscia is reconnecting...')
    		})
    		.on('disconnect', () => {
    			console.warn('Warning! Liscia has disconnected!')
    		})
    }
}