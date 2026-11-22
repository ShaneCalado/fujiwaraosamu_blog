import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const location = useLocation();

  const isPostView = location.pathname.startsWith('/post');
  const toggleContact = () => setIsContactOpen((prev) => !prev);

  return (
    <header className={`home-header-wrapper ${isPostView ? 'is-post-view' : ''}`}>
      <div
        className="home-header-banner"
        onClick={toggleContact}
        role="button"
        tabIndex={0}
        aria-expanded={isContactOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleContact();
          }
        }}
      >
        <img
          src="/images/header_image.webp"
          alt="Office Osamu Fujiwara"
          className="home-header-image"
        />
        <div className="home-header-info">
          <div>HP→行政書士藤原修事務所</div>
          <div>代表者 藤原 修</div>
          <div>所在地 兵庫県宝塚市すみれガ丘１丁目7-1-509号</div>
          <div>TEL 0797-90-2776 (受付時間9時〜18時)</div>
          <div>FAX 0797-90-2784 (24時間受付)</div>
          <div>mail→お問い合わせ</div>
          <div>休業日 土日・祝日・年末年始</div>
        </div>
      </div>

      {/* Collapsible Contact Drawer attached flush to the bottom of the banner */}
      <div className={`home-header-contact ${isContactOpen ? 'is-open' : ''}`}>
        <button
          type="button"
          className="home-header-contact-toggle"
          onClick={toggleContact}
          aria-expanded={isContactOpen}
          aria-label="お問い合わせ・関連サイトを開閉"
        >
          <span className="home-header-contact-chevron">{isContactOpen ? '▲' : '▼'}</span>
        </button>

        <div className="home-header-contact-drawer">
          <div className="home-header-contact-drawer-inner">
            <div className="home-header-contact-content">
              <div className="home-header-contact-item">
                <span className="home-header-contact-heading">お電話・FAX</span>
                <div className="home-header-contact-links">
                  <div className="home-header-contact-row">
                    <span className="home-header-contact-prefix">TEL:</span>
                    <a href="tel:0797-90-2776" className="home-header-contact-link">
                      0797-90-2776
                    </a>
                    <span className="home-header-contact-note">(受付時間9時〜18時)</span>
                  </div>
                  <div className="home-header-contact-row">
                    <span className="home-header-contact-prefix">FAX:</span>
                    <a href="tel:0797-90-2784" className="home-header-contact-link">
                      0797-90-2784
                    </a>
                    <span className="home-header-contact-note">(24時間受付)</span>
                  </div>
                </div>
              </div>

              <div className="home-header-contact-item">
                <span className="home-header-contact-heading">メールでのお問い合わせ</span>
                <div className="home-header-contact-links">
                  <a
                    href="mailto:office@fujiwaraosamu.com"
                    className="home-header-contact-link"
                  >
                    office@fujiwaraosamu.com
                  </a>
                </div>
              </div>

              <div className="home-header-contact-item">
                <span className="home-header-contact-heading">関連ウェブサイト</span>
                <div className="home-header-contact-links">
                  <a
                    href="https://office-fujiwaraosamu.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="home-header-contact-link"
                  >
                    行政書士藤原修事務所 ↗
                  </a>
                  <a
                    href="https://takarazuka-shukatsu.jp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="home-header-contact-link"
                  >
                    宝塚終活サポートセンター ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}