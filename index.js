const fs = require('fs')
const https = require('https');

const hostname = 'easyzoom.blob.core.windows.net'
const path = '/tiled/db634261-8c76-4369-ac0e-912b5bc67922/db634261-8c76-4369-ac0e-912b5bc67922_files/7/'

const y = 108
const x = 90
// const x = 10
// const y = 10
const total = x * y
let ammountReceived = 0

for (let i = 0; i < x; i++) {
  for (let j = 0; j < y; j++) {
    getImage(hostname, path, getFileName(i, j))
  }
}

function getImage(hostname, path, filename) {
  const options = {
    hostname: hostname,
    path: path + filename,
    method: 'GET',
    timeout: 1
  }
  
  https.get(options, (resp) => {
    resp.on('data', (data) => {
      if (resp.statusCode === 404) {
        console.log(filename + ' not found')
        return
      } else if (resp.statusCode === 200) {
        console.log('received ' + filename)
        ammountReceived += 1
        console.log('Progress: ' + Math.floor(100 * (ammountReceived / total)) + '% ' + ammountReceived + '/' + total)

        fs.writeFile('./img/' + filename, data, {encoding: 'hex'},
          (err) => {
            if (err) {
              console.log('error: ' + err)
            }
          })
      } else {
        console.log('something went wrong!!!')
      }
    })
  }).on('error', (e) => {
    // console.error(e)
    console.log('failed to get image ' + filename)
    console.log('retrying')
    getImage(hostname, path, filename)
  })
}

function getFileName(x, y) {
  return '' + x + '_' + y + '.jpg'
}