import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Feed from './Feed';
import Profile from './Profile';
import Register from './Register';


const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path:'/',
      element:<Home/>,
      children:[
        {
          path:'/',
          element:<Feed/>
        },{
          path:'/profile/:id',
          element:<Profile/>
        },
    ]
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/register',
      element:<Register/>
    },
    {
      path:'/',
      element:<Home/>
    }
  ])
  return (
    <div>
      <RouterProvider router={appRouter}/>
    </div>
  )
}

export default Body