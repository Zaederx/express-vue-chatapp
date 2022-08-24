import db from '../db/db-setup.js';
import { compareTwoStrings } from '../helpers/simplystring.js';
/**
 * Returns a json list of users who's names
 * match the request paramerter 'name'
 * @param req
 * @param res
 */
export async function getUsersNames(req, res) {
    //get name from request params
    var name = req.params.name;
    //read from db
    await db.read();
    //find user from users database where the name is similar over 50%
    const limit = 10; //number of names to return
    var arr = (db.data?.users.filter((user) => compareTwoStrings(name, user.name) >= 0.5))?.slice(0, limit);
    //take list of users and create list of names
    var arrStr = [];
    arr.forEach(user => {
        arrStr.push(user.name);
    });
    //convert array of names to json string
    var usersJSON = JSON.stringify(arrStr);
    //send json list of namesof users
    res.json({ usersJSON });
}
