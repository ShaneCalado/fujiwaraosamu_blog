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

        {/* Top-Left Blog Title Overlay */}
        <h1 className="home-header-title">宝塚の行政書士ブログ</h1>

        {/* Bottom-Left Office Info Overlay */}
        <div className="home-header-info">
          <div className="home-header-office-row">
            <img
              src="/images/logo.png"
              alt="行政書士徽章"
              className="home-header-badge"
            />
            <span className="home-header-office-name">行政書士藤原修事務所</span>
          </div>

          <div className="home-header-details">
            <div className="home-header-detail-line">
              <span className="home-header-detail-label">所在地</span>
              <span className="home-header-detail-sep">:</span>
              <span className="home-header-detail-val">
                兵庫県宝塚市すみれガ丘1丁目7-1-509
              </span>
            </div>

            <div className="home-header-detail-line">
              <span className="home-header-detail-label is-latin">TEL</span>
              <span className="home-header-detail-sep">:</span>
              <a
                href="tel:0797-90-2776"
                className="home-header-banner-link home-header-tel-link"
                onClick={(e) => e.stopPropagation()}
              >
                0797-90-2776
              </a>
            </div>

            <div className="home-header-detail-line">
              <span className="home-header-detail-label is-latin">MAIL</span>
              <span className="home-header-detail-sep">:</span>
              <a
                href="mailto:office@fujiwaraosamu.com"
                className="home-header-banner-link home-header-mail-link"
                onClick={(e) => e.stopPropagation()}
              >
                お問い合わせ
              </a>
            </div>
          </div>
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