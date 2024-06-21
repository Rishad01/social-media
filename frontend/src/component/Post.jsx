import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap'; // Import Form and Button from react-bootstrap

function Post(){
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [postIdToUpdate, setPostIdToUpdate] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [userId, setUserId] = useState('');

  
  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('https://social-media-back-ho56.onrender.com/bring', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUserId(res.data.userId);
      setPosts(res.data.posts);
      console.log(res.data.posts);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchPosts();
    }, []);

  const createPost = async () => {
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://social-media-back-ho56.onrender.com/api/posts', { content }, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      await axios.delete(`https://social-media-back-ho56.onrender.com/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const updatePost = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedPost = { content: updateContent };
      const res = await axios.put(`https://social-media-back-ho56.onrender.com/api/posts/${postIdToUpdate}`, updatedPost, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      await axios.post(`https://social-media-back-ho56.onrender.com/api/posts/${id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      await axios.post(`https://social-media-back-ho56.onrender.com/api/posts/${id}/comment`, { text: commentContent }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchPosts(); // Refresh posts after commenting
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Posts</h1>
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
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            {post._id === postIdToUpdate ? (
              <div>
                <input
                  type="text"
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                />
                <Button onClick={updatePost} variant="primary" type="submit">
                        Update
                </Button>
              </div>
            ) : (
              <div>
                <p>{post.content}</p>
                <Button onClick={() => handleUpdateClick(post)}>Edit</Button>
                <Button onClick={() => deletePost(post._id)}>Delete</Button>
                <Button onClick={() => toggleLike(post._id)}>
                  {post.likes.some(like => like._id === userId) ? 'Unlike' : 'Like'}
                </Button>
                <p>Likes: {post.likes.length}</p>
                <div>
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
                  <ul>
                    {post.comments.map(comment => (
                      <li key={comment._id}>
                        <p>{comment.text}</p>
                        <p>Comment by: {comment.username}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Post;
