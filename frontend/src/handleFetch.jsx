
import React, { useState } from 'react'

export default function useFetch() {
    const [data, setData] = useState(null)
    console.log(data, 'from hook')
    const FetchPost = (url) => {
            fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => setData(data))
    }
    const FetchGet = (url) => {
        //React.useEffect(() => {
            fetch(url, {
                method: "GET",
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                }
            }) 
                .then(res => res.json())
                .then(data => { setData(data)})
        //}, [url])
    }

    return {
        data : data, FetchGet, FetchPost
    }
}