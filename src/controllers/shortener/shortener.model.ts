import * as mongoose from 'mongoose'
import IShortener from './shortener.interface'

const shortenerSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String
})

const shortenerModel = mongoose.model<IShortener & mongoose.Document>('Shortener', shortenerSchema);
 
export default shortenerModel;