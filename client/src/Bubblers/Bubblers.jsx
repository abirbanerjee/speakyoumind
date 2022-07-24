import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './styles.css';
import {useNavigate} from 'react-router-dom';
export default function Bubblers() {
const [user, setUser] = useState({});
const [userList, setUserList] = useState([]);
const [searchString, setSearchString] = useState('');
const [followList, setFollowList] = useState([]);
const host = window.location.hostname;
const navigate = useNavigate(); 
const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);
useEffect(
    ()=>{
        const fetchReply= async()=>{
        const token = localStorage.getItem('token');
        if(token == null)
         navigate('/');
        const option = {headers:{token}};
        const reply = await axios.get(`http://${host}:3001`, option);
        const currentuser = reply.data.user.username;
        setUser(reply.data.user);
        if(reply.data.user.following!==undefined){
          setFollowList(reply.data.user.following);
        }
        const replyusers = await axios.get(`http://${host}:3001/allusers`);
        for (let i =0;i<replyusers.data.length;i++){          
          if(replyusers.data[i].username===currentuser){
            replyusers.data.splice(i,1);
          }
        }
        setUserList(replyusers.data);
        };
        fetchReply();
      },[]);

      function doLogout(){
        localStorage.clear();
        navigate('/')
    }

    async function doFollow(e){
      const follower = user.username;
      const following = e.target.name;
      await axios.post(`http://${host}:3001/followfunct`, {follower, following});
    }

    async function doUnFollow(e){
      const follower = user.username;
      const following = e.target.name;
      await axios.post(`http://${host}:3001/unfollowfunct`, {follower, following});
    }

    async function refreshUser(){
       const token = localStorage.getItem('token');
        const option = {headers:{token}};
        const reply = await axios.get(`http://${host}:3001`, option);
        setUser(reply.data.user);
        const currentuser = user.username;
        const replyusers = await axios.get(`http://${host}:3001/allusers`);
        for (let i =0;i<replyusers.data.length;i++){          
          if(replyusers.data[i].username===currentuser){
            replyusers.data.splice(i,1);
          }
        }
        setUserList(replyusers.data);
    }
  return (
    <div>
        Logged in as: {user.f_name} {user.l_name} <br></br>
        <button onClick={()=>doLogout()}>Logout</button><br></br>
        <div className='searchbar'>
          <input type='text' onChange={(e)=>{setSearchString(e.target.value)}}></input>
        </div>
        <div className='allusers'>
            {/* {userList.length>0?
            (<div className='bubblerHolder'>{userList.map((bubbler)=>
            (<a href={`/profile/${bubbler.username}`}><div className='bubbler' key={bubbler._id}>{bubbler.f_name} {bubbler.l_name}<img src={bubbler.profilePicture} alt='profile'  height='80px'></img></div></a>)
            )}</div>):(<div>Loading users</div>)} */}
            {
              userList.filter((val)=>{
                if(searchString===''){
                 return val;
                }
                else if(val.f_name.toLowerCase().includes(searchString.toLowerCase())){
                  return val;
                }
              }).map((val,key)=>(<div className='bubbler' key={key}>{val.f_name} {val.l_name}<br></br><a href={`/profile/${val.username}`}>@{val.username}</a>{followList.indexOf(val.username)===-1?(<button name={val.username} onClick={(e)=>{doFollow(e); delay(1000); refreshUser();}}>Follow</button>):(<button name={val.username} onClick={(e)=>{doUnFollow(e); delay(1000);refreshUser();}}>Following</button>)}<img src={val.profilePicture} height='60px'/></div>))
            }
        </div>
    </div>
  )
}
