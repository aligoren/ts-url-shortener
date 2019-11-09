import App from './app'
import * as bodyParser from 'body-parser'
import ShortenerController from './controllers/shortener/shortener.controller'

const app = new App({
    port: 5000,
    controllers: [
        new ShortenerController()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
    ]
})

app.listen()