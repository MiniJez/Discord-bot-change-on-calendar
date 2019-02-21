# Discord bot displaying epsi calendar changes

This discord bot allows you to get epsi's schedule. He keep you inform about the latest changes.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install and how to install them

Node js v11.10 : https://nodejs.org

Discord : https://discordapp.com/download

### Installing

Clone the git repository.

Install node dependencies :
```
npm install
```

Create a new bot : https://discordapp.com/developers/applications/ click 'New Application'

Get the client secret of your bot (don't share it, otherwise everybody will be able to manage your bot).

Create a new config file. In the root, config/config.js

Export you client secret : 
```
const config = {
    token: 'your-client-secret-goes-here'
};

module.exports = config;
```

Add your bot to a server.

More informations about creating bot and getting token : https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token

## Deployment

To deploy :
```
npm run start
```

## Authors

* **Edouard CLISSON** - [MiniJez] - https://github.com/MiniJez

## License

This project is open source !
