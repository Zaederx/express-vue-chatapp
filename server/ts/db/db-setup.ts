//@ts-ignore
import path from "path";
import { Low, JSONFile } from 'lowdb';
import { Data } from "./classes/Data.js";
import { User } from "./classes/User.js";
import bcryptjs from 'bcryptjs'
import { unlink } from 'node:fs';

//delete existing json file if any
unlink('db.json', (err) => {
  if (err) throw err;
  console.log('db.json was deleted');
});
//use json file for storage
const file = path.join('db.json')

const adapter = new JSONFile<Data>(file);
var db = new Low(adapter)





setup()
async function setup() {
//Read data from Json file, this will set the db.content
await db.read();
//if file.json does not exist db.data will be null
//Set data to default
db.data ||= {users: []}
const password = 'password'
const passwordHash = bcryptjs.hashSync(password, 10)

var u1:User = new User({email:'email0@email.com',
                        name:'name 1' ,
                        username:'username0',
                        password:passwordHash
                    });

var u2:User = new User({email:'email1@email.com',
                        name:'name 2' ,
                        username:'username1',
                        password:passwordHash
                        });

var u3:User = new User({email:'email2@email.com',
                        name:'name 3' ,
                        username:'username3',
                        password:passwordHash
                        });

var u4:User = new User({email:'email1@email.com',
                        name:'name 4' ,
                        username:'username4',
                        password:passwordHash
                        });

var u5:User = new User({email:'email2@email.com',
                        name:'name 5' ,
                        username:'username5',
                        password:passwordHash
                        });


var u6:User = new User({email:'email1@email.com',
                        name:'name 6' ,
                        username:'username6',
                        password:passwordHash
                        });

var u7:User = new User({email:'email2@email.com',
                        name:'name 7' ,
                        username:'username7',
                        password:passwordHash
                        });

//add friends to u1
u1.friendIds.push(u2.id,u3.id,u4.id,u5.id,u6.id,u7.id)
u2.friendIds.push(u1.id,u3.id,u4.id,u5.id,u6.id,u7.id)
u3.friendIds.push(u1.id,u2.id)
u4.friendIds.push(u1.id,u2.id)
u5.friendIds.push(u1.id,u2.id)
u6.friendIds.push(u1.id,u2.id)
u7.friendIds.push(u1.id,u2.id)



//add all users and their information to database
db.data.users.push(u1)
db.data.users.push(u2)
db.data.users.push(u3)
db.data.users.push(u4)
db.data.users.push(u5)
db.data.users.push(u6)
db.data.users.push(u7)

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