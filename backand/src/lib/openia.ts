import 'dotenv/config'
import { OpenAI } from 'openai'

export const openia = new OpenAI({
  apiKey: process.env.OPENAI_KEY
})