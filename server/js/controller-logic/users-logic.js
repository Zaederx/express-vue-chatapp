import sim from 'string-similarity';
import db from '../db/db-setup.js';
/**
 * Returns a json list of users who's names
 * match the request paramerter 'name'
 * @param req
 * @param res
 */
export async function getUsersNames(req, res) {
    var name = req.params.name;
    await db.read();
    var arr = db.data?.users.filter((user) => sim.compareTwoStrings(name, user.name) > 0.5);
    var arrStr = [];
    arr.forEach(user => {
        arrStr.push(user.name);
    });
    //convert array of names to json string
    var usersJSON = JSON.stringify(arrStr);
    res.json(usersJSON);
}
