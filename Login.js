import {Form,Button} from "react-bootstrap"
import {useNavigate} from "react-router"
import {useForm} from "react-hook-form"
import {useDispatch,useSelector} from 'react-redux'
import { loginuser } from "../slices/userSlice"

import {useEffect} from "react"
import axios from "axios"

function Login(){
    let navigate=useNavigate()
    let {register,handleSubmit,formState:{errors}}=useForm()
    let {obj, iserror, errmsg, ispending, isuserlogin}=useSelector(state=>state.users)
   

    let dispatch=useDispatch()

    useEffect(()=>{
      if(isuserlogin==true){
          navigate("/")
      }
     
  
  },[obj])

    const onformsubmit=async(userobj)=>{
     
        dispatch(loginuser(userobj))
      
     
     
    }
            


    return(<div>
      
        {
         iserror && <p className='text-danger mt-3 display-5 text-center'>{errmsg}</p>
        }
       
        

<Form className="w-50 mx-auto mt-4" onSubmit={handleSubmit(onformsubmit)}>
<h2 className="mb-3 text-center">Login</h2>
<Form.Group className="mb-3" controlId="email">
    <Form.Label>Email</Form.Label>
    <Form.Control type="email" placeholder="name@example.com" {...register("email")}/>
  </Form.Group>
  <Form.Group className="mb-3" controlId="password">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" {...register("password")} />
  </Form.Group>
  <Button variant="success" type="submit" className="d-block mx-auto">
    Login
  </Button>
  <div className="mt-3 text-center">
      New to Online Library?<span className="text-danger ms-2 login" onClick={()=>navigate("/signup")}>Create Account</span>
  </div>
</Form>
    </div>)
}

export default Login