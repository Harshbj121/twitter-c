import React from 'react'
import RightSideBar from './RightSideBar'
import LeftSideBar from './LeftSideBar';
import { Outlet } from 'react-router-dom';
import "./Home.css";

const Home = () => {
  return (
    <div className='d-flex justify-content-between mx-auto home' >
      <div className='leftSidebar'>
        <LeftSideBar />
      </div>
      <div className='tweets'>
        <Outlet />
      </div>
      <div className='rightSideBar'>
        <RightSideBar />
      </div>
    </div>
  )
}

export default Home