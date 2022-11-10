import React, { useState } from 'react'
import useFetch from '../handleFetch'
import SinglePost from './SinglePost'
import { useNavigate } from 'react-router-dom'

function Posts() {
    //const { data, FetchGet } = useFetch()
    const [status, setStatus] = useState("not ready")
    const [data, setData] = useState(null)
    const navigate = useNavigate()
    //console.log(data, s)
    //FetchGet('http://localhost:5000/posts')
    //const [data, setData] = useState()

    //const r = FetchGet('http://localhost:5000/posts')

    React.useEffect(() => {

        fetch('http://localhost:5000/posts', {
            method: "GET",
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => { 
                if(data.success){
                    setData(data)
                    setStatus("ready")
                }else{
                    setData(null)
                    setStatus("null")
                }
        })
        .catch(err => {
            console.log(err)
            setData(null)
            setStatus("failed")
        })

        if (data) console.log(data)

    }, []);

    const handleClick = (title) => {
        console.log(title);
        navigate(`/post/${title}`)
    }
    return (
        <>
            <div className="container blog-container mt-5 p-3">
                {(status === "ready" && data) ?
                    <h4 className="title is-4 has-text-centered">All Posts</h4>
                    : (status === "not ready") ? 
                    <p id="loader" className="has-text-centered"> <i className="fad fa-spinner-third fa-spin fa-5x has-text-app-primary"></i></p>
                    : (status === "failed") ?
                    <div className="has-text-centered p-4">
                        <p><i className="fad fa-times-circle fa-5x has-text-danger"></i></p>
                        <h4 className="title is-4 mt-4">Couldn't fetch Posts</h4>
                        <button onClick={ () => {window.location.reload()} } className="button is-app-primary is-act">Try again</button>
                    </div>
                    :
                    <div className="has-text-centered p-4">
                        <p><i className="fad fa-exclamation-triangle fa-5x has-text-danger"></i></p>
                        <h4 className="title is-4 mt-4">NO Posts Yet</h4>
                        <a href='/new-post' className="button is-app-primary is-act">Create a new post</a>
                    </div>
                }
                {(status === "ready" && data) &&
                
                    data.posts.map((val, ind) => {
                        const coverImage = `http://localhost:5000/public/cover_images/${val.cover}`;
                        const style = {
                            "backgroundImage": `url('http://localhost:5000/public/cover_images/${val.cover}')`
                        }
                        return (
                            <section key={ind} className="single-post bg-color">
                                <div className="single-post-first">
                                    <img src={coverImage} />
                                </div>
                                <div className="single-post-last has-text-centered">
                                    <div className="single-post-content">
                                        <h2 className="title is-4 has-text-app-primary">{val.title}</h2>
                                        <h5 className="subtitle has-text-centered">{val.subtitle}</h5>
                                        <article dangerouslySetInnerHTML={{ __html: val.content.substr(0, 200)+"..." }}></article>
                                    </div>
                                    <button className="button is-app-primary btn-act has-fa-icon" onClick={() => { handleClick(val.title) }}>Read post&nbsp;<i className="fad fa-arrow-right fa-sm"></i></button>
                                </div>
                            </section>
                        )

                    })
                }

            </div>
        </>
    )
}

export default Posts