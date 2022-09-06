import * as userLogic from '../js/controller-logic/users-logic.js'
import { Friend } from '../js/db/classes/Friend.js'
import { describe, it} from 'mocha'
import { Chat } from '../js/db/classes/Chat.js'
import { fetchUserId } from '../js/controller-logic/users-logic.js'
import db from '../js/db/db-setup-test.js'
describe('Testing Fetch Chats', ()=> 
{
    describe('fetchChats(userId=invalidId)', () => 
    {
        it('should return an empty list', async () => 
        {
            var invalidId = 20
            var chats = await userLogic.fetchChats(invalidId)
            var emptyList = []

            try {
                if (chats.length == emptyList.length) 
                {
                    return true
                }
                else
                {
                    throw new Error(`List is not empty. typeof chats:${typeof chats}`)
                }
            }
            catch(e)
            {
                throw new Error('Problem evaluating list length. List object may be undefined.')
            }
            
        })
    })

    describe('fetchChats(userId=validId)', () => 
    {
        it('should return an empty list', async () => 
        {
            var validId = 0
            var chats = await userLogic.fetchChats(validId)
            var emptyList = []

            try {
                if (chats.length != emptyList.length) 
                {
                    return true
                }
                else if (chats.length == emptyList.length)
                {
                    throw new Error(`List is empty when is should contain chats.`)
                }
            }
            catch(e)
            {
                throw new Error('Problem evaluating list length. List object may be undefined.')
            }
            
        })
    })
})

const dbPath = 'db-test.json'
describe('Testing Fetch Chats', () => 
{
    describe('fetchUserId(sessionId=validId)', () => 
    {

        it('should return a userId', async () => 
        {
            var validId = '98b44a86-28b9-4cc1-a9a2-622399e18e70'
            var userId = await fetchUserId(validId,dbPath)
            console.log(`userId:${userId}`)
            //if userId contains what looks like an id - return true
            if (typeof userId == Number && userId != false && userId != undefined)
            {
                return true
            }
            //if it looks like there's no id - throw an error
            else if (userId == false || userId == undefined || userId == '') 
            {
                throw new Error('No user id returned when one should be.')
            }
        })
    })

    describe('fetchUserId(sessionId=invalidId)', () => 
    {
        it('should return false', async () => 
        {
            var pass = true
            var validId = 'InValidId'
            var userId = ''
            userId = await fetchUserId(validId,dbPath)
            console.log(`userId:${userId}`)
            if (userId == undefined)
            {
                throw new Error('User Id is undefined when it should be false')
            }
            //if it returns what looks like a user id - throw an error
            else if (typeof userId == Number || userId != false) 
            {
                throw new Error('User Id returned when there should not be one')
            }
            //if it returns a false value - return pass
            else if (userId != false) 
            {
               return pass
            }
        })
    })
})

