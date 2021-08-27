import { ColorResolvable } from 'discord.js'
/**
*    Discord bot config.
**/
if(!process.env.TOKEN) {
	throw new Error('You need to specify your Discord bot token!')
}

if(!process.env.YOUTUBE_API_KEY) {
	console.warn('Youtube API KEY not provided')
}

export type IBotConfig = {
    token: string
    prefix: string
    botOwnerRoleName: string
    youtubeAPIkey: string
    locale: string
    defaultVolume: number
    enableReactions: boolean
    primaryColor: ColorResolvable
    secondaryColor: ColorResolvable
    thirdColor: ColorResolvable
}
  
export const botConfig: IBotConfig = {
	token: process.env.TOKEN,
	prefix: '$$',
	botOwnerRoleName: 'bot-owner',
	youtubeAPIkey: '',
	locale: 'pl',
	defaultVolume: 50,
	enableReactions: true,
	primaryColor: [123, 17, 39], //'#7B1127', //Liscia's red
	secondaryColor: [201, 175, 102], // '#C9AF66', //Liscia's yellow
	thirdColor: [229, 228, 226], // '#E5E4E2' //Liscia's white
}