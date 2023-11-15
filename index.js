import redis from 'redis' // Redis client
import scraper from './scraper.js'  // scraper function
import mongoose from 'mongoose';
import 'dotenv/config';


// Connect to MongoDB
const url = process.env.MONGO_URL;            // use dotenv's .env environment file
//   `mongodb+srv://fullstack:${password}@cluster0.ck2n2.mongodb.net/repos?retryWrites=true&w=majority`

mongoose.set('strictQuery',false);
mongoose.connect(url);

// Create a client and connect to Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
  // host: 'redis-12236.c300.eu-central-1-1.ec2.cloud.redislabs.com',
  // port: 12236,
  // password: 'Pi-cian1986'
})
  .on('error', (err) => {
    console.error("Error " + err);
  })

// Create a subscriber and subscribe to the 'runScraper' channel
const subscriber = redisClient.duplicate()
await subscriber.connect()
console.log('subscriber.isReady():', subscriber.isReady)
console.log('subscriber.isOpen():', subscriber.isOpen)

await subscriber.subscribe(`runScraper_${process.env.NODE_ENV}`, (message) => {

  console.log(message) // 'message'

  const topic = JSON.parse(message).topic
  
  scraper(topic)
  
});