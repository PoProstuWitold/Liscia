/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CommandContext } from '../../models/command-context';
import { ICommand } from '../';
import { createMessageEmbed } from '../../utils/createEmbedMessage';

export class ServerInfoCommand implements ICommand {
    commandNames = ['info', 'server-info']

    getHelpMessage(commandPrefix: string): string {
    	return `Use **${commandPrefix}info** to get basic server info.`
    }

    async run(parsedUserCommand: CommandContext): Promise<void> {

    	// console.log(parsedUserCommand.originalMessage.guild?.members.cache)
    	const embed = createMessageEmbed({ title: 'Basic Server Info', description: `
            **Server name:** ${parsedUserCommand.originalMessage.guild?.name || 'Unknown'}
            **Description:** ${parsedUserCommand.originalMessage.guild?.description || 'Unknown'}
            **AFK Channel:** ${parsedUserCommand.originalMessage.guild?.afkChannel?.name || 'Unknown'}
            **Members:** ${parsedUserCommand.originalMessage.guild?.memberCount || 'Unknown'}
            **Created:** ${parsedUserCommand.originalMessage.guild?.createdAt.toDateString()}
        ` })
    	await parsedUserCommand.originalMessage.reply({ embeds: [embed] })
    }

    hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    	return true
    }
}