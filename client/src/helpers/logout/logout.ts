
/**
 * Ends the user session and directs user to the login page
 * @param router Vue Router
 */
export async function logout(router:any)
{
    //clear session cookie - request to server
    var proxyUrl = '/api/logout'
    var response = await (await fetch(proxyUrl)).json()
    if (response.res == true) 
    {
        //clear csrf cookie
        document.cookie = ''
        //change view back to login
        router.push('/login?logout=true');
    }
    
}