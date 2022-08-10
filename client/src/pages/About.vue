<!-- JS & VUE -->
<script setup lang="ts">
import AboutSection from "../components/AboutSection.vue";

</script>

<!-- HTML -->
<template>
   <HeadScripts></HeadScripts>
   <Router></Router>
   <Banner heading1="Chat" heading2="About"></Banner>
   <HomeMain>
    <AboutSection></AboutSection>
   </HomeMain>
   <SiteFooter></SiteFooter>
</template>

<!-- CSS -->
<style scoped>

</style>