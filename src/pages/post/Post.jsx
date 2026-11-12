// src/pages/post/Post.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Post.css';

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSinglePost = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://dev-fujiwara-wordpress-backend.pantheonsite.io/wp-json/wp/v2/blog_post?slug=${slug}&_embed&t=${Date.now()}`,
          { cache: 'no-store' }
        );
        const wpPosts = await response.json();

        if (wpPosts.length === 0) {
          setError('Post not found.');
          setIsLoading(false);
          return;
        }

        const data = wpPosts[0];
        
        setPost({
          id: data.id,
          title: data.title?.rendered || 'Untitled',
          content: data.content?.rendered || '',
          date: new Date(data.date).toLocaleDateString(),
          featuredMediaUrl: data._embedded?.['wp:featuredmedia']?.[0]?.source_url || data.acf?.image || '',
        });
      } catch (err) {
        console.error('Failed to fetch the post:', err);
        setError('Failed to load post.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSinglePost();
  }, [slug]);

  if (isLoading) return <div className="single-post-loading">Loading post...</div>;
  if (error) return <div className="single-post-error">{error}</div>;
  if (!post) return null;

  return (
    <article className="single-post-container">
      {/* Floating Back Button */}
      <Link to="/" className="single-post-back-btn">
        &larr; Back
      </Link>

      {post.featuredMediaUrl && (
        <div className="single-post-hero">
          <img src={post.featuredMediaUrl} alt="Featured" />
        </div>
      )}
      
      {/* Applies extra padding at the top if there is no image so text clears the back button */}
      <div className={`single-post-content ${!post.featuredMediaUrl ? 'no-image' : ''}`}>
        <header className="single-post-header">
          <h1 
            className="single-post-title" 
            dangerouslySetInnerHTML={{ __html: post.title }} 
          />
          <time className="single-post-date">{post.date}</time>
        </header>
        
        <div 
          className="single-post-body wp-content" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </article>
  );
}