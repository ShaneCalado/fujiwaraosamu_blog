// src/pages/home/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllBlogPosts } from '../../api/blogApi';
import './Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchAllBlogPosts()
      .then((formattedPosts) => {
        if (isMounted) {
          setPosts(formattedPosts);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch WordPress posts:', error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-container">
      {isLoading ? (
        <div className="home-loading">投稿を読み込み中...</div>
      ) : (
        <div className="home-posts-grid">
          {posts.map((post) => (
            <article
              key={post.id}
              className={`home-post-card ${!post.featuredMediaUrl ? 'no-image-card' : ''}`}
            >
              <Link to={`/post/${post.slug}`} className="home-post-card-link">
                {post.featuredMediaUrl && (
                  <div className="home-post-image-placeholder">
                    <img src={post.featuredMediaUrl} alt={post.title} />
                  </div>
                )}

                <div className="home-post-card-body">
                  <h2
                    className="home-post-card-title"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                  <time className="home-post-card-date">{post.date}</time>
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