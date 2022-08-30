import db from '../db/db-setup.js';
import { compareTwoStrings } from '../helpers/simplystring.js';
import { readSessionIdFromReq } from './login-logic.js';
export function fetchUserId(req, res) {
    console.log('*** fetchUserId called ***');
    var sessionId = readSessionIdFromReq(req);
    console.log(`fetchUserId function -  sessionId:${sessionId}`);
    var user;
    if (sessionId) {
        user = db.data?.users.find((u) => u.sessionId == sessionId);
        if (user != undefined) {
            console.log('session id\'s match');
            res.send({ res: true, userId: user.id });
        }
    }
    else {
        res.send({ res: false, message: 'no user id associated with the given session id' });
    }
}
/**
 *
 * @param userId id of the current user
 * @param friendName name of the friend they want to find
 */
export async function fetchFriendNames(userId, friendName) {
    var friends = await getMatchingFriends(userId, friendName);
    var friendsHTML = friendsToHTML(friends);
    return friendsHTML;
}
function friendsToHTML(friends) {
    var friendsHTML = '';
    friends.forEach((f) => {
        friendsHTML += (`<a data-id="${f.id}"><div>${f.name}</div></a>\n`);
    });
    return friendsHTML;
}
/**
 *
 * @param userId user id of current user
 * @param friendName name of firend they want to find
 */
export async function getMatchingFriends(userId, friendName) {
    await db.read();
    //get user
    var user = db.data?.users.filter((u) => { u.id == Number(userId); })[0];
    //get users friends
    const limit = 10;
    var friends = user.friends.filter((f) => compareTwoStrings(f.name, friendName)).slice(0, limit);
    return friends;
}
/**
 * Returns a json list of users who's names
 * match the request paramerter 'name'
 * @param req
 * @param res
 */
export async function fetchUsersNames(req, res) {
    //get name from request params
    var name = req.params.name;
    var namesArr = await getUsersNamesListFromDB(name);
    var namesHTML = '';
    namesArr.forEach((u) => {
        namesHTML += (`<a data-id="${u.id}"><div>${u.name}</div></a>\n`);
    });
    res.send(namesHTML);
}
/**
 * Returns a json list of users who's names
 * match the request paramerter 'name'
 * @param req
 * @param res
 */
export async function getUsersNamesListFromDB(name) {
    //read from db
    await db.read();
    //find user from users database where the name is similar over 50%
    const limit = 10; //number of names to return
    var arr = (db.data?.users.filter((user) => compareTwoStrings(name, user.name) >= 0.5))?.slice(0, limit);
    //take list of users and create list of names
    var arrStr = [];
    // arr.forEach(user => {
    //             // arrStr.push(user.name)
    //         })
    //convert array of names to json string
    // var usersJSON = JSON.stringify(arrStr)
    //send json list of namesof users
    return arr;
}
