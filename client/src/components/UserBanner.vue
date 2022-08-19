
<script setup lang="ts">
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
            <router-link to="/user-home" class="nav-link active" aria-current="page" href="#">Home</router-link>
            </li>
            <li class="nav-item">
            <router-link to="/logout" class="nav-link">Logout</router-link>
            </li>
            <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Links
            </a>
            <ul class="dropdown-menu">
                <li><router-link to="/user-chat" class="dropdown-item">Chat</router-link></li>
                <li><router-link to="/logout" class="dropdown-item" href="#">Logout</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
            </li>
            <li class="nav-item">
            <a class="nav-link disabled">Link</a>
            </li>
        </ul>
        <h1 class="heading2">{{heading2}}</h1>
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
@import url("../assets/banner.css")
</style>