// src/pages/post/Post.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Post.css';

function getYouTubeId(url) {
  if (!url || typeof url !== 'string') return '';
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : '';
}

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSinglePost = async () => {
      setIsLoading(true);
      setError(null);
      setIsPlayingVideo(false);
      
      try {
        const response = await fetch(
          `https://wp-backend.161-33-16-49.sslip.io/wp-json/wp/v2/blog_post?slug=${slug}&_embed&acf_format=standard`
        );
        const wpPosts = await response.json();

        if (wpPosts.length === 0) {
          setError('Post not found.');
          setIsLoading(false);
          return;
        }

        const data = wpPosts[0];
        const videoId = getYouTubeId(data.acf?.video_link);
        const imageUrl =
          (typeof data.acf?.main_image === 'string' && data.acf.main_image) ||
          data._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
          '';
        
        setPost({
          id: data.id,
          title: data.title?.rendered || 'Untitled',
          content: data.content?.rendered || '',
          date: new Date(data.date).toLocaleDateString(),
          videoId,
          featuredMediaUrl: imageUrl,
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

  if (isLoading) return <div className="single-post-loading">投稿を読み込み中...</div>;
  if (error) return <div className="single-post-error">{error}</div>;
  if (!post) return null;

  const hasHeroMedia = Boolean(post.videoId || post.featuredMediaUrl);

  return (
    <article className="single-post-container">
      {/* Floating Back Button */}
      <Link to="/" className="single-post-back-btn">
        &larr; 
      </Link>

      {/* Video takes priority over static image */}
      {post.videoId ? (
        <div className="single-post-hero single-post-video-container">
          {!isPlayingVideo ? (
            <button
              type="button"
              className="single-post-video-facade"
              onClick={() => setIsPlayingVideo(true)}
              aria-label="Play video"
            >
              <img
                src={`https://img.youtube.com/vi/${post.videoId}/hqdefault.jpg`}
                alt={post.title}
              />
              <span className="single-post-play-btn" />
            </button>
          ) : (
            <iframe
              className="single-post-video-iframe"
              src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      ) : (
        post.featuredMediaUrl && (
          <div className="single-post-hero">
            <img src={post.featuredMediaUrl} alt="Featured" />
          </div>
        )
      )}
      
      {/* Applies extra padding at the top if there is no video or image so text clears the back button */}
      <div className={`single-post-content ${!hasHeroMedia ? 'no-image' : ''}`}>
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