import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { octaValidate } from 'octavalidate-reactjs'
import Home from '../pages/Home'
import { useNavigate } from 'react-router-dom'

export default function () {
    const navigate = useNavigate()
    const [data, setData] = useState({
        uname: "",
        pass: "",
        email: ""
    })
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(values => ({ ...values, [name]: value }))
        //console.log(data)
    }
    const handleSubmit = function (e) {
        const form = e.target
        const myForm = new octaValidate(form.id)
        const formData = new FormData(form)
        //the submit button
        const btn = form.querySelector('button');
        //prevent the page from reloading
        e.preventDefault();
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading')
            btn.setAttribute("disabled", "disabled")
            //do fetch
            fetch(import.meta.env.VITE_BACKEND_URL+'/register', {
                method: "POST",
                body: formData,
                mode: 'cors'
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        toast.success(`${data.message}!`);
                        setTimeout(() => {
                            navigate('/login')
                        }, 2000)
                    } else {
                        toast.error(`${data.message}!`);
                        btn.classList.remove('is-loading')
                        btn.removeAttribute("disabled")
                    }
                })
                .catch(err => {
                    console.log(err)
                    btn.classList.remove('is-loading')
                    btn.removeAttribute("disabled")
                    toast.error('Sorry, we can\'t sign you up now');
                })
        }
    }

    return (
        <div className="container p-5 centered-elem">
            <section className="auth-form-section p-4 radius-20">
                <h3 className="has-text-centered title is-4">Create an account</h3>
                <form id="form_register" method="post" className="" noValidate onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label font-roboto">Your Username</label>
                        <p className="control has-icons-left has-icons-right">
                            <input id="inp_uname" name="uname" className="input" type="text" placeholder="Enter Your Username" required="" octavalidate="R,USERNAME" value={data.uname} onChange={handleChange} />
                            <span className="icon is-small is-left">
                                <i className="fas fa-envelope"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <label className="label font-roboto">Your Email</label>
                        <p className="control has-icons-left has-icons-right">
                            <input id="inp_email" name="email" className="input" type="email" placeholder="Enter Your Email" octavalidate="R,EMAIL" value={data.email} onChange={handleChange} />
                            <span className="icon is-small is-left">
                                <i className="fas fa-envelope"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <label className="label font-roboto">Password</label>
                        <p className="control has-icons-left">
                            <input className="input" type="password" placeholder="Enter Your Password" id="inp_pwd" name="pass" octavalidate="R" minLength="8" value={data.pass} onChange={handleChange} />
                            <span className="icon is-small is-left">
                                <i className="fas fa-asterisk"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <label className="label font-roboto">Re-enter password</label>
                        <p className="control has-icons-left">
                            <input className="input" type="password" placeholder="Re-enter Your Password" id="inp_conpwd" equalto="inp_pwd" ov-equalto-msg="Both passwords do not match" />
                            <span className="icon is-small is-left">
                                <i className="fas fa-asterisk"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field mt-5">
                        <button className="button is-app-primary is-fullwidth" type="submit">Register</button>
                    </div>
                    <div className="mt-2 has-text-centered">
                        <p>Already have an account? <a href="/login">Click here to Login</a></p>
                    </div>
                </form>
            </section>
        </div>
    )
}