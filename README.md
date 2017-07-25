# Hover DNS Update #
This application uses the 'unofficial hover api' ([hover-api](https://www.npmjs.com/package/hover-api) npm package) to update a DNS record on a set interval from another domain value;

## Run ##  
```
npm install
npm start
```

## Environment Variables ##  
Name | Description
---- | ----
HOVER_USER | Hover.com username
HOVER_PASS | Hover.com password
HOVER_DOMAIN | The domain to update the DNS under
HOVER_SUBDOMAIN | The DNS A record entry to update
DDNS_HOST | The hostname to grab an updated ip from 

## .env file ##
You can use a .env file in your project root to configure environment variables without setting them. See the [dotenv](https://www.npmjs.com/package/dotenv) package for more info.