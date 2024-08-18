import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import "./LeftSideBar.css";
import { useDispatch } from 'react-redux';
import Avatar from 'react-avatar';

const LeftSideBar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user ? user._id : null;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGON_ERROR' });
    navigate('/login')
  }

  return (
    <div className='mx-2 leftmain d-flex flex-column justify-content-between'>
      <div>
        <div>
          <img className='ms-4' width={"24px"} src="https://about.x.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="twitterLogo" />
        </div>
        <div className='mt-3'>
          <NavLink to="/" className='d-flex leftHome mx-2 px-3 p-1 m-2'>
            <FontAwesomeIcon icon={faHome} className='me-2' size='lg' />
            <div>
              Home
            </div>
          </NavLink>
          <NavLink to={`/profile/${id}`} className='d-flex leftHome mx-2 px-3 p-1 m-2'>
            <FontAwesomeIcon icon={faUser} className='me-2' size='lg' />
            <div>Profile</div>
          </NavLink>
          <NavLink onClick={() => { logout() }} className='d-flex leftHome mx-2 px-3 p-1 m-2'>
            <FontAwesomeIcon icon={faRightFromBracket} className='me-2' size='lg' />
            <div>Logout</div>
          </NavLink>
        </div>
      </div>
      <div className='mb-3 mx-2 px-3 p-1 d-flex'>
        <Avatar size="40" round={true} />
        <div>
        </div><div className='d-flex flex-column ms-1'>
          <h6 className='fw-bold mb-0'><NavLink to={`/profile/${user._id}`} >{user.fullname}</NavLink></h6>
          <p className='text-gray-500 text-small ms-1 mb-0'>@{user.username} </p>
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar