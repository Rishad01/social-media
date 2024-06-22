import React from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col,Card} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

function SignUp() {
  const navigate = useNavigate();
  const [values, setValues] = React.useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('signup');
    try {
      const response = await axios.post(`https://social-media-backend-b49y.onrender.com/register`, values);
        localStorage.setItem('token', response.data.token);
        console.log(response);
        navigate('/posts');
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">Sign Up</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={values.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>
          <div className="text-center mt-3">
            <a href="#" onClick={() => navigate('/login')}>Already Registered? Login here</a>
          </div>             
            </Card.Body>
            </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
