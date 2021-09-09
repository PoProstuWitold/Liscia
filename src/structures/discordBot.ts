import { Client as BotClient, ClientOptions, Message } from 'discord.js'
import { botConfig, IBotConfig } from '../config'
import { CommandHandler } from '../utils/command-handler'
import { createLogger } from '../utils/logger'
import { resolve } from 'path/posix'
import { EventsLoader } from '../utils/event-loader'
import DisTube from 'distube'
import SpotifyPlugin from '@distube/spotify'
import SoundCloudPlugin from '@distube/soundcloud'

export class DiscordBot extends BotClient {

    public readonly config: IBotConfig = botConfig
    public readonly commands = new CommandHandler(this, resolve(__dirname, '..', 'commands'))
    public readonly events = new EventsLoader(this, resolve(__dirname, '..', 'events'))
    public readonly logger = createLogger('main', this.config.debug)
    public readonly distube: DisTube = new DisTube(this, 
    	{
    		emitNewSongOnly: true,
    		leaveOnEmpty: true,
    		leaveOnFinish: true,
    		leaveOnStop: true,
    		savePreviousSongs: true,
    		emitAddSongWhenCreatingQueue: true,
    		emitAddListWhenCreatingQueue: true,
    		searchSongs: 0,
    		// youtubeCookie: botConfig.YOUTUBE_COOKIE,
    		nsfw: true,
    		ytdlOptions: {
    			filter: 'audioonly',
    			highWaterMark: 1024 * 1024 * 64,
    			quality: 'highestaudio',
    			liveBuffer: 60000,
    			dlChunkSize: 1024 * 1024 * 64,
    		},
    		youtubeDL: true,
    		updateYouTubeDL: true,
    		plugins: [
    			new SpotifyPlugin({
    				api: {
    					clientId: botConfig.SPOTIFY_API.clientId,
    					clientSecret: botConfig.SPOTIFY_API.clientSecret,
    				},
    				parallel: true,
    				emitEventsAfterFetching: true
    			}),
    			new SoundCloudPlugin()
    		]
    	}
    )

    constructor(options: ClientOptions) {
    	super(options)
    }

    public async start(): Promise<DiscordBot> {
    	this.once('ready', () => {
    		this.commands.load()
    		this.logger.info(`Logged in as ${this.user?.tag}! GLHF!`)
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
    			this.logger.info(interaction)
    		})
    		.on('error', (err) => {
    			this.logger.error('Discord client error!', err)
    		})
    		.on('reconnecting', () => {
    			this.logger.warn('Liscia is reconnecting...')
    		})
    		.on('disconnect', () => {
    			this.logger.warn('Warning! Liscia has disconnected!')
    		})
    }
}