import React, {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import  {useToken} from '../useToken'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function SinglePost (){
    const title = useParams().title
    const {token} = useToken()
    const [status, setStatus] = useState("not ready")
    const [data, setData] = useState(null)
    const navigate = useNavigate()

    React.useEffect(() => {
        if(title){
            fetch(`http://localhost:5000/post/${title}`, {
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
        }

    }, [title]);
    //replace spaces in post titles with dashes
    React.useEffect(() => {
        if((status === "ready" && data)){
            document.querySelector('.blog-last article').innerHTML = data.post.content
        }
        console.log(data)
    }, [status, data]);
    
    //handle post deletion
    const handleDelete = (e) => {
        console.log(e)
        const btn = e.target
        btn.classList.toggle("is-loading")
        btn.setAttribute("disabled", "disabled")

        if(confirm("Are you sure that you want to delete this post?") && token){
            fetch(`http://localhost:5000/post/delete/${title}/${token}`, {
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
                    setTimeout( ()=> {
                        navigate('/posts')
                    }, 3000)
                } else {
                    btn.classList.remove('is-loading')
                    btn.removeAttribute("disabled", "disabled")
                    toast.error(`${data.message}!`);
                }
            })
        }else{
            btn.classList.remove('is-loading')
            btn.removeAttribute("disabled", "disabled")
        }
    }
    //click on a user to see the number of posts made
    //handle post edit
    const handleEdit = (e) => {

    }
    return(
        <>
        <div className="container blog-container mt-5 p-3">
            {(status === "not ready") ? 
                <p id="loader" className="has-text-centered"> <i className="fad fa-spinner-third fa-spin fa-5x has-text-app-primary"></i></p>
            : (status === "failed") ?
                <div className="has-text-centered p-4">
                    <p><i className="fad fa-times-circle fa-5x has-text-danger"></i></p>
                    <h4 className="title is-4 mt-4">Couldn't fetch Post content</h4>
                    <button onClick={ () => {window.location.reload()}} className="button is-app-primary is-act">Try again</button>
                </div>
            :(status === "null") ?
                <div className="has-text-centered p-4">
                    <p><i className="fad fa-exclamation-triangle fa-5x has-text-danger"></i></p>
                    <h4 className="title is-4 mt-4">A post with this title does not exist!</h4>
                    <a href='/new-post' className="button is-app-primary is-act">Create a new post</a>
                </div>
            : null
            }
            { (status === "ready" && data) && 
            <>
            <ToastContainer
                position="top-right"
                autoClose={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="dark"
            />
            <section className="blog-post">
                <div className="blog-first has-text-centered">
                    <h3 className="title is-4 has-text-app-primary">{data.post.title}</h3>
                    <h5 className="subtitle">{data.post.subtitle}</h5>
                </div>
                <div className="blog-second has-text-centered">
                    <div className="blog-cover">
                        <img src={'http://localhost:5000/public/cover_images/'+data.post.cover} className="img" />
                    </div>
                    <div className="blog-third has-text-centered">
                        <h4 className="title is-6 blog-user">Posted by {data.post.userId.uname} on {new Date(data.post.datePosted).toLocaleString()}</h4>
                        {
                            (token && (data.post.userId._id === token)) &&
                        <div className="button-section">
                            <>
                            <a href={'../edit-post/'+data.post.title} className="has-fa-icon button is-app-primary mr-2">Edit post <i className="fad fa-pencil"></i></a>
                            <button onClick={ (e) => handleDelete(e) } className="button has-fa-icon is-danger is-outlined">Delete post <i className="fad fa-trash"></i></button>
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
            </section>
            </>
            
            }
            </div>
            </>
    )
}
