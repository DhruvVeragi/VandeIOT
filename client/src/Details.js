import React from 'react'

export default function Details(props) {
  return (
    <div>
        <div className="container mt-4 mb-5">
            <div className="row">
                <div className="col-sm-6">

                    <h3>Channel Name : {props.name}</h3>
                    <h5>Channel Id : {props.id}</h5>
                    <h5>Author: </h5>
                    <p>Access: not applicable</p>   
                </div>
                <div className="col-sm-6">
                </div>
            </div>
        </div> 
    </div>
  )
}
