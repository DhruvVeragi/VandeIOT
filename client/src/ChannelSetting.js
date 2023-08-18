import React from "react";
import { useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import Details from "./Details";
import { Formik, Form, Field } from 'formik';
import Loading from "./Loading";
import ChannelNav from "./ChannelNav";


export default function ChannelSetting(){
    const { id } = useParams();
    const [formData, setFormData] = useState({
        _id:'',
        name: '',
        description: '',
        field1Enabled: false,
        field1Value: '',
        field2Enabled: false,
        field2Value: '',
        field3Enabled: false,
        field3Value: '',
      });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    
    const handleSubmit = async(values) => {
      setIsUpdating(true);
      axios.put(`http://localhost:5000/updateChannel`, values)
        .then(response => {
          console.log('Data updated successfully:', response.data);
        })
        .catch(error => {
          console.error('Error updating data:', error);
        });
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsUpdating(false);
    }

    const handleClear = async () =>{
      
      try {
        setIsClearing(true);
        await axios.get(`http://localhost:5000/clearChannel/${data.c_id}`);
        // window.location.href = '/channels';
        setIsClearing(false);
      } catch (error) {
        console.error('Error updating data:', error);
        // Handle error, e.g., display an error message to the user
      }
      // window.location.href = '/channels';
    }

    const handleDelete = async () => {
      
      try {
        setIsDeleting(true);
        await axios.get(`http://localhost:5000/deleteChannel/${data.c_id}`);
        window.location.href = '/';
        setIsDeleting(false);
      } catch (error) {
        console.error('Error updating data:', error);
        // Handle error, e.g., display an error message to the user
      }
    };
    
    useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try{
      const result = await axios.get(`http://localhost:5000/search/${id}`);
      setData(result.data);
      setFormData(result.data);
      setLoading(false);
    }catch (error){
      console.error('Error fetching data:', error);
    }
    
    };
   
    // console.log(formData);
    return(
        <>
            <div className="container">
                <Details name={data.name} id={data.c_id}/>
                <ChannelNav view="nav-link " setting="nav-link active" api="nav-link" sharing="nav-link"/>
                <div className="container mt-4 mb-4">

                  <h1>Channel Settings </h1>
                  <br></br>
                  {loading ? (
                  <div className="mx-4 my-5"><Loading/></div>) :
                  ( 
                    <div>

                    <Formik
                         initialValues={formData}
                         onSubmit={handleSubmit}
                          >
                         {({ values, handleChange}) => (
                           <Form >
                            
                             <div>
                               <label >Name :</label>
                               <Field type="text"  name="name" />
                             </div>
                            <br/>
                             <div>
                               <label htmlFor="description">Description :</label>
                               <Field type="text" name="description" />
                               
                             </div>
                              <br/>
                             <div>
                               
                               {values.field1Enabled ? (
                                 <>
                                   <label htmlFor="field1Value">Field 1 Value :</label>
                                   <Field type="text"  name="field1Value" />
                                 </>
                               ) : (
                                 <>
                                  <label htmlFor="field1Value">Field 1 Value :</label>
                                  <Field type="text" name="field1Value" value="field 1" disabled />
                                </>
                              )}<span> </span>
                                <label>
                                 <Field type="checkbox"  name="field1Enabled"  />
                               </label>
                             </div>
                             <br/>
                             <div>
                               {values.field2Enabled ? (
                                 <>
                                   <label htmlFor="field2Value">Field 2 Value :</label>
                                   <Field type="text" name="field2Value" />
                                 </>
                               ) : (
                                 <>
                                  <label htmlFor="field2Value">Field 2 Value :</label>
                                  <Field type="text"  name="field2Value" disabled />
                                </>
                              )}
                              <span> </span>
                              <label>
                              <Field type="checkbox"  name="field2Enabled" />
                             </label>
                             </div>
                             <br/>
                             <div>
                               {values.field3Enabled ? (
                                 <>
                                   <label htmlFor="field3Value">Field 3 Value :</label>
                                   <Field type="text" name="field3Value" />
                                 </>
                               ) : (
                                 <>
                                  <label htmlFor="field3Value">Field 3 Value :</label>
                                  <Field type="text" name="field3Value" disabled />
                                </>
                              )}
                              <span> </span>
                              <label>
                                <Field type="checkbox"  name="field3Enabled" />
                               </label>
                             </div>
                             <br/>
                             <button className="btn btn-primary" type="submit">{isUpdating ? 'Updating...' : 'Update'}</button>
                           </Form>
                         )}
                        </Formik>
                    </div>
                  )}
                </div> 
                <div className="container mt-4 mb-4">
                  <h3> Wants to delete all Channel feeds ?</h3>
                  <button className="btn btn-danger" disabled={isClearing} onClick={ handleClear}> {isClearing ? 'Clearinging...' : 'Clear Channel Feeds'}</button>
                </div>
                <div className="container mt-5 mb-4">
                  <h3> Wants to delete this Channel ?</h3>
                  <button className="btn btn-danger" disabled={isDeleting} onClick={ handleDelete}> {isDeleting ? 'Deleting...' : 'Delete Channel'}</button>
                </div>
            </div>
            
        </>
    )
}
