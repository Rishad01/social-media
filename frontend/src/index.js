import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter,Route, Routes} from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import Login from './component/Login.jsx';
import Post from './component/Post.jsx';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/login" element={<Login />} />
    <Route path="/posts" element={<Post />} />
  </Routes>
  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
