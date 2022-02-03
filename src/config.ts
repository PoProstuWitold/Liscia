import { ColorResolvable, ExcludeEnum } from 'discord.js'
import { ActivityTypes } from 'discord.js/typings/enums'
/**
*    Discord bot config.
**/

const {
	TOKEN,
	SPOTIFY_API_CLIENT_ID,
	SPOTIFY_API_CLIENT_ID_SECRET
} = process.env

if(!TOKEN) {
	throw new Error('You need to specify your Discord bot token!')
}

if(!SPOTIFY_API_CLIENT_ID) {
	console.warn('You need to specify SPOTIFY_API_CLIENT_ID to use Spotify')
}

if(!SPOTIFY_API_CLIENT_ID_SECRET) {
	console.warn('You need to specify SPOTIFY_API_CLIENT_ID_SECRET to use Spotify')
}

export type Status = { type: ExcludeEnum<typeof ActivityTypes, 'CUSTOM'> | undefined; name: string; }

export type IBotConfig = {
    token: string | undefined
    prefix: string
    botOwnerRoleName: string
    locale: string
    defaultVolume: number
    maxVolume: number
    debug: boolean
    totalShards: string | number
    fetchAllUsers: boolean
    status: Status
    enableReactions: boolean
    primaryColor: ColorResolvable
    secondaryColor: ColorResolvable
    thirdColor: ColorResolvable
    SPOTIFY_API: {
        clientId: string | undefined, 
        clientSecret: string | undefined
    },
    YOUTUBE_COOKIE?: string
}
  
export const botConfig: IBotConfig = {
	token: TOKEN || undefined,
	prefix: '$$',
	botOwnerRoleName: 'bot-owner',
	locale: 'pl',
	defaultVolume: 50,
	maxVolume: 100,
	debug: process.env.DEBUG ? true : false,
	totalShards: process.env.CONFIG_TOTALSHARDS?.toLowerCase() ?? 'auto',
	fetchAllUsers: true,
	status: {
		type: ActivityTypes.WATCHING,
		name: process.env.STATUS_ACTIVITY ?? 'Realist Hero'
	},
	enableReactions: true,
	primaryColor: [123, 17, 39], //'#7B1127', //Liscia's red
	secondaryColor: [201, 175, 102], // '#C9AF66', //Liscia's yellow
	thirdColor: [229, 228, 226], // '#E5E4E2' //Liscia's white
	SPOTIFY_API: {
		clientId: SPOTIFY_API_CLIENT_ID,
		clientSecret: SPOTIFY_API_CLIENT_ID_SECRET
	}
}