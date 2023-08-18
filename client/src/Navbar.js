// import React from "react";
import axios from "axios";
import React, { useState, useEffect } from 'react'

export default function Navbar(){
  const [message, setMessage] = useState("")
  const [auth, setAuth] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  useEffect(() => {
    axios.get(`/verify`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
      .then(response => {
        // console.log(response)
        // console.log(response.data.message)
        if (response.data.message === 'success') {
          setAuth(true);
          setName(response.data.name)
          setEmail(response.data.email)
        }
        else {
          setMessage(response.data.Message)
        }
      })
  }, [])

  const handleLogout = async () => {
    axios.defaults.withCredentials = true
    axios.get(`/logout`)
      .then(res => {
        console.log(res)
          window.location.reload();
      })
      .catch(err => {
        console.log(err)
      })

    }
    return(
        <>
               <nav class="navbar navbar-expand-lg bg-body-tertiary">
                 <div class="container-fluid">
                    {/* <img className="navbar-brand" src="./brand.png" alt="" height={"60px"} /> */}
                    <p className="navbar-brand">Navbar</p>                   
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarText">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li class="nav-item">
                        <a className="nav-link" href="/channels">Channels</a>
                        </li>
                        <li class="nav-item">
                        <a className="nav-link" href="#">Pricing</a>
                        </li>
                        <li class="nav-item">
                        <a className="nav-link" href="#">About us</a>
                        </li>
                        
                    </ul>
                    {/* {
              auth ? <div><h4>{name}  </h4><button onClick={handleLogout}>Logout
              </button></div> : 
              
              <div><button type="button" className="btn "><a href="/login">Login</a>
              </button></div>
            } */}

                    <span class="navbar-text">
                       {
                        auth ?<div>
                            
                            <button className="btn btn-success" >{name} ({email})</button>
                            <span>  </span>  
                            <a className="btn btn-danger" onClick={handleLogout}>Logout</a>
                        </div>
                        :
                        <div>
                            <a className="btn btn-primary" href="/login" >Login</a>
                        <span>  </span>  
                        <a className="btn btn-primary" href="/signup" >Signup</a>
                        </div>
                        
                       } 
                    </span>
                    </div>
                </div>
                </nav>

        </>
        
    )
};