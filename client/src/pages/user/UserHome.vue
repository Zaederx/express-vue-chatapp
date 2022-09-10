<template>
    <!-- Causes doubling of head script tags, 
    because of redirect from login. Commenting out HeadScripts prevents this and 
    allows it to work properly 
    (i.e. banner bootstrap now works as intended)-->
    <UserBanner heading1="Chat" heading2="UserHome"></UserBanner>
    <HomeMain></HomeMain>
    <SiteFooter></SiteFooter>
</template>

<style scoped>
</style>