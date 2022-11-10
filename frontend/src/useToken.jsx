import { useState } from 'react';
//not a recommended way to authenticate a user. learn more about JWT and ask sir emma
export function useToken() {

    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken || ''
    };

    //by default it should fetch the already existing token
    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken));
        //set the [token] value
        setToken(userToken);
    };

    const destroyToken = () => {
        localStorage.removeItem("token")
    };

    return {
        token : token || getToken(),
        setToken: saveToken,
        destroyToken: destroyToken
    }
}
