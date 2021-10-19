import app from './app'
import https from 'https'

/**
 * Start Express server.
 */

const herokuUrl = 'https://liscia-elfrieden.herokuapp.com'

const HOST = process.env.HOST || herokuUrl

const server = app.listen(app.get('port'), () => {

	setInterval(() => {
		console.log('Request received from setInterval')
		https.get(herokuUrl)
	}, 300000)

	console.log(
		`App is running at ${HOST}:${app.get('port')}`,
		app.get('env')
	)
})

export default server