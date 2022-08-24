import sim from 'string-similarity';
import db from '../db/db-setup.js';
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
    var arr = (db.data?.users.filter((user) => sim.compareTwoStrings(name, user.name) >= 0.5))?.slice(0, limit);
    //take list of users and create list of names
    var arrStr = [];
    arr.forEach(user => {
        arrStr.push(user.name);
    });
    //convert array of names to json string
    var usersJSON = JSON.stringify(arrStr);
    //send json list of namesof users
    res.json(usersJSON);
}
export function compareTwoStrings(shortStr, longStr) {
    if (shortStr.length > longStr.length) {
        var { shortStr, longStr } = swap(shortStr, longStr);
    }
    var similarity = editDistance(shortStr, longStr);
}
function swap(shortStr, longStr) {
    return { shortStr: longStr, longStr: shortStr };
}
function editDistance(shortStr, longStr) {
    if (shortStr.length == 0) {
        return shortStr.length;
    }
    if (longStr.length == 0) {
        return longStr.length;
    }
    var longArr = longStr.split('');
    var shortArr = shortStr.split('');
    var scoreList = [];
    shortArr.forEach((char) => {
        //set variables
        var checking = true;
        var i = 0;
        while (checking) {
            //set/reset variables
            var found = 0;
            var distance = 0;
            //if char is found (within length of longStr)
            if (i <= longArr.length && char == longArr[i]) {
                //mark char as found
                found = 1;
                //remove the index the char was found at
                longArr.splice(i, 1);
                //set distance found at
                distance = i + 1; //so that the first position is 1 - not dividing by zero
                //give char a score
                var score = charFoundDistanceScore(found, distance);
                //store the score
                scoreList.push(score);
                //stop searching for the char
                checking = false;
            }
            i++;
        }
    });
    var totalScore = 0;
    scoreList.forEach(score => totalScore += score);
    var editDistance = totalScore / scoreList.length;
    return editDistance;
}
/**
     *
     * @param found whether the char has been found - either 0 or 1
     * @param distance how far the char was found from it's array position
     */
function charFoundDistanceScore(found, distance) {
    var score = 0;
    if (found) {
        score = found / distance;
    }
    return score;
}
