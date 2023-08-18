import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './Login.css'

const handleGoogle =  ()=>{ 
  window.open('http://localhost:5000/auth', '_self')
}


const Login = () => {
    
  return (
      <div>
          <Formik
              initialValues={{ email: '', password: '' }}
              validate={values => {
                  const errors = {}; if (!values.email) {
                      errors.email = 'Required';
                  } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                  ) {
                      errors.email = 'Invalid email address';
                  }
                  if(!values.password) {
                      errors.password = 'Required';
                  }
                  return errors;
              }}

              onSubmit={(values, { setSubmitting }) => {
                  const logindata = values
                  const username = logindata.email
                  const password = logindata.password
                  console.log(username)

                  setTimeout( async () => {
                      console.log("sent")
                      axios.defaults.withCredentials = true
                      await axios.post(`/blogin`, {
                          username: username,
                          password: password
                      })
                          .then((res) => {
                              // console.log(res.data)
                              if (res.data.Status === 'success') {
                                  window.location.href = '/'
                              }
                              else {
                                  alert("Credentials mismatch")
                                  window.location.reload()
                              }
                          }, (err) => {
                              if (err.response && err.response.status === 401) {
                                  alert("Invalid Credentials");
                                  window.location.href = '/login'
                              } else {
                                  console.error("sorry");
                              }
                          });
                      setSubmitting(false);
                  }, 400);
              }}
          >
              {({ isSubmitting }) => (
                  <>
                  <div className='container'>
                          <div class="fc container p-5 text-center">
                              <p class="title">Login</p>

                              <Form class="form">
                                  
                                  <Field type="email" name="email" class='input-group' placeholder="email" />
                                  <ErrorMessage name="email" component="div" />
                                  <br></br>
                                  <Field type="password" name="password" class='input-group' placeholder="password" />
                                  <ErrorMessage name="password" component="div" />
                                  <br></br>
                                  <button type="submit" class='sign' disabled={isSubmitting}>
                                      Login
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
                              <p class="signup">Don't have an account?
                                  <a rel="noopener noreferrer" href="/signup" class="">Sign up</a>
                              </p>
                              <div class="forgot">
				<a rel="noopener noreferrer" href="#">Forgot Password ?</a>
			</div>
                          </div>
                          
                      </div>
                     
                  </>
              )}
          </Formik>
      </div>);
};

export default Login;
