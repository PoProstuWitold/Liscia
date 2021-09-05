import { Client as BotClient, ClientOptions, Collection, Message, Snowflake } from 'discord.js'
import { botConfig, IBotConfig } from '../config'
import { CommandHandler } from '../utils/command-handler'
import { createLogger } from '../utils/logger'
import { ServerQueue } from './serverQueue'
import './guild'
import { resolve } from 'path/posix'
import { Util } from '../utils/util'
import { EventsLoader } from '../utils/event-loader'

export class DiscordBot extends BotClient {

    public readonly config: IBotConfig = botConfig
    public readonly commands = new CommandHandler(this, resolve(__dirname, '..', 'commands'))
    public readonly events = new EventsLoader(this, resolve(__dirname, '..', 'events'))
    public readonly util: Util = new Util(this)
    public readonly logger = createLogger('main', this.config.debug)
    public readonly queue: Collection<Snowflake, ServerQueue> = new Collection()

    constructor(options: ClientOptions) {
    	super(options)
    }

    public async start(): Promise<DiscordBot> {
    	this.once('ready', () => {
    		this.commands.load()
    		console.log(`Logged in as ${this.user?.tag}! GLHF!`)
    		this.user?.setActivity(this.config.activity)
    	})
        
    	await this.addListeners()

    	await this.login(this.config.token)

    	return this
    }

    private async addListeners(): Promise<void> {
    	this
    		.on('messageCreate', (message: Message) => {
    			this.commands.handle(message)
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