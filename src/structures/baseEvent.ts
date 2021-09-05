/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { IEvent } from '../typings'
import { Client } from 'discord.js'

export class BaseEvent implements IEvent {
	public constructor(public readonly client: Client, public name: IEvent['name']) {}

	public execute(...args: any): void {}
}