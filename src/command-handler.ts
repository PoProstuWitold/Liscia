import { Message } from 'discord.js';
import { ICommand, GreetCommand, HelpCommand } from './commands/';
import { CommandContext } from './models/command-context';
import { reactor } from './reactions/reactor';
import { botConfig } from './config/config'
import { createMessageEmbed } from './utils/createEmbedMessage';

/** Handler for bot commands issued by users. */
export class CommandHandler {
    private commands: ICommand[]

    private readonly prefix: string

    constructor(prefix: string) {
    	const commandClasses = [
    		// TODO: Add more commands here.
    		GreetCommand
    	]

    	this.commands = commandClasses.map((CommandClass) => new CommandClass())
    	this.commands.push(new HelpCommand(this.commands))
    	this.prefix = prefix
    }

    /** Executes user commands contained in a message if appropriate. */
    async handleMessage(message: Message): Promise<void> {
    	if (message.author.bot || !this.isCommand(message)) {
    		return
    	}

    	const commandContext = new CommandContext(message, this.prefix)

    	const allowedCommands = this.commands.filter((command) =>
    		command.hasPermissionToRun(commandContext)
    	)

    	const matchedCommand = this.commands.find((command) =>
    		command.commandNames.includes(commandContext.parsedCommandName),
    	)

    	let embed

    	if (!matchedCommand) {
    		embed = createMessageEmbed({ title: 'Command not found', description: `I don't recognize that command. Try **${botConfig.prefix}help**` })
    		await message.reply({ embeds: [embed] })
    		await reactor.failure(message)
    	} else if (!allowedCommands.includes(matchedCommand)) {
    		embed = createMessageEmbed({ title: 'Permission denied', description: `You aren't allowed to use that command. Try **${botConfig.prefix}help**` })
    		await message.reply({ embeds: [embed] })
    		await reactor.failure(message)
    	} else {
    		await matchedCommand
    			.run(commandContext)
    			.then(() => {
    				reactor.success(message)
    			})
    			.catch((reason: unknown) => {
    				console.log(reason)
    				reactor.failure(message)
    			})
    	}
    }

    /** Determines whether or not a message is a user command. */
    private isCommand(message: Message): boolean {
  	    return message.content.startsWith(this.prefix)
    }
}
