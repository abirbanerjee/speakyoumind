import axios from 'axios';
import React from 'react'
import { useEffect,useState } from 'react';
import './styles.css'

function PostCards({Post}) {
    const [followPosts, setFollowPosts] = useState([]);
    useEffect(
        ()=>{
            axios.get(`http://localhost:3001/posts/${Post}`).then(reply=>{setFollowPosts(reply.data.reverse()); });
        },[]
    )
  return (
    <div>
     <div className='followPosts'>{followPosts.map(post=>(<div><b><a href={`/profile/${post.username}`}>@{post.username}</a></b> on <b>{post.timeStamp.slice(0,10)} {post.timeStamp.slice(11,19)}</b> wrote <br></br>{post.content}</div>))}</div>
    </div>
  )
}

export default PostCards