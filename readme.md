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

## Installation

Run `npm install`

### Configure secret/environment variables

- In the root folder create `.env` file with following keys:   
```
MONGO_URL = 'mongodb+srv://fullstack:MONGODB_FULLSTACK_USER_PASSWORD@cluster0.ck2n2.mongodb.net/repos?retryWrites=true&w=majority'
REDIS_URL = 'redis://default:REDIS_DEFAULTUSER_PASSWORD@redis-12236.c300.eu-central-1-1.ec2.cloud.redislabs.com:12236'
```  
- Set sensitive data as Fly.io secrets with commands:   
`fly secrets set MONGO_URL='mongodb+srv://fullstack:MONGODB_FULLSTACK_USER_PASSWORD@cluster0.ck2n2.mongodb.net/repos?retryWrites=true&w=majority'`
`fly secrets set REDIS_URL='redis://default:MONGODB_DEFAULTUSER_PASSWORD@redis-12236.c300.eu-central-1-1.ec2.cloud.redislabs.com:12236'`

## Usage

`npm run build` to compile typescript .ts files located in */src*  
`npm start` to run in dev mode the compiled files located in *./build* folder   
`npm run dev` to run typescript files on the fly reloading when something changes 

### Deploy to Fly.io

Check secrets:
`fly secrets list`

Deploy to Fly
`fly deploy` or `npm run deploy`

Scale Fly app to 0 machines (stopped)
`fly scale count 0`

Scale Fly app back to 1 machine
`fly scale count 1`

Show list of Fly apps currently deployed:
`fly apps list`

Show logs from all machines (or filter by id with -i flag)
`fly logs`

Restart machine
`fly machine restart`

### Docker 

Docker image is used by Fly.io to deploy this micro-service.  
It can be also used to run and debug the Docker image.  

Build Docker image
`docker build . -t scraper`

Run Docker image
`docker run --env MONGO_URL='MONGO_URL_in_.ENV_FILE' --env REDIS_URL='REDIS_URL_in_.ENV_FILE' scraper`

Docker list of all containers `docker ps -a`  
Restart a container `docker restart [container-id]`  
Follow container logs `docker logs --follow [container-id]`

Docker best practices:
![Docker best practices](./documentation/NodeJS-CheatSheet_page-0001.jpg)[Open it in a new tab](https://res.cloudinary.com/snyk/images/v1/wordpress-sync/NodeJS-CheatSheet/NodeJS-CheatSheet.pdf).


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

## References

- The scraping part the project is based on [this tutorial](https://blog.apify.com/how-to-scrape-the-web-with-playwright-ece1ced75f73/) from Apify.
- The mongodb storing part is based on [part 3c](https://fullstackopen.com/en/part3/saving_data_to_mongo_db#mongo-db) Helsinki University's Open Full Stack course.   
- The Redis messagging pub/sub functionality is based on [official node-redis library documentation](https://github.com/redis/node-redis/blob/master/docs/pub-sub.md) and some other examples like [this](https://blog.logrocket.com/using-redis-pub-sub-node-js/).