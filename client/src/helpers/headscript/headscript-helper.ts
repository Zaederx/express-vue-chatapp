
/**
 * Fetch CSRF Token
 */
export async function fetchCSRFToken() 
{
    var proxyUrl = '/api/csrf-token'
try {
    //fetch csrf token from server
    var response:Response = await fetch(proxyUrl,{
                            method: 'GET',
                            credentials: 'include' //whether user agent should send and recieve cookies - see [link](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials) and [link](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
                            })
    //get response in json format
    var data = await response.json()
    console.warn('************* End of script HeadSciprt.vue **************')
    //create meta tag with csrf token
    const csrfToken = document.createElement('meta') as HTMLMetaElement
    csrfToken.name = 'csrf-token'
    csrfToken.content = data.csrfToken
    //append meta tag to header
    document.head.append(csrfToken)
    } 
    catch (error) 
    {
        console.warn('csrf token could not be obtained')
    }
}

/**
 * Set head tags for a vue.
 */
export function setHeadTags()
{
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
    // csrfToken.name = 'csrf-token'
    // csrfToken.content="${csrf-token.token}"

    //add popperjs, bootstrapJS and bootstrapCSS to head tag
    document.head.append( popperjs, bootstrapJS, bootstrapCSS, fa)
}