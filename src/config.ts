import { ActivityType, ColorResolvable } from 'discord.js'
/**
*    Discord bot config.
**/
if(!process.env.TOKEN) {
	throw new Error('You need to specify your Discord bot token!')
}

export type Status = { type: 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'CUSTOM' | 'COMPETING'; activity: string; }

export type IBotConfig = {
    token: string | undefined
    prefix: string
    botOwnerRoleName: string
    youtubeAPIkey: string
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
	youtubeAPIkey: '',
	locale: 'pl',
	defaultVolume: 50,
	maxVolume: 100,
	debug: process.env.DEBUG ? true : false,
	totalShards: process.env.CONFIG_TOTALSHARDS?.toLowerCase() ?? 'auto',
	fetchAllUsers: true,
	status: {
		type: process.env.STATUS_TYPE?.toUpperCase() as ActivityType | null ?? 'LISTENING',
		activity: process.env.STATUS_ACTIVITY ?? 'music on {guildsCount} servers'
	},
	enableReactions: true,
	primaryColor: [123, 17, 39], //'#7B1127', //Liscia's red
	secondaryColor: [201, 175, 102], // '#C9AF66', //Liscia's yellow
	thirdColor: [229, 228, 226], // '#E5E4E2' //Liscia's white
	activity: 'Nekopara',
	SPOTIFY_API: {
		clientId: 'e6e7af6d2dde4ae0a2bf8917c6deddf2',
		clientSecret: 'd164f2a2fbd94c68ae9fe61775298bfe'
	},
	YOUTUBE_COOKIE: 'Cookie: CONSENT=YES+srp.gws-20210715-0-RC1.pl+FX+194; VISITOR_INFO1_LIVE=4NflYkgjV1U; PREF=tz=Europe.Warsaw&f6=400; SID=BwgRT2HPb3CjSc1OO-EbHYvENQ0AgqLju3uWT3rKNosZkW-35ezo7OqW8MVQniM6bOlqeA.; __Secure-1PSID=BwgRT2HPb3CjSc1OO-EbHYvENQ0AgqLju3uWT3rKNosZkW-3qC5LUQ--3ERWoSf8JW8SNg.; __Secure-3PSID=BwgRT2HPb3CjSc1OO-EbHYvENQ0AgqLju3uWT3rKNosZkW-31ar3Mdjk9F0LWfH0gI8l5A.; HSID=AwlmDrGnIfaDzfg3T; SSID=AMkkf3Gzbm2ZGdD21; APISID=Xtj0w5KtZoFvC1rU/AH21MdPvZ-KlgZ-Ha; SAPISID=DseYl_bX608NSNrv/ABPabEH5QBhjzqGh8; __Secure-1PAPISID=DseYl_bX608NSNrv/ABPabEH5QBhjzqGh8; __Secure-3PAPISID=DseYl_bX608NSNrv/ABPabEH5QBhjzqGh8; LOGIN_INFO=AFmmF2swRAIgAzcsEuqI5YacRPgHYg6Bjtt4QV8SdM7eIgoVqU1415YCIEeE70BY1kJzq2HiweRoQpRtA5B1b1BTNYMqkbjCmYc6:QUQ3MjNmd2w0M04zd191Sm50c19PN21OdFZtTkJ2aWhmTjh5OU5YckFhY0JmdDZZOFJ1ZWNZSWFVazl2WHg0MU5rRHhfVGV6N1oyZmJJc2MzUzhyaE0xM3NBU1E0REZQcGJrb09EMTliejFxRmJEa1Y5RnpCWUFaMnp5SElxOWFtc203M3F4TDRMNXpqQ0UzeEtLTElhd3J5OGlaNUFQSVZR; SIDCC=AJi4QfH-vGl3ktfDkGRtj6wY0vfM7rHbD-DOe5TfsxeTOcRQlwb-QSTF9JtuES4UEVUFClGsBQ; __Secure-3PSIDCC=AJi4QfFCZlCucgb1ex0N06Gr2nso-99eGaAwnbmT2Fo1Eb41tmCiUsUPBVkmR65meRThKcfY; YSC=vvUwYDURVLk'
}