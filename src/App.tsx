// src/App.tsx
import { Routes, Route } from 'react-router-dom';

// Components
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';

// Pages
import Home from './pages/home/Home'; 
import Post from './pages/post/Post'; // <-- 1. Import the Post component

export default function App() {
  return (
    <>
      <Header />

      <div className="home-content-layout">
        <main className="home-posts-main">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* 2. Add the dynamic route for the individual posts */}
            <Route path="/post/:slug" element={<Post />} />
          </Routes>
        </main>
        
        <Sidebar />
      </div>
    </>
  );
}