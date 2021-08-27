/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CommandContext } from '../models/command-context'
import { ICommand } from './';
import { botConfig } from '../config/config'

import { createMessageEmbed } from '../utils/createEmbedMessage'

export class HelpCommand implements ICommand {
    readonly commandNames = ['help', 'halp', 'hlep']

    private commands: ICommand[]

    constructor(commands: ICommand[]) {
    	this.commands = commands
    }

    async run(commandContext: CommandContext): Promise<void> {
    	const allowedCommands = this.commands.filter((command) =>
    		command.hasPermissionToRun(commandContext)
    	)

    	if (commandContext.args.length === 0) {
    		// No command specified, give the user a list of all commands they can use.
    		const commandNames = allowedCommands.map(
    			(command) => command.commandNames[0]
    		)
    		const embed = createMessageEmbed({ title: 'List of avaible commands', description: `${commandNames.join(
    			', ',
    		)}. Try **${botConfig.prefix}help** ${commandNames[0]} to learn more about one of them` })

    		await commandContext.originalMessage.reply({ embeds: [embed] })

    		return
    	}

    	const matchedCommand = this.commands.find((command) =>
    		command.commandNames.includes(commandContext.args[0]),
    	)

    	if (!matchedCommand) {
    		const embed = createMessageEmbed({
    			title: 'Command not found', 
    			description: `I don't know about that command. Try **${botConfig.prefix}help** to find all commands you can use.`
    		})
    		await commandContext.originalMessage.reply({ embeds: [embed] })

    		throw Error('Unrecognized command')
    	}
    	if (allowedCommands.includes(matchedCommand)) {
    		const embed = createMessageEmbed({ title: `${matchedCommand.commandNames[0]}`, description: `${this.buildHelpMessageForCommand(matchedCommand, commandContext)}` })
    		await commandContext.originalMessage.reply({ embeds: [embed] })
    	}
    }

    private buildHelpMessageForCommand(
    	command: ICommand,
    	context: CommandContext,
    ): string {
    	return `${command.getHelpMessage(
    		context.commandPrefix,
    	)}\nCommand aliases: **${command.commandNames.join(', ')}**`
    }

    hasPermissionToRun(commandContext: CommandContext): boolean {
    	return true
    }

    getHelpMessage(commandPrefix: string): string {
    	return 'I think you already know how to use this command...'
    }
}