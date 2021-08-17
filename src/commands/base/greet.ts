/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CommandContext } from '../../models/command-context';
import { Command } from '../';

export class GreetCommand implements Command {
    commandNames = ['greet', 'hello']

    getHelpMessage(commandPrefix: string): string {
    	return `Use ${commandPrefix}greet to get a greeting.`
    }

    async run(parsedUserCommand: CommandContext): Promise<void> {
    	await parsedUserCommand.originalMessage.reply('hello, world!')
    }

    hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    	return true
    }
}