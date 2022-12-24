import { octaValidate } from "octavalidate-reactjs"

export default function validationTest() {
    const style = {
        margin: "50px auto",
        maxWidth: "500px"
    }

    const handleSubmit = (e) => {
        //prevent reload of the page
        e.preventDefault()
        //initialize the library
        const demoForm = new octaValidate('form_demo')
        //building a custom validation rule
        // demoForm.customRule('PASS', /12345/, "Your fake password must be 12345")
        //validate the form and then check if validation is successful
        if( demoForm.validate() ){
            //go ahead and process the form
            
        }else{
            //we cannot process the form because it has validation errors
        }
    }

    return (
        <section style={style}>
            <h4 className="title is-4 has-text-centered">VALIDATING A SIMPLE FORM</h4>
            <form noValidate id="form_demo" onSubmit={handleSubmit}>
                <div className="field">
                    <label>Your email</label>
                    <input octavalidate="R" autoComplete="off" className="input" id="inp_email" type="email" placeholder="Enter your email" />
                </div>
                <div className="field">
                    <label>Your username</label>
                    <input octavalidate="R" autoComplete="off" className="input" id="inp_uname" type="text" placeholder="Enter your username" />
                </div>
                <div className="field">
                    <label>Your age</label>
                    <input octavalidate="R" autoComplete="off" className="input" id="inp_age" type="number" placeholder="Enter your age" range="18-50" ov-range-msg="Your age must be between 18 - 50" />
                </div>
                <div className="field">
                    <label>Your password</label>
                    <input octavalidate="R,PWD" autoComplete="off" className="input" id="inp_pass" type="password" placeholder="Enter your password" />
                </div>
                <div className="field">
                    <label>Confirm password</label>
                    <input equalto="inp_pass" ov-equalto-msg="Both passwords do not match" octavalidate="R" autoComplete="off" className="input" id="inp_conpass" type="password" placeholder="Re-enter your password" />
                </div>
                <button type="submit" className="button is-primary"> Register </button>
            </form>
        </section>
    )
}