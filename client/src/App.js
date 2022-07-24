import './App.css';
import { Routes, Route } from 'react-router-dom';
import Register from './Register/Register';
import Setprofilepic from './SetProfilePicture/Setprofilepic';
import Login from './Login/Login';
import UserHome from './UserHome/UserHome';
import Bubblers from './Bubblers/Bubblers';
import React from 'react'
import BrowseProfile from './BrowseProfile/BrowseProfile';  
import './index.css'

function App() {
  
  return (
    <div className="App">

      <h1>Speak Your Mind</h1>
    <Routes>
    <Route path='/register' element = {<Register/>}/>
    <Route path = "/setprofilepic" element ={<Setprofilepic/>}/>
    <Route path='/' element={<Login/>}/>
    <Route path='/userhome' element = {<UserHome/>}/>
    <Route path='/allusers' element = {<Bubblers/>}/>
    <Route path='/profile/:userid' element = {<BrowseProfile/>}/>
  </Routes>
  
    </div>
  );
}

export default App;
