//@ts-ignore
import * as socketLogic from '../js/controller-logic/socket-logic.js'
import { Friend } from '../js/db/classes/Friend.js'
import { describe, it} from 'mocha'
import { Chat } from '../js/db/classes/Chat.js'
import { fileURLToPath } from "url"
import path from "path"
import dbTest from '../js/db/db-setup-test.js'//sets up the test db
import db from '../js/db/db-setup.js'//sets up the db

await dbTest.read()
await db.read()
//path to current file
const __filename = fileURLToPath(import.meta.url);
//path to current directory
const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);
const dbPath = path.join(__dirname,'..','db-test.json');
console.log(`dbPath = ${dbPath}`)

describe('Socket Logic - Unit Tests', () => {
  // TEST createChat function
  describe('Testing createChat function', () => 
  {
    describe('socketLogic.createChat(userId,[friend])', async() => {
        it('should create a chat', async () => {
        var userId = 0
        var friend = new Friend('name','1')
        //no chat id provided
        var chat = await socketLogic.createChat(dbPath,userId,[friend])
        if(chat == undefined)
        {
          throw Error('Chat is undefined')
        }
        else
        {
          return true
        }
        }) 
    })
    
    describe('socketLogic.createChat(userId,[friend],chatId=falseId)', async() => {
        it('should create a new chat with unique id', async () => {
          var userId = 0
          var friend = new Friend('name','1')
          var chatId = 0
          var chat = await socketLogic.createChat(dbPath,userId,[friend],chatId)
          if(chat == undefined)
          {
            throw new Error('Chat undefined')
          }
          else if (typeof chat == Chat)
          {
            return true
          }
        }) 
    })
    
    describe('socketLogic.createChat(userId,[friend],chatId=realId)', async() => {
        it('should fetch chat from db', async () => 
        {
          var userId = 0
          var friend = new Friend('name','1')
          var chatId = '9d4b8a70-5ddc-4a90-aaac-3acd10596187'
          var chat = await socketLogic.createChat(dbPath,userId,[friend],chatId)
          if(chat == undefined)
          {
            throw new Error('Chat is undefined')
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


  describe('Test Socket Logic - Leave Chat', async() => {
    describe('socketLogic.leaveChat(dbPath,userId,chatId)', async() => {
      it('should remove a chat', async () => 
      {
        var userId = 0
        var chatId = '9d4b8a70-5ddc-4a90-aaac-3acd10596187'
        var successful = await socketLogic.leaveChat(dbPath,userId,chatId)
        if(successful)
        {
          return true
        }
        else 
        {
          throw Error(`Chat has not been left`)
        }
        
      }) 
  })
  })
})



after(()=> 
{
  // console.log('After called')
  // db.data = {}
  // db.write()  
})

