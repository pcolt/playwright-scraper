## GitHub's topics scraper with playright

This node microservice is scraping GitHub repositories based on a specific topic (i.e. 'scraping' or 'climatechange').
The service is subcribed to a Redis message channel and starts a new scraping process whenever a message -with the topic to be scraped- is received.   
The microservice stores the results into an Atlas Mongodb database. The complete result is also stored into a local .json and .csv file. 
The scraping process returns for each repository found the following data: 
- owner
- name
- URL
- number of starts
- description
- list of repository topics

## Usage

`npm run start` or `node index.js` to start the microservice listening to new Redis messages.

## Installation

Run `npm install`

In the root folder create `.env` file with following keys:   
```
MONGO_URL = 'mongodb+srv://fullstack:MONGODB_FULLSTACK_USER_PASSWORD@cluster0.ck2n2.mongodb.net/repos?retryWrites=true&w=majority'
REDIS_URL = 'redis://default:MONGODB_DEFAULTUSER_PASSWORD@redis-12236.c300.eu-central-1-1.ec2.cloud.redislabs.com:12236'
```

## References

- The scraping part the project is based on [this tutorial](https://blog.apify.com/how-to-scrape-the-web-with-playwright-ece1ced75f73/) from Apify.
- The mongodb storing part is based on [part 3c](https://fullstackopen.com/en/part3/saving_data_to_mongo_db#mongo-db) Helsinki University's Open Full Stack course.   
- The Redis messagging pub/sub functionality is based on [official node-redis library documentation](https://github.com/redis/node-redis/blob/master/docs/pub-sub.md) and some other examples like [this](https://blog.logrocket.com/using-redis-pub-sub-node-js/).