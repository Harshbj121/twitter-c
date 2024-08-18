import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './Login.css';
import Swal from 'sweetalert2';

const Register = () => {
  const [fullname, setfullname] = useState("");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const register = (event) => {
    event.preventDefault();

    setloading(true);
    const requestData = { fullname: fullname, username: username, email: email, password: password };
    axios.post(`${API_BASE_URL}/auth/register`, requestData)
      .then((result) => {
        if (result) {
          setloading(false);
          Swal.fire({
            icon: 'success',
            title: 'User Registered Successfully'
          })
          navigate('/login');
        }
        setfullname('');
        setusername('');
        setemail('');
        setpassword('');
      })
      .catch((error) => {
        setloading(false);
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: error
        })
      })
  }
  return (
    <div className=' container login-container ' >
      <div className='d-flex  justify-content-center border align-items-center row shadow '>
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
          <h1 className='fw-bold mb-3'>Register</h1>
          <form action="" className='d-flex flex-column' onSubmit={(e) => { register(e) }}>
            <input className='mb-3 p-2' width={"100%"} type="text" value={fullname} onChange={(e) => setfullname(e.target.value)} placeholder='Fullname' />
            <input className='mb-3 p-2' width={"100%"} type="text" value={username} onChange={(e) => setusername(e.target.value)} placeholder='Username' />
            <input className='mb-3 p-2' width={"100%"} type="email" value={email} onChange={(e) => setemail(e.target.value)} placeholder='Email' />
            <input className='mb-3 p-2' width={"100%"} type="text" value={password} onChange={(e) => setpassword(e.target.value)} placeholder='Password' />
            <button className='btn btn-dark' type='submit'>Register</button>
          </form>
          <p className='mt-3'>Already Registered ? <Link to='/login' className='fw-bold fs-5 registerlink'>Login Here</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register