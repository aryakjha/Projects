import {Navbar,Nav,Container,NavDropdown} from "react-bootstrap"
import {LinkContainer} from "react-router-bootstrap"
import {Form,FormControl,Button} from "react-bootstrap"
import {useSelector,useDispatch} from "react-redux"
import {userlogout} from "../slices/userSlice"
import { useState, useEffect } from "react"
import axios from "axios"
import "./detail.css"
function Header(){

  let {isuserlogin,obj}=useSelector(state=>state.users)
 
  let dispatch=useDispatch()

  
  
 
  

    return(<div>
        <Navbar collapseOnSelect expand="lg"  className="headers" >
<Container>
  <Navbar.Brand className="text-light logo fs-2"><b>
      Online Library</b></Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
   
    <Nav className="ms-auto ms-5">
    <LinkContainer to="/">
      <Nav.Link className="px-4 fs-5">Home</Nav.Link>
      </LinkContainer>
   

{!isuserlogin &&
      <LinkContainer to="/signup">
      <Nav.Link className="px-4 fs-5">Signup</Nav.Link>
      </LinkContainer>
}

{isuserlogin &&
      <LinkContainer to="/favourite">
      <Nav.Link className="px-4 fs-5">Favourite</Nav.Link>
      </LinkContainer>
      }

{isuserlogin &&
      <LinkContainer to="/recommended">
      <Nav.Link className="px-4 fs-5">Recommended Books</Nav.Link>
      </LinkContainer>
      }



      {isuserlogin  ?
       
       <NavDropdown title={obj.name} id="collasible-nav-dropdown" className="px-4">
      <LinkContainer to="/viewprofile">
       <NavDropdown.Item>View Profile</NavDropdown.Item>
       </LinkContainer>
       <NavDropdown.Divider />
       <LinkContainer to="/login">
        <NavDropdown.Item onClick={()=>dispatch(userlogout())}>logout</NavDropdown.Item>
        </LinkContainer>
     </NavDropdown>
      :
      <LinkContainer to="/login">
      <Nav.Link className="px-4 fs-5">Login</Nav.Link>
      </LinkContainer>}
     

      
    </Nav>
    
  </Navbar.Collapse>
  </Container>
</Navbar>
    </div>)
}

export default Header