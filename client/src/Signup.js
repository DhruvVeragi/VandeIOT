import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Axios from 'axios';
// import './signup.css'

export default function SignUp() {
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await axios.post('localhost:5000/signup', { name, email, password });
  //     alert('User registered successfully');
  //   } catch (error) {
  //     console.error(error);
  //     alert('An error occurred');
  //   }
  // };

  const handleGoogle =  ()=>{ 
    window.open(`/auth`, `_self`)
  }

  return (
    

      <div>
        <Formik
            initialValues={{ Name: '', email: '', password: '', confirmPassword: '' }}
            validate={values => {
                const errors = {};
                if (!values.Name) {
                    errors.Name = 'Required';
                } else if (values.Name.length > 20) {
                    errors.Name = 'Must be 20 characters or less';
                }
                if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = 'Invalid email address';
                }
                if (values.password !== values.confirmPassword) {
                    errors.confirmPassword = 'Passwords do not match';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    Axios.post(`/bsignup`, {
                        values
                    })
                        .then(response => {
                            // console.log(response.data.message)
                            if (response.data.message === "User created") {
                                alert("Successfully registered")
                                window.location.href = '/login'
                            }
                            else {
                                alert("email already exist")
                                window.location.href = '/signup'
                            }
                        })
                    setSubmitting(false);
                }, 400);
            }}
        >
            {({ isSubmitting }) => (
                <>
                    <div class="fc container-sm p-5 text-center">
                        <p class="title">Regiter Now</p>
                        
                            <Form class="form">
                            <Field type="text" name="Name" class='input-group' id="username" placeholder="name" />
                            <ErrorMessage name="Name" component="div" />
                            <br></br>
                            <Field type="email" name="email" class='input-group' placeholder="email" />
                            <ErrorMessage name="email" component="div" />
                            <br></br>
                            <Field type="password" name="password" class='input-group' placeholder="password" />
                            <ErrorMessage name="password" component="div" />
                            <br></br>
                            <Field type="password" name="confirmPassword" class='input-group' placeholder="confirmPassword" />
                            <ErrorMessage name="confirmPassword" component="div" />
                            <br></br>
                            <button type="submit" class='sign' disabled={isSubmitting}>
                                Signup
                            </button>
                            </Form>
                     
                        <div class="social-message">
                            <div class="line"></div>
                            <p class="message">Login with social accounts</p>
                            <div class="line"></div>
                        </div>
                        <div class="social-icons">
                            <button aria-label="Log in with Google" onClick={handleGoogle} class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
                                    <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                                </svg>
                            </button>
                            
                        </div>
                        <p class="signup">Already have an account? <span></span>
                            <a rel="noopener noreferrer" href="/login" class="">Login</a>
                        </p>
                    </div>
                </>
            )}
        </Formik>
   
        
       
    </div>
  );
};