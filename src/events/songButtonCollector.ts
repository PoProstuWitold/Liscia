/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageComponentInteraction, Collection, Message } from 'discord.js'

export const songButtonCollector = async (collected: Collection<string, MessageComponentInteraction>, message: Message): Promise<any> => {
	try {
		const id = collected.first()?.customId
		const queue = message.client.distube.getQueue(message)
		if(!queue) {
			return undefined
		}
		switch (id) {
		case 'pause':
			if (queue!.paused) {
                queue!.resume()
			}
            queue!.pause()
			collected.first()?.deferUpdate()
			break;
		case 'resume':
			if (!queue!.paused) {
                queue!.pause()
			}
            queue!.resume()
			collected.first()?.deferUpdate()
			break;
		case 'stop':
			queue?.stop()
			collected.first()?.deferUpdate()
			break;
		case 'skip':
			try {
				await queue!.skip()
			} catch (e) {
				console.log(e)
			}
			collected.first()?.deferUpdate()
			break;
		case 'previous':
			await queue!.previous()
			collected.first()?.deferUpdate()
			break;
		case 'volume-up':
			queue?.setVolume(queue?.volume + 10)
			collected.first()?.deferUpdate()
			break;
		case 'volume-down':
			queue?.setVolume(queue?.volume - 10)
			collected.first()?.deferUpdate()
			break;
    
		default:
			break;
		}
	} catch (err) {
		console.log(err)
	}
}