import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useExternalScript } from '../externalScript'
import { octaValidate } from 'octavalidate-reactjs'
import { useToken } from '../useToken'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditPost() {
    const navigate = useNavigate()
    const title = useParams().title.replaceAll('-', ' ')
    const [data, setData] = useState()
    const [status, setStatus] = useState("not ready")
    const { token } = useToken()

    React.useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token])

    //fetch post with this title
    React.useEffect ( () => {
        if(title){
            fetch(`import.meta.env.VITE_BACKEND_URL/post/${title}`, {
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
    }, [title])


//all users
    const state1 = useExternalScript("/summernote/jquery-3.4.1.slim.min.js")
    const state2 = useExternalScript("/summernote/summernote-lite.min.js")

    React.useEffect(() => {
        if (state1 === "ready" && state2 === "ready") {
            jQuery('#summernote').summernote({
                placeholder: 'Hello stand alone ui',
                tabsize: 2,
                height: 120,
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'underline', 'clear']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
                    ['view', ['fullscreen', 'codeview', 'help']]
                ],
                callbacks: {
                    onChange: function (contents, $editable) {
                        jQuery('#inp_content').html(contents)
                    }
                }
            });
        }
    }, [state1, state2])

    const handleSubmit = (e) => {
        //get form
        const form = e.target
        const myForm = new octaValidate(form.id)
        //prevent reload
        e.preventDefault()
        //get form data
        const formData = new FormData(form)
        //append user token to form data
        formData.append('token', token)
        formData.append('old_title', title)
        //get button
        const btn = form.querySelector(`button[form=${form.id}]`)
        if (myForm.validate()) {
            //put button in loading state
            btn.classList.toggle('is-loading')
            btn.setAttribute("disabled", "disabled")

            fetch(import.meta.env.VITE_BACKEND_URL+'/update-post', {
                method: "POST",
                body: formData,
                mode: 'cors'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        //btn.classList.remove('is-loading')
                        //btn.removeAttribute("disabled", "disabled")
                        toast.success(`${data.message}!`);
                        setTimeout(() => {
                            navigate(`/post/${formData.get('title').replaceAll(' ','-')}`)
                        }, 3000)
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

    React.useEffect( () =>{
        if(data && (state1 === "ready" && state2 === "ready") && status === "ready"){
            //invalid left side assingment if you do this d() = value
            jQuery('#summernote').summernote('code', data.post.content)
        }
    }, [data, state1, state2, status])

    const blogCategories = ['Science and Technology', 'Entertainment', 'Sports', 'Self Development', 'Health', 'Inspiration', 'Other'];
    return (
        <>  
            {(status === "not ready") ? 
                <p id="loader" className="has-text-centered"> <i className="fas fa-spinner fa-spin fa-5x has-text-app-primary"></i></p>
            : (status === "failed") ?
                <div className="has-text-centered p-4">
                    <p><i className="fas fa-times-circle fa-5x has-text-app-primary"></i></p>
                    <h4 className="title is-4 mt-4">Couldn't fetch Post content</h4>
                    <button onClick={ () => {window.location.reload()}} className="button is-app-primary is-act">Try again</button>
                </div>
            :(status === "null") ?
                <div className="has-text-centered p-4">
                    <p><i className="fas fa-exclamation-triangle has-text-app-primary"></i></p>
                    <h4 className="title is-4 mt-4">A post with this title does not exist!</h4>
                    <a href='/new-post' className="button is-app-primary is-act">Create a new post</a>
                </div>
            : null
            }
            <link href="/summernote/summernote-lite.min.css" rel="stylesheet" />
            { (state1 === "ready" && state2 === "ready" && status === "ready" && data) &&
                <div className="container mt-5 p-4 xbg-color">
                    <h3 className="title is-3 has-text-centered">Edit Post</h3>
                    <h5 className="subtitle has-text-centered has-text-app-primary">Put your thoughts into writing...</h5>
                    <section className="" style={{ maxWidth: "700px", margin: 'auto' }}>
                        <form id="form_update_post" method="post" className="" noValidate onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="field">
                                <label className="label">Blog Title</label>
                                <p className="control has-icons-left has-icons-right">
                                    <input id="inp_title" name="title" className="input" defaultValue={title} type="text" placeholder="Enter Post Title" octavalidate="R,ALPHA_SPACES"  {...{ "ov-required-msg": "Blog title is required" }} />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-font"></i>
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <label className="label">Blog Subtitle</label>
                                <p className="control has-icons-left">
                                    <input className="input" type="text" defaultValue={data.post.subtitle} placeholder="Enter Post Subtitle" id="inp_pwd" name="subtitle" octavalidate="R,ALPHA_SPACES"  {...{ "ov-required-msg": "Blog subtitle is required" }} />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-font"></i>
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <label className="label">Blog Category</label>
                                <div className="control has-icons-left">
                                <div className="select is-fullwidth">
                                    <select id="select_blog_category" defaultValue={data.post.category}  octavalidate="R,TEXT" name="category" className="" ov-required-msg="Blog category is required">
                                        <option value="">Select a Category</option>
                                        { 
                                        blogCategories.map( (val, ind) => {
                                            return(
                                                <option key={ind}>{val}</option>
                                            )
                                        })
                                        }
                                    </select>
                                </div>
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-object-group"></i>
                                    </span>
                                </div>
                            </div>
                            <div className='field'>
                                <label className='label'>Select a Cover Image</label>
                                <div className="file has-name">
                                    <label className="file-label">
                                        <input id="inp_cover" className="file-input" type="file" name="cover" accept-mime="image/*" />
                                        <span className="file-cta">
                                            <span className="file-icon">
                                                <i className="fas fa-upload"></i>
                                            </span>
                                            <span className="file-label">
                                                Choose a file…
                                            </span>
                                        </span>
                                        <span className="file-name">Select a file
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Blog Content</label>
                                <p className="control has-icons-left">
                                    <textarea id="summernote"></textarea>
                                    <textarea className="d-hidden" name="content" placeholder="Type in your content" id="inp_content" octavalidate="R" {...{ "ov-required-msg": "Blog content is required" }} defaultValue={data.post.content}></textarea>
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-font"></i>
                                    </span>
                                </p>
                            </div>
                            <div className="field mt-5">
                                <button form="form_update_post" className="button is-app-primary" type="submit">Update Post</button>
                            </div>
                        </form>
                    </section>
                </div>
            }
        </>
    )
}