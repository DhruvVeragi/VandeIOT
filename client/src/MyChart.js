import React from "react";
import { useParams, Link  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Chart } from 'react-google-charts';
import Loading from "./Loading";

export default function MyChart(props){
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
    
        axios.get(`http://localhost:5000/chart?id=${id}&field=${props.field}`)
        .then(res => setData(res.data))
        .catch(err => console.error(err));
        setLoading(false);
    }, []);

    

    function getChartData() {
        const chartData = [['Time', props.fieldName]];
       
        data.forEach((item) => {
          const createdAt = new Date(item.createdAt);
        //   console.log(createdAt);
          const value = parseFloat(item.value); // or parseInt(item.value)
          chartData.push([createdAt, value]);
        });
       
        return chartData;
        
      }
      
      
      

    return(
        <>
            <div className="card mt-3 mb-5">
                <div class="card-header text-center">
                    <h5>Chart for {props.field} </h5>
                </div>
                { loading ? (
                <div className="mx-4 my-5"><Loading/></div>
                    ) :(  
                        <div>
                            {data.length === 0 ? (
                                <div className="text-center">No data available</div>
                            ) : (
                            
                                <Chart
                                chartType="LineChart"
                                data={getChartData()}
                                options={{
                                    title: `${props.fieldName} vs Date Chart`,
                                    hAxis: {
                                    title: 'Date',
                                    format: 'd MMM, h:mm',
                                    },
                                    vAxis: { title: props.fieldName },
                                }}
                                width="auto"
                                height="300px"
                                />
                            )}
                        </div>
                    )
                }
            </div>
        </>
    )
}