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

##### Configure secret/environment variables

- In the root folder create `.env` file with following keys:   
```
MONGO_URL = 'mongodb+srv://fullstack:MONGODB_FULLSTACK_USER_PASSWORD@cluster0.ck2n2.mongodb.net/repos?retryWrites=true&w=majority'
REDIS_URL = 'redis://default:REDIS_DEFAULTUSER_PASSWORD@redis-12236.c300.eu-central-1-1.ec2.cloud.redislabs.com:12236'
```  
- Set sensitive data as Fly.io secrets with commands:   
`fly secrets set MONGO_URL='mongodb+srv://fullstack:MONGODB_FULLSTACK_USER_PASSWORD@cluster0.ck2n2.mongodb.net/repos?retryWrites=true&w=majority'`
`fly secrets set REDIS_URL='redis://default:MONGODB_DEFAULTUSER_PASSWORD@redis-12236.c300.eu-central-1-1.ec2.cloud.redislabs.com:12236'`

## Dependencies

### Mongodb atlas

##### Connect via web app
https://account.mongodb.com/

### Redis cloud

##### Connect via web app

https://app.redislabs.com/ 

##### Connect via terminal
Use the Connect button from the web app which will provide something like this:
`redis-cli -u redis://default:REDIS_DEFAULTUSER_PASSWORD@redis-12236.c300.eu-central-1-1.ec2.cloud.redislabs.com:12236`

Once you are connected, check open and running pub.sub channels with:
`PUBSUB CHANNELS`

### Docker 

Build Docker image
`docker build . -t scraper`

Run Docker image
`docker run --env URL='URL_.ENV_FILE' --env REDIS_URL='REDIS_URL_.ENV_FILE' scraper`

Docker best practices:
![Docker best practices](./documentation/NodeJS-CheatSheet_page-0001.jpg)[Open it in a new tab](https://res.cloudinary.com/snyk/images/v1/wordpress-sync/NodeJS-CheatSheet/NodeJS-CheatSheet.pdf).

### Fly

Check secrets:
`fly secrets list`

Deploy to Fly
`fly deploy`

## References

- The scraping part the project is based on [this tutorial](https://blog.apify.com/how-to-scrape-the-web-with-playwright-ece1ced75f73/) from Apify.
- The mongodb storing part is based on [part 3c](https://fullstackopen.com/en/part3/saving_data_to_mongo_db#mongo-db) Helsinki University's Open Full Stack course.   
- The Redis messagging pub/sub functionality is based on [official node-redis library documentation](https://github.com/redis/node-redis/blob/master/docs/pub-sub.md) and some other examples like [this](https://blog.logrocket.com/using-redis-pub-sub-node-js/).