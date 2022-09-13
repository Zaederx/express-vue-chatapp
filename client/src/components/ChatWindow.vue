<script setup lang="ts" defer>
import { displayDiv, hideDiv, setNameInNameBadgeBox, setQueryAllNamesWithClickEvent, chatMessagesToHTML, fetchMessages, loadChats, fetchUserId} from '@/helpers/chat-window/chat-window-helper.js';
import { onMounted, onUpdated } from 'vue';
import type {Friend} from '../classes/Friend.js'
//@ts-ignore
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import $ from 'jquery'
import type { Chat } from '@/classes/Chat';
import type { Message } from '@/helpers/Message';

console.log('**** ChatWindow Setup Script called ****');
    //SEARCHBAR 
    //declare variables
    var name:string
    var searchbar:HTMLSpanElement
    var queryDiv: HTMLDivElement
    var nameBadgeBox: HTMLDivElement
    var messageBox:HTMLDivElement
    var chatsSidebar:HTMLDivElement
    var messageText:HTMLSpanElement
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
    searchbar = (document.querySelector('#searchbar') as HTMLSpanElement)
    queryDiv = document.querySelector('#queryDiv') as HTMLDivElement
    nameBadgeBox = document.querySelector('#name-badge-box') as HTMLDivElement
    messageBox = document.querySelector('#message-box') as HTMLDivElement
    chatsSidebar = document.querySelector('#chat-sidebar') as HTMLDivElement
    messageText = document.querySelector('#message-text') as HTMLSpanElement
    

    //open socket connection
    socket = await io({
                //proxy address
                path:'/socket.io',
                withCredentials: true,
                extraHeaders: 
                {
                    'CSRF-Token': token.csrfToken
                },
                transports: ['websocket'],
                autoConnect: true //default
            });


            socket.on('refresh-chats', async () => {
                console.log('socket.on - refresh chats called')
                await loadChats(socketVars, chatsSidebar, messageBox, socket)
                //clear messages from message Box
                // messageBox.innerHTML = ''
            })

            socket.on('message', (m:Message) => 
            {
                console.log('socket.on - message called')
                messageBox.innerHTML += chatMessagesToHTML([m],socketVars.userId)
            })

    
    //fetch user id
    const userId = await fetchUserId()
    //set userId value in socketVars
    socketVars.userId = userId
    console.log(`userId:${userId}`)
    //fetch chats
    await loadChats(socketVars, chatsSidebar, messageBox, socket)

    
  
})

  


 /**
  * Remove a chat from your list of chats. 
  */
async function leaveChat()
{
    console.log('button leave chat clicked')
    var {userId, chatId} = socketVars
    socket.emit('leave-chat', userId, chatId)
}

/**
 * Sends a message via websocket requesting a chat to be created
*/
async function createJoinChat()
{
    console.log('create-join-chat clicked')
    

    console.log('btn-join-chat clicked')
    socket.emit('create-join-chat', socketVars.userId, varContainer.selectedFriends, socketVars.chatId)

    await loadChats(socketVars, chatsSidebar, messageBox, socket)
}

    /**
 * Takes searchbar input and fetches user names
 * that are similar. These can be clicked in order to
 * add them to chats
 */
async function searchbarInput()
    { 
        console.log('typing into searchbar...')
        //get name from the searchbar
        var name = searchbar.innerHTML as string;
        
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
        /**
 * Sends a message to the server through web socket.
 * Also reloads messages can clears message text input span.
 */
async function sendMessage()
{
    console.log('*** function sendMessage was called ***')
    //get message text input
    var message = messageText.innerHTML
    //get userId and chatId
    var {userId, chatId} = socketVars
    //send the message to the server via websocket
    socket.emit('chat', userId, chatId, message)
    //clear text from input span
    messageText.innerHTML = ''
}
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
            
            <!-- Searchbar and name badge box -->
            <!-- Note to self:always use span for this kind of searcbar thing - not div - divs have weird sid effects like break tags added to text when you press backspace -->

            <span id="searchbar" class="searchbar editable" contenteditable="true" data-placeholder="Enter a name" @input="searchbarInput"></span>

            
            <div id="name-badge-box" class="name-badge-box" style="display:none"></div>
            

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
        
            <span id="btn-send" class="btn-send" @click="sendMessage">Send</span>
            
        </div>
        <div class="btn-column">
            <span id="btn-join-chat" class="btn-join-chat" @click="createJoinChat">Join Chat</span>
            <span id="btn-leave-chat" class="btn-leave-chat" @click="leaveChat">Leave Chat</span>
        </div>
        
    </div>
    
</template>

<!-- removed scoped - it stopped css from being applied to elements added via AJAX during onMounted being called  -->
<style>
.chat-window
{
    width: 622px;
    height: 560px;
    border-radius:5%;
    z-index: 1;
    right: 20%;
    position: fixed;
    background-color: rgb(235,235,235);
    display:grid;
    /* 6 columns */
    grid-template-columns: [gap1]22px [chat-sidebar]139px [gap2]20px [main]311px [gap3]12px [button-col]109px;
}
.chat-sidebar
{
    width:139px;
    height:503px;
    border-radius:25px;
    margin-top:26px;
    background-color: rgb(186, 203, 207);
    grid-column: 2;
    overflow-y: auto;
}

.chat
{
    height:40px;
    width: 100px;
    border-radius: 10px;
    padding-top: 8px;
    margin-top: 23px;
    margin-left: auto;
    margin-right:auto;
    background-color: white;
    cursor: pointer;
    text-align: center;
}

.chat-grid 
{
    margin-top: 46px;
    grid-column: 4;
}


.btn-close
{
    background-color: red;
    cursor: pointer;
}


.header
{
    font-size: 30px;
    display: grid;
    justify-content:center;
}

.editable:empty:before
{
    content: attr(data-placeholder);
    white-space: pre-wrap;
    word-wrap: normal;
    text-align: center;
}

.searchbar
{
    border-radius: 25px;
    background-color: white;
    color:rgb(172,172,172);
    height: 79px;
    width: 306px;
    text-align: center;
    padding-top: 25px;
    cursor: pointer;
    margin-bottom:0;
    display:block;
}

.searchbar-btn-join-chat
{
    display: grid;
}

.name-badge-box
{
    z-index: 1;
    background-color: transparent;
}

.queryDiv
{
    background-color: rgb(207, 207, 188);
    color:white;
    border-radius: 10px;
    z-index: 1;
}

.message-box 
{
    margin-top: 15px;
    border-radius: 25px;
    background-color: white;
    color:rgb(172,172,172);
    border-color: black;
    height:280px;
    overflow-y: auto;
    text-align:center;
}

.message-received
{
    background-color: rgb(86, 166, 227);
    color: white;
    margin-right: 30%;
    border-radius: 2%;
    margin-top:10px;
}

.message-sent
{
    background-color: rgb(86, 166, 227);
    color:white;
    margin-left: 30%;
    border-radius: 2%;
    margin-top:10px;
    
}

.message-text
{
    background-color: white;
    color:rgb(172,172,172);
    border-radius: 10px;
    margin-top:14px;
    padding-top: 8px;
    width: 306px;
    height: 38px;
    text-align: center;
    display:block;
}

.btn-send
{
    background-color: rgb(186, 203, 207);
    color: white;
    border-radius: 10px;
    padding-top: 10px;
    margin-top:12px;
    width: 306px;
    height: 44px;
    text-align: center;
    display:block;
    cursor: pointer;
}

.btn-send:hover
{
    background-color:rgb(129, 165, 173);
}

.btn-column
{
    grid-column: 6;
}
.btn-join-chat
{
    background-color: rgb(186, 203, 207);
    color:white;
    border-radius: 10px;
    margin-top: 57px;
    padding: 15px;
    height: 60px;
    width: 109px;
    display:block;
    text-align:center;
    cursor: pointer;
}

.btn-join-chat:hover
{
    background-color:rgb(129, 165, 173);
}
.btn-leave-chat
{
    background-color: rgb(207, 186, 188);
    color:white;
    border-radius: 10px;
    margin-top: 38px;
    padding: 13.8px;
    height: 60px;
    width: 109px;
    display:block;
    text-align:center;
    cursor: pointer;
}
.btn-leave-chat:hover
{
    background-color:rgb(171, 129, 134);
}
</style>



