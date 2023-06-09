import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import { useParams } from 'react-router-dom'

const follow_unfollow_btn = {
    padding: "5px 100px",
    color: "white",
    backgroundColor: "#0d9cb9",
    border: "none"
}

const Profile = () => {
    const [userProfile,setProfile] = useState(null)
    
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    //console.log("profilr",state)
    //console.log(userid);
    useEffect(()=>{
        fetch(`https://instaclone98.onrender.com/user/${userid}`,{
             headers:{
                 "Authorization":"Bearer " + localStorage.getItem("jwt")
             }
         }).then(res=>res.json())
         .then(result =>{
            //console.log("usrProfile",result);
            setProfile(result)
         })
     },[])


     const followUser = () => {
         fetch('https://instaclone98.onrender.com/follow',{
             method:"put",
             headers:{
                 "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })

         }).then(res=>res.json())
         .then(data=>{
            console.log("data",data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
         })
     }
     const unfollowUser = () => {
         fetch('https://instaclone98.onrender.com/unfollow',{
             method:"put",
             headers:{
                 "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })

         }).then(res=>res.json())
         .then(data=>{
            console.log("data",data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item!== data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
         })
     }

    return (
        <>
        {userProfile ? <div style={{maxWidth:"700px",margin:"0px auto"}}>
            <div className='p-2' style={{
                display:"flex", justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid gray"
            }}>
                <div>
                    <img style={{width:160,height:160,borderRadius:80}} src={userProfile.user.pic}/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h6>{userProfile.user.email}</h6>
                    <div style={{display:"flex",justifyContent:"space-between",width:"109%"}}>
                        <h6>{userProfile.posts.length} Posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length}following </h6>
                    </div>
                    {
                        showfollow ? <button style={follow_unfollow_btn} onClick={()=>followUser()}>follow</button> : <button style={follow_unfollow_btn} onClick={()=>unfollowUser()}>Unfollow</button>
                    }
                    
                </div>
            
            </div>
            <div className='gallery'>
                {
                    userProfile.posts.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div> : <h2>loading...</h2>}
        
        </>
    )
}

export default Profile
