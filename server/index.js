const mongoOps = require('./databaseFunctions');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const cors = require('cors');
const token_secret = process.env.TOKEN_SECRET;

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json({limit:'10mb'}));
app.listen(process.env.PORT,()=>{
    console.log('Listening on server ', process.env.PORT);
});

app.get('/',async(req,res)=>{
   try{ 
    const username = jwt.verify(req.headers.token, token_secret);
    const user = await mongoOps.checkExisting(username);
    delete user.password;

    const posts = await mongoOps.getAllPost(username);
    if(posts.length>0){
    posts.forEach(post=>{
        const timeStamp = post._id.getTimestamp();
        post.timeStamp = timeStamp;
    })}
    return res.send({status:'ok', user,posts});
}
catch(err){
    return res.send(err);
}
})

app.post('/login',async(req,res)=>{
    const {username, password} = req.body;
    const user = await mongoOps.checkExisting(username);
    if(user!=null){
        const passwordCheck = await bcrypt.compare(password, user.password);
        if(passwordCheck){
            delete user.password;
            const usertoken = jwt.sign(username, token_secret);
            user.token = usertoken;
            return res.json({status:'ok',user});
        }
    }
    return res.json({status:'bad', error:'Invalid username or password'});
})

app.post('/register', async(req, res)=>{
    const schema = Joi.object({
        username:Joi.string().alphanum().min(6).max(20).required(),
        password: Joi.string().min(6).max(15).alphanum().required(),
        email:Joi.string().email(),
        phone:Joi.string().pattern(new RegExp('[0-9]')).min(10).max(14).required(),
        f_name:Joi.string().required(),
        l_name:Joi.string().required(),
    })
    const {username, password, f_name, l_name, email, phone} = req.body;
    const checkExisting = await mongoOps.checkExisting(username, email, phone);
    const inputValidation = schema.validate({username,password, email, phone, f_name, l_name});
    if(inputValidation.error!=undefined)
        {
            return res.send(inputValidation.error.message);
        }
    if(checkExisting!==null){
        if(checkExisting.username===username){
            return res.send('Username already exists.');
        }
        else if(checkExisting.email===email){
            return res.send('Email already exists.');
        }
        else{ 
            return res.send('Phone number already exists');
        }
    }
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password, salt);
    const createStatus = await mongoOps.addUser(username, encryptedPassword, f_name, l_name, email, phone);
    const usertoken = jwt.sign(username, token_secret);
    return res.json({status:'ok', usertoken});
})

app.post('/updateProfilePhoto',async(req,res)=>{
    const {profilePicture,username} = req.body;
    mongoOps.profPicUpload(username, profilePicture);
    return res.json({status:'ok'});
})

app.post('/createpost',async(req,res)=>{
    const {user, post} = req.body;
    await mongoOps.addPost(user, post);
    const posts = await mongoOps.getAllPost(user);
    return res.json({status:'posted'});
})

app.post('/delPost', async(req,res)=>{
    const {postid} = req.body;
    await mongoOps.delPost(postid);
    return res.json({status:'deleted'});
})

app.put('/editPost', async(req,res)=>{
    const {postid, editedPost} = req.body;
    await mongoOps.editPost(postid, editedPost);
    return res.json({status:'updated'});
})

app.get('/allusers', async(req,res)=>{
    const allUsers = await mongoOps.allUsers();
    allUsers.forEach(user=>{
        delete user.password;
        delete user.email;
        delete user.phone;
    })
    return res.json(allUsers);
})

app.post('/finduser', async(req,res)=>{
    const {searchString} =req.body;
    const foundUsers = await mongoOps.findUsers(searchString);
    return res.send(foundUsers);
})

app.get('/profile/:userid', async(req,res)=>{
    const {userid} = req.params;
    const reply =await mongoOps.browseProfile(userid);
    return res.send(reply);
})

app.get('/posts/:userid', async(req,res)=>{
    const {userid} = req.params;
    const posts = await mongoOps.getAllPost(userid);
    if(posts.length>0){
    posts.forEach(post=>{
        const timeStamp = post._id.getTimestamp();
        post.timeStamp = timeStamp;
    })}
    return res.send(posts);
})

app.post('/followfunct', async(req, res)=>{
    const{follower, following} = req.body;
    const reply = await mongoOps.followFunct(follower, following);
    return res.send('successful');
})

app.post('/unfollowfunct', async(req, res)=>{
    const{follower, following} = req.body;
    const reply = await mongoOps.unFollowFunct(follower, following);
    return res.send('successful');
})

// mongoOps.checkExisting('abirban', 'when', '988').then(result=>console.log(result));

// mongoOps.addUser('abirb', 'intel', 'Abir', 'Banerjee', 'abir.banerjee@gmail.com', '9836299168').then(result=>console.log(result));