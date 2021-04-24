/**
 * Copyright 2019-2021 John H. Nguyen
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

const Discord = require("discord.js")
const winston = require("winston")
const fs = require("fs")
const utils = require("./utils")
const msgBuilder = require("./messageBuilder")
const pool = require("./pool")
const { getGuildData, setGuildData } = require("./redis")
const trait = require("./trait")
const config = require("./config")
const messageBuilder = require("./messageBuilder")
require("dotenv").config()

// help content
let help1 = fs.readFileSync("./data/help1.txt", { encoding: "utf8" })
let help2 = fs.readFileSync("./data/help2.txt", { encoding: "utf8" })
let about = fs.readFileSync("./data/about.txt", { encoding: "utf8" })

let overflow = (help1.length > 2000) || (help2.length > 2000)
overflow = overflow || (about.length > 2000)
if (overflow) {
  console.warn("At least one of the help files is longer than 2000 symbols and will be rejected by Discord")
}

let addMeMsg =
  "https://discordapp.com/api/oauth2/authorize?client_id=831001838971125760&permissions=51200&scope=bot"

const CommandPrefix = process.env.prefix

//Configure logger settings
const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  defaultMeta: {
    service: "user-service",
  },
  transports: [new winston.transports.Console()],
})

async function setGame(guildId, game) {
  const guildData = await getGuildData(guildId)
  if (game === 'help' && guildData.game) {
    const diceCmds = config[guildData.game].dice;
    const keys = Object.keys(diceCmds)
    let supportedCustomCmds = ''
    for (let key of keys) {
      if (!supportedCustomCmds) {
        supportedCustomCmds += '\n'
      }

      supportedCustomCmds += `!${key} - ${diceCmds[key].display}`
    }

    return supportedCustomCmds || `No custom commands avaialble for ${config[guildData.game].display}`
  }

  if (!config[game]) {
    const keys = Object.keys(config)
    let supportedGames = ''
    for (let key of keys) {
      if (supportedGames) {
        supportedGames += '\n'
      }

      supportedGames += `${key} - ${config[key].display}`
    }

    if (game === 'list') {
      return supportedGames
    }

    return `'${game}' not supported!\n${supportedGames}`
  }

  guildData.game = game;

  await setGuildData(guildId, guildData)

  return `Game is now set to ${config[game].display}`
}

async function getGame(guildId) {
  const guildData = await getGuildData(guildId)
  if (!guildData.game) {
    const keys = Object.keys(config)
    let supportedGames = ''
    for (let key of keys) {
      if (supportedGames) {
        supportedGames += '\n'
      }

      supportedGames += `${key} - ${config[key].display}`
    }
    return `Game not set!\nSupported Games\n${supportedGames}`
  }

  return `Game is set to ${config[guildData.game].display}`
}

// Initialize Discord Bot
const bot = new Discord.Client()

bot.login(process.env.token)

bot.on("ready", (evt) => {
  logger.info("Connected")
  logger.info("Logged in as: ")
  logger.info(bot.user.username + " - (" + bot.user.id + ")")
  logger.info(config)
})

bot.on("message", async (message) => {
  if (message.author.username.indexOf("2d20") > -1) {
    console.log("Preventing 2d20 from spamming.")
    return
  }

  try {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    let msg = ""
    let embed = null
    const cmdPrefix = message.content.substring(0, 1)
    if (CommandPrefix === cmdPrefix) {
      let args = message.content.substring(1).split(" ")
      let cmd = args[0]
      args = args.splice(1)

      let isD6 = cmd.indexOf("d6") > -1
      let isD20 = cmd.indexOf("d20") > -1
      if (isD6) {
        await msgBuilder.buildD6Msg(cmd, message)
      } else if (isD20) {
        await msgBuilder.buildD20msg(cmd, args, message)
      } else {
        let option = args.length > 0 ? args.join(" ").toLowerCase() : ""
        switch (cmd) {
          case "help":
            message.channel.send(help1)
            message.channel.send(help2)
            return
          case "about":
            message.channel.send(about)
            return
          case "addme":
            msg = addMeMsg
            break
          case "pool":
            embed = await pool.status(message, option)
            break
          case "m":
            embed = await pool.adjustMomentum(message, option)
            break
          case "t":
            embed = await pool.adjustThreat(message, option)
            break
          case "trait":
            embed = await trait.trait(message, option)
            break
          case "trait":
            embed = await trait.trait(message, option)
            break
          case "game":
            const guildId = message.guild.id.toString()
            if (option) {
              msg = await setGame(guildId, option)
            } else {
              msg = await getGame(guildId)
            }
            break
          default:
            messageBuilder.buildCustomRollMsg(cmd, args, message)
        }
        if (msg) {
          message.channel.send(msg)
        } else if (embed) {
          message.channel.send({ embed })
        }
      }
    }
  } catch (error) {
    console.error(error)
    if (message && message.channel) {
      message.channel.send(error)
    }
  }
})
