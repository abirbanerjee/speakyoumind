import React, {useState} from "react";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Link, useNavigate} from "react-router-dom";
const axios = require('axios');
const toastOptions={
    position:"bottom-right",
    autoClose:8000,
    pauseOnHover: true,
};
export default function Register(){
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPasword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    function handleSubmit(e){
        e.preventDefault();
        const options = {
            f_name:firstName,
            l_name:lastName,
            username,
            password,
            email,
            phone
        }
        axios.post('http://localhost:3001/register', options).then(reply=>{
        if(reply.data.status==='ok'){    
         localStorage.setItem('token', reply.data.usertoken);navigate('/setprofilepic');
    }
    else{
        toast.error(reply.data,toastOptions);
    }
    }
        
    );
    }
    
    return(
        <div>
        <form onSubmit={(e)=>handleSubmit(e)}>
            <label>First name:</label>
            <input type={"text"} name="f_name" placeholder="First Name" onChange={(e)=>{setFirstName(e.target.value)}}></input><br></br>
            <label>Last name:</label>
            <input type={"text"} name="l_name" placeholder="Last Name" onChange={(e)=>{setLastName(e.target.value)}}></input><br></br>
            <label>Username:</label>
            <input type={"text"} name="username" placeholder="username" onChange={(e)=>{setUsername(e.target.value)}}></input><br></br>
            <label>Password:</label>
            <input type={"password"} name="password" placeholder="password" onChange={(e)=>{setPasword(e.target.value)}}></input><br></br>
            <label>E-mail id:</label>
            <input type={"email"} name="email" placeholder="E-Mail address" onChange={(e)=>{setEmail(e.target.value)}}></input><br></br>
            <label>Phone number:</label>
            <input type={"text"} name="phone" placeholder="Phone" onChange={(e)=>{setPhone(e.target.value)}}></input><br></br>
            <input type={"submit"}></input>
        </form>
        Already have an Account?<Link to={'/'}>Login</Link>
        <ToastContainer />
        </div>
    )
}

