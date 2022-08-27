<script setup lang="ts" defer>
import { onMounted } from 'vue';

/*** 
 * The idea of this seciton is to create a Filter Dropdown Table 
 * Examples of what is meant by such a table can be found at [w3schools](https://www.w3schools.com/howto/howto_js_filter_dropdown.asp)
 * 
 * **** */

const varContainer = 
{
    friend_name : '',
    friend_id : '',
    chatId: '',
    url : '/api/get-users/with-name/'
}
//fetch name from user in db
 onMounted(async() => {
    var name = '';
    var searchbar = (document.querySelector('#searchbar') as HTMLDivElement)
    searchbar.addEventListener('input', async() => { 
        name = document.querySelector('#searchbar')?.innerHTML as string;
        const emptyStr = ''
        if (name != emptyStr) 
        {
            //put name a path vairable in proxyURL
            const proxyUrl = `${varContainer.url}${name}`
            //fetch response string
            var namesHTML:string = await (await fetch(proxyUrl)).text()
            console.log(namesHTML)

            //set queryDiv to names HTML
            var queryDiv = document.querySelector('#queryDiv') as HTMLDivElement
            queryDiv.innerHTML = namesHTML
            
            //each node is an `<a><div>name</div></a>` tag with a name enclosed
            queryDiv.childNodes.forEach((nameNode) => {
                console.log(`nameNode.textContent:${nameNode.textContent}`)
                console.log(`nameNode.nodeName:${nameNode.nodeName}`)
                if (nameNode != undefined && nameNode.nodeName != '#text')
                {
                    var a = nameNode as HTMLLinkElement
                    console.log(`a.innerHTML:${a.innerHTML}`)
                    //get user id
                    var userId = a.getAttribute('data-id') as string
                    // get user's name
                    var friend_name = (a.childNodes[0] as HTMLDivElement).innerHTML//contains user's name
                    //set the element with a function onclick - function takes data-ids

                }
                
            })
        }
        
    })
    
    

    /**
     * Function to put user's name into the searchbar when it is selected.
     * Function to put the user's id into a variable to be used for
     * websocket messaging.
     * @param friend_id user's id
     * @param friend_name user's name (not username)
     */
    function selectName(friend_id:string, friend_name:string)
    {
        //set this name in the searchbar
        var searchbar = (document.querySelector('#searchbar') as HTMLDivElement)
        searchbar.innerHTML = friend_name

        //set variable in varContainer for later user in messaging
        varContainer.friend_id = friend_id
        varContainer.friend_name = friend_name
    }

   

    function returnListofNamesHTML()
    {

    }
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
        <!-- contact box -->
        <!-- Note to self:always use span for this kind of searcbar thing - not div - divs have weird sid effects like break tags added to text when you press backspace -->
        <span id="searchbar" class="searchbar" contenteditable="true" data-placeholder="Enter a name"></span>
        <div id="queryDiv">
            
        </div>
        <!-- Message box -->
        <div id="messages" class="message-box">
            Type message...
        </div>
        <!-- Send button -->
        <div>
            <button id="btn-send" class="btn btn-primary form-control">Send</button>
        </div>
    </div>
</template>

<style scoped>

.btn-close 
{
    background-color: red
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

.searchbar 
{
    background-color:  rgb(202, 202, 202);
    height: 30px;
    content: attr(data-placeholder);
    color: #6d6d6d;
    white-space: pre-wrap;
    word-wrap: normal;
}

.chat-grid 
{
    width: 30%;
    height: 450px;
    background-color: white;
    z-index: 1;
    right: 20%;
    position: fixed;
    display: grid;
    grid-template-rows: [chat-header] 2fr [sub-header] 2fr [message] 5fr [send-button] 1fr;
}

.chat-header 
{

}

.contact-box 
{
    background-color: rgb(202, 202, 202);
    border-color: black;
}

.message-box 
{
    background-color: rgb(202, 202, 202);
    border-color: black;
}
</style>



