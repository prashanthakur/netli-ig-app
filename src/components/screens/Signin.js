import React ,{useState,useContext} from 'react'
import { Link ,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

//const liveurl = "https://instagramclone98.herokuapp.com/signin"
const Signin = () => {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const PostData = () =>{
        fetch("https://instaclone98.onrender.com/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password:password,
                email:email
            })
        }).then(res=> res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html:data.error})
            }else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"SignedIn successfull"})
                history.push('/')
            }
            
        }).catch(err=>{
            console.log(err)
        })
    }

    return (
        <>
        <div className="login-card mt-5">
            <h2 className='logo-ig'>Instagram</h2>
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
            <div><button className='btn mt-1 fw-bold' style={{width:"100%",backgroundColor:"#a0e8f7"}}onClick={()=>PostData()}>Login</button></div>
            <div className='d-flex row mt-3'>
                <div className='col-5'>
                    <hr/>
                </div>
                <div className='col-2'>
                    OR
                </div>
                <div className='col-5'>
                    <hr/>
                </div>
            </div>
            <div><h6 style={{color:"blue"}} className='fw-bold'>Login with Facebook</h6></div>
            <div><Link to="/signup">Dont have account ? Signup</Link></div>
        </div>
        </>
    )
}

export default Signin
