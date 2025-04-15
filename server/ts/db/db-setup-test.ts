//@ts-ignore
import path from 'path';
import { Low, JSONFile } from 'lowdb';
import { Data } from './classes/Data.js';
import { User } from './classes/User.js';
import bcryptjs from 'bcryptjs'
import { Chat } from './classes/Chat.js';
import { unlink, existsSync } from 'node:fs';

const filepath = path.join('db-test.json')
console.log('db-test.json filepath:',filepath)

//delete existing json file if any
if (existsSync(filepath)) {
  unlink(filepath, (err) => {
    if (err) throw err;
    console.log('db-test.json was deleted');
  });
}


//use json file for storage
const adapter = new JSONFile<Data>(filepath);
var db = new Low(adapter)

//call setup
await setup()
async function setup() {
//Read data from Json file, this will set the db.content
await db.read();
//clear db file
db.data = null
db.data = {users: []}

//if file.json does not exist db.data will be null
//Set data to default
// db.data ||= {users: []}
const password = 'password'
const passwordHash = bcryptjs.hashSync(password, 10)

var u0:User = new User({email:'email0@email.com',
                        name:'name 0' ,
                        username:'username0',
                        password:passwordHash
                    });
u0.sessionId = '555b975a-39e2-4b9f-b62a-7da7d5b8360a'

var u1:User = new User({email:'email1@email.com',
                        name:'name 1' ,
                        username:'username1',
                        password:passwordHash
                        });

//create test chat to use with users 1 and 2
var name = 'Test Chat'
var chatId = '9d4b8a70-5ddc-4a90-aaac-3acd10596187'
var messages = []
var subscriberIds = ['0','1']
var c1 = new Chat(chatId,name,[],subscriberIds)
u0.chats.push(c1)
u1.chats.push(c1)

var u2:User = new User({email:'email2@email.com',
                        name:'name 2' ,
                        username:'username2',
                        password:passwordHash
                        });



var u3:User = new User({email:'email3@email.com',
                        name:'name 3' ,
                        username:'username3',
                        password:passwordHash
                        });


//add friends to u1
u0.friendIds.push(u1.id,u2.id,u3.id)

//add all users and their information to database
db.data.users.push(u0)
db.data.users.push(u1)
db.data.users.push(u2)
db.data.users.push(u3)

//write this data to json file
await db.write()


/** 
 * needs to be in this order so that db is filled before being queried for users
 */
await db.read()
//add u0 id to all friends
u1.friendIds.forEach(fId => db.data?.users.find(u => u.id == fId)?.friendIds.push(u0.id))
await db.write()

}

export default db