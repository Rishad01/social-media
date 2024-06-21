import React from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = React.useState({
    password: '',
    username: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('login');
    try {
      const response = await axios.post(`${window.location.origin}/login`, values);
      console.log(response);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/posts');
      }
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
              <Card.Title className="text-center mb-4">Login</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter username" 
                    name="username" 
                    value={values.username} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter password" 
                    name="password" 
                    value={values.password} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>

                <Button variant="dark" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
              <div className="text-center mt-3">
                <a href="#" onClick={() => navigate('/forgot_pass')}>Forgot password?</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
