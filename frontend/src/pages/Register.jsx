import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {octaValidate} from 'octavalidate-reactjs'
import Home from '../pages/Home'

export default function () {
    const myForm = new octaValidate('form_register')

    const [data, setData] = useState({
        uname: "",
        pass: "",
        email: ""
    })
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(values => ({ ...values, [name]: value }))
        console.log(data)
    }
    const handleSubmit = function (e) {
        //prevent the page from reloading
        e.preventDefault();
        //validate form
        if (myForm.validate()) {
            //do fetch
            fetch('http://localhost:5000/register', {
                method: "POST",
                body: JSON.stringify(data),
                mode: 'cors',
                headers : {
                    'content-type' : 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if(data.success){
                        toast.success(`${data.message}!`);
                    }else{
                        toast.error(`${data.message}!`);
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        console.log(data)

    }

    return (
        <div className="container p-5">
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
                            <input className="input" type="password" placeholder="Re-enter Your Password" id="inp_conpwd" equalto="inp_pwd" />
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