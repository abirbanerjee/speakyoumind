import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
export default function Setprofilepic() {
  const host = window.location.hostname;
  const [profilePic, setProfilePic] = useState([]);
  const [username, setUsername] = useState('');
  const navigate= useNavigate();
    const token = localStorage.getItem('token');
    if(token===null||undefined)
      navigate('/');
    const options = {
      headers:{
        token
      }
    }
    axios.get(`http://${host}:3001/`,options).then(reply=>{
      setUsername(reply.data.user.username);
    });
  function setPic(){
    const reader = new FileReader();
    reader.onload = (e)=>{
      const pic = e.target.result;
      axios.post(`http://${host}:3001/updateProfilePhoto`,{profilePicture:pic, username});      
    }
      reader.readAsDataURL(profilePic);
      navigate('/userhome');
  }
  return (
    <div>
        <h2>Upload profile photo</h2>
        <input type={'file'} name='profilephoto' accept='images' multiple={false} onChange={(e)=>setProfilePic(e.target.files[0])}></input>
        <button name='upload' onClick={()=>setPic()}>Upload</button>
    </div>
  )
}