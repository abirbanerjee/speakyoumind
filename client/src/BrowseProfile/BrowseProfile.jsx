import axios from 'axios';
import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


function BrowseProfile() {
  const {userid} = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [profile, setProfile] = useState({});
  const [bubbles, setBubbles] = useState([]);
  const [search, setSeacrh] = useState('');
  const [followList, setFollowList] = useState([]);
  const[followUnfollow, setFollowUnfollow] =useState('');
  const host = window.location.hostname;
   useEffect(
    ()=>
    {  
      const fetchReply= async()=>{
        const token = localStorage.getItem('token');
        if(token ===undefined||token == null){
          navigate('/');
        }
        const option = {headers:{token}};
        const reply = await axios.get(`http://${host}:3001/`, option);
        setCurrentUser(await reply.data.user);
        setFollowList(await reply.data.user.following);
        if (followList.indexof(profile.username)===-1){
          setFollowUnfollow('Follow');
        }
        else{
          setFollowUnfollow('Unfollow');
        }
        };
        
      fetchReply();
      
      axios.get(`http://${host}:3001/profile/${userid}`).then(reply=>{setProfile(reply.data);});
      axios.get(`http://${host}:3001/posts/${userid}`).then(reply=>{setBubbles(reply.data.reverse());});
    },[]
    
  ) 

  function doLogout(){
    localStorage.clear();
    navigate('/')
}

async function doFollow(e){
  const follower = currentUser.username;
  const following = profile.username;
  await axios.post(`http://${host}:3001/followfunct`, {follower, following});
}

async function doUnFollow(e){
  const follower = currentUser.username;
  const following = profile.username;
  await axios.post(`http://${host}:3001/unfollowfunct`, {follower, following});
}


  return (
    <div>
        <img src = {currentUser.profilePicture} width='40px'></img>
        <h3>{currentUser.username}</h3>
        <button onClick={()=>doLogout()}>Logout</button><br></br>
        <a href='/'>Home</a>
        <h2>Bubbles by {profile.f_name} {profile.l_name} </h2>
        <img height='40px' src = {profile.profilePicture}/><br></br>
        {(followList.indexOf(profile.username)===-1)?(<button name={profile.username} onClick={(e)=>{doFollow(e); window.location.reload()}}>Follow</button>):(<button name={profile.username} onClick={(e)=>{doUnFollow(e); window.location.reload();}}>Following</button>)}
        Search bubbles: <input type='text' onChange={(e)=>{setSeacrh(e.target.value)}}/>
        {bubbles.length>0? (<div className='bubbleHolder'>{
        bubbles.filter((bubble)=>{
          if(search===''){
            return bubble;
          }
          else if(bubble.content.toLowerCase().includes(search.toLowerCase())){
            return bubble;
          }
        }).map((bubble)=>(<div key={bubble._id} className='bubble'><div className='username'>{bubble.username} </div><br></br><div className='bubbleContent'>{bubble.content}</div> <br></br> <div>Bubbled on {bubble.timeStamp.substr(0,10)} at {bubble.timeStamp.substr(11,8)}</div> <br></br></div>))}</div>):(<h1>No bubbles yet</h1>)}  
    </div>
  )
}

export default BrowseProfile;