import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () => {
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
    console.log("profilr",state)
    useEffect(()=>{
        fetch('https://instaclone98.onrender.com/mypost',{
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result =>{
            setPics(result.mypost)
        })
    },[])

    useEffect(()=>{
        if(image){
            const data = new FormData
            data.append("file",image)
            data.append("upload_preset","insta-clone")
            data.append("cloud_name","tpsmern")
            fetch("https://api.cloudinary.com/v1_1/tpsmern/image/upload",{
                method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
                //setUrl(data.url)
                //console.log("image-update",data)
                // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                // dispatch({type:"UPDATEPIC",payload:data.url})
                fetch('https://instaclone98.onrender.com/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result =>{
                    //console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                    //window.location.reload()
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[image])
    const updatePhoto = (file) => {
        setImage(file)
    }

    return (
        <div style={{maxWidth:"700px",margin:"0px auto"}}>
            <div className='p-2' style={{
                display:"flex", justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid gray"
            }}>
                <div>
                    <img style={{width:160,height:160,borderRadius:80}} src={state?state.pic:"loading"}/>
                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <h6>{state?state.email:"loading"}</h6>
                    <div style={{display:"flex",justifyContent:"space-between",width:"109%"}}>
                        <h6>{mypics.length} Posts</h6>
                        <h6>{state?state.followers.length:"0"} followers</h6>
                        <h6>{state?state.following.length:"0"} following </h6>
                    </div>
                    <input type="file" className='btn btn-info' onChange={(e)=>updatePhoto(e.target.files[0])}/>
                </div>
            </div>
            <div className='gallery'>
                {
                    mypics.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile
