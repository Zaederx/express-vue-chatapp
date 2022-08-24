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
// setup()
function setup() {
    //if file.json does not exist db.data will be null
    //Set data to default
    db.data || (db.data = { users: [] });
    const password = 'password';
    const passwordHash = bcryptjs.hashSync(password, 10);
    var u1 = new User({ email: 'email0@email.com',
        name: 'name asdhg',
        username: 'username0',
        password: passwordHash
    });
    var u2 = new User({ email: 'email1@email.com',
        name: 'name asd asd',
        username: 'username1',
        password: passwordHash
    });
    var u3 = new User({ email: 'email2@email.com',
        name: 'name ghdfgh',
        username: 'username3',
        password: passwordHash
    });
    var u4 = new User({ email: 'email1@email.com',
        name: 'asd  asd',
        username: 'username4',
        password: passwordHash
    });
    var u5 = new User({ email: 'email2@email.com',
        name: 'asd name',
        username: 'username5',
        password: passwordHash
    });
    var u6 = new User({ email: 'email1@email.com',
        name: 'name',
        username: 'username6',
        password: passwordHash
    });
    var u7 = new User({ email: 'email2@email.com',
        name: 'name',
        username: 'username7',
        password: passwordHash
    });
    var u8 = new User({ email: 'email1@email.com',
        name: 'name',
        username: 'username8',
        password: passwordHash
    });
    var u9 = new User({ email: 'email2@email.com',
        name: 'name',
        username: 'username9',
        password: passwordHash
    });
    var u10 = new User({ email: 'email0@email.com',
        name: 'name',
        username: 'username10',
        password: passwordHash
    });
    var u11 = new User({ email: 'email1@email.com',
        name: 'name',
        username: 'username11',
        password: passwordHash
    });
    var u12 = new User({ email: 'email2@email.com',
        name: 'name',
        username: 'username12',
        password: passwordHash
    });
    db.data.users.push(u1);
    db.data.users.push(u2);
    db.data.users.push(u3);
    db.write(); //writes new objects - don't use for updating objects or it causes duplicates
    //only use for writing new objects
}
export default db;
