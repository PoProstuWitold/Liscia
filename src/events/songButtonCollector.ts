/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MessageComponentInteraction, Message } from 'discord.js'
import { Queue } from 'distube'
import util from 'util'
import { row, row2, row3 } from '../utils/button-rows'
import { currentSongEmbed } from '../utils/currentSongEmbed'

const wait = util.promisify(setTimeout)

export const editCustomMessage = async (customMessage: any, queue: any, nextSong: any, previousSong: any) => {
	// console.log('customMessage.id from function', customMessage.id)
	return await customMessage.edit({
		embeds: [
			currentSongEmbed(queue, nextSong, previousSong)
		],
		components: [
			row, row2, row3
		],
	}).catch((e: unknown) => {
		console.log(e)
	})
}

export const songButtonCollector = async (reaction: MessageComponentInteraction, message: Message, customMessage: any): Promise<any> => {
	try {
		const id = reaction.customId
		const queue: Queue | undefined = message.client.distube.getQueue(message)
		let _queue: Queue | undefined

		if(!queue) {
			return undefined
		}

		let nextSong: string | undefined
		let previousSong: string | undefined
		let _nextSong: string | undefined
		let _previousSong: string | undefined

		queue?.previousSongs[0] ? previousSong = queue?.previousSongs[queue?.previousSongs.length - 1].name : previousSong = 'No previous song'
		queue?.songs[1] ? nextSong = queue?.songs[1].name : nextSong = 'No next song'


		// console.log('nextSong \n', nextSong)
		// console.log('previousSong \n', previousSong)
		// console.log('_nextSong \n', _nextSong)
		// console.log('_previousSong \n', _previousSong)

		switch (id) {
		case 'pause':
			// await wait(1000)
			_queue = queue.pause()
			// await wait(750)
			await editCustomMessage(customMessage, _queue, nextSong, previousSong)
			// await wait(750)
			reaction.deferUpdate()
			break;
		case 'resume':
			// await wait(1000)
			_queue = queue.resume()
			// await wait(750)
			await editCustomMessage(customMessage, _queue, nextSong, previousSong)
			// await wait(750)
			reaction.deferUpdate()
			break;
		case 'stop':
			queue.stop()
			await editCustomMessage(customMessage, queue, nextSong, previousSong)
			// await wait(2000)
			customMessage.delete()
			reaction.deferUpdate()
			break;
		case 'skip':
			await queue.skip()
			await wait(2000)

			queue?.songs[1] ? _nextSong = queue?.songs[1].name : _nextSong = 'No next song'
			queue?.previousSongs[0] ? _previousSong = queue?.previousSongs[queue?.previousSongs.length - 1].name : _previousSong = 'No previous song'

			editCustomMessage(customMessage, queue, _nextSong, _previousSong)
			reaction.deferUpdate()
			break;
		case 'previous':
			await queue.previous()
			await wait(2000)
			
			queue?.songs[1] ? _nextSong = queue?.songs[1].name : _nextSong = 'No next song'
			queue?.previousSongs[0] ? _previousSong = queue?.previousSongs[queue?.previousSongs.length - 1].name : _previousSong = 'No previous song'
			
			await editCustomMessage(customMessage, queue, _nextSong, _previousSong)
			reaction.deferUpdate()
			break;
		case 'volume-up':
			queue?.setVolume(queue?.volume + 5)
			editCustomMessage(customMessage, queue, nextSong, previousSong)
			// await wait(1000)
			reaction.deferUpdate()
			break;
		case 'volume-down':
			queue?.setVolume(queue?.volume - 5)
			editCustomMessage(customMessage, queue, nextSong, previousSong)
			// await wait(1000)
			reaction.deferUpdate()
			break;
		default:
			break;
		}
	} catch (err) {
		console.log(err)
	}
}