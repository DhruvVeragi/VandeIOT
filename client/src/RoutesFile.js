import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import Navbar from './Navbar';
import Channel from './channel';
import Home from './Home';
import Channel_view from './Channel_view';
import ChannelSetting from './ChannelSetting';
import Apikeys from './ApiKeys';
import Create from './Create';
import Sharing from './Sharing';
import SignupUser from './SignupUser';
import Login from './Login';
import SignUp from "./Signup";



export default function RoutesFile() {

  const [message, setMessage] = useState("");
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
    useEffect(() => {
      axios.get(`http://localhost:5000/verify`, {
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
    }, []);

  return (
    <>
        <BrowserRouter>
            <Navbar name={name} email={email} auth={auth}/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/channels" element={<Channel />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create" element={<Create />} /> 
                    <Route path="/channel/:id" element={<Channel_view/>} />
                    <Route path="/channel/:id/setting" element={<ChannelSetting/>} />
                    <Route path="/channel/:id/api" element={<Apikeys/>} />
                    <Route path="/channel/:id/sharing" element={<Sharing/>} />

                </Routes>
        </BrowserRouter>
    </>
  )
}
