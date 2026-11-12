// src/pages/home/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `https://dev-fujiwara-wordpress-backend.pantheonsite.io/wp-json/wp/v2/blog_post?_embed&t=${Date.now()}`,
          { cache: 'no-store' }
        );
        const wpPosts = await response.json();

        const formattedPosts = wpPosts.map((post) => {
          const rawText = post.excerpt?.rendered || post.content?.rendered || '';
          const cleanExcerpt = rawText.replace(/<[^>]+>/g, '').trim().substring(0, 120) + '...';

          return {
            id: post.id,
            slug: post.slug,
            title: post.title?.rendered || 'Untitled',
            excerpt: cleanExcerpt,
            featuredMediaUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || post.acf?.image || '',
            date: post.date,
          };
        });

        setPosts(formattedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch WordPress posts:', error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="home-container">
      {isLoading ? (
        <div className="home-loading">Loading posts...</div>
      ) : (
        <div className="home-posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="home-post-card">
              <Link to={`/post/${post.slug}`} className="home-post-card-link">
                <div className="home-post-image-placeholder">
                  {post.featuredMediaUrl ? (
                    <img src={post.featuredMediaUrl} alt={post.title} />
                  ) : (
                    <span>Image Placeholder</span>
                  )}
                </div>
                <div className="home-post-card-body">
                  <h2 
                    className="home-post-card-title" 
                    dangerouslySetInnerHTML={{ __html: post.title }} 
                  />
                  <p 
                    className="home-post-card-excerpt" 
                    dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                  />
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}