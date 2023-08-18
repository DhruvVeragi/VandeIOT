import ChannelsList from "./ChannelsList";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import Loading from "./Loading";

export default function Channel(){
  const [check, setCheck] = useState(true);
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
            const result = await axios.get(`/count/${user.data.email}`);
            // console.log(result);
            if(result.data.channels>0){
              setCheck(false);
            } 
            setLoading(false);
        };
    fetchData();
  }, []);
    
    return(
        <>
        <div className="container mt-2">
            <div className="row mt-3">
                <div className="col-sm-10">
                    <h1>Channels</h1>
                </div>
                <div className="col-sm-2">
                    <a className="btn btn-primary" href="/create">Create Channel</a>
                </div>
            </div>  
        </div>
        <div className="container mt-2">
            {loading ? (<div className="mx-4 my-5"><Loading/></div>)
            :
              (
               <div> 
                {check ?(<div><h3>No Channels Created, Create One! </h3></div>)
                :
                (<div>
                  <ChannelsList/>
                </div>)}
              </div> 
            )}
        </div>
      </>
    )
}