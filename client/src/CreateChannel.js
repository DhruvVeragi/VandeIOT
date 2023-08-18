import React from "react";
import { useState } from 'react';
import Axios from 'axios';
import './CreateChannel.css'

export default function CreateChannel(){
    const [name, setName] = useState("")
    const [description, setDes] = useState("")
    const [field1, setField1] = useState('');
    const [field2, setField2] = useState('');
    const [field3, setField3] = useState('');
    const [enableInput1, setEnableInput1] = useState(false);
    const [enableInput2, setEnableInput2] = useState(false);
    const [enableInput3, setEnableInput3] = useState(false);

   
    const handleSubmit = (e) => {
        e.preventDefault(); 

        Axios.post(`http://localhost:5000/create`, {
            Name:name,
            Description:description,
            Field1:field1,
            Field2:field2,
            Field3:field3,
            enableInput1,
            enableInput2,
            enableInput3
            
        });
        e.target.reset();
        window.location.href = '/channels';
        
    }
   
    return(
        <>
            <div className="container text-center mt-3">
                <form className="form" onSubmit={handleSubmit}>
                    <p className="title">Create Channel</p>
                    <label>
                        <input required placeholder="" type="text" class="input" onChange={(e) => {setName(e.target.value)}} />
                        <span>Channel name</span>
                    </label>
                    <label>
                        <textarea required placeholder="" type="text" class="input1" onChange={(e) => {setDes(e.target.value)}} />
                        <span>Channel Description</span>
                    </label>
                    <div>
                        <label>
                            <input type="text" className="input2 " onChange={(e) => setField1(e.target.value)} disabled={!enableInput1} /> 
                            <span>Field 1</span> 
                        </label>
                        <label>
                            <input type="checkbox" className="input" checked={enableInput1} onChange={(e) => setEnableInput1(e.target.checked)} />
                        </label>
                        <label>
                            <input type="text" className="input2 " onChange={(e) => setField2(e.target.value)} disabled={!enableInput2} /> 
                            <span>Field 2</span> 
                        </label>
                        <label>
                            <input type="checkbox" className="input" checked={enableInput2} onChange={(e) => setEnableInput2(e.target.checked)} />
                        </label>
                        <label>
                            <input type="text" className="input2 " onChange={(e) => setField3(e.target.value)} disabled={!enableInput3} /> 
                            <span>Field 3</span> 
                        </label>
                        <label>
                            <input type="checkbox" className="input" checked={enableInput3} onChange={(e) => setEnableInput3(e.target.checked)} />
                        </label>
                    </div>

                    <button  class="submit">Submit</button>   
                </form>
            </div>
        </>
    )
}