import React, {useState,useEffect} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {host} from '../APIRoutes';
import '../index.css'
export default function Login() {
    const [username, setUsername] = useState('');
    const [userpass, setUserPass] = useState('');
    useEffect(()=>{
      const token = localStorage.getItem('token');
      if(token !==null || undefined){
        const option = {headers:{token}};
        axios.get(host, option).then(navigate('/userhome'));
      }
    },[])
    const navigate = useNavigate();
    function doLogin(e){
        e.preventDefault();
        axios.post('http://localhost:3001/login', {username:username, password:userpass}).then((reply)=>{
     if(reply.data.status==='ok'){
        localStorage.setItem('token', reply.data.user.token);
        if(reply.data.user.profilePicture === undefined||null)
          navigate('/setprofilepic');
        navigate('/userhome'); 
    }
    else{
      toast.error(reply.data.error);
    }
      });
        }
  return (
    <div className="form"><h2>Login to bubble and see other's bubbles</h2>
    <form onSubmit={(e)=>{doLogin(e)}}>
    <label>Username: </label><input type={'text'} name={'username'} onChange={(e)=>{setUsername(e.target.value)}}></input><br></br>
    <label>Password: </label><input type={'password'} name={'password'} onChange={(e)=>{setUserPass(e.target.value)}}></input><br></br>
    <input type={"submit"} name="submit"></input><br></br>
    </form>
    Don't have an account? <Link to='/register'>Register</Link>
    <ToastContainer />
    </div>
  )
}