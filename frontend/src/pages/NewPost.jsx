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
    const state = useExternalScript("/summernote/summernote-lite.min.js")

    React.useEffect(() => {
        if (state === "ready") {
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
    }, [state])

    const handleSubmit = (e) => {
        e.stopPropagation();
        //get form #582be8
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

            fetch(import.meta.env.VITE_BACKEND_URL + '/new-post', {
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
    const setFileName = (e) => {
        document.querySelector('.file-name').innerText = e.target.files[0].name
    }
    const blogCategories = ['CSS',  'HTML', 'JavaScript', 'MongoDB', 'MySQL', 'NodeJS', 'PHP', 'ReactJS', 'Others'];
    return (
        <>
            <link href="/summernote/summernote-lite.min.css" rel="stylesheet" />
            {(state === "ready") &&
                <div className="container mt-5 p-4 xbg-color">
                    <h3 className="title is-3 has-text-centered">Submit A New Post</h3>
                    <h5 className="subtitle has-text-centered has-text-app-primary">Put your thoughts into writing...</h5>
                    <section className="" style={{ maxWidth: "700px", margin: 'auto' }}>
                        <form id="form_new_post" method="post" className="" noValidate onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="field">
                                <label className="label">Post Title</label>
                                <p className="control has-icons-left has-icons-right">
                                    <input id="inp_title" name="title" className="input" type="text" placeholder="Enter Post Title" octavalidate="R,ALPHA_SPACES" ov-required-msg="Post title is required" />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-font"></i>
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <label className="label">Post Subtitle</label>
                                <p className="control has-icons-left">
                                    <input className="input" type="text" placeholder="Enter Post Subtitle" id="inp_pwd" name="subtitle" octavalidate="R,ALPHA_SPACES" ov-required-msg="Post subtitle is required" />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-font"></i>
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <label className="label">Post Category</label>
                                <div className="control has-icons-left">
                                    <div className="select is-fullwidth">
                                        <select id="select_record_count" octavalidate="R,TEXT" name="category" className="" ov-required-msg="Post category is required">
                                            <option value="">Select a Category</option>
                                            {
                                                blogCategories.map((val, ind) => {
                                                    return (
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
                                        <input onChange={setFileName} id="inp_cover" className="file-input" type="file" name="cover" octavalidate="R" accept-mime="image/*" ov-required-msg="Cover image is required" />
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
                                <label className="label">Post Content</label>
                                <p className="control has-icons-left">
                                    <textarea id="summernote"></textarea>
                                    <textarea className="d-hidden" name="content" placeholder="Type in your content" id="inp_content" octavalidate="R" ov-required-msg="Post content is required"></textarea>
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