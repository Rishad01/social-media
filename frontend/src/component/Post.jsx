import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [postIdToUpdate, setPostIdToUpdate] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUserId(res.data.userId);
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    }
  };

  const createPost = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/posts`, { content }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setPosts([...posts, res.data]);
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (id) => {
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateClick = (post) => {
    setPostIdToUpdate(post._id);
    setUpdateContent(post.content);
  };

  const updatePost = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedPost = { content: updateContent };
      const res = await axios.put(`http://localhost:5000/api/posts/${postIdToUpdate}`, updatedPost, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const updatedPosts = posts.map(post =>
        post._id === res.data._id ? { ...post, content: res.data.content } : post
      );
      setPosts(updatedPosts);
      setPostIdToUpdate('');
      setUpdateContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/posts/${id}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchPosts(); // Refresh posts after liking/unliking
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (id, commentContent) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/posts/${id}/comment`, { text: commentContent }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchPosts(); // Refresh posts after commenting
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Posts</h1>
      <Form onSubmit={createPost} className="mb-4">
        <Form.Group controlId="formPostContent">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Post
        </Button>
      </Form>

      {posts.map(post => (
        <Card key={post._id} className="mb-4">
          <Card.Body>
            {post._id === postIdToUpdate ? (
              <div>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                />
                <Button variant="success" className="me-2" onClick={updatePost}>
                  Update
                </Button>
                <Button variant="secondary" onClick={() => setPostIdToUpdate('')}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div>
                <Card.Text>{post.content}</Card.Text>
                <Button variant="info" className="me-2" onClick={() => handleUpdateClick(post)}>
                  Edit
                </Button>
                <Button variant="danger" className="me-2" onClick={() => deletePost(post._id)}>
                  Delete
                </Button>
                <Button variant="primary" onClick={() => toggleLike(post._id)}>
                  {post.likes.some(like => like._id === userId) ? 'Unlike' : 'Like'}
                </Button>
                <Badge bg="secondary" className="ms-2">{post.likes.length}</Badge>
                <Form onSubmit={(e) => { e.preventDefault(); handleComment(post._id, commentContent); }}>
                  <Form.Control
                    type="text"
                    placeholder="Add a comment..."
                    className="mt-2"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <Button variant="primary" type="submit" className="mt-2">
                    Comment
                  </Button>
                </Form>
                <ul className="list-unstyled mt-3">
                  {post.comments.map(comment => (
                    <li key={comment._id}>
                      <Card.Text>{comment.text}</Card.Text>
                      <Card.Text>Comment by: {comment.username}</Card.Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Post;
