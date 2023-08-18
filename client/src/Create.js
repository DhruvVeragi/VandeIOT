import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateChannel.css'


export default function Create() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [field1Enabled, setField1Enabled] = useState(false);
  const [field1Value, setField1Value] = useState('Field 1');
  const [field2Enabled, setField2Enabled] = useState(false);
  const [field2Value, setField2Value] = useState('Field 2');
  const [field3Enabled, setField3Enabled] = useState(false);
  const [field3Value, setField3Value] = useState('Field 3');

  useEffect(() => {
    axios.get(`/verify`, {
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
          setEmail(response.data.email)
        }
        
      })
  }, [])
  

  const handleFieldValueChange = (event, fieldName, setFieldEnabled, setFieldValue, fieldValue) => {
    const newValue = event.target.value;
    if (!setFieldEnabled) {
      setFieldValue(newValue || fieldValue);
    } else {
      setFieldValue(newValue);
    }
  
    
  };
  useEffect(() => {
    if (!field1Enabled) {
      setField1Value('Field 1');
    }
  }, [field1Enabled]);

  useEffect(() => {
    if (!field2Enabled) {
      setField2Value('Field 2');
    }
  }, [field2Enabled]);
  useEffect(() => {
    if (!field3Enabled) {
      setField3Value('Field 3');
    }
  }, [field3Enabled]);

  const handleSubmit = async event => {
    event.preventDefault();
    try {
        await axios.post(`/createChannel`, {
          email, 
          name, 
          description, 
          field1Enabled,
          field1Value,
          field2Enabled,
          field2Value,
          field3Enabled, 
          field3Value,
        });
      } catch (error) {
        console.error('Error submitting form:', error);
      };
      event.target.reset();
      window.location.href = '/channels';
        
  };

  return (
    <>
    <div className="container text-center mt-3">
        <form className="form1" onSubmit={handleSubmit}>
        <p className="create">Create Channel</p>
        <label>
            <input required type="text" class="input"  onChange={event => setName(event.target.value)} />
            <span>Channel Name</span>
        </label>
        <label>
            <textarea required placeholder="" type="text" class="input1" onChange={event => setDescription(event.target.value)} />
            <span>Description:</span>
        </label>
        
        <div>
            <label>
                <input type="text" value={field1Value} className="input2 " onChange={event => handleFieldValueChange(event, 'field1', field1Enabled, setField1Value, 'Field 1 value')} disabled={!field1Enabled} /> 
                {/* <span>Field 1</span>  */}
            </label>
            <label>
                <input type="checkbox" className="input" checked={field1Enabled} onChange={event => setField1Enabled(event.target.checked)} />
            </label>
            <label>
                <input type="text" value={field2Value} className="input2 " onChange={event => handleFieldValueChange(event, 'field2', field2Enabled, setField2Value, 'Field 2 value')} disabled={!field2Enabled} /> 
                {/* <span>Field 2</span>  */}
            </label>
            <label>
                <input type="checkbox" className="input" checked={field2Enabled} onChange={event => setField2Enabled(event.target.checked)} />
            </label>
            <label>
                <input type="text" value={field3Value} className="input2 " onChange={event => handleFieldValueChange(event, 'field3', field3Enabled, setField3Value, 'Field 3 value')} disabled={!field3Enabled} /> 
                {/* <span>Field 3</span>  */}
            </label>
            <label>
                <input type="checkbox" className="input" checked={field3Enabled} onChange={event => setField3Enabled(event.target.checked)} />
            </label>
        </div>
        
        <button className="submit" type="submit">Submit</button>
        </form>
    </div>
    </>
  );
}

