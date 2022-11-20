import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useToken } from '../../useToken'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

export default function Navbar() {
    const location = useLocation()
    const { token, setToken, destroyToken } = useToken();
    const navigate = useNavigate()
    const [logOut, setLogOut] = useState(false)
    const blogCategories = ['Science and Technology', 'Entertainment', 'Sports', 'Self Development', 'Health', 'Inspiration', 'Other'];

    const toggleMobileNav = function (e) {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        document.querySelector('.navbar-burger').classList.toggle('is-active');
        document.querySelector('.navbar-menu').classList.toggle('is-active');
    }
    const unToggleMobileNav = () => {
        document.querySelector('.navbar-burger').classList.remove('is-active');
        document.querySelector('.navbar-menu').classList.remove('is-active');
    }
    const LogOut = (e) => {
        console.log(e)
        e.target.parentNode.classList.toggle("is-loading")
        e.target.parentNode.setAttribute("disabled", "disabled")
        setTimeout(() => {
            setLogOut(true)
            e.target.parentNode.classList.remove("is-loading")
            e.target.parentNode.removeAttribute("disabled")
        }, 3000)
        //you cant call hooks inside a function?
    }
        //check for changes in the variable
        React.useEffect(() => {
            if(location){
                console.log(location)
                //remove any active class present in any element
                document.querySelectorAll('a').forEach(elem => {
                    elem.classList.remove('navbar-item-active')
                })
                console.log(window.location.origin+'/'+location.pathname+location.search)
                //set the active class on the element with the current url pathname
                const elem = (location.pathname && !location.search) ? document.querySelector(
                    `a[href="${location.pathname}"]`
                    ) : document.querySelector(
                        `a[href="${window.location.origin+location.pathname+location.search}"]`
                        )
                if(!elem.classList.contains('button')){
                    elem.classList.add('navbar-item-active')
                }
            }
        }, [location])

        /*

import React from 'react'
import { useLocation } from 'react-router-dom/client'

export default function Navbar() {
    //invoke the function
    const location = useLocation()
    //check for changes in the variable
    React.useEffect(() => {
        if(location){
            //remove any active class present in any element
            document.querySelectorAll('a').forEach(elem => {
                elem.classList.remove('is-active')
            })
            //set the active class on the element with the current url pathname
            document.querySelector(
                `a[href="${location.pathname}"]`
                ).classList.add('is-active')
        }
    }, [location])
}


        */
    //useEffect is like using event listeners on a variable
    //the second argument checks if the variable has changed its value
    //the variable can be passed as a state that can be updated
    React.useEffect(() => {
        //check if logout button was clicked
        if (logOut) {
            if (location.pathname == "/home") {
                window.location.reload()
            } else {
                //go to the home route
                navigate('/home')
            }
            //update token state to an empty string
            setToken('')
            //update logout state to false
            setLogOut(false);
            //remove token from browser storage
            destroyToken()
            //unToggle mobile nav
            unToggleMobileNav()
            toast.success('Logout successful');
        }
    }, [logOut])

    return (
        <>
            <ToastContainer
                position="top-right"
                hideProgressBar={false}
                autoClose={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="colored"
            />
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item font-pacifico" href="./">
                        SanBlog
                    </a>

                    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="sanBlogNavBar" onClick={(event) => toggleMobileNav(event)}>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="sanBlogNavBar" className="navbar-menu">
                    <div className="navbar-start">
                        <Link onClick={unToggleMobileNav} to="/" className="navbar-item">
                            Home
                        </Link>
                        <Link onClick={unToggleMobileNav} to="/posts" className="navbar-item">
                            All posts
                        </Link>
                        {(token) &&
                            <a href="/new-post" className="navbar-item">
                                New post
                            </a>
                        }
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">
                                Categories
                            </a>

                            <div className="navbar-dropdown">
                                {blogCategories.map((item, ind) => {
                                    const url = new URL(window.location.origin + '/posts');
                                    url.searchParams.append('category', item.replaceAll(' ', '-'))
                                    return (
                                        <a key={ind} href={url.href} className="navbar-item">
                                            {item}
                                        </a>
                                    )
                                })
                                }
                            </div>
                        </div>
                        <Link onClick={unToggleMobileNav} to="/about" className="navbar-item">
                            About us
                        </Link>
                        <Link onClick={unToggleMobileNav} to="/contact" className="navbar-item">
                            Contact us
                        </Link>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item has-buttons">
                            <div className="buttons">
                                {(!token) ?
                                    <>
                                        <a href="/login" className="button is-light">
                                            Log in
                                        </a>
                                        <a className="button is-app-primary" href="/register">
                                            <strong>Sign up</strong>
                                        </a>
                                    </> :
                                    <button className="button is-app-primary" onClick={LogOut}>
                                        <strong>Logout</strong>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    )
}