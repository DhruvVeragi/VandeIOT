import React from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from "./Loading";

export default function ChannelsList(){
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            const user = await  axios.get(`/verify`, {
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      withCredentials: true
                    });
            const result = await axios.get(`/user/${user.data.email}`);
            setData(result.data);
            setLoading(false);
        };
    fetchData();
  }, []);
    
    return(
        <>  
            <div className="container ">
            {loading ? (
            <div className="mx-4 my-5"><Loading/></div>) :
            (          
                <div>   
                {data.map((x, index) => (
                        <div class="container ">
                        <div class="card mb-2">
                            <div class="card-header">
                                Channel {index+1}
                            </div>
                            <div class="row">
                                <div class="col-sm-10">
                                    <div class="card-body">
                                        <h5 class="card-title">{x.name}</h5>
                                        <p class="card-text">{x.description}</p>
                                    </div>
                                </div>
                                <div class="col-sm-2">
                                    <div class="card-body">
                                        <br/>
                                        <Link class=" btn btn-primary"  to={`/channel/${x.c_id}`}>View Details</Link>

                                    </div>
                                </div>
                            </div>  
                        </div>
                        </div>
                    ))}
            
                </div>
            )}
            </div> 
        </>
    )
}