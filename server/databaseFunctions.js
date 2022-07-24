require ('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err=>{
    console.log('Connected to mongodb.');
}
);

const db = client.db('speakyourmind');
const userColl = db.collection('users');
const postColl = db.collection('posts');
const checkExisting = async(username, email, phone)=>{
    const founduser = await userColl.findOne({$or:[{username},{email}, {phone}]});
    // console.log(founduser);
    return(founduser)
}
const addUser = async(username, password, f_name, l_name, email, phone)=>{
     await userColl.insertOne({
        username, password, f_name, l_name, email, phone
     })
     return('success');
}

const profPicUpload = async(username, profilePicture)=>{
    const picRes = await userColl.updateOne({username:username}, {$set:{profilePicture:profilePicture }});
    return('success');
}

const addPost = async(username, content)=>{
    const post = await postColl.insertOne({username, content});
    return('Post created');
}

const getAllPost = async(username)=>{
    const posts = await postColl.find({username}).toArray();
    return posts;
}

const delPost = async (postid)=>{
    const id = ObjectId(postid);
    const del = await postColl.deleteOne({_id:id});
    console.log(del);
    return ('deleted');
}

const editPost = async (postid, newpost)=>{
    const id = ObjectId(postid);
    const update = await postColl.updateOne({_id:id},{$set:{content:newpost}});
    console.log(update);
    return ('updated');
}

const allUsers = async()=>{
    const allUsers = await userColl.find().toArray();
    return(allUsers);
}

const findUsers = async(searchString)=>{
    const regular = `/.*${searchString}*./`
    const results = await userColl.find({$or:[{f_name:{$regex:searchString, $options:'i'}},{l_name:{$regex:searchString, $options:'i'}}]}).toArray();
    if(results.length>0){
        results.forEach(result=>{
            delete result.password;
            delete result.email;
            delete result.phone;
        })
    }
    return results;
}
const browseProfile = async(username)=>{
    const user = await userColl.findOne({username});
    delete user.password;
    delete user.email;
    delete user.phone;
    return(user);
}


const followFunct = async(follower, following)=>{
    const followingAdded = await userColl.updateOne({username:follower},{$push:{following}});
    const followerAdded = await userColl.updateOne({username:following}, {$push:{followers:follower}});
    return([followerAdded, followingAdded]);
}


const unFollowFunct = async(follower, following)=>{
    const followingRemoved = await userColl.updateOne({username:follower},{$pull:{following}});
    const followerRemoved = await userColl.updateOne({username:following}, {$pull:{followers:follower}});
    return([followerRemoved, followingRemoved]);
}
module.exports = {
    addUser,checkExisting,profPicUpload,addPost,getAllPost,delPost,editPost,allUsers,findUsers,browseProfile, followFunct, unFollowFunct
}