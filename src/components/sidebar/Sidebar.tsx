// src/components/sidebar/Sidebar.tsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { fetchAllBlogPosts } from '../../api/blogApi';
import './Sidebar.css';

interface SidebarPost {
  id: number;
  slug: string;
  title: string;
  rawDate: string;
  isTopPost: boolean;
  listPosition: number | null;
  tags?: string[];
}

export default function Sidebar() {
  const [posts, setPosts] = useState<SidebarPost[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const selectedTag = searchParams.get('tag') || '';

  useEffect(() => {
    let isMounted = true;

    fetchAllBlogPosts()
      .then((fetchedPosts) => {
        if (isMounted) {
          setPosts(fetchedPosts);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch sidebar posts:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Only lock background scroll while the popup menu drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 1. Pre-sort all posts newest-first using the ISO rawDate
  const postsByNewest = [...posts].sort(
    (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
  );

  // 2. Collect unique tags across all posts
  const availableTags = Array.from(
    new Set(postsByNewest.flatMap((post) => post.tags || []))
  );

  // 3. For each slot 1..5, pick the most recent post assigned to that position
  const topCandidates = postsByNewest.filter((post) => post.isTopPost);
  const topPosts = [1, 2, 3, 4, 5]
    .map((pos) => topCandidates.find((post) => post.listPosition === pos))
    .filter((post): post is SidebarPost => Boolean(post));

  // 4. Most recent 5 posts overall
  const recentPosts = postsByNewest.slice(0, 5);

  const closeSidebar = () => setIsOpen(false);

  const handleTagSelect = (tag: string) => {
    const nextTag = selectedTag === tag ? '' : tag;

    if (nextTag) {
      setSearchParams({ tag: nextTag }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }

    closeSidebar();
  };

  const sidebarSections = (
    <div className="home-sidebar-inner">
      {isHomePage && availableTags.length > 0 && (
        <section className="home-sidebar-section home-sidebar-section--tags">
          <h3 className="home-sidebar-heading">タグで絞り込む</h3>
          <div className="sidebar-tag-list">
            <button
              type="button"
              className={`sidebar-tag-btn ${!selectedTag ? 'is-active' : ''}`}
              onClick={() => handleTagSelect('')}
            >
              すべて
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`sidebar-tag-btn ${selectedTag === tag ? 'is-active' : ''}`}
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      )}

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
  );

  // Portaled directly onto document.body so it sits cleanly on top of everything
  const mobileOverlay = (
    <div className="mobile-overlay-root">
      {isOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} />
      )}

      <aside className={`mobile-sidebar-drawer ${isOpen ? 'is-open' : ''}`}>
        <div className="sidebar-mobile-header">
          <span>記事メニュー</span>
          <button type="button" className="sidebar-close-btn" onClick={closeSidebar}>
            ✕
          </button>
        </div>
        {sidebarSections}
      </aside>

      <nav className="mobile-bottom-nav" aria-label="モバイルメニュー">
        <a
          href="https://takarazuka-shukatsu.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-bottom-nav-item"
          onClick={closeSidebar}
        >
          <svg
            className="mobile-bottom-nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
            <path d="M12 17.5s-3-2-3-3.9a1.8 1.8 0 0 1 3-1.3 1.8 1.8 0 0 1 3 1.3c0 1.9-3 3.9-3 3.9z" />
          </svg>
          <span className="mobile-bottom-nav-label">終活サポート</span>
        </a>

        <a
          href="https://office-fujiwaraosamu.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-bottom-nav-item"
          onClick={closeSidebar}
        >
          <svg
            className="mobile-bottom-nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <line x1="9" y1="7" x2="15" y2="7" />
            <line x1="9" y1="11" x2="15" y2="11" />
            <line x1="9" y1="15" x2="13" y2="15" />
          </svg>
          <span className="mobile-bottom-nav-label">事務所HP</span>
        </a>

        <a
          href="mailto:office@fujiwaraosamu.com"
          className="mobile-bottom-nav-item"
          onClick={closeSidebar}
        >
          <svg
            className="mobile-bottom-nav-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.2-8 5-8-5V6l8 5 8-5v2.2z" />
          </svg>
          <span className="mobile-bottom-nav-label">お問い合わせ</span>
        </a>

        <a
          href="tel:0797-90-2776"
          className="mobile-bottom-nav-item"
          onClick={closeSidebar}
        >
          <svg
            className="mobile-bottom-nav-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
          </svg>
          <span className="mobile-bottom-nav-label">9:00〜18:00</span>
        </a>

        <button
          type="button"
          className={`mobile-bottom-nav-item ${isOpen ? 'is-active' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="記事メニューを開閉"
        >
          {isOpen ? (
            <svg
              className="mobile-bottom-nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg
              className="mobile-bottom-nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
          <span className="mobile-bottom-nav-label">{isOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="home-sidebar-anchor">
        <aside className="home-sidebar">
          {sidebarSections}
        </aside>
      </div>

      {/* Mobile Fixed Bar & Drawer */}
      {typeof document !== 'undefined' && createPortal(mobileOverlay, document.body)}
    </>
  );
}