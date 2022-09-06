import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    })

    const onChange = e => {    //username     : barney   
        setInputs({...inputs, [e.target.name] : e.target.value})
    }

    const { username, password } = inputs

    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            const body = {username, password}

            const response = await fetch(
                "http://localhost:8000/register",
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            )
            
            const parseRes = await response.json()

            if(parseRes.token) {
                //localstorage
                localStorage.setItem("token", parseRes.token)
                setAuth(true)
            } else {
                setAuth(false)
                console.log("Something wrong")
            }
 
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={onSubmitForm}>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={e => onChange(e)} />
                <input
                    type="text"
                    name="password"
                    value={password}
                    onChange={e => onChange(e)} />

                <button>Submit</button>
            </form>
            <Link to="/login">Login</Link>
        </div>
    )
}
export default Register;