import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {octaValidate} from 'octavalidate-reactjs';
import Home from '../pages/Home'
import PropTypes from 'prop-types';
import { useToken } from '../useToken'
import { useNavigate} from "react-router-dom"

export default function Login() {
    const { token, setToken } = useToken()
    
    const navigate = useNavigate();
    
    React.useEffect( () => {
        if(token){
            setTimeout(() => {
                //window.location.href="home"
                navigate('/home');
            }, 3000)
        }
    }, [token])

    const [data, setData] = useState({
        pass: "",
        email: ""
    })
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(values => ({ ...values, [name]: value }))
    }
    const handleSubmit = function (e) {
        const form = e.target
        const formData = new FormData(form)
        const myForm = new octaValidate(form.id)
        //the submit button
        const btn = form.querySelector('button');
        //prevent the page from reloading
        e.preventDefault();
        //validate form
        if (myForm.validate()) {
            btn.classList.toggle('is-loading')
            btn.setAttribute("disabled", "disabled")
            //do fetch
            fetch(import.meta.env.VITE_BACKEND_URL+'/login', {
                method: "POST",
                body: formData,
                mode: 'cors'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        btn.classList.remove('is-loading')
                        btn.setAttribute("disabled", "disabled")
                        toast.success(`${data.message}!`);
                        //set token
                        setToken(data.data);
                    } else {
                        btn.classList.remove('is-loading')
                        btn.removeAttribute("disabled")
                        toast.error(`${data.message}!`);
                    }
                })
                .catch(err => {
                    console.log(err)
                    btn.classList.remove('is-loading')
                    btn.removeAttribute("disabled")
                    toast.error(`Sorry, we can't login you in now.`);
                })
        } else {
            btn.classList.remove('is-loading')
        }
    }

    return (
        <div className="container p-5">
            <section className="auth-form-section p-4 radius-10">
                <h3 className="has-text-centered title is-4"> Login to your account</h3>
                <form id="form_login" method="post" className="" noValidate onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label font-roboto">Your Email</label>
                        <p className="control has-icons-left has-icons-right">
                            <input id="inp_email" name="email" className="input" type="email" placeholder="Enter Your Email" octavalidate="R,EMAIL" value={data.email} onChange={handleChange} ov-required-msg="Your email address is required" />
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
                    <div className="field mt-5">
                        <button className="button is-app-primary is-fullwidth" type="submit">Login</button>
                    </div>
                    <div className="mt-2 has-text-centered">
                        <p>Don't have an account? <a href="/register">Click here to Register</a></p>
                    </div>
                </form>
            </section>
        </div>

    )
}
