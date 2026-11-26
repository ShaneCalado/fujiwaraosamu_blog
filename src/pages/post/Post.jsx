// src/pages/post/Post.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSingleBlogPostBySlug } from '../../api/blogApi';

// Import ONLY editor_front.css (do NOT import single.css or index.css)
import '../../themes/syn_own/css/editor_front.css';
import './Post.css';

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single post & scroll cleanly to the top on slug change
  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);
    setIsLoading(true);
    setError(null);
    setIsPlayingVideo(false);
    setIsTocOpen(false);

    fetchSingleBlogPostBySlug(slug)
      .then((postData) => {
        if (!isMounted) return;
        if (!postData) {
          setError('Post not found.');
        } else {
          setPost(postData);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch the post:', err);
        if (isMounted) setError('Failed to load post.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) return <div className="single-post-loading">投稿を読み込み中...</div>;
  if (error) return <div className="single-post-error">{error}</div>;
  if (!post) return null;

  const hasHeroMedia = Boolean(post.videoId || post.featuredMediaUrl);
  const hasToc = post.toc && post.toc.length > 0;

  const handleTocClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="single-post-page-wrapper">
      <article className="single-post-container">
        {/* 1. Post Title & Navigation at the Very Top */}
        <header className="single-post-header">
          <div className="single-post-topbar">
            <Link to="/" className="single-post-back-btn">
              ←
            </Link>
            <time className="single-post-date">{post.date}</time>
          </div>

          <h1
            className="single-post-title"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </header>

        {/* 2. Hero Media (Video takes priority over static image) */}
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

        {/* 3. Collapsible Table of Contents */}
        {hasToc && (
          <nav
            className={`single-post-toc ${hasHeroMedia ? 'attached-to-hero' : 'no-hero-media'} ${
              isTocOpen ? 'is-open' : ''
            }`}
            aria-label="目次"
          >
            <button
              type="button"
              className="single-post-toc-toggle"
              onClick={() => setIsTocOpen((prev) => !prev)}
              aria-expanded={isTocOpen}
            >
              <span className="single-post-toc-label">目次 (クリックして展開)</span>
              <span className="single-post-toc-chevron">{isTocOpen ? '▲' : '▼'}</span>
            </button>

            <div className="single-post-toc-drawer">
              <div className="single-post-toc-drawer-inner">
                <ol className="single-post-toc-list">
                  {post.toc.map((item) => (
                    <li
                      key={item.id}
                      className={`single-post-toc-item level-${item.level}`}
                      style={{ paddingLeft: `${item.indent * 20}px` }}
                    >
                      <a
                        href={`#${item.id}`}
                        className="single-post-toc-link"
                        onClick={(e) => handleTocClick(e, item.id)}
                      >
                        {`${item.sectionNumber} - ${item.text}`}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </nav>
        )}

        {/* 4. Post Body */}
        <div className="single-post-content entry__main">
          <div
            className="single-post-body post-content wp-content entry-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
}