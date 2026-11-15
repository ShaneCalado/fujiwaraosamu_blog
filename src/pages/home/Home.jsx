// src/pages/home/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Extracts the 11-character YouTube ID from watch?v=, youtu.be/, embed/, or shorts/ links
function getYouTubeThumbnail(url) {
  if (!url || typeof url !== 'string') return '';
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `https://wp-backend.161-33-16-49.sslip.io/wp-json/wp/v2/blog_post?_embed&acf_format=standard`
        );
        const wpPosts = await response.json();

        const formattedPosts = wpPosts.map((post) => {
          // 1. Prioritize ACF preview_text, otherwise fall back to WP excerpt or content
          const acfPreview = post.acf?.preview_text?.trim();
          const rawText = acfPreview || post.excerpt?.rendered || post.content?.rendered || '';
          const strippedText = rawText.replace(/<[^>]+>/g, '').trim();
          const cleanExcerpt = strippedText.length > 160 
            ? strippedText.substring(0, 160) + '...' 
            : strippedText;

          // 2. Prioritize ACF main_image or WP Featured Image, then fall back to YouTube thumbnail
          const imageUrl =
            (typeof post.acf?.main_image === 'string' && post.acf.main_image) ||
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            '';
          const videoThumbnailUrl = getYouTubeThumbnail(post.acf?.video_link);

          return {
            id: post.id,
            slug: post.slug,
            title: post.title?.rendered || 'Untitled',
            excerpt: cleanExcerpt,
            featuredMediaUrl: imageUrl || videoThumbnailUrl || '',
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