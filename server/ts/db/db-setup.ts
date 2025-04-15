//@ts-ignore
import path from "path";
import { Low, JSONFile } from 'lowdb';
import { Data } from "./classes/Data.js";
import { User } from "./classes/User.js";
import bcryptjs from 'bcryptjs'
import { unlink, existsSync } from 'node:fs';

const filepath = path.join('db.json')
console.log('db.json filepath:',filepath)

//delete existing json file if any
if (existsSync(filepath)) {
  unlink(filepath, (err) => {
    if (err) throw err;
    console.log('db.json was deleted');
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
//Set data to default
db.data ||= {users: []}
const password = 'password'
const passwordHash = bcryptjs.hashSync(password, 10)

var u0:User = new User({email:'email0@email.com',
                        name:'name 0' ,
                        username:'username0',
                        password:passwordHash
                    });

var u1:User = new User({email:'email1@email.com',
                        name:'name 1' ,
                        username:'username1',
                        password:passwordHash
                        });

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

var u4:User = new User({email:'email4@email.com',
                        name:'name 4' ,
                        username:'username4',
                        password:passwordHash
                        });



//add friends to u1
u0.friendIds.push(u1.id,u2.id,u3.id,u4.id)
u1.friendIds.push(u0.id,u2.id,u3.id,u4.id)
u2.friendIds.push(u0.id,u1.id,u3.id,u4.id)
u3.friendIds.push(u0.id,u1.id,u2.id,u4.id)
u4.friendIds.push(u0.id,u1.id,u2.id,u3.id)




//add all users and their information to database
db.data.users.push(u1)
db.data.users.push(u2)
db.data.users.push(u3)
db.data.users.push(u4)

//write this data to json file
await db.write()


/** 
 * needs to be in this order so that db is filled before being queried for users
 */
await db.read()
//add u1 id to all friends
u1.friendIds.forEach(fId => db.data?.users.find(u => u.id == fId)?.friendIds.push(u1.id) )
await db.write()

}

export default db