<script setup lang="ts">
import $ from 'jquery'
//request the csrf token
$.ajax({
            url: 'http://localhost:3000/csrf-token',
            success: (res)=> {
                var data = JSON.parse(res)
                var csrfToken = data.csrfToken 
                const metaCSRF = document.createElement('meta') as HTMLMetaElement
                metaCSRF.name = 'csrf-token'
                metaCSRF.content = csrfToken
                document.head.append(metaCSRF)
            }
        })
</script>
<script lang="ts">
// a place for dependencies to be added to the html head
var url = 'http://localhost:3000'
var xhttp;
  xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange = fetchCSRFToken;

  function fetchCSRFToken(this:XMLHttpRequest, ev:Event) {
    if (this.readyState == 4 && this.status == 200) {
        //parse response from JSON to JS Object
        var data = JSON.parse(this.response)
        //get the csrf token
        var csrfToken = data.csrfToken 
        //create a meta tag and add the token
        const metaCSRF = document.createElement('meta') as HTMLMetaElement
        metaCSRF.name = 'csrf-token'
        metaCSRF.content = csrfToken
        //append to the html document head
        document.head.append(metaCSRF)
    }
 };
  xhttp.open("GET", url, true);
  xhttp.send();
export default {
    // inheritAttrs: true //true is default
    mounted() {

        //ajax request for CSRF Token - to put in head as meta tag content
        var url = 'http://localhost:3000'
        var xhttp;
        xhttp=new XMLHttpRequest();
        xhttp.onreadystatechange = fetchCSRFToken;

        function fetchCSRFToken(this:XMLHttpRequest, ev:Event) {
            console.log('fetching CSRF Token')
            if (this.readyState == 4 && this.status == 200) {
                //parse response from JSON to JS Object
                var data = JSON.parse(this.response)
                //get the csrf token
                var csrfToken = data.csrfToken 
                //create a meta tag and add the token
                const metaCSRF = document.createElement('meta') as HTMLMetaElement
                metaCSRF.name = 'csrf-token'
                metaCSRF.content = csrfToken
                //append to the html document head
                document.head.append(metaCSRF)
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
        
        //view router
        const viewRouter = document.createElement('script') as HTMLScriptElement
        viewRouter.type = 'text/javascript'
        viewRouter.src = 'https://unpkg.com/vue-router@4'

        //create popperjs script element
        const popperjs = document.createElement('script') as HTMLScriptElement;
        popperjs.type = 'text/javascript';
        popperjs.src = 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js'
        popperjs.integrity = 'sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk'
        popperjs.crossOrigin = 'anonymous'

        //create bootstrap script element
        const bootstrapJS = document.createElement('script') as HTMLScriptElement
        bootstrapJS.type = 'text/javascript'
        bootstrapJS.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js'
        bootstrapJS.integrity = 'sha384-ODmDIVzN+pFdexxHEHFBQH3/9/vQ9uori45z4JjnFsRydbmQbmL5t1tQ0culUzyK'
        bootstrapJS.crossOrigin = 'anonymous'

        //create bootstrap css link element
        const bootstrapCSS = document.createElement('link') as HTMLLinkElement
        bootstrapCSS.type = 'text/css'
        bootstrapCSS.rel = 'stylesheet'
        bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css'
        bootstrapCSS.integrity = 'sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx'
        bootstrapCSS.crossOrigin = 'anonymous'
        
        //font awesome icons
        const fa = document.createElement('link') as HTMLLinkElement
        fa.type = 'text/css'
        fa.rel = 'stylesheet'
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'

        // // <meta th:name="_csrf" th:content="${_csrf.token}"/>
        // const csrfToken = document.createElement('meta') as HTMLMetaElement
        // csrfToken.name = '_csrf'
        // csrfToken.content="${_csrf.token}"

        //add popperjs, bootstrapJS and bootstrapCSS to head tag
        document.head.append( popperjs, bootstrapJS, bootstrapCSS, fa)
    }

    
}

</script>

<script setup lang="ts">
</script>

<template>
</template>