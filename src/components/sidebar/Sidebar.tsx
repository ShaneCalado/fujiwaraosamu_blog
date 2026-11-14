// src/components/sidebar/Sidebar.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  isTopPost: boolean;
}

export default function Sidebar() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [tabTop, setTabTop] = useState(140);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSidebarPosts = async () => {
      try {
        const response = await fetch(
          `https://wp-backend.161-33-16-49.sslip.io/wp-json/wp/v2/blog_post?acf_format=standard`
        );
        const wpPosts = await response.json();

        const formattedPosts = wpPosts.map((post: any) => ({
          id: post.id,
          slug: post.slug,
          title: post.title?.rendered || 'Untitled',
          date: post.date,
          isTopPost: !!post.acf?.on_top_post_list,
        }));

        setPosts(formattedPosts);
      } catch (error) {
        console.error('Failed to fetch sidebar posts:', error);
      }
    };

    fetchSidebarPosts();
  }, []);

  // Keep mobile tab aligned with the content start, then clamped at MIN_TOP when scrolling down
  useEffect(() => {
    const MIN_TOP = 140; // Distance from top of phone screen when scrolling down

    const updateTabPosition = () => {
      if (!anchorRef.current) return;
      // Measure the parent content wrapper's top so it works even in column layouts
      const parentRect = anchorRef.current.parentElement?.getBoundingClientRect() 
        || anchorRef.current.getBoundingClientRect();
      setTabTop(Math.max(MIN_TOP, parentRect.top));
    };

    updateTabPosition();
    window.addEventListener('scroll', updateTabPosition, { passive: true });
    window.addEventListener('resize', updateTabPosition);
    return () => {
      window.removeEventListener('scroll', updateTabPosition);
      window.removeEventListener('resize', updateTabPosition);
    };
  }, []);

  const topPosts = posts.filter((post) => post.isTopPost).slice(0, 5);
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const closeSidebar = () => setIsOpen(false);

  return (
    <div ref={anchorRef} className="home-sidebar-anchor">
      <button
        className={`sidebar-mobile-tab ${isOpen ? 'tab-open' : ''}`}
        style={{ top: `${tabTop}px` }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        <span className="sidebar-tab-icon">{isOpen ? '✕' : '◀'}</span>
        <span className="sidebar-tab-text">記事一覧</span>
      </button>

      {isOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} />
      )}

      <aside className={`home-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="sidebar-mobile-header">
          <span>記事メニュー</span>
          <button className="sidebar-close-btn" onClick={closeSidebar}>✕</button>
        </div>

        <div className="home-sidebar-inner">
          <section className="home-sidebar-section">
            <h3 className="home-sidebar-heading">人気のブログ記事</h3>
            <ol className="home-sidebar-list">
              {topPosts.map((post) => (
                <li key={post.id} className="home-sidebar-item">
                  <Link
                    to={`/post/${post.slug}`}
                    className="home-sidebar-link"
                    onClick={closeSidebar}
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                </li>
              ))}
            </ol>
          </section>

          <section className="home-sidebar-section">
            <h3 className="home-sidebar-heading">最新のブログ記事</h3>
            <ol className="home-sidebar-list">
              {recentPosts.map((post) => (
                <li key={post.id} className="home-sidebar-item">
                  <Link
                    to={`/post/${post.slug}`}
                    className="home-sidebar-link"
                    onClick={closeSidebar}
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                </li>
              ))}
            </ol>
          </section>
        </div>
      </aside>
    </div>
  );
}