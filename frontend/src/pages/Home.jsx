import React, { useState } from 'react'
import { useToken } from '../useToken'

function Home() {
    const { token } = useToken('')
    const [homeBtn, setHomeBtn] = useState(false)
    const [status, setStatus] = useState("not ready")
    const [data, setData] = useState(null)

    React.useEffect(() => {
        if (token) {
            setHomeBtn(true);
            document.querySelector('#homeBtn').innerHTML = `<a href="/new-post" class="btn-act button is-app-primary is-medium">Create post</a>`;
        } else {
            setHomeBtn(false);
            document.querySelector('#homeBtn').innerHTML = `<a href="/login" class="btn-act button is-app-primary is-medium">Get started</a>`;
        }
    }, [token])

    React.useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + '/posts', {
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
                    setStatus("ready")
                } else {
                    setData(null)
                    setStatus("null")
                }
            })
            .catch(err => {
                console.log(err)
                setData(null)
                setStatus("failed")
            })
    }, [token])


    return (
        <>
            <section className="hero is-medium">
                <div className="hero-body">
                    <div className="container has-text-centered" style={{ top: '30%' }}>
                        <h1 className="title is-1 has-text-light">Welcome to sanBlog</h1>
                        <p className="subtitle has-text-light font-pacifico">The Home of quality content</p>
                        <div id="homeBtn">
                            {(!homeBtn) ?
                                <a href="/login" className="btn-act button is-app-primary is-medium">Get started</a>
                                : <a href="/new-post" className="btn-act button is-app-primary is-medium">Create post</a>}
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-desc bg-color">

            </section>
            {(status === "ready" && data) ?
                <section className="container p-4 home-posts-container">
                    <h4 className="title is-4 center-on-mobile">Recent Posts</h4>
                    <div className="home-posts-columns columns" style={{ flexWrap: "wrap" }}>
                        {
                            data &&

                            data.posts.map((post, ind) => {
                                const coverImage = (post.cover) ? JSON.parse(post.cover)?.secure_url : 'https://res.cloudinary.com/dxsxxso3a/image/upload/v1668527703/cld-sample-3.jpg';
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
                                                    <a href={'/post/' + post.title.replaceAll(' ', '-')} className="button is-app-primary-outline">Read post</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </section>

                : (status === "not ready") ?
                    <p id="loader" className="has-text-centered mt-5 should-be-centered"> <i className="fas fa-spinner fa-spin fa-5x has-text-app-primary"></i></p>
                    : (status === "failed") ?
                        <div className="has-text-centered p-4 mt-5 should-be-centered">
                            <p><i className="fas fa-times-circle fa-5x has-text-app-primary"></i></p>
                            <h4 className="title is-4 mt-4">Couldn't fetch Posts</h4>
                            <button onClick={() => { window.location.reload() }} className="button is-app-primary is-act">Try again</button>
                        </div>
                        :
                        null
            }
        </>

    )
}

export default Home