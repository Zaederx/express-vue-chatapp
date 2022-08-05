
<script setup lang="ts">

// import { ref, computed } from 'vue'
// import Home from '../pages/Home.vue'
// import Login from '../pages/Login.vue'
// import About from '../pages/About.vue'
// import ChatApp from '../pages/user/ChatApp.vue'

// const routes:any = {
//     '/': Home,
//     '/home':Home,
//     '/login': Login,
//     '/about': About,
//     '/chat-app': ChatApp,
// }

// const currentPath = ref(window.location.hash)//#hash just takes the hash vaule as the end of the path
// console.log(`currentPath: ${currentPath}`)
// console.log(`currentPath.value:${currentPath.value}`)
// window.addEventListener('hashchange', ()=> {
//     currentPath.value = window.location.hash
// })

// const currentView = computed(()=> {
//     return routes[currentPath.value.slice(1) || '/' || 'NotFound']
// })
// //props - short for properties of html elements
// //these are properties that we set out the elements we create
const props = defineProps({
    heading1:String,
    heading2:String
})
</script>


<template>
    <div id="nav">
    <nav class="navbar navbar-expand-lg bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">{{heading1}}</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarScroll">
      <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <!-- <a class="nav-link" href=""> -->
            <a class="nav-link" href="#/">Link</a>
          <!-- </a> -->
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Links
          </a>
          <ul class="dropdown-menu">
            <li><a to="/sign-up" class="dropdown-item" href="#/sign-up">Sign Up</a></li>
            <li><a  class="dropdown-item" href="#/login">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled">Link</a>
        </li>
      </ul>
      <!-- <h1 class="heading2">{{heading2}}</h1> -->
      <!-- <component :is="currentView"/> -->
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
  </div>
</template>

<style scoped>
.heading2 
{
  display: inline;
  justify-content: left;
}

.nav-link
{
  cursor: pointer;
}
</style>