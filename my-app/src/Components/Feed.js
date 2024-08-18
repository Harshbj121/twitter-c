import React, { useEffect, useState } from 'react';
import "./Feed.css";
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import CreatePost from './CreatePost';
import Tweet from './Tweet';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const navigate = useNavigate()
  const [mypost, setMyPost] = useState([])
  const fetchPost = () => {
    const token = localStorage.getItem("token")
    if(!token){
      navigate('/login')
    }
    axios.get(`${API_BASE_URL}/api/allposts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((result) => {
        if (result && result.data && result.data.dbPosts) {
          const posts = result.data.dbPosts.map(post => ({
            ...post,
            formattedTime: formatTime(post.createdAt)
          }));
          setMyPost(posts);
        } else{
          navigate('/login')
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: error
        });
      })
  }

  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const timeDiff = now - postTime;

    // Convert time difference to hours
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));

    if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      if (days <= 7) {
        return `${days} days ago`;
      } else {
        // Format as date (e.g., "Jul 20")
        return postTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }
  }

  useEffect(() => {
    fetchPost()
  }, [])

  return (
    <div style={{ width: "inherit" }} className='border'>
      <CreatePost />
      {mypost.map(item => {
        return (<Tweet key={item._id} _id={item._id} image={item.image} profileImg={`http://localhost:4000/uploads/${item.author.profileImg}`} postUserid={item.author._id} fullname={item.author.fullname} username={item.author.username} time={item.formattedTime} description={item.description} likes={item.likes?.length} comments={item.comments?.length} />)
      })}
    </div>
  )
}

export default Feed