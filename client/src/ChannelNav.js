import React from "react";
import { useParams, Link  } from 'react-router-dom';

export default function ChannelNav(props){
    
    const { id } = useParams();

    return(
        <>
            <div className="container text-center mt-2 mb-2">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                    <Link className={props.view} to={`../channel/${id}`}>Channel view</Link>       
                    </li>
                    <li className="nav-item">
                    <Link className={props.setting}  to={`../channel/${id}/setting`}>Channel Setting</Link>
                    </li>
                    <li className="nav-item">
                    <Link className={props.api}  to={`../channel/${id}/api`}>Api Keys</Link>
                    </li>
                    <li className="nav-item">
                    <Link className={props.sharing}  to={`../channel/${id}/sharing`}>sharing </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}