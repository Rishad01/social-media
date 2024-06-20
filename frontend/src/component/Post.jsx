import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [postIdToUpdate, setPostIdToUpdate] = useState('');
  const [commentContent,setCommentContent]= useState('');
  const [userId,setUserId]= useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
        const token=localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }});
        setUserId(res.data.userId);
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    }
  };

  const createPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/posts', { content }, {
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

  const updatePost = async () => {
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
      await axios.post(`http://localhost:5000/api/posts/${id}/like`, {
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
    <div>
      <h1>Posts</h1>
      <input 
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
      />
      <button onClick={createPost}>Post</button>
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
                <button onClick={updatePost}>Update</button>
              </div>
            ) : (
              <div>
                <p>{post.content}</p>
                <button onClick={() => handleUpdateClick(post)}>Edit</button>
                <button onClick={() => deletePost(post._id)}>Delete</button>
                <button onClick={() => toggleLike(post._id)}>
                {post.likes.includes(userId) ? 'Unlike' : 'Like'}
                </button>
                <p>Likes: {post.likes.length}</p>
                <div>
                  <input 
                    type="text"
                    placeholder="Add a comment..."
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <button onClick={() => handleComment(post._id, commentContent)}>Comment</button>
                </div>
                <ul>
                  {post.comments.map(comment => (
                    <li key={comment._id}>
                      <p>{comment.text}</p>
                      <p>Comment by: {comment.username}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Post;
