import path from "path";
import { Low, JSONFile } from 'lowdb';
import { Data } from "./classes/Data.js";
import { User } from "./classes/User.js";
import bcryptjs from 'bcryptjs'
//use json file for storage
const file = path.join('db.json')

const adapter = new JSONFile<Data>(file);
var db = new Low(adapter)



//Read data from Json file, this will set the db.content
await db.read();

// setup()
function setup() {
//if file.json does not exist db.data will be null
//Set data to default
db.data ||= {users: []}
const password = 'password'
const passwordHash = bcryptjs.hashSync(password, 10)

var u1:User = new User({email:'email0@email.com',
                        name:'name asdhg' ,
                        username:'username0',
                        password:passwordHash
                    });

var u2:User = new User({email:'email1@email.com',
                        name:'name asd asd' ,
                        username:'username1',
                        password:passwordHash
                        });

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
                
u1.friends.push(u2,u3,u4,u5,u6,u7)
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
db.write()//writes new objects - don't use for updating objects or it causes duplicates
//only use for writing new objects
}


export default db