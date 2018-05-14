const jimp = require('jimp')

let img = new jimp(10, 10)
console.log(img.bitmap)
img.resize(20, 20)
console.log(img.bitmap)