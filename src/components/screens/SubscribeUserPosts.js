import React ,{useState,useEffec, useEffect, useContext}from 'react'
import {UserContext} from '../../App'
import { Link } from 'react-router-dom'
const url = "https://images.unsplash.com/photo-1507090960745-b32f65d3113a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHdhbGxwYXBlcnxlbnwwfDB8MHx8&auto=format&fit=crop&w=500&q=60"

const SubscribeUserPosts = () => {
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/getsubpost',{
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.posts)
        })
    },[])

    const likePost = (id) => {
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log("resultoflike",result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    const unlikePost = (id) => {
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //console.log("resultofun-like",result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }


    const makeComment = (text,postId) => {
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:postId, //we can condensed also
                text:text
            })
        }).then(res=>res.json())
        .then(result =>{
            console.log("formco",result);
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }


    const deletePost = (postid) =>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }




    return (
        <div className='home'>
            {
                data.map(item=>{
                    return(
                        <div className='cards home-card' key={item._id}>
                            <div className='d-flex'> 
                                <img src={url} style={{height:30,width:30,borderRadius:"50%"}}/>
                                <h5><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link> {item.postedBy._id == state._id && <button className='btn btn-danger'
                                onClick={()=>deletePost(item._id)}
                                >delete</button>}</h5>
                            </div>
                            <div className='card-image card-bodys'>
                                <img src={item.photo} style={{height:350}}/>
                            </div>
                            <div className='card-content'>
                                <h6><span className='fw-bold m-1'>{item.postedBy.name}</span>{item.title}</h6>
                                <p>{item.body}</p>
                                <span className="hearts">&#10084;</span>
                                {
                                    item.likes.includes(state._id)
                                    ? <span className="hearts"
                                        onClick={()=>{unlikePost(item._id)}}
                                        >&#128078;</span>
                                    : <span className="hearts"
                                    onClick={()=>{likePost(item._id)}}
                                    >&#128077;</span>
                                }

                                <h6 className='fw-bold'>{item.likes.length} likes</h6>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id}><span className='fw-bold'>{record.postedBy.name}</span>&nbsp;{record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                <input type="text" placeholder='Add a comment' className='comment-input'/>    
                                </form>   
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SubscribeUserPosts
