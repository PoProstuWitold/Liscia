import { MessageEmbed, ColorResolvable } from 'discord.js'
import { botConfig } from '../config/config'

interface MessageEmbedContent {
    title: string
    description: string
}

const mainColors: Colors = {
	primaryColor: botConfig.primaryColor,
	secondaryColor: botConfig.secondaryColor,
	thirdColor: botConfig.thirdColor
}

interface Colors {
    primaryColor: ColorResolvable
    secondaryColor: ColorResolvable
    thirdColor: ColorResolvable
}

export const createMessageEmbed = (messageEmbedContent: MessageEmbedContent, colors: Colors = mainColors): MessageEmbed => {
	const embed = new MessageEmbed()
		.setTitle(messageEmbedContent.title)
		.setDescription(messageEmbedContent.description)
		.setColor(colors.primaryColor)

	return embed
}