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

const fs = require("fs")

/**
 * Reads in a file synchronously with the default encoding specified.
 * @param path The file path. 
 * @returns The raw file as a string.
 */
const loadFile = path => {
  return fs.readFileSync(path, { encoding: "utf8" })
}

/**
 * Reads in a file then attempts to parse the file into a Json object.
 * @param path The file path. 
 * @returns The parsed Json object.
 */
const loadJsonFile = path => {
  return JSON.parse(loadFile(path))
}

module.exports = {
  /**
   * this.shuffles elements of an array and returns the this.shuffled array.
   * If you just need a random element, use this.randomElement instead, because
   * it does not operate on the whole array.
   * @param a The array to this.shuffle.
   * @return The this.shuffled array.
   */
  shuffle(a) {
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = a[i]
      a[i] = a[j]
      a[j] = x
    }

    return a
  },

  /**
  * this.randomElement picks a random element from an array and returns it
  * @param a The non-empty array to pick a random element from
  * @return The picked element
  */
  randomElement(a) {
    if (a.length > 0) {
      return a[Math.floor(Math.random() * a.length)]
    } else {
      console.error("Tried picking a random element from empty array")
      return null
    }
  },

  /**
   * Enumerates a dictionary and inserts a delimiter.
   * @param d The dictionary to enumerate.
   * @param delimiter The delimiter to insert between the key value pairs.
   */
  enumerateDictionary(d, delimiter) {
    let str = ""
    for (let key in d) {
      if (str) {
        str += delimiter
      }

      str += "**" + key + "**: " + d[key]
    }

    return str
  },
  loadFile,
  loadJsonFile
}
