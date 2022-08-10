<template>
    <div id="main" class="main">    
        <slot></slot>
    </div>
</template>

<style scoped>
.main {
    height: 1000px;
    background-image: url(/img/pexels-pixabay-163064.jpg);
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: 100% 100%;
    display:grid;
    justify-content: center;
} 
</style>