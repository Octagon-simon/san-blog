import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useExternalScript } from '../externalScript'
import { octaValidate } from 'octavalidate-reactjs'
import { useToken } from '../useToken'
import { useNavigate } from 'react-router-dom'

export default function NewPost() {
    const navigate = useNavigate()

    const { token } = useToken()

    React.useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token])

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
        e.stopPropagation();
        //get form
        const form = e.target
        const myForm = new octaValidate(form.id)
        //prevent reload
        e.preventDefault()
        //get form data
        const formData = new FormData(form)
        //append user token to form data
        formData.append('token', token)
        //get button
        const btn = form.querySelector(`button[form=${form.id}]`)
        if (myForm.validate()) {
            //put button in loading state
            btn.classList.toggle('is-loading')
            btn.setAttribute("disabled", "disabled")

            fetch('http://localhost:5000/new-post', {
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
                            navigate('/posts')
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
    return (
        <>
            <link href="/summernote/summernote-lite.min.css" rel="stylesheet" />
            { (state1 === "ready" && state2 === "ready") &&
                <div className="container mt-5 p-4 xbg-color">
                    <h3 className="title is-3 has-text-centered">Submit A New Post</h3>
                    <h5 className="subtitle has-text-centered">Put your thoughts into writing...</h5>
                    <section className="" style={{ maxWidth: "700px", margin: 'auto' }}>
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
                        <form id="form_new_post" method="post" className="" noValidate onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="field">
                                <label className="label">Blog Title</label>
                                <p className="control has-icons-left has-icons-right">
                                    <input id="inp_title" name="title" className="input" type="text" placeholder="Enter Post Title" octavalidate="R,TEXT"  {...{ "ov-required:msg": "Blog title is required" }} />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-font"></i>
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <label className="label">Blog Subtitle</label>
                                <p className="control has-icons-left">
                                    <input className="input" type="text" placeholder="Enter Post Subtitle" id="inp_pwd" name="subtitle" octavalidate="R,TEXT"  {...{ "ov-required:msg": "Blog subtitle is required" }} />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-font"></i>
                                    </span>
                                </p>
                            </div>
                            <div className='field'>
                                <label className='label'>Select a Cover Image</label>
                                <div className="file has-name">
                                    <label className="file-label">
                                        <input id="inp_cover" className="file-input" type="file" name="cover" octavalidate="R" accept-mime="image/*" {...{ "ov-required:msg": "Cover image is required" }} />
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
                                    <textarea className="d-hidden" name="content" placeholder="Type in your content" id="inp_content" octavalidate="R" {...{ "ov-required:msg": "Blog content is required" }}></textarea>
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-font"></i>
                                    </span>
                                </p>
                            </div>
                            <div className="field mt-5">
                                <button form="form_new_post" className="button is-app-primary" type="submit">Submit Post</button>
                            </div>
                        </form>
                    </section>
                </div>
            }
        </>
    )
}