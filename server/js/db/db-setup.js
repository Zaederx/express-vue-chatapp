import path from "path";
import { Low, JSONFile } from 'lowdb';
import { User } from "./classes/User.js";
import bcryptjs from 'bcryptjs';
//use json file for storage
const file = path.join('db.json');
const adapter = new JSONFile(file);
var db = new Low(adapter);
//Read data from Json file, this will set the db.content
await db.read();
//if file.json does not exist db.data will be null
//Set data to default
db.data || (db.data = { users: [] });
const password = 'password';
const passwordHash = bcryptjs.hashSync(password, 10);
export var vars = { id: 0 };
var u1 = new User({ email: 'email0@email.com',
    name: 'name',
    username: 'username0',
    password: passwordHash
});
var u2 = new User({ email: 'email1@email.com',
    name: 'name',
    username: 'username1',
    password: passwordHash
});
var u3 = new User({ email: 'email2@email.com',
    name: 'name',
    username: 'username2',
    password: passwordHash
});
db.data.users.push(u1);
db.data.users.push(u2);
db.data.users.push(u3);
db.write(); //writes new objects - don't use for updating objects or it causes duplicates
//only use for writing new objects
export default db;
