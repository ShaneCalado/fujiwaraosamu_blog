// src/components/sidebar/Sidebar.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  isTopPost: boolean;
}

export default function Sidebar() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchSidebarPosts = async () => {
      try {
        // We don't need _embed here since the sidebar doesn't display images
        const response = await fetch(
          `https://dev-fujiwara-wordpress-backend.pantheonsite.io/wp-json/wp/v2/blog_post?t=${Date.now()}`,
          { cache: 'no-store' }
        );
        const wpPosts = await response.json();

        const formattedPosts = wpPosts.map((post: any) => ({
          id: post.id,
          slug: post.slug,
          title: post.title?.rendered || 'Untitled',
          date: post.date,
          isTopPost: !!post.acf?.is_top_post,
        }));

        setPosts(formattedPosts);
      } catch (error) {
        console.error('Failed to fetch sidebar posts:', error);
      }
    };

    fetchSidebarPosts();
  }, []);

  const topPosts = posts.filter((post) => post.isTopPost).slice(0, 5);
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <aside className="home-sidebar">
      <section className="home-sidebar-section">
        <h3 className="home-sidebar-heading">人気のブログ記事</h3>
        <ol className="home-sidebar-list">
          {topPosts.map((post) => (
            <li key={post.id} className="home-sidebar-item">
              <Link 
                to={`/post/${post.slug}`} 
                className="home-sidebar-link"
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
                dangerouslySetInnerHTML={{ __html: post.title }}
              />
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}