import { RESERVED_EVENTS } from 'socket.io/dist/socket'
import { User } from '../db/classes/User.js'
import db from '../db/db-setup.js'
import { compareTwoStrings } from '../helpers/simplystring.js'
import { readSessionIdFromReq } from './login-logic.js'



export function fetchUserId(req:any, res:any)
{
    console.log('*** fetchUserId called ***')
    var sessionId = readSessionIdFromReq(req)
    console.log(`fetchUserId function -  sessionId:${sessionId}`)
    var user:User
    if(sessionId) 
    {
       user = db.data?.users.find((u) => u.sessionId == sessionId) as User
       if (user != undefined) 
       {
        console.log('session id\'s match')
        res.send({res:true,userId:user.id})
       }
    }
    else 
    {
        res.send({ res: false, message: 'no user id associated with the given session id' });
    }
}

/**
 * 
 * @param userId id of the current user
 * @param friendName name of the friend they want to find
 */
export async function fetchFriendNames(userId: string, friendName: string)
{
    var friends:User[] = await getMatchingFriends(userId, friendName)
    var friendsHTML:string = friendsToHTML(friends)
    return friendsHTML
}
function friendsToHTML(friends:User[]):string
{
    var friendsHTML = ''
    friends.forEach((f)=> {
        friendsHTML += (`<a data-id="${f.id}"><div>${f.name}</div></a>\n`) as string
    })
    return friendsHTML
}
/**
 * 
 * @param userId user id of current user
 * @param friendName name of firend they want to find
 */
export async function getMatchingFriends(userId:string, friendName:string)
{
    await db.read()
    //get user
    var user:User = db.data?.users.filter((u) => {u.id == Number(userId)})[0] as User
    //get users friends
    const limit = 10
    var friends:User[] = user.friends.filter((f) => compareTwoStrings(f.name,friendName)).slice(0,limit) as User[]
    return friends
}

/**
 * Returns a json list of users who's names
 * match the request paramerter 'name'
 * @param req 
 * @param res 
 */
export async function fetchUsersNames(req:any,res:any) {
    //get name from request params
    var name = req.params.name
    var namesArr:User[] = await getUsersNamesListFromDB(name)
    var namesHTML = ''
    namesArr.forEach((u)=> {
        namesHTML += (`<a data-id="${u.id}"><div>${u.name}</div></a>\n`) as string
    })
    res.send(namesHTML)
}


/**
 * Returns a json list of users who's names
 * match the request paramerter 'name'
 * @param req 
 * @param res 
 */
 export async function getUsersNamesListFromDB(name:string) {
    //read from db
    await db.read()
    //find user from users database where the name is similar over 50%
    const limit = 10//number of names to return
    var arr:User[] = (db.data?.users.filter((user:User) =>  
        compareTwoStrings(name,user.name) >= 0.5))?.slice(0,limit) as User[]
        //take list of users and create list of names
        var arrStr:string[] = [] 
        // arr.forEach(user => {
        //             // arrStr.push(user.name)
        //         })
        
    //convert array of names to json string
    // var usersJSON = JSON.stringify(arrStr)
    //send json list of namesof users
    return arr
}




