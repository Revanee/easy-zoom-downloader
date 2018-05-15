const jimp = require('jimp')

// const IMG_GRID_HEIGHT = 108
// const IMG_GRID_WIDTH = 90

const IMG_GRID_HEIGHT = 30
const IMG_GRID_WIDTH = 30
const TOTAL_IMAGES = IMG_GRID_WIDTH * IMG_GRID_HEIGHT

const gridPromise = getGrid(IMG_GRID_WIDTH, IMG_GRID_HEIGHT)

gridPromise.then((grid) => {
  stitch(grid)
})

function getGrid(width, height) {
  return new Promise((resolve, reject) => {
    const colPromises = []
    for (let x = 0; x < width; x++) {
      colPromises.push(getColumn(x, height))
    }
    Promise.all(colPromises)
      .then(cols => {
        console.log('resolving grid')
        resolve(cols)
      }, err => console.log)
  })
}

function getImage(x, y) {
  return jimp
    .read(getFileName(x, y))
    .catch(err =>
      console.log('failed to get image ' + getFileName(x, y)))
}

function getColumn(x, gridHeight) {
  return new Promise((resolve, reject) => {
    const imagePromises = []
    for (let y = 0; y < gridHeight; y++) {
      imagePromises.push(getImage(x, y))
    }
    Promise.all(imagePromises)
      .then(images => {
        console.log('resolving column ' + x)
        resolve(images)
      }, err => 0)
  })
}

function stitch(images) {
  console.log('stitching')
  let stitched = 0

  const pixelWidth = images[0][0].bitmap.width
  const pixelHeight = images[0][0].bitmap.height
  const img = new jimp(IMG_GRID_WIDTH * pixelWidth, IMG_GRID_HEIGHT * pixelHeight)

  for (let y = 0; y < IMG_GRID_HEIGHT; y++) {
    for (let x = 0; x < IMG_GRID_WIDTH; x++) {
      try {
        img.composite(images[x][y], x * pixelWidth, y * pixelHeight)
      } catch (e) {
        console.log('failed to stitch image ' + getFileName(x, y))
      }
      stitched++
      console.log('stitched: ' + stitched + '/' + TOTAL_IMAGES)
    }
  }

  console.log('writing file...')
  img.write('./final.jpg')
  console.log('done')
}

function getFileName(x, y) {
  return './img/' + x + '_' + y + '.jpg'
}
