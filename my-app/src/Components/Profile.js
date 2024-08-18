import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import "./Profile.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Tweet from './Tweet';


const Profile = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [post, setPost] = useState([]);
  const [dateofbirth, setDateofbirth] = useState('');
  const [Location, setLocation] = useState('');
  const [Fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [Follower, setFollower] = useState('');
  const [Following, setFollowing] = useState('');
  const [doj, setDoj] = useState('')
  const [profileImg, setProfileImg] = useState('');
  const [userId, setUserId] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  // Update Profile data 
  const [file, setFile] = useState(null);
  const [newFullname, setnewFullname] = useState('');
  const [newLocation, setnewLocation] = useState('');
  const [newDateOfBirth, setnewDateOfBirth] = useState('');
  const FetchPost = async () => {
    const token = localStorage.getItem("token");
    if(!token){
      navigate('/login')
    }
    const user = JSON.parse(localStorage.getItem("user"))
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { post, user: profileUser, doB } = response.data;
      console.log(profileUser)
      setPost(post);
      setProfileImg(`http://localhost:4000/uploads/${profileUser.profileImg}`);
      setFullname(profileUser.fullname);
      setFullname(profileUser.fullname);
      setFullname(profileUser.fullname);
      setUsername(profileUser.username);
      setLocation(profileUser.location);
      setFollower(profileUser.followers.length)
      setFollowing(profileUser.following.length)
      setDateofbirth(doB);
      setDoj(profileUser.createdAt);
      setUserId(profileUser._id);
      setLoggedInUser(profileUser.username === user.username);
      setIsFollowing(user.following.includes(profileUser._id));
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: error
      });
    }
  }

  const updateProfile = () => {
    const data = {};
    if (newFullname !== '') {
      data.fullname = newFullname;
    }
    if (newLocation !== '') {
      data.location = newLocation;
    }
    if (newDateOfBirth !== '') {
      const dob = new Date(newDateOfBirth);
      data.dob = dob.toISOString(); // Format date as ISO string before sending
    }
    const token = localStorage.getItem('token');
    const id = JSON.parse(localStorage.getItem('user'))._id;
    axios.put(`${API_BASE_URL}/auth/profile/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((result) => {
      Swal.fire({
        icon: 'success',
        title: "User info updated"
      })
    }).catch((error) => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Some error occured please '
      })
    })
  }

  // Update Profile Photo
  const updateProfileImg = async (e) => {
    const token = localStorage.getItem('token');
    const id = JSON.parse(localStorage.getItem('user'))._id;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/file/uploadFile/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Upload response:', response.data);
      // Handle success: update state or show message
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error: show error message to user
    }
  };


  useEffect(() => {
    FetchPost()
  }, [id])


  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem("user"))

    try {
      await axios.put(
        `${API_BASE_URL}/api/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User Followed")
      setIsFollowing(true);

      const updatedUser = { ...user };
      updatedUser.following.push(userId); // Add the followed user ID to following list
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage

    } catch (error) {
      console.error('Error following user:', error);
      // Handle error, e.g., show error message to user
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem("user"))

    try {
      await axios.put(
        `${API_BASE_URL}/api/unfollow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User Unfollowed")
      setIsFollowing(false);

      const updatedUser = { ...user };
      updatedUser.following = updatedUser.following.filter(id => id !== userId); // Remove the unfollowed user ID from following list
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage

    } catch (error) {
      console.error('Error unfollowing user:', error);
      // Handle error, e.g., show error message to user
    }
  };

  useEffect(() => {
    FetchPost(); // Fetch initial profile data
  }, [isFollowing]);

  return (
    <div className='border tweetbody' >
      <div>
        <Link to="/">
          <FontAwesomeIcon icon={faArrowLeft} className='me-2' size='lg' />
        </Link>
      </div>
      <div>
        <img className='img-fluid profilebg' src="https://img.freepik.com/free-photo/social-media-background-twitte_135149-69.jpg" alt="profilebg" />
        <div className='position-relative ms-4'>
          <img className='card-profile-pic' src={profileImg} alt="post" />
          <div>
            {loggedInUser ? ( // Show Edit Profile button if current user is the profile owner
              <> <div className='float-end mt-2 me-2'>
                <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  Edit Profile
                </button>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Profile</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <form onSubmit={updateProfile}>
                        <div className="modal-body">
                          <label htmlFor="fullname">Fullname</label>
                          <input type="text" id='fullname' className='col-12' value={newFullname} onChange={(e) => { setnewFullname(e.target.value) }} />
                          <label htmlFor="location">Location</label>
                          <input type="text" id='location' className='col-12' value={newLocation} onChange={(e) => { setnewLocation(e.target.value) }} />
                          <label htmlFor="date">Date Of Birth</label>
                          <input type="date" id='date' className='col-12' value={newDateOfBirth} onChange={(e) => { setnewDateOfBirth(e.target.value) }} />
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="submit" className="btn btn-primary">Save changes</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
                <div className='float-end mt-2 me-1'>
                  <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                    Edit Profile Photo
                  </button>
                  <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5" id="exampleModalLabel">Update Profile Pic</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={updateProfileImg}>
                          <div className="modal-body">
                            <p className="p-2 mb-2 note" >Note : The image should be square in shape.</p>
                            <input type="file" className='col-12' onChange={e => { setFile(e.target.files[0]) }} />
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary">Save changes</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </>) : (
              <div className='float-end mt-2 me-3'>
                {isFollowing ? (
                  <button type="button" className="btn btn-secondary" onClick={handleUnfollow}>Unfollow</button>
                ) : (
                  <button type="button" className="btn btn-secondary" onClick={handleFollow}>Follow</button>
                )}
              </div>)}
          </div>
        </div>
        <div className='ms-4'>
          <h4 className='mb-0 fw-bold'>{Fullname}</h4>
          <p className='pb-0 mb-0'>@{username}</p>
          <div className='d-flex'>
            <div className='me-5'><FontAwesomeIcon icon={faCalendarDays} size='sm' /> {dateofbirth}</div>
            <div><FontAwesomeIcon icon={faLocationDot} size='sm' /> {Location}</div>
          </div>
          <div>Date of joined : {doj} </div>
          <div className='d-flex fw-bold mt-1'>
            <div className='me-5'>Followers {Follower}</div>
            <div>Following {Following}</div>
          </div>
        </div>
      </div>
      <h5 >Tweets And Reply</h5>
      {post.map((item) => {
        return (<Tweet key={item._id} _id={item._id} profileImg={profileImg} postUserid={item.author._id} fullname={item.author.fullname} username={username} time={item.createdAt} description={item.description} likes={item.likes?.length} comments={item.comments?.length} />)
      })}
    </div>

  )
}

export default Profile