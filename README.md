# Majel

Discord bot for use with Star Trek Adventures role playing game. This will help resolve dice rolls and some reference sheets.

# Add Majel To Your Server

> Add this bot if you want the command prefixes to start with "!".

https://discordapp.com/api/oauth2/authorize?client_id=538555398521618432&permissions=51200&scope=bot

> Add this bot if you want the command prefixes to start with "/".

https://discordapp.com/api/oauth2/authorize?client_id=729181873024139294&permissions=51200&scope=bot

# Community & Support

Twitter: https://twitter.com/majeldiscordbot

Facebook: https://www.facebook.com/majeldiscordbot

Support this project: https://www.patreon.com/majeldiscordbot

# 2D20 Command List

> Note - "/" prefix is also supported depending which bot is added to your server.

`!help` - Displays all possible commands Majel can understand.

`!addme` - Invite me to your game!

`!about` - Information on development and source code.

**Supported Games**

`!game` If a game is not set, then you will receive a warning and a list of supported games.

`!game [Game Code]` If the code is supported then the game will be set. Otherwise you will receive a warning and a list of supported.

`!game list` List the supported games.

`!game help` List of the supported custom commands. These are custom dice rolls such as hit locations in Fallout.

**D6 Rolls**

![d6 Rolls](https://i.imgur.com/DOaORZP.png "d6 Rolls")

`!d6` - Roll a challenge die.

`!Xd6` - Roll X challenge dice (e.g. Roll 5 d6 = !5d6). X can be left blank, defaults to 1.

**D20 Rolls**

![d20 Rolls](https://i.imgur.com/BliWREK.png "d20 Rolls")

`!d20` - Roll a d20.

`!Xd20` - Roll x d20s (e.g. Roll 2 d20 = !2d20). X can be left blank, defaults to 1.

`!Xd20` [Target] - Roll x d20s with a target number (e.g. Roll 2 d20 with target number of 15 = !2d20 15). X can be left blank, defaults to 1.

`!Xd20` [Target][crit range] - Roll x d20s with a target number and crit range (e.g. Roll 2 d20 with target number of 15 with crit range to 5 = !2d20 15 5). X can be left blank, defaults to 1.

`!Xd20` [Target][crit range] [Complication Range] - Roll x d20s with a target number, crit range, and complication range (e.g. Roll 2 d20 with target number of 15 with crit range to 5 and comp range to 17 = !2d20 15 5 17). X can be left blank, defaults to 1.

**Momemtum and Threat Pools**

`!pool` - Show the global pool and all channels' pool on server.

`!pool here` - Show the global pool and the current channel's pool.

`!pool reset` - Reset the global pool and delete all other pools on this server.

`!pool reset here` - Delete this channel's pool.

`!m or !t` - Show the global momentum or threat and the current channel's momentum or threat.

`!m or !t [add, sub, set][some value]` - Add, subtract, or set the momentum or threat to the global pool.

`!m or !t [add, sub, set][some value] here` - Add, subtract, or set the momentum or threat to the current channel's pool.

**Traits**

`!trait` - List all containers and their traits.

`!trait set [container] [trait] [value]` - Set a value to a trait within a container.

`!trait del [container] [trait]` - Delete a trait within a container.

`!trait del [container]` - Delete a container.

`!trait [container]` - List all traits for this container.

# Developer Setup

## NPM
This section assumes that you're familiar with javascript and node.js. Ensure you have npm installed on your workstation by following the steps outlined here:

https://www.npmjs.com/get-npm

To install the required dependencies, go to this repository's folder (majel by default), and type this command.

```
npm install
```

Make sure `nodemon` is installed:

https://www.npmjs.com/package/nodemon

## Redis Cache
Redis cache needs to be up and running before starting the bot server. Ensure redis is installed and the server running:

Windows: https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504

Mac: https://gist.github.com/tomysmile/1b8a321e7c58499ef9f9441b2faa0aa8

Linux: https://redis.io/download

For your own development purposes, you will need to create your own bot, and invite it to your own server. Use the steps outlined here:

https://www.writebots.com/discord-bot-token/

There's a section mentioning how to generate the bot's auth token. That token is needed to run the bot server and allow clients to connect to it. Ensure 'token' is set somewhere in your environment. Easiest option is to create a .env file in the respository's folder. Copy and paste the following environment variables into your .env file.

```
token=[ADD YOUR AUTH TOKEN HERE]
prefix=!
redis_host=127.0.0.1
redis_port=6379
```
Copy the auth token as mentioned in the tutorial and replace [ADD YOUR AUTH TOKEN HERE]

## Invite the bot to your server

The writebots.com link above also contains a section on how to generate the invite link for the bot. Follow the instructions.
When you get to the point where you need to specify the permissions for the bot in the Discord developer interface, check

* Send Messages
* Embed Links
* Attach Files

This should give a permissions mask of 51200, which will be part of the generated URL in the `permissions` parameter.

## Start your bot

```
nodemon .
```

(If you have a non-global installation of `nodemon`, the command to start `nodemon` may look differently. Refer to the `nodemon` installation instructions above.)

Your terminal should look something like this:
```
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node .`
Redis client ready.
{"message":"Connected","level":"info","service":"user-service"}
{"message":"Logged in as: ","level":"info","service":"user-service"}
{"message":"Majel-Local - (12345678901234567890)","level":"info","service":"user-service"}
```

The bot is now running. If you have invited it to your server as above, it is now functional.

# Hosting Options

On your computer, needs to be on at least during the game session if not all the time. I initially hosted Majel on a Raspberry PI.

You can also deploy to AWS free tier, which is my current solution.

# Contributors

**Developers**

- John Nguyen - john@engooyen.com
- Konstantin Kotenko

**Players**

Special thanks to my discord rp group.

- Michael D. and the crew of U.S.S. Pioneer