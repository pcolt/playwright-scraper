import redis from 'redis' // Redis client
import scraper from './scraper.js'  // scraper function

(async () => {
  // Create a client and connect to Redis
  const redisClient = redis.createClient({
    url: 'redis://default:D8STrD4BhkWwVHO46oOIc0TKCnUWSQAa@redis-12236.c300.eu-central-1-1.ec2.cloud.redislabs.com:12236'
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

  await subscriber.subscribe('runScraper', (message) => {

    console.log(message) // 'message'

    const topic = JSON.parse(message).topic
    
    scraper(topic)
    
  });
})()