import express, { Request, Response } from 'express'
import path from 'path'
import compression from 'compression'
const app = express()
console.log(path.join(__dirname, 'public'))
// Express configuration
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
	express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
)


//routes
app.get('/', (req: Request, res: Response) => {
	return res.render('index', {
		title: 'Liscia Elfrieden'
	})
})

app.get('/about', (req: Request, res: Response) => {
	return res.render('about', {
		title: 'About'
	})
})

export default app