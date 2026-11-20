// src/components/sidebar/Sidebar.tsx
import { useState, useEffect, useRef } from 'react';
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

const MIN_TAB_TOP = 16; // Distance in px from top of screen when scrolled down

export default function Sidebar() {
  const [posts, setPosts] = useState<SidebarPost[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [tabTop, setTabTop] = useState(MIN_TAB_TOP);
  const anchorRef = useRef<HTMLDivElement>(null);

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

  // Keep mobile tab aligned with the content start, then clamped near the top edge when scrolling down
  useEffect(() => {
    const updateTabPosition = () => {
      if (!anchorRef.current) return;
      const parentRect =
        anchorRef.current.parentElement?.getBoundingClientRect() ||
        anchorRef.current.getBoundingClientRect();
      setTabTop(Math.max(MIN_TAB_TOP, parentRect.top));
    };

    updateTabPosition();
    window.addEventListener('scroll', updateTabPosition, { passive: true });
    window.addEventListener('resize', updateTabPosition);
    return () => {
      window.removeEventListener('scroll', updateTabPosition);
      window.removeEventListener('resize', updateTabPosition);
    };
  }, [location.pathname]);

  // Lock background page scroll on mobile when the drawer is open
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
      </aside>
    </div>
  );
}