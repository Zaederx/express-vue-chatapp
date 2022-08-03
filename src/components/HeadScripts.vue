<script lang="ts">
// a place for dependencies to be added to the html head
export default {
    // inheritAttrs: true //true is default
    mounted() {
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
        

        //add popperjs, bootstrapJS and bootstrapCSS to head tag
        document.head.append(popperjs, bootstrapJS, bootstrapCSS)
    }
}

</script>

<script setup lang="ts">
</script>