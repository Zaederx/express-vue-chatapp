//@ts-ignore
import * as socketLogic from '../js/controller-logic/socket-logic.js'
import { Friend } from '../js/db/classes/Friend.js'
import { describe, it} from 'mocha'
import { Chat } from '../js/db/classes/Chat.js'
import { fileURLToPath } from "url"
import path from "path"

//path to current file
const __filename = fileURLToPath(import.meta.url);
//path to current directory
const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);
const dbPath = path.join(__dirname, '..','db-test.json');
console.log(`dbPath = ${dbPath}`)

describe('Socket Logic Tests', () => {
  // TEST createChat function
  describe('Testing createChat function', () => 
  {
    describe('socketLogic.createChat(userId,[friend])', async() => {
        it('should create a chat', async () => {
        var userId = 0
        var friend = new Friend('name','1')
        //no chat id provided
        var chat = await socketLogic.createChat(dbPath,userId,[friend])
        if(chat == typeof Chat)
        {
          return true
        }
        else
        {
          return false
        }
        }) 
    })
    
    describe('socketLogic.createChat(userId,[friend],chatId=falseId)', async() => {
        it('should create create a chat', async () => {
        var userId = 0
        var friend = new Friend('name','1')
        var chatId = 0
        var chat = await socketLogic.createChat(dbPath,userId,[friend],chatId)
        if(typeof chat == undefined)
        {
          throw new Error('Not Expected Value')
        }
        else if (typeof chat == Chat)
        {
          return true
        }
        }) 
    })
    
    describe('socketLogic.createChat(userId,[friend],chatId=realId)', async() => {
        it('should fetch chat from db', async () => {
        var userId = 0
        var friend = new Friend('name','1')
        var chatId = '9d4b8a70-5ddc-4a90-aaac-3acd10596187'
        var chat = await socketLogic.createChat(dbPath,userId,[friend],chatId)
        if(typeof chat == undefined)
        {
          throw new Error('Not Expected Value')
        }
        else if (chat.id == chatId)
        {
          return true
        }
        else 
        {
          throw Error(`Id's do not match`)
        }
        }) 
    })
  })
})




// // 9ecca7f0-683f-4ae4-8981-cb2d8692fdd7
// test('should return chat',
// async () => {
//     var userId = 0
//     var friend = new Friend('name','1')
//     var chatId = '9ecca7f0-683f-4ae4-8981-cb2d8692fdd7'
//     var chat = await socketLogic.createChat(userId,[friend], )
//     expect(chat).toBeUndefined()
// })