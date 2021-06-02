const nacl = require('tweetnacl')
const util = require('tweetnacl-util')
const scruptsy = require('scryptsy')
const fs = require('fs')
const command = process.argv[2]
const commandInput = process.argv[3]
const inputSalt = process.argv[4] ?? null
const inputNonce = process.argv[5] ?? null
const inputFile = process.argv[6] ?? null

// if (command !== 'encrypt' && !inputSalt || !inputNonce || !inputFile) {
//   throw new Error(`noch noch`)
// }

const password = 'hey'
const message = util.decodeUTF8(commandInput)

let salt
let nonce

if (command === 'encrypt') {
  salt = nacl.randomBytes(16)
  console.log(`salt: ${salt}`)
} else {
  salt = new Uint8Array(inputSalt.split(','))
  nonce = new Uint8Array(inputNonce.split(','))
}

const key = scruptsy(password, salt, 16384, 8, 1, nacl.secretbox.keyLength)
// console.log(`key: ${key}`)

if (command === 'encrypt') {
  nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
  console.log(`nonce: ${nonce}`)

  let encrypted = nacl.secretbox(message, nonce, key)
  encrypted = util.encodeBase64(encrypted)

  fs.writeFile('./encrypted-message-file.txt', encrypted, 'ascii', err => {
    if (err)
      console.log(err)
    else
      console.log(`check out ./encrypted-file.txt`)
  })
} else {
  const content = fs.readFileSync(inputFile, 'ascii')
  const encryptedData = util.decodeBase64(content)
  const decrypt = nacl.secretbox.open(encryptedData, nonce, key)
  console.log(util.encodeUTF8(decrypt))
}
