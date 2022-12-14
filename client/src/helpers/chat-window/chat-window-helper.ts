
//@ts-ignore
import type { Chat } from "@/classes/Chat.js"
import { Friend } from "@/classes/Friend.js"

import type { Message } from "../Message.js"

class VarContainer 
{
    selectedFriends: Friend[] = []
    url :string = ''
}
 /**
 * Sets query names in queryDiv with event to 
 * to add self to nameBadgeBox onclick
 */
export function setQueryAllNamesWithClickEvent(queryDiv:HTMLDivElement, varContainer:VarContainer, nameBadgeBox:HTMLDivElement, messagesBox:HTMLDivElement)
  {
    console.log(`****** setQueryAllNamesWithClickEvent called *****`)
    //each node is an `<a data-id="${id}"><div>name</div></a>` tag with a name enclosed
    //want each node to add itself to the nameBadgeBox onclick
    queryDiv.childNodes.forEach((node) => 
    {
        if (node != undefined && node.nodeName != '#text')
        {
            var a = node as HTMLLinkElement
            //get friend id
            var friendId = a.getAttribute('data-id') as string
            // get friend's name
            var friendName = (a.childNodes[0] as HTMLDivElement).innerHTML//contains user's name
            
            //set the element with a function onclick
            a.onclick = () => 
            {
                //create friend object from name and id
                var selectedFriend = new Friend(friendName,friendId)
                //get selected friends
                var selectedFriends = varContainer.selectedFriends

                //check whether create friend already exists in selectedFriends list
                varContainer.selectedFriends = filter(selectedFriends,selectedFriend) as Friend[]

                //check for duplicates
                var duplicateFriend = false
                var friendsCount = selectedFriends.length
                var newFriendsCount = varContainer.selectedFriends.length
                if (newFriendsCount > friendsCount) {duplicateFriend = false}
                else if (newFriendsCount == friendsCount) {duplicateFriend = true}

                //if not duplicate...
                if (!duplicateFriend)
                {
                    //select name and put into badge box
                    setNameInNameBadgeBox(nameBadgeBox, friendId, friendName)
                    //log friend that has been added
                    console.log(`added Friend name:${friendName}, id:${friendId}`)
                    //set all badge buttons - with remove event
                    makeClickableBadgeButtons(nameBadgeBox, varContainer)
                }
                 
                // displayNameBadgeBox()
                displayDiv(nameBadgeBox)
                displayDiv(messagesBox)
                hideDiv(queryDiv)


                
            }
        }
        
    })
          
}

/**
 * Adds friends to a friend list ensuring that there are new duplicates
 * of the given friend.
 * Returns a list with the friend included, but no duplicates of that friend.
 * @param friends 
 * @param friend 
 */
export function filter(friends:Friend[],friend:Friend):Friend[]|null 
{
    var selectedFriends:Friend[] = friends.filter(f => !(f.equals(friend)))
    console.log(`selectedFriends:${selectedFriends}`)
    selectedFriends.push(friend)
    return selectedFriends
}
// hide and display queryDiv
export function hideDiv(div:HTMLElement)
{
    div.style.display = "none"
}
export function displayDiv(div:HTMLElement)
{
    div.style.display = "block"
}

/**
 * Make badge buttons respond to click.
 * Responds by removing themselves from 
 * varContainer.selectedFriends.
 * It then refills the badge div with names left in
 * varContainer.selectedFriends
 */
export function makeClickableBadgeButtons(nameBadgeBox:HTMLDivElement, varContainer:VarContainer)
 {
     console.log(' **** makeClickableBadgeButtons ****')

     //set onclick events on the span of <span data-id="friendId" class='friend-name'>${friend_name}<span>X</span></span>
     nameBadgeBox.childNodes.forEach((node) => {
         if(node != undefined && node.nodeName != '#text')
         {
            var span1 = (node as HTMLDivElement)
            var friendId = span1.getAttribute('data-id')
            var span2 = ((node as HTMLDivElement).childNodes[0] as HTMLSpanElement)
            span1.addEventListener('click' ,() => {
                console.log('close-btn-div click')
                removeSelectedFriend(nameBadgeBox, varContainer, {id:friendId as string})
            })
            span2.addEventListener('click' ,() => {
                console.log('close-btn-div click')
                removeSelectedFriend(nameBadgeBox,varContainer,{id:friendId as string})

            })
         }
     })

     console.log(' **** End of makeClickableBadgeButtons ****')
     
 }


 /**
     * Turns name into badge which is then put into 
     * the nameBadgeBox. Also puts firend id into data-id 
     * attribute of the span tag.
     * 
     * @param nameBadgeBox div to put badge into
     * @param friendId id to put into span data-id
     * @param friendName name to put into badge box
     */
export function setNameInNameBadgeBox(nameBadgeBox:HTMLDivElement,friendId:string, friendName:string)
  {
      clearSearchbar()
      //set this name in the searchbar

      nameBadgeBox.innerHTML += `<span data-id="${friendId}" class='friend-name'>${friendName}<span class="btn-close">X</span></span>`

  }


  /**
     * Clears the searchbar
     */
function clearSearchbar()
   {
       var searchbar = (document.querySelector('#searchbar') as HTMLDivElement)
       searchbar.innerHTML = ''
}

   
   


   /**
    * Removes Friend of given id from varContainer.selectedFriends
    * @param id 
    */
function removeFriendFromVarsContainer(varContainer:VarContainer, id:string, name?:string, ):void
{
    if(id)
    {
        //find index of friend in array / list - using obj.id
        var i = varContainer.selectedFriends.findIndex((f:Friend) => f.id == id)
        //remove that index that spot in the array / list
        varContainer.selectedFriends.splice(i, 1)
    }
    else
    {
        //find index of friend in array / list - using obj.name
        var i = varContainer.selectedFriends.findIndex((f:Friend) => f.name == name)
        //remove that index that spot in the array / list
        varContainer.selectedFriends.splice(i, 1)
    }
}

function removeSelectedFriend(nameBadgeBox:HTMLDivElement,varContainer:VarContainer,obj:{id?:string, name?:string}) 
{   
    console.log('******* removeSelectedFriend called *******')
    console.log(`varContainer.selectedFriends:${varContainer.selectedFriends.toLocaleString()}`)
    removeFriendFromVarsContainer(varContainer,obj.id as string, obj.name)
    clearSearchbar()
    console.log(`varContainer.selectedFriends:${varContainer.selectedFriends}`)
    fillNameBadgeBoxFromVarsContainer(nameBadgeBox, varContainer)

}

/**
 * Fills name badge box with name badges from names found
 * in varContainer.selectedFriends.
 * Also makes them clickable
 */
function fillNameBadgeBoxFromVarsContainer(nameBadgeBox:HTMLDivElement, varContainer:VarContainer)
{
    //empty name badge box
    nameBadgeBox.innerHTML = ''
    //fill name badge box
    varContainer.selectedFriends.forEach((f:Friend) => {
        setNameInNameBadgeBox(nameBadgeBox, f.id,f.name)
        makeClickableBadgeButtons(nameBadgeBox, varContainer)
    })
}

/**
 * Convert messages to HTML with classes for vue frontend
 * @param messages messages to be turned to HTML
 * @param userId userId of person receiving the messages
 */
 export function chatMessagesToHTML(messages:Message[], userId:string) 
 {
     var messagesHTML = ''
     messages.forEach(m => 
     {
         //if sent by user
         if (m.senderId == userId) 
         {
             messagesHTML += `<div class="message-sent">${m.message}</div>`
         }
         else
         {
             messagesHTML += `<div class="message-received">${m.message}</div>`
         }
         
     })
     if (messagesHTML == '') 
     {
         messagesHTML = `<div class="notice">No Messages</div>`
     }
     return messagesHTML
 }






/**
 * Fetches the messages of the user's chat
 * @param chatId id of the chat you want messages from
 * @param userId optional (because user can be found through session cookie)
 */
export async function fetchMessages(chatId:string, userId:string='') 
{
    return (await (await fetch(`/api/messages/${chatId}/${userId}`)).text())
}

 /**
   * Loads messages into messageBox.
   */
export async function loadMessages(socketVars:any,  messageBox:HTMLSpanElement)
{
var { chatId, userId } = socketVars
//send request for fetch messages
var messagesHTML = await fetchMessages(chatId, userId)//TODO WRITE FUNCTION
messageBox.innerHTML = messagesHTML
}

/**
 * Fetches the current users chats.
 * @param userId user id of the current user
 */
export async function fetchChatsJson(userId:string):Promise<Chat[]>
{
    //fetch response and then turn to json
    return (await (await fetch('/api/chats/'+userId)).json()).chats

}

/**
 * Loads chats of the current user into
 * chat sidebar.
 * @param userId user id of the current user
 */

export async function loadChats(socketVars:any, chatsSidebar:HTMLDivElement, messageBox:HTMLDivElement, socket:any) 
{
    console.log('loadChats called')
    var { userId } = socketVars
    const chats:Chat[] = await fetchChatsJson(userId)
    //fill chat sidebar with fetched chats
    chatsSidebar.innerHTML = chatsToHTML(chats)
    //set each chat with onclick event - set chat id
    setChatDivsWithEvent(messageBox, chatsSidebar, socketVars, socket)
}

/**
 * set each chat div with onclick event
 * to set chat id to the data-id attribute
 */
function setChatDivsWithEvent(messageBoxDiv:HTMLSpanElement, chatsSidebar:HTMLDivElement, socketVars:any, socket:any)
{
chatsSidebar.childNodes.forEach((node) => {
    //if node is not a text node
    if (node != undefined && node.nodeName != '#text')
    {
        //node is a div node
        var div = node as HTMLDivElement
        //div add event listener click
        div.addEventListener('click', async ()=> {
            //set chat id from div data-id attribute - store for later
            socketVars.chatId = div.getAttribute('data-id')as string;
            var { chatId, userId } = socketVars
            //send request for fetch messages
            var messagesHTML = await fetchMessages(chatId, userId)//TODO WRITE FUNCTION
            messageBoxDiv.innerHTML = messagesHTML
            //join socket onto chat
            socket.emit('join-chat', chatId)
        })
    }
})
}

  
/**
 * Takes an array of chats and converts them to HTML divs
 * @param chats chats to be turned to HTML
 */
function chatsToHTML(chats:Chat[]):string
{
var chatsHTML = ''
chats.forEach((c) => {
    //get div from html - fill with chat div
    chatsHTML += `<div data-id="${c.id}" class="chat">${c.name}</div>`
})
return chatsHTML
}





/**
 * Fetches the current users id
 */
export async function fetchUserId():Promise<string>
{
    return (await (await fetch('/api/userId')).json()).userId
}



