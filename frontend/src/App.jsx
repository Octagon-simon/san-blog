import React from 'react'
import { useToken } from './useToken'
import Home from './pages/Home'
import Posts from './pages/Posts'
import Register from './pages/Register'
import Login from './pages/Login'
import Test from './Test'
import Navbar from './pages/layouts/navbar' 
import NewPost from './pages/NewPost' 
import EditPost from './pages/EditPost'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { nanoid } from 'nanoid'
import SinglePost from './pages/SinglePost'
import UserMeta from './pages/UserMeta'

function App() {
  const { token } = useToken();

  React.useEffect( () => {
    console.log(token, "from app")
  }, [token])

  const handleClick = () => {
    //$(document.body)[0].classList.toggle('dark')
  }
  // const [token, setToken] = useState();
  //\"^[A-Za-z0-9-_./ ]*$\
  // //check if token is empty then render the login component
  // if(!token) {
  //   return <Login setToken={setToken} />
  // }/*(token) ? <NewPost />:<Navigate replace to="/login" />  */
  /* 
    <div className="theme-switch" onClick={handleClick}>
      <button className="btn-theme-switch">
        <i className="fas fa-sun"></i>
      </button>
    </div>
    */
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="test" element={<Test />} />
          <Route path="posts" element={<Posts />} />
          <Route path="new-post" element={<NewPost />} />
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
