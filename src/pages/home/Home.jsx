// src/pages/home/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Placeholder data structured for an easy swap with WordPress REST API (/wp-json/wp/v2/posts?_embed)
const MOCK_POSTS = [
  {
    id: 1,
    slug: 'post-1',
    title: 'Getting Started with Headless WordPress and React',
    excerpt: 'How to decouple your frontend and fetch posts dynamically using the WP REST API and custom endpoints.',
    featuredMediaUrl: '',
    date: '2026-10-28',
    isTopPost: true,
  },
  {
    id: 2,
    slug: 'post-2',
    title: 'Understanding Inheritance and Estate Planning Basics',
    excerpt: 'A practical overview of essential documentation, timelines, and administrative procedures to prepare early.',
    featuredMediaUrl: '',
    date: '2026-10-25',
    isTopPost: true,
  },
  {
    id: 3,
    slug: 'post-3',
    title: 'How to Organize Important Family Documents',
    excerpt: 'Keeping records accessible and structured saves significant time and stress when legal verification is required.',
    featuredMediaUrl: '',
    date: '2026-10-20',
    isTopPost: true,
  },
  {
    id: 4,
    slug: 'post-4',
    title: 'Digital Assets: What Happens to Online Accounts?',
    excerpt: 'Modern estate planning involves more than physical property. Here is how to handle subscriptions and digital records.',
    featuredMediaUrl: '',
    date: '2026-10-15',
    isTopPost: false,
  },
  {
    id: 5,
    slug: 'post-5',
    title: 'Common Mistakes When Drafting Formal Agreements',
    excerpt: 'Small ambiguities in wording can invalidate a document or cause delays. Watch out for these frequent pitfalls.',
    featuredMediaUrl: '',
    date: '2026-10-10',
    isTopPost: true,
  },
  {
    id: 6,
    slug: 'post-6',
    title: 'Autumn Office Update and Consultation Hours',
    excerpt: 'Updated schedule for the upcoming season along with new resources available for first-time visitors.',
    featuredMediaUrl: '',
    date: '2026-10-02',
    isTopPost: false,
  },
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Replace with your WordPress fetch call later:
    // fetch('https://your-domain.com/wp-json/wp/v2/posts?_embed')
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setPosts(MOCK_POSTS);
      } catch (error) {
        console.error('Failed to fetch WordPress posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Derived lists for the right sidebar
  const topPosts = posts.filter((post) => post.isTopPost).slice(0, 5);
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="home-container">
      {/* Reserved Header Image Space */}
      <header className="home-header-banner">
        <div className="home-header-placeholder">
          <span>Header Image Placeholder</span>
        </div>
      </header>

      {/* Main Content Area: 3/4 Left Grid + 1/4 Right Sidebar */}
      <div className="home-content-layout">
        {/* Left 3/4: 3-Wide Grid of Posts */}
        <main className="home-posts-main">
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
                      <h2 className="home-post-card-title">{post.title}</h2>
                      <p className="home-post-card-excerpt">{post.excerpt}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Right 1/4: Navigation Sidebar */}
        <aside className="home-sidebar">
          <section className="home-sidebar-section">
            <h3 className="home-sidebar-heading">Top Blog Posts</h3>
            <ol className="home-sidebar-list">
              {topPosts.map((post) => (
                <li key={post.id} className="home-sidebar-item">
                  <Link to={`/post/${post.slug}`} className="home-sidebar-link">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className="home-sidebar-section">
            <h3 className="home-sidebar-heading">Most Recent Posts</h3>
            <ol className="home-sidebar-list">
              {recentPosts.map((post) => (
                <li key={post.id} className="home-sidebar-item">
                  <Link to={`/post/${post.slug}`} className="home-sidebar-link">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}