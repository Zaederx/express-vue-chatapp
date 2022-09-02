<script setup lang="ts" defer>
import { displayDiv, hideDiv, setNameInNameBadgeBox, setQueryAllNamesWithClickEvent } from '@/helpers/chat-window/chat-window-helper.js';
import { onMounted, onUpdated } from 'vue';
import type {Friend} from '../classes/Friend.js'
//@ts-ignore
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import $ from 'jquery'
import type { Chat } from '@/classes/Chat';

console.log('**** ChatWindow Setup Script called ****');
    //SEARCHBAR 
    //declare variables
    var name:string
    var searchbar:HTMLDivElement
    var queryDiv: HTMLDivElement
    var nameBadgeBox: HTMLDivElement
    var messageBox:HTMLDivElement
    var btnJoinChat:HTMLDivElement
    var chatsSidebar:HTMLDivElement
    var token = {csrfToken:''}

     //CHAT SOCKETS
    const socketVars = 
    {
        userId: '',
        chatId: ''
    }
    
    //VarContainer
    var friendArr:Friend[] = []
    var varContainer = 
    {
        selectedFriends: friendArr,
        url : '/api/get-friends/with-name/'
    }
    
    
    var socket:any;
  onMounted(async () => {
    console.log('  ***** onMounted was called ***** ')
    //initialise variables
    token.csrfToken = $("meta[name='csrf-token']").attr("content") as string;
    name = '';
    searchbar = (document.querySelector('#searchbar') as HTMLDivElement)
    queryDiv = document.querySelector('#queryDiv') as HTMLDivElement
    nameBadgeBox = document.querySelector('#name-badge-box') as HTMLDivElement
    messageBox = document.querySelector('#message-box') as HTMLDivElement
    btnJoinChat = document.querySelector('#btn-join-chat') as HTMLDivElement
    chatsSidebar = document.querySelector('#chat-sidebar') as HTMLDivElement
    socket = io({
                //proxy address + socket.io
                path:'/socket.io',
                withCredentials: true,
                extraHeaders: 
                {
                    'CSRF-Token': token.csrfToken
                },
                transports: ['websocket'],
                autoConnect: true //default
            });
    //fetch user id
    const userId = await fetchUserId()
    //set userId value in socketVars
    socketVars.userId = userId
    //fetch chats
    const chats:Chat[] = await fetchChatsJson(userId)
    //fill chat sidebar with fetched chats
    chatsSidebar.innerHTML = chatsToHTML(chats)
    //set each chat with onclick event - set chat id
    setChatDivsWithEvent(messageBox)

  })

  /**
   * set each chat div with onclick event
   * to set chat id to the data-id attribute
   */
  function setChatDivsWithEvent(messageBoxDiv:HTMLDivElement)
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
                var {chatId, userId } = socketVars
                //send request for fetch messages
                var messagesHTML = await fetchMessages(chatId, userId)//TODO WRITE FUNCTION
                messageBoxDiv.innerHTML = messagesHTML

            })
        }
    })
  }

  /**
   * Fetches the messages of the user's chat
   * @param chatId id of the chat you want messages from
   * @param userId optional (because user can be found through session cookie)
   */
async function fetchMessages(chatId:string, userId:string='') 
{
    return (await (await fetch(`/api/messages/${chatId}/${userId}`)).text())
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
async function fetchChatsJson(userId:string):Promise<Chat[]>
{
    //fetch response and then turn to json
    return (await (await fetch('/api/chats/'+userId)).json()).chats
}
/**
 * Fetches the current users id
 */
async function fetchUserId():Promise<string>
{
    return (await (await fetch('/api/userId')).json()).userId
}
async function searchbarInput() 
    { 
        console.log('typing into searchbar...')
        //get name from the searchbar
        name = searchbar.innerHTML as string;
        
        const emptyStr = ''
        if (name != emptyStr) 
        {
            //display the queryDiv
            displayDiv(queryDiv)
            hideDiv(messageBox)
            //put name a path vairable (name) in proxyURL
            const proxyUrl = `${varContainer.url}${name}`
            //fetch response string
            var namesHTML:string = (await (await fetch(proxyUrl)).text())

            //set queryDiv to names HTML
            queryDiv.innerHTML = namesHTML
            
            setQueryAllNamesWithClickEvent(queryDiv, varContainer, nameBadgeBox, messageBox)
             
        }
        else 
        {
            displayDiv(messageBox)
            hideDiv(queryDiv)
        } 
        
}
async function createJoinChat()
{
    console.log('create-join-chat clicked')
    

    console.log('btn-join-chat clicked')
    socket.emit('create-join-chat', socketVars.userId, varContainer.selectedFriends, socketVars.chatId)
}

/*** 
 * The idea of this seciton is to create a Filter Dropdown Table 
 * Examples of what is meant by such a table can be found at [w3schools](https://www.w3schools.com/howto/howto_js_filter_dropdown.asp)
 * 
 *
 */



 
</script>


<template>
    <!-- Chat Window -->
    <div class="chat-window">


        <div id="chat-sidebar" class="chat-sidebar">
            <div class="chat">No Chats Avaialable</div>
        </div>
        <!-- Chat grid -->
        <div class="chat-grid">
        <!-- window heading -->
        <div class="chat-header">
            <div class="header"> Chat </div>
            <div class="btn-close"> X </div>
        </div>
        <!-- Searchbar and name badge box -->
        <!-- Note to self:always use span for this kind of searcbar thing - not div - divs have weird sid effects like break tags added to text when you press backspace -->
        <div class="searchbar-btn-join-chat">
            <span id="searchbar" class="searchbar editable" contenteditable="true" data-placeholder="Enter a name" @input="searchbarInput"></span><span id="btn-join-chat" class="btn btn-success btn-join-chat" @click="createJoinChat">Join Chat</span>
        </div>
        
        <div id="name-badge-box" class="name-badge-box" ></div>
        

        <!-- Query Div and Message Box -->
        <div id="queryDiv" class="queryDiv" style="display:none">
        </div>
        <div id="message-box" class="message-box">
            <div class="message-received">Message recieved</div>
            <div class="message-sent">Message sent</div>
        </div>
        <!-- Message text -->
        <span id="message-text" class="message-text editable" contenteditable="true" data-placeholder="Enter a message...">
        </span>
        <!-- Send button -->
        <div>
            <button id="btn-send" class="btn btn-primary form-control">Send</button>
        </div>
        </div>
    </div>
    
</template>

<!-- removed scoped - it stopped css from being applied to elements added via AJAX during onMounted being called  -->
<style>
.chat-window
{
    width: 30%;
    height: 450px;
    z-index: 1;
    right: 20%;
    position: fixed;
    background-color: white;
    display:grid;
    grid-template-columns: [chat-sidebar]2fr [main]8fr;
}
.chat-sidebar
{
    background-color: grey;
    grid-column: 1;
    overflow-y: scroll;
}

.chat
{
    background-color: rgb(86, 166, 227);
    cursor: pointer;
}

.chat-grid 
{
   
    display: grid;
    grid-column: 2;
    grid-template-rows: [chat-header]2fr [searchbar]1fr [name-badge-box]1fr [message]4fr [send-button]2fr;
}
.btn-close
{
    background-color: red;
    cursor: pointer;
}

.chat-header
{
    display: grid;
    grid-template-columns: [header] 9fr 1fr[btn-close];

}

.header
{
    font-size: 30px;
    display: grid;
    justify-content:center;
}

.editable:empty:before
{
    background-color:  rgb(202, 202, 202);
    content: attr(data-placeholder);
    white-space: pre-wrap;
    word-wrap: normal;
}

.searchbar
{
    background-color:  rgb(202, 202, 202);
    border: 1px solid black;
}
.btn-join-chat
{
}

.searchbar-btn-join-chat
{
    display: grid;
    grid-template-columns: [searchbar] 7fr [btn-join-chat] 3fr ;
}
.name-badge-box
{
    z-index: 1;
    background-color: transparent;
}
.queryDiv
{
    background-color: yellow;
    z-index: 1;
}

.message-box 
{
    background-color: rgb(202, 202, 202);
    border-color: black;
    overflow-y: scroll;
}

.message-received
{
    background-color: rgb(86, 166, 227);
    margin-right: 30%;
    border-radius: 2%;
    margin-top:10px;
}

.message-sent
{
    background-color: rgb(86, 166, 227);
    margin-left: 30%;
    border-radius: 2%;
    margin-top:10px;
    
}

</style>



