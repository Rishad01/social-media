import React from "react";
import axios from "axios";
import {Form,Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function SignUp()
{
  const navigate=useNavigate();
    const[values,setValues]=React.useState({
        email:'',
        password:'',
        username:''
      });
  
      const handleSubmit=async (event)=>{
        console.log('login');
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/register', values);
          alert(response.data.message);
        }
        catch(error){
          console.error(error);
        }
      }
  
      const handleChange=(event)=>{
        setValues({...values,[event.target.name]:event.target.value});
      }
    return(
      <div>
             <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" name="username" onChange={handleChange}/>
                </Form.Group>
                <Button variant="btn btn-dark" type="submit" onClick={handleSubmit}>
                    Sign Up
                </Button>
              </Form>

              <a onClick={()=>navigate('/login')}>Already Registered?</a>
        </div>
    );
}

export default SignUp;