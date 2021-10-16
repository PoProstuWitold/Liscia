import { MessageActionRow, MessageButton } from 'discord.js'

const row = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('pause')
			.setLabel('Pause')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('resume')
			.setLabel('Resume')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('stop')
			.setLabel('Stop')
			.setStyle('DANGER'),
		new MessageButton()
			.setCustomId('skip')
			.setLabel('Next')
			.setStyle('SECONDARY'),
		new MessageButton()
			.setCustomId('previous')
			.setLabel('Previous')
			.setStyle('SECONDARY')						
	)

const row2 = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('volume-up')
			.setLabel('Boost volume')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('volume-down')
			.setLabel('Reduce volume')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setLabel('GitHub')
			.setStyle('LINK')
			.setURL('https://github.com/PoProstuWitold')
	)

export { row, row2 }