/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Avatar from 'react-avatar';
import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import axios from 'axios';

const Tweet = (props) => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(props.likes);
    const [commentText, setCommentText] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    var id = props.postUserid;
    const postId = props._id;

    useEffect(() => {
        // Check if the current user has liked the post when component mounts
        const token = localStorage.getItem('token');
        axios.get(`${API_BASE_URL}/api/checklike/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setLiked(response.data.liked);
            })
            .catch((error) => {
                console.error('Error checking like status:', error);
            });
    }, [postId]); // Dependency array ensures useEffect runs when postId changes

    const handleDelete = () => {
        const token = localStorage.getItem('token')
        axios.delete(`${API_BASE_URL}/api/deletepost/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response.data); // Log success message
                alert('Post Deleted')
                setIsDeleted(true);
            })
            .catch((error) => {
                console.error('Error deleting post:', error);
                alert(error)
                // Handle error, e.g., show error message to user
            });
    };

    if (isDeleted) {
        return null; // If deleted, don't render the component
    }



    const handleLike = async () => {
        const postId = props._id;
        const endpoint = liked ? 'unlike' : 'like'; // Determine whether to like or unlike
        const token = localStorage.getItem('token');
        await axios.put(`${API_BASE_URL}/api/${endpoint}/${postId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setLiked(!liked); // Toggle liked state
                setLikesCount(response.data.likes.length)  // Update likes count based on API response
            })
            .catch((error) => {
                console.error(`Error ${endpoint}ing post:`, error);
                // Handle error, e.g., show error message to user
            });
    }

    const handleCommentSubmit = async () => {
        const token = localStorage.getItem('token');
        console.log(postId)

        //commentText is not empty
        if (!commentText.trim()) {
            alert('Please enter a comment.');
            return;
        }

        //API call to /comment endpoint using Axios
        axios.put(`${API_BASE_URL}/api/comment`, {
            postId: postId,
            commentText: commentText,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                // Handle success response
                console.log('Comment added:', response.data);
                setCommentText(''); // Clear comment text after successful submission
            })
            .catch(error => {
                // Handle error
                console.error('Error adding comment:', error);
            });
    };

    return (
        <div className='border p-4 border-bottom '
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div>
                <div className='d-flex'>
                    <Avatar src={props.profileImg} size="40" round={true} />
                    <div className='ms-2 w-100'>
                        <div className='d-flex justify-content-between '>
                            <div className='d-flex flex-column '>
                                <h6 className='fw-bold mb-0'><NavLink to={`/profile/${id}`} >{props.fullname}</NavLink></h6>
                                <p className='text-gray-500 text-small ms-1 mb-0'>@{props.username} : {props.time}</p>
                            </div>
                            {loggedInUser && loggedInUser._id === props.postUserid && isHovered && (
                                <button type='button' className='deleteButton' onClick={handleDelete}>
                                    <FontAwesomeIcon icon={faTrashCan} size='sm' />
                                </button>
                            )}
                        </div>
                        {props.image && (
                            <div>
                                <img src={`http://localhost:4000/uploads/${props.image}`} alt="postImg" height={'300px'} width={"100%"} />
                            </div>
                        )}
                        <div>
                            <p className='mb-0'>{props.description}</p>
                        </div>
                        <div className='d-flex'>
                            <div className='d-flex align-items-center me-5'>
                                <button type='button' className='likeButton' onClick={handleLike}>
                                    <FontAwesomeIcon icon={faHeart} className='me-2' size='sm' style={{ color: liked ? 'red' : 'gray' }} />
                                </button>
                                <div className=''>{likesCount}</div>
                            </div>

                            <div type="button" data-bs-toggle="modal" data-bs-target={`#exampleModal-${postId}`}>
                                <div className='d-flex align-items-center me-5'>
                                    <div><FontAwesomeIcon icon={faComment} className='me-2' size='sm' /></div>
                                    <div className=''>{props.comments}</div>
                                </div>
                            </div>
                            <div className={`modal fade`} id={`exampleModal-${postId}`} tabIndex="-1" aria-labelledby={`exampleModalLabel-${postId}`} aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id={`exampleModalLabel-${postId}`}>Comment</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <form onSubmit={handleCommentSubmit} >
                                            <div className="d-flex flex-column align-items-center">
                                                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} rows={4}
                                                    style={{ width: '90%', resize: 'none', padding: '5px' }} placeholder="Enter your comment..." />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" className="btn btn-primary">Comment</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>



                            <div className='d-flex align-items-center'>
                                <div><FontAwesomeIcon icon={faRetweet} className='me-2' size='sm' /></div>
                                <div className=''>0</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Tweet