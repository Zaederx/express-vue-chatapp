<script setup lang="ts">

import { loginViaSessionCookie } from '@/helpers/login-form/login-helper';
import { onMounted } from 'vue'
import { setHeadTags } from '../helpers/headscript/headscript-helper.js'
    
onMounted( async ()=> {
    console.warn('************* HeadScript.vue script **************')
    // set the rest of the head tags with dependencies
    setHeadTags()
})

</script>




<template>
</template>

