import React , {useState,useEffect} from 'react'
import { Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'

//const liveApiUrl = "https://instagramclone98.herokuapp.com/signup" 

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = () =>{
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

    const uploadFields = () => {
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name, //key and value is same4
                password:password,
                email:email,
                pic:url
            })
        }).then(res=> res.json())
        .then(data=>{
            //console.log(data)
            if(data.error){
                M.toast({html:data.error})
            }else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
            
        }).catch(err=>{
            console.log(err)
        })
    }
    
    const PostData = () =>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
        
    }

    return (
        <div>
            <div className="login-card mt-5">
            <h2 className='logo-ig'>Instagram</h2>
            <h5 style={{color:"gray"}}>Sign up to see photos and videos from your friends.</h5>
            <input type="text"
            placeholder='Name'
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <input type="text"
            placeholder='email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input type="text"
            placeholder='password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <label>Upload profile pic</label>
            <input className="input-file-btn form-control" type="file" accept="image" placeholder=''
            onChange={(e)=>setImage(e.target.files[0])}
            />
            <div><button className='btn btn-success' onClick={()=>PostData()}>Signup Now</button></div>
            <div><Link to="/signin">Already have an account ? Signin</Link></div>
        </div>
        </div>
    )
}

export default Signup
