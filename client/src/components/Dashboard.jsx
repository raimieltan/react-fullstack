import React, { useEffect, useState } from "react";
import Tweets from "./Tweets";

const Dashboard = ({ setAuth }) => {
    const [name, setName] = useState("");

    const getProfile = async () => {
        try {
            //fetch api that uses the GET method
            const response = await fetch(
                "http://localhost:8000/profile",
                {
                    method: "GET",
                    //retrieving the token and putting it in the Auth header
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                })
            //parsing the json back to a JS object
            const parseRes = await response.json();
            setName(parseRes.username);

        } catch (error) {
            console.log(error.message)
        }
    }

    const logout = async (e) => {
        e.preventDefault()
        try {
            //removing the token from localstorage
            localStorage.removeItem('token')
            setAuth(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getProfile();
    }, [])
    return (

        <>
            <div className="card" style={{ width: 18 + 'rem' }}>

                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                </div>


            </div>
            <br></br>
            <br></br>
            <Tweets />
            <button onClick={logout} className="btn btn-primary btn-block mb-4">Sign Out</button>
        </>


    )
}
export default Dashboard;