import { ColorResolvable } from 'discord.js'
/**
*    Discord bot config.
**/
if(!process.env.TOKEN) {
	throw new Error('You need to specify your Discord bot token!')
}

export type BotConfigInterface = {
    token: string
    prefix: string
    botOwnerRoleName: string
    enableReactions: boolean
    primaryColor: ColorResolvable
    secondaryColor: ColorResolvable
    thirdColor: ColorResolvable
}
  
export const botConfig: BotConfigInterface = {
	token: process.env.TOKEN, // TODO: Put your token here!
	prefix: '$$', // Command prefix. ex: !help
	botOwnerRoleName: 'bot-owner',
	enableReactions: true,
	primaryColor: [123, 17, 39], //'#7B1127', //Liscia's red
	secondaryColor: [201, 175, 102], // '#C9AF66', //Liscia's yellow
	thirdColor: [229, 228, 226], // '#E5E4E2' //Liscia's white
}