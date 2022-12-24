## SANBLOG

This is a full working blogging solution built using the MERN stack.

![image](https://user-images.githubusercontent.com/68190998/209425650-3960e48e-7fe5-4ec4-842d-fb354b741817.png)

## ✅ FEATURES

Here are some features of this blog

- You have the ability to register and login 
- You have the ability to create a blog post
- You have the ability to view all posts.
- You have the ability to submit a comment
- You have the ability to manage comments under your post
- You can see related posts 

## ⚡ INSTALLATION

This project comes with 2 folders.

- Frontend

  The frontend is built with REACTJS 
- Backend
  
  The backend is built with NODEJS, EXPRESS & MONGODB

Navigate to the `/frontend/` folder and create an `.env` file.

In this file, modify the parameter below to reflect the development URL of your backend server

```bash
VITE_BACKEND_URL = http://localhost:5000
```
Navigate to the `/backend/` folder and create an `.env` file.

In this file, modify the parameters below

```bash
CLOUDINARY_URL = YOUR_CLOUDINARY_URL
DB_URL = YOUR_MONGODB_URL
```

Now you have to fireup the **frontend server** with this command 

```bash
$ cd frontend
$ npm run dev
```

Then fireup the **backend server** with this command 

```bash
$ cd backend
$ node index.js
```
## AUTHOR

[Simon Ugorji](https://twitter.com/ugorji_simon)
