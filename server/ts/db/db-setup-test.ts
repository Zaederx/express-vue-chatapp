//@ts-ignore
import path from 'path';
import { Low, JSONFile } from 'lowdb';
import { Data } from './classes/Data.js';
import { User } from './classes/User.js';
import bcryptjs from 'bcryptjs'
import { Chat } from './classes/Chat.js';
//use json file for storage
const file = path.join('db-test.json')

const adapter = new JSONFile<Data>(file);
var db = new Low(adapter)


setup()

async function setup() {
//Read data from Json file, this will set the db.content
await db.read();
//clear db
db.data = {users: []}
//if file.json does not exist db.data will be null
//Set data to default
// db.data ||= {users: []}
const password = 'password'
const passwordHash = bcryptjs.hashSync(password, 10)

var u1:User = new User({email:'email0@email.com',
                        name:'name asdhg' ,
                        username:'username0',
                        password:passwordHash
                    });
u1.sessionId = '555b975a-39e2-4b9f-b62a-7da7d5b8360a'

var u2:User = new User({email:'email1@email.com',
                        name:'name asd asd' ,
                        username:'username1',
                        password:passwordHash
                        });

//create test chat to use with users 1 and 2
var name = 'test Chat'
var chatId = '9d4b8a70-5ddc-4a90-aaac-3acd10596187'
var messages = []
var subscriberIds = ['0','1']
var c1 = new Chat(chatId,name,[],subscriberIds)
u1.chats.push(c1)
u2.chats.push(c1)

var u3:User = new User({email:'email2@email.com',
                        name:'name ghdfgh' ,
                        username:'username3',
                        password:passwordHash
                        });



var u4:User = new User({email:'email1@email.com',
                        name:'asd  asd' ,
                        username:'username4',
                        password:passwordHash
                        });

var u5:User = new User({email:'email2@email.com',
                        name:'asd name' ,
                        username:'username5',
                        password:passwordHash
                        });


var u6:User = new User({email:'email1@email.com',
                        name:'name' ,
                        username:'username6',
                        password:passwordHash
                        });

var u7:User = new User({email:'email2@email.com',
                        name:'name' ,
                        username:'username7',
                        password:passwordHash
                        });

var u8:User = new User({email:'email1@email.com',
                        name:'name' ,
                        username:'username8',
                        password:passwordHash
                        });

var u9:User = new User({email:'email2@email.com',
                        name:'name' ,
                        username:'username9',
                        password:passwordHash
                        });

var u10:User = new User({email:'email0@email.com',
                        name:'name' ,
                        username:'username10',
                        password:passwordHash
                        });

var u11:User = new User({email:'email1@email.com',
                        name:'name' ,
                        username:'username11',
                        password:passwordHash
                        });

var u12:User = new User({email:'email2@email.com',
                        name:'name' ,
                        username:'username12',
                        password:passwordHash
                        });

//add friends to u1
u1.friendIds.push(u2.id,u3.id,u4.id,u5.id,u6.id,u7.id)

//add all users and their information to database
db.data.users.push(u1)
db.data.users.push(u2)
db.data.users.push(u3)
db.data.users.push(u4)
db.data.users.push(u5)
db.data.users.push(u6)
db.data.users.push(u7)
db.data.users.push(u8)
db.data.users.push(u9)
db.data.users.push(u10)
db.data.users.push(u11)
db.data.users.push(u12)
//write this data to json file
await db.write()


/** 
 * needs to be in this order so that db is filled before being queried for users
 */
await db.read()
//add u1 id to all friends
u1.friendIds.forEach(fId => db.data?.users.find(u => u.id == fId)?.friendIds.push(u1.id))
await db.write()

}

export default db