import React, {useState} from 'react'
import {useToken} from '../useToken'

function Home() {

    const {token} = useToken()
    const [status, setStatus] = useState(false)

    React.useEffect( () => {
        console.log(token, "from effect home")
        if(token){  
            setStatus(true);
            document.querySelector('#homeBtn').innerHTML = `<a href="/new-post" class="btn-act button is-app-primary is-medium">Create post</a>`;
        }else{
            setStatus(false);
            document.querySelector('#homeBtn').innerHTML = `<a href="/login" class="btn-act button is-app-primary is-medium">Get started</a>`;
        }
    }, [token])

    return (
        <section className="hero is-primary is-medium">
            <div className="hero-body">
                <div className="container has-text-centered" style={{top: '30%'}}>
                    <h1 className="title is-1 font-poppins">Welcome to sanBlog</h1>
                    <p className="subtitle">The Home of quality content</p>
                    <div id="homeBtn">
                    {(!status) ?
                        <a href="/login" className="btn-act button is-app-primary is-medium">Get started</a>
                    : <a href="/new-post" className="btn-act button is-app-primary is-medium">Create post</a>}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home