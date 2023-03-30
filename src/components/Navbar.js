import React , {useContext,useRef,useEffect,useState} from 'react'
import { Link , useHistory} from 'react-router-dom'
import { UserContext } from '../App' 
import M from 'materialize-css'

const Navbar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])
    const renderList = () =>{
        if(state){
            return [
                <li className="nav-item" key="1">
                <Link className="nav-link" to="/profile">Profile</Link>
                </li>,
                <li className="nav-item" key="2">
                <Link className="nav-link" to="/create">Create post</Link>
                </li>,
                <li className="nav-item" key="3">
                <Link className="nav-link" to="/myfollowingpost">My following posts</Link>
                </li>,
                <button className='btn' style={{backgroundColor:"pink"}}onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                }} key="4">Logout</button>
            ]
        }else{
            return [
                <li className="nav-item" key="5">
                    <Link className="nav-link" to="/signin">SignIn</Link>
                </li>,
                <li className="nav-item" key="6">
                    <Link className="nav-link" to="/signup">SignUp</Link>
                </li>
            ]
        }
    }


    const fetchUsers = (query) =>{
        setSearch(query)
        fetch('/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query //both key and value is same
            })
        }).then(res=>res.json())
        .then(results=>{
            //console.log(results);
            setUserDetails(results.user)
        })
    }

    return (
        <>
           <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/signin">InstaGram</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <Link className="nav-link" to={state?"/":"/signin"}>Home</Link>
                    </li>
                    <li className="nav-item">
                    <input data-target="modal1" className="modal-trigger" type="text" placeholder='search users...' style={{marginLeft:20}}/>
                    </li>
                </ul>
                <div className="d-flex">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                   {
                       renderList()
                   }   
                </ul>
                </div>
                <div id="modal1" class="modal custom-modal" ref={searchModal}>
                    <div class="modal-content">
                        <input type="text"
                        placeholder='search users here...'
                        value={search}
                        onChange={(e)=>fetchUsers(e.target.value)}
                        />
                        <ul>
                            {
                                userDetails.map(item =>{
                                    return <Link to={"/profile/"+item._id} onClick={()=>{M.Modal.getInstance(searchModal.current).close()}
                                    }><li key={item._id}>{item.email}</li></Link>
                                })
                            }
                        </ul>
                    </div>
                    <div class="modal-footer">
                    <button class="modal-close btn btn-success" onClick={()=>setSearch('')}>Close</button>
                    </div>
                </div>
                </div>
            </div>
            </nav> 
        </>
    )
}

export default Navbar
