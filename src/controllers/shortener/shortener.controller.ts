import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from 'interfaces/IControllerBase.interface'

import shortenerModel from './shortener.model'
import IShortener from './shortener.interface';


class ShortenerController implements IControllerBase {
    public path = '/'
    public router = express.Router()
    
    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/', this.index)
        this.router.get('/:shortcode', this.get)
        this.router.post('/create', this.create)
    }

    private generateRandomUrl(length: Number) {

        const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let urlChars = "";

        for (var i = 0; i < length; i++) {
            urlChars += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }
            
        return urlChars;
    }

    index = async(req: Request, res: Response) => {

        res.render('home/index')
    }

    get = async(req: Request, res: Response) => {
        
        const { shortcode } = req.params

        const data: IShortener = {
            shortUrl: shortcode
        }

        const urlInfo = await shortenerModel.findOne(data)

        if (urlInfo != null) {
            res.redirect(302, urlInfo.longUrl)
        } else {
            res.render('home/not-found')
        }
    }

    create = async(req: express.Request, res: express.Response) => {

        const { url } = req.body

        const data: IShortener = {
            longUrl: url
        }

        let urlInfo = await shortenerModel.findOne(data)

        if (urlInfo == null) {
            const shortCode = this.generateRandomUrl(5)

            const shortData: IShortener = {
                longUrl: url,
                shortUrl: shortCode
            }
    
            const shortenerData = new shortenerModel(shortData)
    
            urlInfo = await shortenerData.save()
        }

        res.json({
            success: true,
            message: 'URL Shortened',
            url: urlInfo.shortUrl
        })

        
    }
}

export default ShortenerController