import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useToken } from '../useToken'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { octaValidate } from 'octavalidate-reactjs';

export default function SinglePost() {
    const title = useParams().title
    const { token } = useToken()
    const [status, setStatus] = useState("not ready")
    const [data, setData] = useState(null)
    const navigate = useNavigate()

    React.useEffect(() => {
        if (title) {
            fetch(import.meta.env.VITE_BACKEND_URL+`/post/${title.replaceAll('-',' ')}`, {
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
    }, []);
    //replace spaces in post titles with dashes
    React.useEffect(() => {
        if ((status === "ready" && data)) {
            document.querySelector('.blog-last article').innerHTML = data.post.content
        }
        console.log(data)
    }, [status, data]);

    //handle post deletion
    const handleDelete = (e) => {
        const btn = e.target
        btn.classList.toggle("is-loading")
        btn.setAttribute("disabled", "disabled")

        if (confirm("Are you sure that you want to delete this post?") && token) {
            fetch(import.meta.env.VITE_BACKEND_URL+`/delete-post/${title.replaceAll('-',' ')}/${token}`, {
                method: "GET",
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        btn.classList.remove('is-loading')
                        btn.setAttribute("disabled", "disabled")
                        toast.success(`${data.message}!`);
                        setTimeout(() => {
                            navigate('/posts')
                        }, 3000)
                    } else {
                        btn.classList.remove('is-loading')
                        btn.removeAttribute("disabled", "disabled")
                        toast.error(`${data.message}!`);
                    }
                })
        } else {
            btn.classList.remove('is-loading')
            btn.removeAttribute("disabled", "disabled")
        }
    }
    //handle post deletion
    const handleDeleteComment = (e) => {
        const btn = e.target
        const commentId = btn.getAttribute("comment-id");

        btn.classList.toggle("is-loading")
        btn.setAttribute("disabled", "disabled")

        if (confirm("Are you sure that you want to delete this comment?") && token && data && commentId) {
            fetch(import.meta.env.VITE_BACKEND_URL+`/delete-comment/${commentId}/${data.post._id}/${token}`, {
                method: "GET",
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        btn.classList.remove('is-loading')
                        btn.setAttribute("disabled", "disabled")
                        toast.success(`${data.message}!`);
                        setTimeout(() => {
                            window.location.reload()
                        }, 3000)
                    } else {
                        btn.classList.remove('is-loading')
                        btn.removeAttribute("disabled", "disabled")
                        toast.error(`${data.message}!`);
                    }
                })
        } else {
            btn.classList.remove('is-loading')
            btn.removeAttribute("disabled", "disabled")
        }
    }
    const handleNewComment = (e) => {
        console.log(e)
        //prevent reload
        e.preventDefault()
        //get form
        const form = e.target
        if (confirm("Are you sure that you want to post this comment?") && data) {
            //init validation library
            const myForm = new octaValidate(form.id)
            console.log(myForm, "myForm")
            //get form data
            const formData = new FormData(form)
            //append user token to form data
            formData.append('postId', data.post._id)
            //get button
            const btn = form.querySelector(`button[form=${form.id}]`)
            if (myForm.validate()) {
                //put button in loading state
                btn.classList.toggle('is-loading')
                btn.setAttribute("disabled", "disabled")

                fetch(import.meta.env.VITE_BACKEND_URL+'/new-comment', {
                    method: "POST",
                    body: formData,
                    mode: 'cors'
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            btn.classList.remove('is-loading')
                            //btn.removeAttribute("disabled", "disabled")
                            toast.success(`${data.message}!`);
                            setTimeout(() => {
                                window.location.reload()
                            }, 3000)
                            //reset form
                            form.reset()
                        } else {
                            btn.classList.remove('is-loading')
                            btn.removeAttribute("disabled", "disabled")
                            toast.error(`${data.message}!`);
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
    }
        return (
            <>
                <div className="container blog-container mt-5 p-3">
                    {(status === "not ready") ?
                        <p id="loader" className="has-text-centered">
                            <i className="fas fa-spinner fa-spin fa-5x has-text-app-primary"></i>
                        </p>
                        : (status === "failed") ?
                            <div className="has-text-centered p-4">
                                <p><i className="fas fa-times-circle fa-5x has-text-app-primary"></i></p>
                                <h4 className="title is-4 mt-4">Couldn't fetch Post content</h4>
                                <button onClick={() => { window.location.reload() }} className="button is-app-primary is-act">Try again</button>
                            </div>
                            : (status === "null") ?
                                <div className="has-text-centered p-4">
                                    <p><i className="fas fa-exclamation-triangle fa-5x has-text-app-primary"></i></p>
                                    <h4 className="title is-4 mt-4">A post with this title does not exist!</h4>
                                    <a href='/new-post' className="button is-app-primary is-act">Create a new post</a>
                                </div>
                                : null
                    }
                    {(status === "ready" && data) &&
                        <>
                            <section className="blog-post mt-5">
                                <div className="blog-first has-text-centered">
                                    <h3 className="title is-5">{data.post.title}</h3>
                                    <h5 className="subtitle">{data.post.subtitle}</h5>
                                </div>
                                <div className="blog-category has-text-centered">
                                    <p>Posted in <a href={'../posts?category='+data.post?.category || "Other"}>{data.post?.category || "Other"}</a></p>
                                </div>
                                <div className="blog-second has-text-centered">
                                    <div className="blog-cover">
                                        <img src={(data.post.cover) ? JSON.parse(data.post.cover)?.secure_url : 'https://res.cloudinary.com/dxsxxso3a/image/upload/v1668527703/cld-sample-3.jpg'} className="img" />
                                    </div>
                                    <div className="blog-third has-text-centered">
                                        <h4 className="title is-6 blog-user">Posted by <a href={'../user/' + data.post.userId._id}>{data.post.userId.uname}</a> on {new Date(data.post.datePosted).toLocaleString()}</h4>
                                        {
                                            (token && (data.post.userId._id === token)) &&
                                            <div className="button-section">
                                                <>
                                                    <a href={'../edit-post/' + data.post.title.replaceAll(' ','-')} className="has-fa-icon button is-app-primary mr-2">Edit post</a>
                                                    <button onClick={(e) => handleDelete(e)} className="button has-fa-icon is-danger">Delete post</button>
                                                </>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="blog-last">
                                    <article>
                                        Me at content dot net
                                    </article>
                                </div>
                                <section className="mt-5">
                                    <button className="d-none button is-app-primary">Submit new comment</button>
                                    <h4 className="title is-4">Comments</h4>
                                    { (!data.comments.length) ?
                                    <p>This post has not received any comments yet</p>
                                    :
                                    <>
                                    {
                                        data.comments.map( (val, ind) => {
                                            return (
                                                <div key={ind} className="card card-comment p-1">
                                                    { (token && (data.post.userId._id === token)) &&
                                                    <div className="has-text-right">
                                                        <button onClick={ (e) => {handleDeleteComment(e)}} comment-id={val._id} className="button delete-comment is-danger"><i className="fas fa-trash"></i></button>
                                                    </div>
                                                    }
                                                    <div className="card-content p-2">
                                                        <article>
                                                            <p className="mb-2">
                                                                {val.comment}
                                                            </p>
                                                        </article>
                                                        <h4 className="title is-6">By {val.username} on {new Date(val.datePosted).toDateString()}</h4>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    </>
}
                                </section>
                                <section className="mt-5 comment-section">
                                    <h3 className="title is-4">Submit a new comment</h3>
                                    <form id="form_new_comment" onSubmit={(e) => { handleNewComment(e) }}>
                                        <div className="field">
                                            <label>Username</label>
                                            <input id="inp_username" name="username" placeholder="Simon..." type="text" octavalidate="R,USERNAME" ov-required-msg="Your username contains invalid characters" className="input" />
                                        </div>
                                        <div className="field">
                                            <label>Comment</label>
                                            <textarea name="comment" placeholder="I love your post!" className="textarea" id="inp_comment" octavalidate="R,TEXT" ov-required-msg="Your comment contains invalid characters"></textarea>
                                        </div>
                                        <div className="field">
                                            <button form="form_new_comment" className="button is-app-primary">Post</button>
                                        </div>
                                    </form>
                                </section>
                                <div className="single-post-divider mt-5"></div>
                                <section className="similar-posts mt-5">
                                    <h4 className="title is-4">Similar Posts</h4>
                                    {
                                        (data.similar.length > 0) ?
                                        data.similar.map( (val, ind) => {
                                            const coverImage = (val.cover) ? JSON.parse(val.cover)?.secure_url : 'https://res.cloudinary.com/dxsxxso3a/image/upload/v1668527703/cld-sample-3.jpg';
                                            return (
                                                <section key={ind} className="single-post bg-color">
                                                    <div className="single-post-first">
                                                        <img src={coverImage} />
                                                    </div>
                                                    <div className="single-post-last has-text-centered">
                                                        <div className="single-post-content">
                                                            <h2 className="title is-5">{val.title}</h2>
                                                            <h5 className="subtitle has-text-centered">{val.subtitle}</h5>
                                                            <article dangerouslySetInnerHTML={{ __html: val.content.substr(0, 200) + "..." }}></article>
                                                        </div>
                                                        <p className="single-post-comment"><strong>{val.comments.length}</strong> {(val.comments.length === 1) ? 'comment' : 'comments'}</p>
                                                        <button className="button is-app-primary btn-act has-fa-icon" onClick={() => { handleReadPost(val.title) }}>Read post&nbsp;<i className="fas fa-arrow-right fa-sm"></i></button>
                                                    </div>
                                                </section>
                                            )
                                        })
                                        :
                                        <p className="m-0">There are no similar posts</p>
                                    }
                                </section>
                            </section>
                        </>
                    }
                </div>
            </>
        )
    }
