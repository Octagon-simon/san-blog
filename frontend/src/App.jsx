import React from 'react'
import { useToken } from './useToken'
import Home from './pages/Home'
import Posts from './pages/Posts'
import Register from './pages/Register'
import Login from './pages/Login'
import Test from './Test'
import Navbar from './pages/layouts/navbar' 
import NewPost from './pages/NewPost' 
import About from './pages/About' 
import EditPost from './pages/EditPost'
import Contact from './pages/Contact.jsx'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { nanoid } from 'nanoid'
import SinglePost from './pages/SinglePost'
import UserMeta from './pages/UserMeta'
import { useEffect } from 'react'
import { useState } from 'react'

function App() {
  const { token } = useToken();
  const [alive, setAlive] = useState(true)
  const [colorScheme, setColorScheme] = useState(localStorage.getItem('colorScheme') || 'light')
  const interval = setInterval( () => {
    //the server is about to go to sleep
    setAlive(false);
  }, 600000)

  //ping the sleepy server after 10 mins when a user is still on the site
  useEffect( () => {
    if(!alive){
      fetch(import.meta.env.VITE_BACKEND_URL+'/')
      .then(res => res.json())
      .then(data => {
        console.log("No sleeping resources")
        //server is alive now
        setAlive(true)
        clearInterval(interval)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }, [alive])

  //check and toggle dark mode
  useEffect( () => {
    if(colorScheme == 'light'){
      document.body.classList.remove('dark')
      document.body.classList.add('light')
    }else{
      document.body.classList.remove('light')
      document.body.classList.add('dark')
    }
  }, [colorScheme])

  const handleClick = (e) => {
    e.stopPropagation()
    //e.currentTarget is the button
    const elem = e.target
    if(colorScheme == 'light'){
      document.body.classList.remove('light')
      document.body.classList.toggle('dark')
      elem.removeAttribute("class")
      elem.setAttribute("class", "fas fa-sun")
      setColorScheme("dark")
      localStorage.setItem('colorScheme', 'dark')
    }else{
      document.body.classList.remove('dark')
      document.body.classList.toggle('light')
      elem.removeAttribute("class")
      elem.setAttribute("class", "fas fa-moon")
      setColorScheme("light")
      localStorage.setItem('colorScheme', 'light')
    }
  }
  return (
    <>
    <div className="theme-switch">
      <button className="btn-theme-switch">
        <i className="fas fa-sun" onClick={handleClick}></i>
      </button>
    </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="test" element={<Test />} />
          <Route path="posts" element={<Posts />} />
          <Route path="new-post" element={<NewPost />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="register" element={(token) ? <Navigate replace to="/" /> : <Register />} />
          <Route path="login" element={(token) ? <Navigate replace to="/" /> : <Login />} />
          <Route path="new-post" element={<NewPost />} />
          <Route path="post/:title" element={<SinglePost />} />
          <Route path="user/:user" element={<UserMeta />} />
          <Route path="edit-post/:title" element={<EditPost />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App
