<script setup lang="ts">


    //fetch name from user in db
    const proxyUrl = "/api/username/"
    var response:Response = await fetch(proxyUrl)
    //set sub heading to name
    var responseStr = JSON.stringify(response.body)
    var res = JSON.parse(responseStr)
    var username = res.user
    //set subheading to username
    var subHeading = document.querySelector('#to') as HTMLDivElement
    subHeading.innerHTML = username
    subHeading.oninput = () => {

    }
</script>
<template>
    <!-- Chat Window -->
    <div class="chat-grid">
        <!-- window heading -->
        <div class="chat-header">
            <div class="header"> Chat </div>
            <div class="btn-close"> X </div>
        </div>
        <!-- sub heading -->
        <div id="to" contenteditable="true"></div>
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

.message-box {
    background-color: rgb(202, 202, 202);
}
</style>