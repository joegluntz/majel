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

 
const asyncRedis = require("async-redis")
const redis = asyncRedis.createClient(
  process.env.redis_port,
  process.env.redis_host,
  {
    no_ready_check: true,
  }
)

redis.on("error", (error) => {
  console.error("Redis error:", error)
})

redis.on("ready", () => {
  console.log("Redis client ready.")
})

async function getGuildData(guildId) {
  let guildData = await redis.get(guildId)
  if (guildData) {
    guildData = JSON.parse(guildData)
  }

  console.warn("get redis", guildId, guildData)
  if (!guildData) {
    guildData = {}
  }

  return guildData
}

async function setGuildData(guildId, guildData) {
  await redis.set(guildId, JSON.stringify(guildData))
}

module.exports = {
    getGuildData,
    setGuildData
}
