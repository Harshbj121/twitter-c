import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useDispatch } from "react-redux";
import './Login.css';

const Login = () => {

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = (event) => {
    event.preventDefault();

    setloading(true);
    const requestData = { email: email, password: password };
    axios.post(`${API_BASE_URL}/auth/login`, requestData)
      .then((result) => {
        if (result) {
          setloading(false);
          console.log(result);
          localStorage.setItem('token', result.data.result.token);
          localStorage.setItem('user', JSON.stringify(result.data.result.user));
          dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.result.user });
          navigate('/')
        }

        setemail('');
        setpassword('');
      })
      .catch((error) => {
        setloading(false);
        Swal.fire({
          icon: 'error',
          title: error
        })
      })
  }
  return (
    <div className=' container login-container ' >
      <div className='d-flex  justify-content-center border align-items-center row shadow'>
        <div className='col-md-5 col-sm-12'>
          <img width={"100%"} src="https://thumbs.dreamstime.com/z/login-text-hanging-ropes-d-illustration-75697943.jpg" alt="" />
        </div>
        <div className='p-4 col-md-7'>
          {
            loading ? <div className="col-md-12">
              <div className="spinner-border text-primary" role="status">
              </div>
            </div> : ''
          }
          <h1 className='fw-bold mb-3'>Log In</h1>
          <form action="" className='d-flex flex-column' onSubmit={(e) => login(e)}>
            <input className='mb-3 p-2' width={"100%"} value={email} onChange={(e) => setemail(e.target.value)} type="text" placeholder='Email' />
            <input className='mb-3 p-2' width={"100%"} value={password} onChange={(e) => setpassword(e.target.value)} type="text" placeholder='Password' />
            <button className='btn btn-dark' type='submit'>Login</button>
          </form>
          <p className='mt-3'>Don't have an account ? <Link to='/register' className='fw-bold fs-5 registerlink'>Register Here</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login;