import React, { useState } from 'react';
import './CreatePost.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { API_BASE_URL } from '../config';
import axios from 'axios';

const CreatePost = () => {
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);

    const createTweet = async (event) => {

        const user = localStorage.getItem('user')
        const token = localStorage.getItem("token")

        const formData = new FormData();
        if(desc === ''){
            alert("Write something to tweet")
        }
        formData.append('description', desc);
        formData.append('user', user);
        if (file) {
            formData.append('image', file);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/file/createtweet`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Tweet Created Successfully")
            console.log("Tweet created successfully:", response.data);
            // Optionally clear form fields or close modal
        } catch (error) {
            console.error("Error creating tweet:", error);
        }
    }

    const openFileInput = () => {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click(); //file input click
        }
    }

    return (
        <div className='d-flex justify-content-between  pb-2 p-4 border-bottom'>
            <div className='fw-bold'>Home</div>
            <button type="button" className="btn btn-primary post" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Tweet
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">New Tweet</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={(e) => { createTweet(e) }}>
                            <div className="modal-body">
                                <textarea id="w3review" name="w3review" rows="4" cols="60" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='Write Your Tweet' className='p-1'></textarea>
                                <FontAwesomeIcon icon={faImage} className='me-1' size='sm' onClick={openFileInput} style={{ cursor: 'pointer' }} />
                                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={e => { setFile(e.target.files[0]) }} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Tweet</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost