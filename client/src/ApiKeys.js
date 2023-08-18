import React from "react";
import { useParams, Link  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import Details from "./Details";
import ChannelNav from "./ChannelNav";

export default function Apikeys(){
    const { id } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData(); // Fetch initial data when the component mounts
     }, []);
    
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/search/${id}`);
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
     };

    // Function to update the write API key
    const handleWriteAPIKey = async () => {
    try {
      axios.post(`http://localhost:5000/updateWriteapi/${data._id}`);
    } catch (error) {
      console.error('Error updating write API key:', error);
    }
    await new Promise(resolve => setTimeout(resolve, 600)); 
    fetchData(); 
  };
  
  // Function to update the read API key
  const handleReadAPIKey = async () => {
    try {
      axios.post(`http://localhost:5000/updateReadapi/${data._id}`); 
    } catch (error) {
      console.error('Error updating read API key:', error);
    }
    await new Promise(resolve => setTimeout(resolve, 600)); 
    fetchData();
  };
  

    return(
        <>

            <div className="container">
                <Details name={data.name} id={data.c_id}/>
                <ChannelNav view="nav-link " setting="nav-link " api="nav-link active" sharing="nav-link"/>
                <div className="container mt-4">
                    <div className="row mt-5">
                        <div className="col-sm-5 ">
                            <div className="mt-2 mb-3">
                                <h5>Write API Key</h5>
                            </div>
                            <div className="container text-center">
                                <div className="input-group flex-nowrap">
                                    <span className="input-group-text" id="addon-wrapping"> Key </span>
                                    <input type="text" className="form-control" id="write-api"  value={data.writeapiKey} aria-label="Disabled input example" disabled readonly/>
                                </div>
                                <br/>
                                <button type="submit" onClick={handleWriteAPIKey} className="btn btn-success ">Generate New Write API Key</button>    
                            </div>
                            <br/>
                            <div className="container  ">
                                <div className="mt-2 mb-3">
                                    <h5>Read API Key</h5>
                                </div>
                                <div className="container text-center">
                                    <div className="input-group flex-nowrap">
                                        <span className="input-group-text" id="addon-wrapping"> Key </span>
                                        <input type="text" className="form-control" id="write-api"  value={data.readapiKey} aria-label="Disabled input example" disabled readonly/>
                                    </div>
                                    <br/>
                                    <button type="submit" onClick={handleReadAPIKey} className="btn btn-warning ">Generate New Read API Key</button>
                                </div>
                            </div>     
                        </div>
                        <div class="col-sm-7">
                            <div class="container">
                                <h5>Help</h5>
                                <p>API keys enable you to write data to a channel or read data from a private channel. API keys are auto-generated when you create a new channel.</p>
                            </div>
                            <br/><br/><br/>
                            <div class="container">
                                <h5>API Requests</h5>
                                <div class="container mt-4">
                                    <div class="mb-3">
                                        <label for="basic-url" class="form-label">Write a Channel Feed</label>
                                        <div class="input-group">
                                            <span class="input-group-text" id="basic-addon3">GET</span>
                                            <input type="text" class="form-control" id="write-api" value={`localhost:5000/update?id=${data.c_id}&api_key=${data.writeapiKey}&field1=`}  aria-label="Disabled input example" disabled readonly/>
                                            {/* <button onclick="copyWriteApi()" tabindex="0" class="btn btn-primary" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="Copied"><i  class=" mx-2 my-2 bi bi-clipboard"></i></button> */}
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="basic-url" class="form-label">Read all Channel Feed</label>
                                        <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3">GET</span>
                                        <input type="text" class="form-control" id="read-api"  value={ `localhost:5000/channels/${data.c_id}/feeds?api_key=${data.readapiKey}`} aria-label="Disabled input example" disabled readonly/>
                                        {/* <button onclick="copyReadApi()" tabindex="0" class="btn btn-primary" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="Copied"><i  class=" mx-2 my-2 bi bi-clipboard"></i></button> */}
                                        </div>
                                    </div>
                                </div>                   
                            </div>
                        </div>
                    </div>    
                </div> 
            </div>
        </>
    )
}