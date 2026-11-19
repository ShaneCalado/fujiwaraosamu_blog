// src/components/contact/Contact.tsx
import './Contact.css';

export const ContactLinkId = {
  None: 0,
  OfficeFujiwara: 1,
  TakarazukaShukatsu: 2,
} as const;

interface ContactPreset {
  heading: string;
  description: string;
  buttonText: string;
  url: string;
}

// Edit or add new numbered entries here whenever you add ACF select choices
const CONTACT_PRESETS: Record<number, ContactPreset> = {
  [ContactLinkId.OfficeFujiwara]: {
    heading: '行政書士に相談したい方へ',
    description: '各種許認可・書類作成などのお困りごとをご相談ください。',
    buttonText: 'お問い合わせ・相談予約',
    url: 'https://office-fujiwaraosamu.com/contact',
  },
  [ContactLinkId.TakarazukaShukatsu]: {
    heading: '行政書士に相談したい方へ',
    description: '相続・遺言・成年後見などのお困りごとをご相談ください。',
    buttonText: '無料ご相談・お問い合わせフォーム',
    url: 'https://takarazuka-shukatsu.jp/contact',
  },
};

type ContactLinkInput =
  | number
  | string
  | boolean
  | null
  | undefined
  | { value?: number | string };

interface PostContactCtaProps {
  contactLink: ContactLinkInput;
}

function parseContactLinkId(raw: ContactLinkInput): number {
  if (!raw) return 0;
  if (typeof raw === 'object' && 'value' in raw) {
    return Number(raw.value) || 0;
  }
  return Number(raw) || 0;
}

export default function PostContactCta({ contactLink }: PostContactCtaProps) {
  const linkId = parseContactLinkId(contactLink);
  const preset = CONTACT_PRESETS[linkId];

  // Hide completely if 0, false, empty, or not in CONTACT_PRESETS
  if (!linkId || !preset) {
    return null;
  }

  return (
    <aside className="post-contact-cta" aria-label={preset.heading}>
      <h3 className="post-contact-cta__heading">{preset.heading}</h3>
      <p className="post-contact-cta__description">{preset.description}</p>
      <a
        href={preset.url}
        target="_blank"
        rel="noopener noreferrer"
        className="post-contact-cta__button"
      >
        {preset.buttonText}
      </a>
    </aside>
  );
}