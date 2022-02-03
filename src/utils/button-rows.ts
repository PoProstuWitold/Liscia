import { MessageActionRow, MessageButton } from 'discord.js'

const row = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('pause')
			.setLabel('⏸')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('resume')
			.setLabel('▶')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('stop')
			.setLabel('⏹')
			.setStyle('DANGER')						
	)

const row2 = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('skip')
			.setLabel('⏭')
			.setStyle('SECONDARY'),
		new MessageButton()
			.setCustomId('previous')
			.setLabel('⏮')
			.setStyle('SECONDARY')						
	)

const row3 = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('volume-up')
			.setLabel('🔊')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('volume-down')
			.setLabel('🔉')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setLabel('Author')
			.setStyle('LINK')
			.setURL('https://github.com/PoProstuWitold')
	)

export { row, row2, row3 }