import React, { useState } from 'react'
import { useToken } from '../useToken'

function Home() {
    const { token } = useToken('')
    const [status, setStatus] = useState(false)
    const [data, setData] = useState(null)

    React.useEffect(() => {
        if (token) {
            setStatus(true);
            document.querySelector('#homeBtn').innerHTML = `<a href="/new-post" class="btn-act button is-app-primary is-medium">Create post</a>`;
        } else {
            setStatus(false);
            document.querySelector('#homeBtn').innerHTML = `<a href="/login" class="btn-act button is-app-primary is-medium">Get started</a>`;
        }
    }, [token])

    React.useEffect( () => {
        fetch('http://localhost:5000/posts', {
            method: "GET",
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setData(data)
            } else {
                setData(null)
            }
        })
        .catch(err => {
            console.log(err)
            setData(null)
        })
    }, [token])


    return (
        <>
            <section className="hero is-medium">
                <div className="hero-body">
                    <div className="container has-text-centered" style={{ top: '30%' }}>
                        <h1 className="title is-1 font-poppins has-text-light">Welcome to sanBlog</h1>
                        <p className="subtitle has-text-light">The Home of quality content</p>
                        <div id="homeBtn">
                            {(!status) ?
                                <a href="/login" className="btn-act button is-app-primary is-medium">Get started</a>
                                : <a href="/new-post" className="btn-act button is-app-primary is-medium">Create post</a>}
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-desc bg-color">

            </section>
            <section className="container p-4 home-posts-container">
                <h4 className="title is-4 center-on-mobile">Recent Posts</h4>
                <div className="home-posts-columns columns" style={{ flexWrap: "wrap" }}>
                    {
                        data &&

                        data.posts.map((post, ind) => {
                            const coverImage = `http://localhost:5000/public/cover_images/${post.cover}`;
                            return (
                                <div key={ind} className="column is-4">
                                    <div className="card home-posts-card m-auto">
                                        <div className="card-img">
                                            <img className="img" src={coverImage} />
                                        </div>
                                        <div className="card-content p-3">
                                            <h4 className="title is-5">{post.title}</h4>
                                            <article dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + '...' }}>
                                            </article>
                                        </div><div className="footer-section p-2" >
                                                <div className="comment-area">
                                                <span>{post.comments.length} {(post.comments.length === 1) ? 'comment' : 'comments'}</span>
                                                </div>
                                                <div className="button-area">
                                                <a href={'/post/'+post.title.replaceAll(' ','-')} className="button is-app-primary-outline">Read post</a>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
        </>

    )
}

export default Home