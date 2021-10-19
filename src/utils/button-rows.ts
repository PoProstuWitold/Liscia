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
			.setStyle('DANGER')						
	)

const row2 = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('skip')
			.setLabel('Next')
			.setStyle('SECONDARY'),
		new MessageButton()
			.setCustomId('previous')
			.setLabel('Previous')
			.setStyle('SECONDARY')						
	)

const row3 = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('volume-up')
			.setLabel('Volume Up')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('volume-down')
			.setLabel('Volume Down')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setLabel('Author')
			.setStyle('LINK')
			.setURL('https://github.com/PoProstuWitold')
	)

export { row, row2, row3 }