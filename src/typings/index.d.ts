/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { ServerQueue } from '../structures/serverQueue'
import { DiscordBot } from '../structures/discordBot'
import { Client as OClient, ClientEvents, Guild as OGuild, Message, PermissionString } from 'discord.js'
import { Readable } from 'stream'

export interface ICommandComponent {
    meta: {
        aliases?: string[]
        cooldown?: number
        disable?: boolean
        path?: string
        name: string
        description?: string
        usage?: string
        permissions: Array<PermissionString>
    }
    execute(message: Message, args: string[]): any
}

export interface IEvent {
    name: keyof ClientEvents
    execute(...args: any): any
}

declare module 'discord.js' {
    // @ts-expect-error Override
    export interface Client extends OClient {
        readonly config: DiscordBot['config']
        readonly logger: DiscordBot['logger']
        readonly commands: DiscordBot['commands']
        readonly events: DiscordBot['events']
        readonly util: DiscordBot['util']
        readonly queue: DiscordBot['queue']

        build(token: string): Promise<this>
    }
    // @ts-expect-error Override
    export interface Guild extends OGuild {
        queue: ServerQueue | null
    }
}
export interface ISong {
    id: string
    title: string
    url: string
    thumbnail: string
    download(): Readable
}