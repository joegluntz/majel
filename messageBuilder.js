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

const dice = require("./dice")
const utils = require("./utils")
const config = require("./config")
const { getGuildData } = require("./redis")

module.exports = {
  // <@goldendelicious> d6 Roll Result:
  // (2, 4, 4) = 2 with 0 fx
  async buildD6Msg(cmd, msg) {
    const guildId = msg.guild.id.toString()
    const guildData = await getGuildData(guildId)
    if (!guildData.game) {
      msg.channel.send({ embed: {
        title: "Game not set!",
        description: "Please use !game to see the possible options then use !game [GAME] to set the game."
      } })

      return
    }

    let numDice = cmd.replace("d6", "")
    if (numDice === "") {
      numDice = "1"
    }
    numDice = parseInt(numDice)

    const { rawResult, numericResult, fxResult } = dice.rollD6(numDice)
    const game = config[guildData.game]
    console.warn(game)

    const embed = {
      title: msg.author.username,
      description: "d6 Roll Result",
      thumbnail: {
        url: game.images.d6,
      },
      fields: [
        {
          name: "Raw Result",
          value: rawResult,
          inline: true,
        },
        {
          name: "Total Damage",
          value: numericResult,
          inline: true,
        },
        {
          name: "Total Effects Triggered",
          value: fxResult,
          inline: true,
        },
      ],
    }

    console.warn(embed)
    msg.channel.send({ embed })
  },

  // <@goldendelicious> d20 Roll Result:
  // Target = 20, Critical range = 1, Complication range = 20
  // (9, 20) = 2 success / 1 complication
  async buildD20msg(cmd, args, msg) {
    const guildId = msg.guild.id.toString()
    const guildData = await getGuildData(guildId)
    if (!guildData.game) {
      msg.channel.send({ embed: {
        title: "Game not set!",
        description: "Please use !game to see the possible options then use !game [GAME] to set the game."
      } })

      return
    }

    let numDice = cmd.replace("d20", "")
    if (numDice === "") {
      numDice = "1"
    }
    numDice = parseInt(numDice)
    const game = config[guildData.game]
    const {
      target,
      critRange,
      compRange,
      rawResult,
      success,
      complication,
    } = dice.rollD20(numDice, args)

    const embed = {
      title: msg.author.username,
      description: "d20 Roll Result",
      thumbnail: {
        url: game.images.d20,
      },
      fields: [
        {
          name: "Target",
          value: target,
          inline: true,
        },
        {
          name: "Critical Range",
          value: critRange,
          inline: true,
        },
        {
          name: "Complication Range",
          value: compRange,
          inline: true,
        },
        {
          name: "Raw Result",
          value: rawResult,
          inline: true,
        },
        {
          name: "Success(es)",
          value: success,
          inline: true,
        },
        {
          name: "Complication(s)",
          value: complication,
          inline: true,
        },
      ],
    }

    msg.channel.send({ embed })
  },
  async buildCustomRollMsg(cmd, args, msg) {
    const guildId = msg.guild.id.toString()
    const guildData = await getGuildData(guildId)
    if (!guildData.game) {
      msg.channel.send({ embed: {
        title: "Game not set!",
        description: "Please use !game to see the possible options then use !game [GAME] to set the game."
      } })

      return
    }

    const game = config[guildData.game]
    if (!game.dice[cmd]) {
      msg.channel.send({ embed: {
          title: `'${cmd}' is not a game specific command!`,
          description: `d20, d6, ${Object.keys(game.dice).join(', ')} are valid commands.`
        }
      })

      return
    }

    const customCmd = game.dice[cmd];
    const embed = {
      title: msg.author.username,
      thumbnail: {
        url: game.images.d20,
      },
      fields: [
        {
          name: customCmd.display,
          value: utils.randomElement(customCmd.values),
        }
      ],
    }

    console.warn(embed)
    msg.channel.send({ embed })
  }
}
