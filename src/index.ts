import redis from 'redis' // Redis client
import scraper from './scraper.js'  // scraper function
import mongoose from 'mongoose'
import 'dotenv/config'

const main = async () => {

  // CONNECT TO MONGO DB
  const url = process.env.MONGO_URL            // use dotenv's .env environment file
  //   `mongodb+srv://fullstack:${password}@cluster0.ck2n2.mongodb.net/repos?retryWrites=true&w=majority`

  mongoose.set('strictQuery',false)
  if (url === undefined) {
    throw new Error('MONGO_URL is undefined')
  }
  await mongoose.connect(url)

  // CREATE A CLIENT AND CONNECT TO REDIS
  const redisUrl = process.env.REDIS_URL
  // console.log('redisUrl:', redisUrl)
  const redisClient = redis.createClient({
    url: redisUrl
  }).on('error', (err) => {
      console.error("Redis client error " + err)
    })

  // CREATE A SUBSCRIBER AND SUBSCRIBE TO THE 'runScraper' CHANNEL
  const subscriber = redisClient.duplicate().on('error', (err) => {
    console.error("Redis subscriber error " + err)
  })
  await subscriber.connect()
  console.log('subscriber.isReady():', subscriber.isReady)
  console.log('subscriber.isOpen():', subscriber.isOpen)

  await subscriber.subscribe(`runScraper_${process.env.NODE_ENV}`, (message) => {

    console.log(message) // 'message'

    const parsedMessge: unknown = JSON.parse(message)
    if (parsedMessge && typeof parsedMessge === 'object' && 'topic' in parsedMessge && typeof parsedMessge.topic === 'string'){
      scraper(parsedMessge.topic).catch((err) => {
        console.error(err)
      })
    } else {
      console.error('error parsing message')
    }

  })
}

main().catch((err) => {
    console.error('Main() error: ', err)
  })