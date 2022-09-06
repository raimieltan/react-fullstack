import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    })

    //setting the inputs
    const onChange = e => {    //username     : barney   
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    //deconstructing the username and password variable from the inputs
    const { username, password } = inputs

    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {

            //making a body object from the values of username and password
            const body = { username, password }

            //fetch api for POST method
            const response = await fetch(
                "http://localhost:8000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            )

            const parseRes = await response.json()

            if (parseRes.token) {
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
        <div className="login">
            <h1>Login</h1>

            <form onSubmit={onSubmitForm}>

                <div className="form-outline mb-4">
                    <input 
                    type="text" 
                    id="usernameForm" 
                    name="username" 
                    className="form-control" 
                    value={username} 
                    onChange={e => onChange(e)} />
                    <label className="form-label" for="form2Example1">username</label>
                </div>


                <div className="form-outline mb-4">
                    <input 
                    type="password" 
                    id="passwordForm" 
                    name="password" 
                    className="form-control"
                    value={password} 
                    onChange={e => onChange(e)} />
                    <label className="form-label" for="form2Example2">Password</label>
                </div>


                <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>


            </form>
            <Link to="/register">register</Link>
        </div>
    )
}
export default Login;