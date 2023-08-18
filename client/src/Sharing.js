import React from 'react';
import { useParams, Link  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import Details from "./Details";
import ChannelNav from './ChannelNav';


export default function Sharing() {
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

  return (
    <>
        <div className="container">
            <Details name={data.name} id={data.c_id}/>
            <ChannelNav view="nav-link" setting="nav-link" api="nav-link" sharing="nav-link active"/>
            <h1>This Page is under Maintanance</h1>
        </div>
    </>
  )
}
