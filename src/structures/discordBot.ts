/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client as BotClient, ClientOptions, Interaction, Message, MessageReaction, PartialMessageReaction, TextChannel } from 'discord.js'
import { botConfig, IBotConfig } from '../config'
import { CommandHandler } from '../utils/command-handler'
import { createLogger } from '../utils/logger'
import { resolve } from 'path'
import { EventsLoader } from '../utils/event-loader'
import { Playlist, Queue, Song, DisTube, SearchResult } from 'distube'
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
    		.on('addSong', async (queue: Queue, song: Song) => {
    			console.log(`Added new song - ${song.name}!`, `Queue songs length ${queue.songs.length}`)
    		})
    		.on('addList', async (queue: Queue, playlist: Playlist) => {
    			console.log(`Added new playlist! - ${playlist.name}`, `Queue songs length ${queue.songs.length}`)
    		})
    		.on('searchResult', async (message: Message, result: SearchResult[]) => {
    			console.log('Search results: ', result)
    			// console.log('Message: ', message)
    		})
    		.on('searchCancel', async (message: Message, query: string) =>  {
    			console.log('Searching canceled', `query: ${query}`)
    			// console.log('Message: ', message)
    		}
    		)
    		.on('error', async (message: TextChannel, err: any) => {
    			console.log('An error encountered: ', err)
    			console.log('Message: ', message)
    			if(err.name === 'PlayingError') {
    				if(err.status === 429) {
    					await message.send({
    						embeds: [
    							createMessageEmbed({
    								title: 'Error 429',
    								description: 'You are being ratelimited'
    							})
    						]
    					})
    				}
    				return
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
    		.on('disconnect', async (queue: Queue) => {
    			console.log('Disconnected! ', `Guild ID: ${queue.textChannel?.guild.id}`)
    		})
    		.on('finish', async (queue: Queue) => {
    			console.log('Song finished! ', `Guild ID: ${queue.textChannel?.guild.id}`)
    		})
    		.on('empty', async (queue: Queue) => {
    			console.log('Channel is empty! ', `Guild ID: ${queue.textChannel?.guild.id}`)
    		})
    		.on('searchNoResult', async (message: Message, query: string) => {
    			await message.channel.send({
    				embeds: [
    					createMessageEmbed({
    						title: 'Error',
    						description: `No results found with query ${query}`
    					})
    				]
    			})
    		})

    	await this.login(this.config.token)

    	return this
    }

    private async addListeners(): Promise<void> {
    	this
    		.on('messageCreate', async (message: Message) => {
    			this.commands.handle(message)
    		})
    		.on('interactionCreate', async (interaction: Interaction) => {
    			if(interaction.isButton()) {
    				console.log(`Button interaction id ${interaction.customId} triggered!`, interaction)
    			}
    		})
    		.on('error', async (err: any) => {
    			console.log('Discord client error!', err)
    			this.logger.error('Discord client error!', err)
    		})
    		.on('reconnecting', async () => {
    			console.log('Liscia is reconnecting...')
    			this.logger.warn('Liscia is reconnecting...')
    		})
    		.on('disconnect', async () => {
    			console.log('Liscia has disconnected!')
    			this.logger.warn('Liscia has disconnected!')
    		})
    		.on('messageReactionAdd', async (reaction: MessageReaction | PartialMessageReaction) => {
    			console.log('Reaction added!', reaction.emoji.name)
    		})
    }
}