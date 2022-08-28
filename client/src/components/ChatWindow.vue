<script setup lang="ts" defer>
import { displayDiv, hideDiv, setNameInNameBadgeBox, setQueryAllNamesWithClickEvent } from '@/helpers/chat-window/chat-window-helper.js';
import { onMounted } from 'vue';
import type {Friend} from '../classes/friend.js'
/*** 
 * The idea of this seciton is to create a Filter Dropdown Table 
 * Examples of what is meant by such a table can be found at [w3schools](https://www.w3schools.com/howto/howto_js_filter_dropdown.asp)
 * 
 * **** */


var friendArr:Friend[] = []
var varContainer = 
{
    selectedFriends: friendArr,
    url : '/api/get-users/with-name/'
}

//fetch name from user in db
 onMounted(async() => {
    var name = '';
    const searchbar = (document.querySelector('#searchbar') as HTMLDivElement)
    const queryDiv = document.querySelector('#queryDiv') as HTMLDivElement
    const nameBadgeBox = document.querySelector('#name-badge-box') as HTMLDivElement
    const messageBox = document.querySelector('#message-box') as HTMLDivElement

    searchbar.addEventListener('input', async() => 
    { 
        //get name from the searchbar
        name = searchbar.innerHTML as string;
        
        const emptyStr = ''
        if (name != emptyStr) 
        {
            //display the queryDiv
            displayDiv(queryDiv)
            //put name a path vairable (name) in proxyURL
            const proxyUrl = `${varContainer.url}${name}`
            //fetch response string
            var namesHTML:string = await (await fetch(proxyUrl)).text()
            console.log(namesHTML)

            //set queryDiv to names HTML
            queryDiv.innerHTML = namesHTML
            
            setQueryAllNamesWithClickEvent(queryDiv, varContainer, nameBadgeBox)
             
        }
        else 
        {
            hideDiv(queryDiv)
        }
        
    })
    

    
 })   
</script>

<template>
    <!-- Chat Window -->
    <div class="chat-grid">
        <!-- window heading -->
        <div class="chat-header">
            <div class="header"> Chat </div>
            <div class="btn-close"> X </div>
        </div>
        <!-- Searchbar and name badge box -->
        <!-- Note to self:always use span for this kind of searcbar thing - not div - divs have weird sid effects like break tags added to text when you press backspace -->
        <span id="searchbar" class="searchbar editable" contenteditable="true" data-placeholder="Enter a name"></span>
        <div id="name-badge-box" class="name-badge-box" ></div>
        

        <!-- Query Div and Message Box -->
        <div id="queryDiv" class="queryDiv" style="display:none">
        </div>
        <div id="message-box" class="message-box">
                <div class="message-recieved">Message recieved</div>
            
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
</template>

<style scoped>

.chat-grid 
{
    width: 30%;
    height: 450px;
    background-color: white;
    z-index: 1;
    right: 20%;
    position: fixed;
    display: grid;
    grid-template-rows: [chat-header] 2fr [searchbar]1fr [name-badge-box] 1fr [message] 4fr [send-button] 2fr;
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

.message-recieved
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



