import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
        //data post 
        if(url){
            fetch("https://instaclone98.onrender.com/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            }).then(res=> res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html:data.error})
                }else{
                    M.toast({html:"Post created successfully"})
                    history.push('/')
                }
                
            }).catch(err=>{
                console.log(err)
        })
    }
    },[url])

    const postDetails = () =>{
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
            //console.log(data)
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })

    }

    return (
        <div className='card input-field'
        style={{
            margin:"10px auto",
            maxWidth:"500px",
            padding:20,
            textAlign:"center"
        }}
        >
            <input type="text" placeholder='title'
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />
            <input type="text" placeholder='body'
            value={body}
            onChange={(e)=>setBody(e.target.value)}
            />
            <input className="input-file-btn form-control" type="file" accept="image" placeholder='Upload image'
            onChange={(e)=>setImage(e.target.files[0])}
            />
            <div><button className='btn btn-success mt-2' onClick={()=>postDetails()}>submit post</button></div>
        </div>
    )
}

export default CreatePost
