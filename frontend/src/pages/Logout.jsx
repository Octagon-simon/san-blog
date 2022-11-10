import React from 'react'
import { useToken } from '../useToken'
import { useNavigate } from 'react-router-dom'

export default function () {
    const navigate = useNavigate();
    const { token, destroyToken } = useToken()

    destroyToken()
    //call navigate() in use effect, not when your component is being rendered... Wonderful 
    return React.useEffect(() => {
        console.log(token)
        if (!token) {
            // window.location.href="/home"
            navigate('/home')
        }
    }, [token])
}