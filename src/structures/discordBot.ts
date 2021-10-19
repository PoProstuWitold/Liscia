/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client as BotClient, ClientOptions, DiscordAPIError, Message, MessageReaction, TextChannel } from 'discord.js'
import { botConfig, IBotConfig } from '../config'
import { CommandHandler } from '../utils/command-handler'
import { createLogger } from '../utils/logger'
import { resolve } from 'path'
import { EventsLoader } from '../utils/event-loader'
import { Playlist, Queue, Song, DisTube } from 'distube'
import SpotifyPlugin from '@distube/spotify'
import SoundCloudPlugin from '@distube/soundcloud'
import { createMessageEmbed } from '../utils/createEmbedMessage'

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
    	this.on('ready', () => {
    		this.commands.load()
    		this.logger.info(`Logged in as ${this.user?.tag}! GLHF!`)
    	})
        
    	await this.addListeners()

    	this.distube
    		.on('playSong', async (queue: Queue, song: Song) => {
    			console.log(`Playing new song - ${song.name}!`, `Queue songs length ${queue.songs.length}`)
    		})
    		.on('addSong', (queue: Queue, song: Song) => {
    			console.log(`Added new song - ${song.name}!`, `Queue songs length ${queue.songs.length}`)
    		})
    		.on('addList', async (queue: Queue, playlist: Playlist) => {
    			console.log(`Added new playlist! - ${playlist.name}`, `Queue songs length ${queue.songs.length}`)
    		})
    		.on('searchResult', (message, result) => {
    			const i = 0
    			console.log(message, '')
    		})
    	// DisTubeOptions.searchSongs = true
    		.on('searchCancel', (message) =>  console.log(message, 'Searching canceled')
    		)
    		.on('error', (message: TextChannel, err: any) => {
    			console.log(message, `An error encountered: ${err}`)
    			if(err.name === 'PlayingError') {
    				if(err.status === 429) {
    					message.send({
    						embeds: [
    							createMessageEmbed({
    								title: 'Error 429',
    								description: 'You are being ratelimited'
    							})
    						]
    					})
    				}
    			}

    			message.send({
    				embeds: [
    					createMessageEmbed({
    						title: `Error ${err.status}`,
    						description: `${err.name}`
    					})
    				]
    			})
    		}
    		)
    		.on('disconnect', (queue: Queue) => {
    			console.log('DISCONNECTED!', /*queue*/)
    		})
    		.on('finish', (queue: Queue) => {
    			console.log('SONG FINISHED!', /*queue.listeners?.error.name*/)
    		})
    		.on('empty', (queue: Queue) => {
    			console.log('Channel is empty!!', /*queue.listeners?.error.name*/)
    		})
    		.on('searchNoResult', (message: Message, query: string) => {
    			message.channel.send({
    				embeds: [
    					createMessageEmbed({
    						title: 'Error',
    						description: 'No results found'
    					})
    				]
    			})
    		})

    	await this.login(this.config.token)

    	return this
    }

    private async addListeners(): Promise<void> {
    	this
    		.on('messageCreate', (message: Message) => {
    			this.commands.handle(message)
    		})
    		.on('interactionCreate', async (interaction) => {
    			// this.logger.info(interaction)

    			if(interaction.isButton()) {
    				// console.log(interaction)
    			}
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
    		.on('messageReactionAdd', (reaction) => {
    			console.log(reaction)
    		})
    }
}