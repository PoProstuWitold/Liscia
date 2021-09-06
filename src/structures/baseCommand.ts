/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { ICommandComponent } from '../typings'
import { Client, Message } from 'discord.js'
export abstract class BaseCommand implements ICommandComponent {
	public constructor(public client: Client, public meta: ICommandComponent['meta']) {}

	public execute(message: Message, args: string[]): any {}

	public getHelpMessage(commandPrefix: string): string {
		return 'Please, implement help message'
	}

	public hasPermissionToRun(message: Message): boolean {
		return true
	}
}