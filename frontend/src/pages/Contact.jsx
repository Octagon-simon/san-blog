import React, { useState } from "react";
import { octaValidate } from "octavalidate-reactjs";
//import { toast } from "react-toastify";

export default function Contact() {

    // Input Change Handling
    const [inputs, setInputs] = useState({
        email: "",
        subject: "",
        message: "",
    });
    const handleOnChange = (event) => {
        //event.persist();
        setInputs((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
        console.log(inputs)
    };

    // Server State Handling
    const handleOnSubmit = (event) => {
        const btn = event.target.querySelector('button')
        const myForm = new octaValidate('form_contact')

        if (myForm.validate()) {
            btn.setAttribute("disabled", "disabled")
            btn.classList.add('is-loading')
            event.target.setAttribute('action', 'https://formbold.com/s/oPnz9')
            event.currentTarget.submit()
            // fetch('https://formbold.com/s/oPnz9', {
            //     method: "POST",
            //     mode: 'no-cors',
            //     body: JSON.stringify(inputs),
            //     headers : {
            //         'content-type' : 'application/json'
            //     }
            // })
            // .then(res => res.json())
            // .then((r) => {
            //     console.log(r);
            //     btn.classList.remove('is-loading')
            //     toast.success("Your message has been delivered")
            // })
            // .catch((r) => {
            //     console.log(r);
            //     btn.removeAttribute("disabled")
            //     btn.classList.remove('is-loading')
            //     toast.error("Sorry, we can't send your message now")
            // });
        }else{
        event.preventDefault();
        }
    };
    return (
        <>
            <section className="hero is-medium">
                <div className="hero-body">
                    <div className="container has-text-centered" style={{ top: '30%' }}>
                        <h1 className="title is-1 has-text-light">Contact Us</h1>
                        <p className="subtitle has-text-light font-pacifico">We are available for you 24 / 7</p>
                    </div>
                </div>
            </section>
            <div className="container mt-5 mb-5">
                <section className="form-section p-3">
                    <div className="mt-5 mb-5 center-on-mobile">
                        <h4 className="title is-3 mb-2">Send us a message</h4>
                        <p className="mb-2">Our team is available <strong>24/7</strong> to help you with any complaint you may have</p>
                    </div>
                    <form onSubmit={handleOnSubmit} id="form_contact" noValidate method="post">
                        <div className="field">
                            <label className="label">Your Email Address</label>
                            <p className="control has-icons-left has-icons-right">
                                <input id="inp_email" name="email" className="input" type="email" placeholder="Enter Your Email Address" octavalidate="R,EMAIL" ov-reqired-msg="Your Email address is required" onChange={handleOnChange} defaultValue={inputs.email} />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-envelope"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <label className="label">Email Subject</label>
                            <p className="control has-icons-left has-icons-right">
                                <input id="inp_subject" name="subject" className="input" type="text" placeholder="Enter Email Subject" octavalidate="R,ALPHA_SPACES" ov-required-msg="Email subject is required" onChange={handleOnChange} defaultValue={inputs.subject} />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-font"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <label className="label">Your Message</label>
                            <textarea
                                onChange={handleOnChange}
                                defaultValue={inputs.message}
                                id="message"
                                name="message"
                                placeholder="Type your message"
                                octavalidate="R,TEXT"
                                className="textarea"
                                ov-required-msg="Your message is required"
                            />
                        </div>
                        <button type="submit" className="button is-app-primary btn-act"> Send Message </button>
                    </form>
                </section>
            </div>
        </>
    )
}