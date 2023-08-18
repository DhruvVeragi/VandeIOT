import React from "react";
import { useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import MyChart from "./MyChart";
import Details from "./Details";
import ChannelNav from "./ChannelNav";
    
export default function Channel_view(){
    const { id } = useParams();
    const [data, setData] = useState([]);
    
    useEffect(() => {
    
        axios.get(`http://localhost:5000/search/${id}`)
        .then(res => setData(res.data))
        .catch(err => console.error(err));

    }, []);
    
    // console.log(typeof(data));
    // console.log(data);

    return(
        <>
            <div>
                <Details name={data.name} id={data.c_id}/>
                <ChannelNav view="nav-link active" setting="nav-link" api="nav-link" sharing="nav-link"/>
                <div className="container">
                    <div className="row">
                        <h1>Charts</h1>
                        <div className="col-sm-6">
                            {data.field1Enabled && (
                                <div>
                                <MyChart field="field1" fieldName={data.field1Value}/>
                                </div>
                            )}
                        </div>
                        <div className="col-sm-6">
                            {data.field2Enabled && (
                                <div>
                                <MyChart field="field2" fieldName={data.field2Value}/>
                                </div>
                            )}
                        </div>
                        <div className="col-sm-6">
                            {data.field3Enabled && (
                                <div>
                                    <MyChart field="field3" fieldName={data.field3Value}/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                
            </div>
        </>
    )
}