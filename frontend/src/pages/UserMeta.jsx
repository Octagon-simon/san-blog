import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

import 'bulma-extensions/bulma-timeline/dist/css/bulma-timeline.min.css';

//pagination 
export default function SinglePost() {
    const user = useParams().user
    const [status, setStatus] = useState("not ready")
    const [data, setData] = useState(null)

    React.useEffect(() => {
        if (user) {
            fetch(import.meta.env.VITE_BACKEND_URL+`/user/${user}`, {
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
        }

    }, [user]);

    return (
        <>
            <div className="container blog-container mt-5 p-3">
                {(status === "not ready") ?
                    <p id="loader" className="has-text-centered"> <i className="fas fa-spinner fa-spin fa-5x has-text-app-primary"></i></p>
                    : (status === "failed") ?
                        <div className="has-text-centered p-4">
                            <p><i className="fas fa-times-circle fa-5x has-text-danger"></i></p>
                            <h4 className="title is-4 mt-4">Couldn't Fetch This User's Meta Data</h4>
                            <button onClick={() => { window.location.reload() }} className="button is-app-primary is-act">Try again</button>
                        </div>
                        : (status === "null") ?
                            <div className="has-text-centered p-4">
                                <p><i className="fas fa-exclamation-triangle fa-5x has-text-danger"></i></p>
                                <h4 className="title is-4 mt-4">This user does not exist!</h4>
                                <a href='/new-post' className="button is-app-primary is-act">Create a new post</a>
                            </div>
                            : null
                }
                {(status === "ready" && data) &&
                    <>
                        <section className="blog-post">
                            <div className="blog-first has-text-centered">
                                <p><i className="fas fa-user fa-2x has-text-app-primary"></i></p>
                                <h3 className="title is-3">{data.userData.username}</h3>
                            </div>
                            <div className='columns'>
                                <div className='column is-6 m-auto'>
                                    <div className="card user-meta-card has-text-centered" title="Date joined">
                                        <div className="card-img">
                                            <i className="fas fa-clock fa-5x has-text-info"></i>
                                        </div>
                                        <div className="card-content">
                                            <p className="m-0"><strong>Date joined</strong></p>
                                            {new Date(Number(data.userData.dateJoined)).toDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className='column is-6 m-auto'>
                                    <div className="card user-meta-card has-text-centered" title="Number of posts">
                                        <div className="card-img">
                                            <i className="fas fa-check fa-5x has-text-success"></i>
                                        </div>
                                        <div className="card-content">
                                            <p className="m-0"><strong>Number of posts</strong></p>
                                            {data.totalPosts}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="m-auto" style={{ maxWidth: "700px" }}>
                                <div className="timeline">
                                    <header className="timeline-header">
                                        <span className="tag is-medium is-app-primary">Start</span>
                                    </header>
                                    {
                                        data.postData.map( (val, ind) => {
                                            return (
                                                <div key={ind} className="timeline-item is-info">
                                                <div className="timeline-marker"></div>
                                                <div className="timeline-content">
                                                    <p className="heading">{new Date(val.datePosted).toDateString()}</p>
                                                    <p><a href={'../post/' + val.title.replaceAll(' ','-')}>{val.title}</a></p>
                                                </div>
                                            </div>
                                            )
                                        })
                                    }
                                    <header className="timeline-header">
                                        <span className="tag is-medium is-app-primary">End</span>
                                    </header>
                                </div>
                            </div>
                        </section>
                    </>
                }
            </div>
        </>
    )
}
