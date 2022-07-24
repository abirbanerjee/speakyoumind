import React, {useState,useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import Loading from '../Loading_2.gif';
import PostCards from '../PostCards/PostCards';
export default function UserHome() {
    const host = window.location.hostname;
    const [name, setName] = useState('');
    const [image, setImage] = useState(undefined);
    const [bubbles, setBubbles] = useState([]);
    const [newbubble, setNewbubble] = useState('');
    const [username, setUsername] = useState('');
    const [numofletters, setNumofletters]=useState(0);
    const [followingList, setFollowingList] = useState([]);
    const navigate = useNavigate();
    useEffect(
        ()=>{
            const fetchReply= async()=>{
            const token = localStorage.getItem('token');
            const option = {headers:{token}};
            const reply = await axios.get(`http://${host}:3001`, option);
            setFollowingList(reply.data.user.following);
            setName(`${reply.data.user.f_name} ${reply.data.user.l_name}`);
            setUsername(reply.data.user.username);
            setBubbles(await reply.data.posts.reverse());
            setImage(reply.data.user.profilePicture);            
          }
          fetchReply();
        },[]
        );

    function doLogout(){
        localStorage.clear();
        navigate('/')
    }
    async function deletePost(e){
      const postid = e.target.name;
      axios.post(`http://${host}:3001/delPost`, {postid});
      const token = localStorage.getItem('token');
      const option = {headers:{token}};
      const reply = await axios.get(`http://${host}:3001`, option);
      setBubbles(await reply.data.posts.reverse());
    }

    async function editPost(e){
      const postid = e.target.name;
      const editedPost = prompt('Enter new post', `${e.target.className}` );
      axios.put(`http://${host}:3001/editPost`, {postid, editedPost});
      const token = localStorage.getItem('token');
      const option = {headers:{token}};
      const reply = await axios.get(`http://${host}:3001`, option);
      setBubbles(await reply.data.posts.reverse());

    }

    async function handleNewBubble(){
      axios.post(`http://${host}:3001/createpost`, {user:username, post:newbubble});
      const token = localStorage.getItem('token');
      const option = {headers:{token}};
      const reply = await axios.get(`http://${host}:3001`, option);
      setBubbles(await reply.data.posts.reverse());
      setNewbubble('');
      setNumofletters(0);
    }
  return (
    <div>
    <img src={image} height='80px' alt='Profile'></img>
    {name.length>0?(<h1> Welcome {name}</h1>):(<img src={Loading} alt='Loading animation'></img>)}
    <button onClick={()=>doLogout()}>Logout</button><br></br>
    <Link to={'/allusers'}><h3>See other peoples's bubbles</h3></Link>
    <textarea name='newbubble' rows={10} cols={50} value={newbubble} onChange={(e)=>{setNewbubble(e.target.value); setNumofletters(e.target.value.length)}}/><br></br>
    <label>{200-numofletters}</label>
    {numofletters<=200?(<button onClick={()=>handleNewBubble()}>Bubble</button>):(<button disabled={true}>Bubble</button>)}
    <h3>Your bubbles:</h3>
    {bubbles.length>0? (<div className='bubbleHolder'>{bubbles.map((bubble)=>(<div key={bubble._id} className='bubble'><div className='username'>{bubble.username} </div><br></br><div className='bubbleContent'>{bubble.content}</div> <br></br> <div>Bubbled on {bubble.timeStamp.substr(0,10)} at {bubble.timeStamp.substr(11,8)}</div> <br></br>
    <div className='buttonsDiv'> <button name={bubble._id} onClick={(e)=>{deletePost(e)}}>Delete</button>
    <button name={bubble._id} className={bubble.content} onClick={(e)=>{editPost(e)}}>Edit</button></div></div>))}</div>):(<h1>No bubbles yet</h1>)} 
    {/* <div>{postsCreated.map(Post=>(<PostCards Post={Post}/>))}</div> */}
    <div>
    <h3>Bubbles by people you follow:</h3>
      {followingList!=undefined?(followingList.map(Post=>(<PostCards Post={Post}/>))):(<h4>You are not following anyone</h4>)}</div>
    </div>
  )
}
