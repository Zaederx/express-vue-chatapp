<script setup lang="ts" defer>
import { onMounted } from 'vue';

/*** 
 * The idea of this seciton is to create a Filter Dropdown Table 
 * Examples of what is meant by such a table can be found at [w3schools](https://www.w3schools.com/howto/howto_js_filter_dropdown.asp)
 * 
 * **** */
class Friend
{
    name:string
    id:string

    constructor(name:string, id:string)
    {
        this.name = name
        this.id = id
    }
    toString()
    {
        var str =  
        `Friend:{
            name:${this.name},
            id:${this.id}
        }`
        return str
    }
}

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
            displayQueryDiv()
            //put name a path vairable (name) in proxyURL
            const proxyUrl = `${varContainer.url}${name}`
            //fetch response string
            var namesHTML:string = await (await fetch(proxyUrl)).text()
            console.log(namesHTML)

            //set queryDiv to names HTML
            queryDiv.innerHTML = namesHTML
            
            setQueryAllNamesWithClickEvent()
            
        }
        else 
        {
            hideQueryDiv()
        }
        
    })

    /**
     * Sets query names in queryDiv with event to 
     * to add self to nameBadgeBox onclick
     */
    function setQueryAllNamesWithClickEvent()
    {
        console.log(`****** setQueryAllNamesWithClickEvent called *****`)
        //each node is an `<a><div>name</div></a>` tag with a name enclosed
            //want each node to add itself to the nameBadgeBox onclick
            queryDiv.childNodes.forEach((node) => 
            {
                console.log(`nameNode.textContent:${node.textContent}`)
                console.log(`nameNode.nodeName:${node.nodeName}`)
                if (node != undefined && node.nodeName != '#text')
                {
                    var a = node as HTMLLinkElement
                    console.log(`a.innerHTML:${a.innerHTML}`)
                    //get friend id
                    var friendId = a.getAttribute('data-id') as string
                    // get friend's name
                    var friendName = (a.childNodes[0] as HTMLDivElement).innerHTML//contains user's name
                    console.log(`friendId ${friendId} and friendName ${friendName}`)
                    
                    //set the element with a function onclick
                    a.onclick = () => 
                    {
                        //select name and put into badge box
                        setNameInNameBadgeBox(friendId, friendName)

                        //add friends to varContainer.selectedFriends
                        varContainer.selectedFriends.push(new Friend(friendName,friendId))
                        console.log(`added Friend name:${friendName}, id:${friendId}`)
                        
                        //set badge buttons - with remove event
                        makeClickableBadgeButtons()
                        
                        displayNameBadgeBox()
                        hideQueryDiv()

                        
                    }
                }
                
            })
            
    }
    /** //SECTION hide and display functions */
    //hide and display searchbar
    function hideSearchbar()
    {
        searchbar.style.display = 'none'
    }
    function displaySeachbar()
    {
        searchbar.style.display = 'block'
    }
    // hide and display queryDiv
    function hideQueryDiv()
    {
        queryDiv.style.display = "none"
    }
    function displayQueryDiv()
    {
        queryDiv.style.display = "block"
    }

    //hide and display Name Badge Box
    function hideNameBadgeBox()
    {
        nameBadgeBox.style.display = "none"
    }
    function displayNameBadgeBox()
    {
        nameBadgeBox.style.display = "block"
    }

    //hide and display message Box
    function hideMessageBox()
    {
        messageBox.style.display = "none"
    }
    function displayMessageBox()
    {
        messageBox.style.display = "block"
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
     * Turns name into badge which is then put into 
     * the nameBadgeBox
     * @param friendName name to put into the badge box
     */
    function setNameInNameBadgeBox(friendId:string, friendName:string)
    {
        clearSearchbar()
        //set this name in the searchbar

        nameBadgeBox.innerHTML += `<span data-id="${friendId}" class='friend-name'>${friendName}<span class="btn-close">X</span></span>`

    }
    /**
     * Make badge buttons respond to click.
     * Responds by removing themselves from 
     * varContainer.selectedFriends.
     * It then refills the badge div with names left in
     * varContainer.selectedFriends
     */
    function makeClickableBadgeButtons()
    {
        console.log(' **** makeClickableBadgeButtons ****')

        //set onclick events on the span of <span data-id="friendId" class='friend-name'>${friend_name}<span>X</span></span>
        nameBadgeBox.childNodes.forEach((node) => {
            if(node != undefined && node.nodeName != '#text')
            {

                var span1 = (node as HTMLDivElement)
                console.log(`span1.textContent:${span1.textContent}`)
                var friendId = span1.getAttribute('data-id')
                console.log(`friendId: ${friendId}`)
                var span2 = ((node as HTMLDivElement).childNodes[0] as HTMLSpanElement)
                span1.addEventListener('click' ,() => {
                    console.log('close-btn-div click')
                    removeSelectedFriend({id:friendId as string})
                })
                span2.addEventListener('click' ,() => {
                    console.log('close-btn-div click')
                    removeSelectedFriend({id:friendId as string})

                })
            }
        })

        console.log(' **** End of makeClickableBadgeButtons ****')
        
    }


    /**
     * Removes Friend of given id from varContainer.selectedFriends
     * @param id 
     */
    function removeFriendFromVarsContainer(id:string, name?:string)
    {
        if(id)
        {
            //find index of friend in array / list - using obj.id
            var i = varContainer.selectedFriends.findIndex((f:Friend) => f.id == id)
            console.log(`index of friend with id '${id}':${i}`)
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
    function removeSelectedFriend(obj:{id?:string, name?:string}) 
    {   
        console.log('******* removeSelectedFriend called *******')
        console.log(`varContainer.selectedFriends:${varContainer.selectedFriends.toLocaleString()}`)
        removeFriendFromVarsContainer(obj.id as string, obj.name)
        clearSearchbar()
        console.log(`varContainer.selectedFriends:${varContainer.selectedFriends}`)
        fillNameBadgeBoxFromVarsContainer()

    }

    /**
     * Fills name badge box with name badges from names found
     * in varContainer.selectedFriends.
     * Also makes them clickable
     */
    function fillNameBadgeBoxFromVarsContainer()
    {
        //empty name badge box
        nameBadgeBox.innerHTML = ''
        //fill name badge box
        varContainer.selectedFriends.forEach((f:Friend) => {
            setNameInNameBadgeBox(f.id,f.name)
            makeClickableBadgeButtons()
        })
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



