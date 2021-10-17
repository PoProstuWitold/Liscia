import { ActivityType, ColorResolvable } from 'discord.js'
/**
*    Discord bot config.
**/
if(!process.env.TOKEN) {
	throw new Error('You need to specify your Discord bot token!')
}

export type Status = { type: 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'CUSTOM' | 'COMPETING'; name: string; }

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
    activity: string,
    SPOTIFY_API: {
        clientId: string, 
        clientSecret: string
    },
    YOUTUBE_COOKIE?: string
}
  
export const botConfig: IBotConfig = {
	token: process.env.TOKEN || undefined,
	prefix: '$$',
	botOwnerRoleName: 'bot-owner',
	locale: 'pl',
	defaultVolume: 50,
	maxVolume: 100,
	debug: process.env.DEBUG ? true : false,
	totalShards: process.env.CONFIG_TOTALSHARDS?.toLowerCase() ?? 'auto',
	fetchAllUsers: true,
	status: {
		type: process.env.STATUS_TYPE?.toUpperCase() as ActivityType | null ?? 'WATCHING',
		name: process.env.STATUS_ACTIVITY ?? 'Nekopara 3'
	},
	enableReactions: true,
	primaryColor: [123, 17, 39], //'#7B1127', //Liscia's red
	secondaryColor: [201, 175, 102], // '#C9AF66', //Liscia's yellow
	thirdColor: [229, 228, 226], // '#E5E4E2' //Liscia's white
	activity: 'Nekopara',
	SPOTIFY_API: {
		clientId: 'e6e7af6d2dde4ae0a2bf8917c6deddf2',
		clientSecret: 'd164f2a2fbd94c68ae9fe61775298bfe'
	}
}