<script setup lang="ts">

</script>

<template>
    <div class="intro-container">
        <p class="intro">Chat with your friends online with ChatApp!</p>
        <hr>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

@keyframes fadeInAnimation 
{
	0% {
        /* background: black; */
		opacity: 0;
	}
    /* 50% {
        background: rgb(27, 27, 27);
	} */
	100% {
        /* background: rgb(69, 69, 69); */
		opacity: 1;
	}
}

.intro-container
{
    border-radius: 10px;
    width:80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
    background-color: rgba(186, 203, 207, 0.778);
    height: 30%;
    font-family: 'Montserrat', sans-serif;

    animation: fadeInAnimation ease 6s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
}
.intro
{
    color: white;
    font-size: 5rem;
    text-align: center;
}
</style>