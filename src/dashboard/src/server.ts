import app from './app'
import https from 'https'

/**
 * Start Express server.
 */

const herokuUrl = 'https://liscia-elfrieden.herokuapp.com/'

const server = app.listen(app.get('port'), () => {

	setInterval(() => {
		https.get(herokuUrl)
	}, 300000)

	console.log(
		`App is running at ${app.get('host')}:${app.get('port')}`,
		app.get('env')
	)
})

export default server