import { useState, useEffect, useRef, createContext, useContext } from 'react';
import jsPDF from 'jspdf';

/* ══════════════════════════════════════════════════════════
   DARK MODE CONTEXT
══════════════════════════════════════════════════════════ */
const DarkModeContext = createContext({ dark: false, toggle: () => {} });
function useDark() { return useContext(DarkModeContext); }

/* ══════════════════════════════════════════════════════════
   ICON SYSTEM — lightweight inline SVG, zero dependencies
══════════════════════════════════════════════════════════ */
function Icon({ d, size = 20, className = '', strokeWidth = 1.75, fill = 'none', style = {} }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style}
    >
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

const IC = {
  sparkle:   'M12 2l1.09 3.26L16 6l-2.91 1.74L12 11l-1.09-3.26L8 6l2.91-1.74L12 2zm7 10l.73 2.18L22 15l-2.27 1.18-.73 2.18-.73-2.18L16 15l2.27-1.18L19 12zm-14 0l.73 2.18L8 15l-2.27 1.18L5 18.36l-.73-2.18L2 15l2.27-1.18L5 12z',
  arrow:     'M5 12h14M12 5l7 7-7 7',
  arrowL:    'M19 12H5M12 19l-7-7 7-7',
  check:     'M20 6L9 17l-5-5',
  location:  'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
  users:     'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8 4v6m3-3h-6',
  money:     'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  calendar:  'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  notes:     'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  services:  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6',
  budget:    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  clock:     'M12 8v4l3 3M12 2a10 10 0 100 20A10 10 0 0012 2z',
  list:      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h.01M13 12h.01M17 12h.01M9 16h.01M13 16h.01',
  store:     'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z',
  star:      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  share:     'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13',
  refresh:   'M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15',
  verified:  'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  sun:       'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 100 14A7 7 0 0012 5z',
  moon:      'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  sliders:   'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
};

/* ══════════════════════════════════════════════════════════
   DARK MODE TOKEN MAPS
══════════════════════════════════════════════════════════ */
const T = {
  light: {
    bg:         '#FFF9F5',
    card:       '#FFFFFF',
    border:     '#ECECEC',
    borderWarm: '#F0E8E2',
    surface:    '#FDF5EF',
    surfaceAlt: '#FAFAFA',
    text:       '#222222',
    textSec:    '#6B7280',
    textMuted:  '#9CA3AF',
    primary:    '#A34D12',
    accent:     '#F15A24',
    barTrack:   '#F0EBE6',
    navBg:      '#FFFFFF',
    navBorder:  '#ECECEC',
    tabBg:      '#FFFFFF',
    inputBg:    '#FAFAFA',
    inputBorder:'#ECECEC',
    insightBg:  'rgba(163,77,18,0.05)',
    insightBdr: 'rgba(163,77,18,0.12)',
    insightTxt: '#5C3B1E',
    checkRow:   'transparent',
    checkRowHov:'#F5F0EB',
    checkBox:   '#FAFAFA',
    checkBorder:'#DEDEDE',
    timelineTxt:'#222222',
    sectionIcon:'rgba(163,77,18,0.08)',
    totalChip:  '#FDF5EF',
    totalBorder:'rgba(163,77,18,0.1)',
    vendorCard: '#FAFAFA',
    optimizerBg:'rgba(163,77,18,0.04)',
    optimizerBr:'rgba(163,77,18,0.12)',
    savingsBg:  '#DCF5E7',
    savingsTxt: '#16A34A',
  },
  dark: {
    bg:         '#0F172A',
    card:       '#1E293B',
    border:     '#334155',
    borderWarm: '#334155',
    surface:    '#1A2540',
    surfaceAlt: '#162032',
    text:       '#F1F5F9',
    textSec:    '#94A3B8',
    textMuted:  '#64748B',
    primary:    '#C97040',
    accent:     '#F15A24',
    barTrack:   '#334155',
    navBg:      '#1E293B',
    navBorder:  '#334155',
    tabBg:      '#1E293B',
    inputBg:    '#162032',
    inputBorder:'#334155',
    insightBg:  'rgba(201,112,64,0.1)',
    insightBdr: 'rgba(201,112,64,0.2)',
    insightTxt: '#CBD5E1',
    checkRow:   'transparent',
    checkRowHov:'#1A2540',
    checkBox:   '#162032',
    checkBorder:'#475569',
    timelineTxt:'#F1F5F9',
    sectionIcon:'rgba(201,112,64,0.15)',
    totalChip:  '#1A2540',
    totalBorder:'rgba(201,112,64,0.15)',
    vendorCard: '#162032',
    optimizerBg:'rgba(201,112,64,0.08)',
    optimizerBr:'rgba(201,112,64,0.2)',
    savingsBg:  'rgba(22,163,74,0.15)',
    savingsTxt: '#4ADE80',
  },
};

/* ══════════════════════════════════════════════════════════
   DATA — Event types & Vendors
══════════════════════════════════════════════════════════ */
const EVENT_TYPES = [
  { value: 'wedding',     emoji: '💍', label: 'Wedding',      desc: 'Celebrate love' },
  { value: 'birthday',    emoji: '🎂', label: 'Birthday',     desc: 'Cherish moments' },
  { value: 'corporate',   emoji: '🏢', label: 'Corporate',    desc: 'Professional' },
  { value: 'engagement',  emoji: '💐', label: 'Engagement',   desc: 'New beginnings' },
  { value: 'babyshower',  emoji: '👶', label: 'Baby Shower',  desc: 'Welcome baby' },
  { value: 'housewarming',emoji: '🏡', label: 'Housewarming', desc: 'New home' },
];

const VENDOR_DATA = {
  wedding:   [
    { name: 'Royal Banquets',              category: 'Venue',        rating: 4.8, price: '₹1.2L–2.5L', color: '#FDEBD0' },
    { name: 'Blossom Decor Studio',        category: 'Decoration',   rating: 4.6, price: '₹40K–80K',   color: '#D5F5E3' },
    { name: 'Shutter Stories Photography', category: 'Photography',  rating: 4.9, price: '₹50K–1L',    color: '#D6EAF8' },
    { name: 'Raga Caterers',               category: 'Catering',     rating: 4.7, price: '₹450/plate',  color: '#F9EBEA' },
  ],
  corporate: [
    { name: 'The Grand Conference Hub',    category: 'Venue',        rating: 4.7, price: '₹80K–1.5L',  color: '#FDEBD0' },
    { name: 'AV Masters',                  category: 'AV & Tech',    rating: 4.8, price: '₹30K–60K',   color: '#D5F5E3' },
    { name: 'Prestige Caterers',           category: 'Catering',     rating: 4.5, price: '₹600/plate',  color: '#D6EAF8' },
    { name: 'Summit Print & Media',        category: 'Branding',     rating: 4.4, price: '₹15K–35K',   color: '#F9EBEA' },
  ],
  birthday:  [
    { name: 'Funzone Party Hall',          category: 'Venue',        rating: 4.6, price: '₹25K–60K',   color: '#FDEBD0' },
    { name: 'Cake Canvas Bakery',          category: 'Cake & Sweets',rating: 4.9, price: '₹8K–25K',    color: '#D5F5E3' },
    { name: 'Happy Snaps Photography',     category: 'Photography',  rating: 4.5, price: '₹20K–45K',   color: '#D6EAF8' },
    { name: 'DJ Beats Entertainment',      category: 'Entertainment',rating: 4.7, price: '₹18K–40K',   color: '#F9EBEA' },
  ],
};

const AI_INSIGHTS = {
  wedding:   [
    'Booking the venue 90+ days early can save up to 20% on costs.',
    'Outdoor venues significantly reduce decoration expenses.',
    'Combining catering & decoration with one vendor offers bundled discounts.',
    'Your budget comfortably supports the selected guest count.',
  ],
  corporate: [
    'Morning slots for conference halls are typically 30% cheaper.',
    'Digital invitations can save ₹15,000–25,000 vs. printed materials.',
    'Bundling AV equipment with the venue often gives 15–20% off.',
    'Assigning a dedicated event coordinator improves execution quality.',
  ],
  birthday:  [
    'Booking a cake designer 3 weeks early ensures theme customisation.',
    'Saturday-afternoon time slots are more affordable than evenings.',
    'Combined photography + DJ packages save an average of ₹12,000.',
    'DIY return gifts can personalise the event and cut costs.',
  ],
};

const SERVICE_ICONS = {
  'Banquet Hall': '🏛', 'Conference Hall': '🏛', 'Party Hall': '🏛', 'Venue': '🏛',
  'Decoration': '🌸', 'Theme Decor': '🌸', 'Catering': '🍽', 'Photography': '📷',
  'Makeup': '💄', 'DJ': '🎵', 'Invitation Cards': '✉️', 'AV Equipment': '📽',
  'Keynote Speaker': '🎤', 'Badges & Printing': '🖨', 'Cake Designer': '🎂',
  'Entertainment': '🎭', 'Return Gifts': '🎁', 'Valet Parking': '🚗',
  'Security & Crowd Control': '🔒', 'Live Food Counters': '🍲',
};

/* ══════════════════════════════════════════════════════════
   DARK MODE TOGGLE BUTTON
══════════════════════════════════════════════════════════ */
function DarkToggle() {
  const { dark, toggle } = useDark();
  const t = dark ? T.dark : T.light;
  return (
    <button
      id="dark-mode-toggle"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 40, height: 40, borderRadius: 12,
        border: `1px solid ${t.border}`,
        background: t.surface,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.25s, border-color 0.25s, transform 0.15s',
        flexShrink: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Icon d={dark ? IC.sun : IC.moon} size={17} style={{ color: t.primary }} />
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   UTILITY COMPONENTS
══════════════════════════════════════════════════════════ */

/* Ekatraa logo word-mark */
function Logo({ size = 'md', forceLight = false }) {
  const { dark } = useDark();
  const t = (dark && !forceLight) ? T.dark : T.light;
  const sizes = { sm: { font: 15, icon: 28, iconR: 8 }, md: { font: 19, icon: 36, iconR: 10 }, lg: { font: 26, icon: 52, iconR: 14 } };
  const s = sizes[size];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: s.icon, height: s.icon, borderRadius: s.iconR, background: '#A34D12', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(163,77,18,0.3)' }}>
        <span style={{ fontSize: s.icon * 0.44, lineHeight: 1 }}>✦</span>
      </div>
      <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: s.font, color: t.text, letterSpacing: -0.3 }}>
        eka<span style={{ color: t.primary }}>traa</span>
      </span>
    </div>
  );
}

/* Section card wrapper — dark-mode aware */
function SectionCard({ icon, title, subtitle, children, id }) {
  const { dark } = useDark();
  const t = dark ? T.dark : T.light;
  return (
    <div style={{ background: t.card, borderRadius: 20, border: `1px solid ${t.border}`, boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(163,77,18,0.04)', padding: 20 }} id={id}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, minWidth: 36, borderRadius: 10, background: t.sectionIcon, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.primary }}>
          <Icon d={icon} size={17} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: 'Inter, sans-serif' }}>{title}</h3>
          {subtitle && <p style={{ margin: 0, fontSize: 12, color: t.textMuted, marginTop: 1 }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* Budget bar — dark-mode aware, animates on scroll */
function BudgetBar({ category, allocated, percentage, dark: darkProp }) {
  const { dark } = useDark();
  const t = dark ? T.dark : T.light;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{category}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: t.textMuted }}>{percentage}%</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>₹{allocated.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div style={{ width: '100%', height: 7, background: t.barTrack, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: visible ? `${percentage}%` : '0%', borderRadius: 100, background: 'linear-gradient(90deg, #A34D12 0%, #F15A24 60%, #FDBA3B 100%)', transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }} />
      </div>
    </div>
  );
}

/* Checklist item */
function CheckItem({ label, checked, onToggle }) {
  const { dark } = useDark();
  const t = dark ? T.dark : T.light;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: `1px solid ${t.border}`, opacity: checked ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <div
        onClick={onToggle}
        role="checkbox"
        aria-checked={checked}
        style={{ width: 22, height: 22, minWidth: 22, borderRadius: 6, border: `1.5px solid ${checked ? t.primary : t.checkBorder}`, background: checked ? t.primary : t.checkBox, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
      >
        {checked && <Icon d={IC.check} size={13} style={{ color: '#fff' }} strokeWidth={2.5} />}
      </div>
      <span style={{ fontSize: 14, color: t.text, textDecoration: checked ? 'line-through' : 'none', flex: 1 }}>{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   BUDGET OPTIMIZER — new bonus feature
══════════════════════════════════════════════════════════ */
function BudgetOptimizer({ budgetDistribution, totalBudget }) {
  const { dark } = useDark();
  const t = dark ? T.dark : T.light;

  // Find the venue/hall category (first category that contains "Venue" or "Hall")
  const venueIdx = budgetDistribution.findIndex(
    item => /venue|hall/i.test(item.category)
  );
  if (venueIdx === -1) return null; // no venue category — skip

  const venueItem = budgetDistribution[venueIdx];
  const [sliderPct, setSliderPct] = useState(venueItem.percentage);

  // How much was saved from the original venue allocation
  const savedPct  = venueItem.percentage - sliderPct;
  const savedAmt  = Math.round(totalBudget * savedPct / 100);

  // Redistribute savings proportionally across all OTHER categories
  const otherTotal = budgetDistribution
    .filter((_, i) => i !== venueIdx)
    .reduce((s, item) => s + item.percentage, 0);

  const optimized = budgetDistribution.map((item, i) => {
    if (i === venueIdx) {
      return { ...item, percentage: sliderPct, allocated: Math.round(totalBudget * sliderPct / 100) };
    }
    const extra = otherTotal > 0 ? (item.percentage / otherTotal) * savedPct : 0;
    const newPct = item.percentage + extra;
    return { ...item, percentage: Math.round(newPct), allocated: Math.round(totalBudget * newPct / 100) };
  });

  const isModified = sliderPct < venueItem.percentage;

  return (
    <div style={{ marginTop: 20, padding: 16, background: t.optimizerBg, borderRadius: 14, border: `1px solid ${t.optimizerBr}` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Icon d={IC.sliders} size={16} style={{ color: t.primary }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>Budget Optimizer</span>
        {isModified && (
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: t.savingsBg, color: t.savingsTxt }}>
            Saving ₹{savedAmt.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      <p style={{ margin: '0 0 14px', fontSize: 12, color: t.textSec, lineHeight: 1.55 }}>
        Drag the slider to reduce <strong style={{ color: t.text }}>{venueItem.category}</strong> cost.
        Savings are automatically redistributed across other categories.
      </p>

      {/* Slider */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: t.textSec, fontWeight: 600 }}>Venue allocation</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>{sliderPct}%</span>
            <span style={{ fontSize: 12, color: t.textMuted }}>
              ≈ ₹{Math.round(totalBudget * sliderPct / 100).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <input
          id="venue-optimizer-slider"
          type="range"
          min={5}
          max={venueItem.percentage}
          value={sliderPct}
          onChange={e => setSliderPct(Number(e.target.value))}
          style={{
            width: '100%',
            height: 6,
            accentColor: '#A34D12',
            cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMuted, marginTop: 4 }}>
          <span>5% (min)</span>
          <span>{venueItem.percentage}% (original)</span>
        </div>
      </div>

      {/* Optimized distribution */}
      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
        <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: t.textSec }}>
          {isModified ? 'Redistributed allocation:' : 'Adjust slider to see redistribution'}
        </p>
        {optimized.map((item, i) => {
          const isVenue   = i === venueIdx;
          const increased = !isVenue && isModified;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: t.text, flex: 1, fontWeight: isVenue ? 700 : 400 }}>
                {item.category}
              </span>
              <span style={{ fontSize: 11, color: t.textMuted, minWidth: 30, textAlign: 'right' }}>
                {item.percentage}%
              </span>
              {increased && (
                <span style={{ fontSize: 10, color: t.savingsTxt, fontWeight: 700 }}>▲</span>
              )}
              {isVenue && isModified && (
                <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 700 }}>▼</span>
              )}
              <span style={{ fontSize: 12, fontWeight: 700, color: t.primary, minWidth: 80, textAlign: 'right' }}>
                ₹{item.allocated.toLocaleString('en-IN')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      {isModified && (
        <button
          onClick={() => setSliderPct(venueItem.percentage)}
          style={{ marginTop: 12, fontSize: 12, color: t.textSec, background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}
        >
          Reset to original
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCREEN 1 — SPLASH
══════════════════════════════════════════════════════════ */
function SplashScreen({ onStart }) {
  const { dark } = useDark();
  const t = dark ? T.dark : T.light;
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: t.bg, padding: '40px 24px', textAlign: 'center', transition: 'background 0.3s' }}>
      {/* Dark toggle top-right */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <DarkToggle />
      </div>

      <div className="anim-fade-up" style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/ekatraa-logo.png" alt="Ekatraa Logo" style={{ width: 150, height: 'auto', marginBottom: 20 }} />
      </div>

      <h1 className="anim-fade-up delay-100" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 8vw, 42px)', fontWeight: 700, color: t.text, lineHeight: 1.2, letterSpacing: -0.5, margin: '0 0 16px', maxWidth: 320, transition: 'color 0.3s' }}>
        Plan Your Event<br />
        <span style={{ color: t.primary }}>with AI</span>
      </h1>

      <p className="anim-fade-up delay-200" style={{ fontSize: 16, color: t.textSec, maxWidth: 280, lineHeight: 1.65, margin: '0 0 48px', transition: 'color 0.3s' }}>
        Tell us the details,<br />we'll handle the checklist.
      </p>

      {/* Feature pills */}
      <div className="anim-fade-up delay-300" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 52 }}>
        {['AI-Powered Plan', 'Budget Breakdown', 'Smart Timeline', 'Vendor Match'].map(f => (
          <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: dark ? 'rgba(201,112,64,0.12)' : 'rgba(163,77,18,0.08)', color: t.primary, borderRadius: 100, fontSize: 12, fontWeight: 600, border: `1px solid ${dark ? 'rgba(201,112,64,0.2)' : 'rgba(163,77,18,0.14)'}` }}>
            {f}
          </span>
        ))}
      </div>

      <div className="anim-fade-up delay-400" style={{ width: '100%', maxWidth: 340 }}>
        <button id="splash-start-btn" className="ek-btn-primary" onClick={onStart}>
          Start Planning
          <Icon d={IC.arrow} size={18} style={{ color: '#fff' }} />
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: t.textMuted, marginTop: 14 }}>
          Free · Instant · No sign-up required
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LOADING SCREEN
══════════════════════════════════════════════════════════ */
const LOAD_STEPS = [
  'Planning your celebration…',
  'Finding services',
  'Optimising budget',
  'Building timeline',
  'Preparing checklist',
  'Matching vendors',
];

function LoadingScreen() {
  const { dark } = useDark();
  const t = dark ? T.dark : T.light;
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => { setActiveIdx(i => (i < LOAD_STEPS.length - 1 ? i + 1 : i)); }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: t.bg, padding: '40px 24px', transition: 'background 0.3s' }}>
      <div style={{ background: t.card, borderRadius: 20, border: `1px solid ${t.border}`, padding: '40px 32px', width: '100%', maxWidth: 400, textAlign: 'center', boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(163,77,18,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div className="ek-spinner" />
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: t.text, margin: '0 0 8px' }}>
          {LOAD_STEPS[activeIdx]}
        </h3>
        <p style={{ fontSize: 13, color: t.textMuted, margin: '0 0 28px' }}>Our AI is crafting your personalised event plan</p>
        <div style={{ textAlign: 'left' }}>
          {LOAD_STEPS.slice(1).map((step, i) => {
            const idx = i + 1;
            const isDone = idx < activeIdx, isActive = idx === activeIdx;
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', fontSize: 14, color: isDone ? '#16A34A' : isActive ? t.primary : t.textMuted, fontWeight: isActive ? 600 : 400, transition: 'color 0.3s' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? '#DCF5E7' : isActive ? t.sectionIcon : t.surface, flexShrink: 0 }}>
                  {isDone ? <Icon d={IC.check} size={11} style={{ color: '#16A34A' }} strokeWidth={2.5} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? t.primary : t.textMuted, display: 'block' }} />}
                </div>
                {step}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCREEN 2 — EVENT DETAILS FORM
══════════════════════════════════════════════════════════ */
function EventDetailsScreen({ formData, setFormData, onBack, onSubmit, loading }) {
  const { dark } = useDark();
  const t = dark ? T.dark : T.light;
  const today = new Date().toISOString().split('T')[0];
  const daysUntil = formData.event_date ? Math.ceil((new Date(formData.event_date) - new Date()) / 86400000) : null;

  const cardStyle = { background: t.card, borderRadius: 20, border: `1px solid ${t.border}`, padding: 20, boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)' };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: t.textSec, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 10 };
  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${t.inputBorder}`, background: t.inputBg, fontFamily: 'inherit', fontSize: 15, color: t.text, outline: 'none', appearance: 'none', WebkitAppearance: 'none', transition: 'border-color 0.2s, background 0.2s' };
  const inputWithIconStyle = { ...inputStyle, paddingLeft: 42 };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', flexDirection: 'column', transition: 'background 0.3s' }}>
      {/* Top bar */}
      <div style={{ background: t.navBg, borderBottom: `1px solid ${t.navBorder}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50, boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.04)', transition: 'background 0.3s' }}>
        <button onClick={onBack} style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: t.textSec, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 500 }}>
          <Icon d={IC.arrowL} size={17} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Playfair Display', serif" }}>Let's Plan Your Celebration</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>Fill in the details below</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: t.primary, background: t.sectionIcon, padding: '4px 10px', borderRadius: 100 }}>Step 2 of 3</span>
        <DarkToggle />
      </div>

      <div style={{ maxWidth: 500, width: '100%', margin: '0 auto', padding: '0 16px', paddingTop: 20, paddingBottom: 100 }}>
        {/* Progress */}
        <div style={{ height: 4, background: t.barTrack, borderRadius: 100, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '66%', background: 'linear-gradient(90deg, #A34D12, #F15A24)', borderRadius: 100 }} />
        </div>

        <form id="event-form" onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Event Type */}
          <div className="anim-fade-up" style={cardStyle}>
            <label style={labelStyle}>Event Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {EVENT_TYPES.map(et => {
                const sel = formData.event_type === et.value;
                return (
                  <button key={et.value} type="button" id={`event-type-${et.value}`}
                    onClick={() => setFormData({ ...formData, event_type: et.value })}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '16px 12px', borderRadius: 14, border: `1.5px solid ${sel ? '#F15A24' : t.border}`, background: sel ? (dark ? 'rgba(241,90,36,0.1)' : 'rgba(241,90,36,0.05)') : t.inputBg, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease', position: 'relative' }}
                  >
                    <span style={{ fontSize: 26 }}>{et.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{et.label}</span>
                    <span style={{ fontSize: 10, color: t.textMuted }}>{et.desc}</span>
                    {sel && <span style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: '#F15A24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={IC.check} size={9} style={{ color: '#fff' }} strokeWidth={2.5} /></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* City */}
          <div className="anim-fade-up delay-50" style={cardStyle}>
            <label htmlFor="city-input" style={labelStyle}>City</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: t.primary, pointerEvents: 'none' }}><Icon d={IC.location} size={17} /></span>
              <input id="city-input" type="text" required placeholder="Mumbai, Delhi, Bangalore…" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} style={inputWithIconStyle} />
            </div>
          </div>

          {/* Guests */}
          <div className="anim-fade-up delay-100" style={cardStyle}>
            <label htmlFor="guests-input" style={labelStyle}>Number of Guests</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: t.primary, pointerEvents: 'none' }}><Icon d={IC.users} size={17} /></span>
              <input id="guests-input" type="number" required min={1} placeholder="e.g. 150" value={formData.guests} onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) || 0 })} style={inputWithIconStyle} />
            </div>
            {formData.guests > 300 && <p style={{ margin: '8px 0 0', fontSize: 12, color: t.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Icon d={IC.sparkle} size={12} style={{ color: t.primary }} /> Large event — Valet Parking & Security included automatically</p>}
            {formData.guests > 100 && formData.guests <= 300 && <p style={{ margin: '8px 0 0', fontSize: 12, color: t.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Icon d={IC.sparkle} size={12} style={{ color: t.primary }} /> Live Food Counters will be added for this size</p>}
          </div>

          {/* Budget */}
          <div className="anim-fade-up delay-150" style={cardStyle}>
            <label htmlFor="budget-input" style={labelStyle}>Total Budget</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: t.primary, fontSize: 16, fontWeight: 700, fontFamily: 'serif', pointerEvents: 'none' }}>₹</span>
              <input id="budget-input" type="number" required min={1} placeholder="5,00,000" value={formData.budget} onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })} style={inputWithIconStyle} />
            </div>
            {formData.budget > 0 && formData.guests > 0 && <p style={{ margin: '8px 0 0', fontSize: 12, color: t.textMuted }}>≈ ₹{Math.round(formData.budget / formData.guests).toLocaleString('en-IN')} per guest</p>}
          </div>

          {/* Event Date */}
          <div className="anim-fade-up delay-200" style={cardStyle}>
            <label htmlFor="event-date-input" style={labelStyle}>Event Date</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: t.primary, pointerEvents: 'none' }}><Icon d={IC.calendar} size={17} /></span>
              <input id="event-date-input" type="date" required min={today} value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} style={{ ...inputWithIconStyle, colorScheme: dark ? 'dark' : 'light' }} />
            </div>
            {daysUntil !== null && daysUntil > 0 && <p style={{ margin: '8px 0 0', fontSize: 12, color: t.textMuted }}>{daysUntil} day{daysUntil !== 1 ? 's' : ''} from today</p>}
          </div>

          {/* Additional Requirements */}
          <div className="anim-fade-up delay-250" style={cardStyle}>
            <label htmlFor="requirements-input" style={labelStyle}>Additional Requirements</label>
            <textarea id="requirements-input" rows={4} placeholder={'Outdoor venue preferred\nVegetarian catering\nLive music\nWheelchair accessibility'} value={formData.additional_requirements} onChange={e => setFormData({ ...formData, additional_requirements: e.target.value })} style={{ ...inputStyle, resize: 'none', lineHeight: 1.65 }} />
          </div>

          {/* CTA */}
          <div className="anim-fade-up delay-300" style={{ paddingTop: 4 }}>
            <button id="generate-plan-btn" type="submit" className="ek-btn-primary" disabled={loading}>
              <Icon d={IC.sparkle} size={18} style={{ color: '#fff' }} />
              ✨ Generate AI Event Plan
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: t.textMuted, marginTop: 12 }}>Powered by Ekatraa AI · Instant · Free</p>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCREEN 3 — AI EVENT PLAN
══════════════════════════════════════════════════════════ */
const RESULT_TABS = [
  { id: 'services',  label: 'Services',  icon: IC.services },
  { id: 'budget',    label: 'Budget',    icon: IC.budget   },
  { id: 'timeline',  label: 'Timeline',  icon: IC.clock    },
  { id: 'checklist', label: 'Checklist', icon: IC.list     },
  { id: 'vendors',   label: 'Vendors',   icon: IC.store    },
];

function ResultScreen({ result, formData, onPlanAnother }) {
  const { dark } = useDark();
  const t = dark ? T.dark : T.light;
  const [activeTab,    setActiveTab]   = useState('services');
  const [checkStates,  setCheckStates] = useState({});
  const [exporting,    setExporting]   = useState(false);

  const eventType = EVENT_TYPES.find(e => e.value === formData.event_type) ?? EVENT_TYPES[0];
  const vendors   = VENDOR_DATA[formData.event_type] ?? VENDOR_DATA.wedding;
  const insights  = AI_INSIGHTS[formData.event_type] ?? AI_INSIGHTS.wedding;
  const checklist = result.required_services.map(s => `Book / arrange — ${s}`);
  const toggleCheck = label => setCheckStates(prev => ({ ...prev, [label]: !prev[label] }));
  const scrollingRef = useRef(false); // prevent observer firing during programmatic scroll

  const scrollToTab = tabId => {
    scrollingRef.current = true;
    setActiveTab(tabId);
    const el = document.getElementById(`section-${tabId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Re-enable observer after scroll animation completes (~800ms)
    setTimeout(() => { scrollingRef.current = false; }, 900);
  };

  /* ── Scroll Spy — auto-highlight tab as user scrolls ── */
  useEffect(() => {
    const TAB_IDS = ['services', 'budget', 'timeline', 'checklist', 'vendors'];

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingRef.current) return; // skip during programmatic scroll

        // Find the entry with the highest intersection ratio that is visible
        let best = null;
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        });

        if (best) {
          const id = best.target.id.replace('section-', '');
          setActiveTab(id);
          // Scroll the tab button into view inside the scrollable tab bar
          const tabBtn = document.getElementById(`tab-btn-${id}`);
          if (tabBtn) tabBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      },
      {
        // Fire when section crosses 20% visible threshold
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5],
        // Shrink the top margin to account for the sticky tab bar (~60px)
        rootMargin: '-60px 0px -40% 0px',
      }
    );

    TAB_IDS.forEach(id => {
      const el = document.getElementById(`section-${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ── PDF Export ── */
  const exportToPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 18;
      const colW = pageW - margin * 2;
      let y = 0;

      const checkPage = (needed = 14) => {
        if (y + needed > pageH - 16) { doc.addPage(); y = margin; }
      };

      // ── Header band
      doc.setFillColor(163, 77, 18);
      doc.rect(0, 0, pageW, 36, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('ekatraa', margin, 14);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('AI Event Planner', margin, 20);

      // Event label top-right
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${eventType.emoji} ${eventType.label} Plan`, pageW - margin, 14, { align: 'right' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageW - margin, 20, { align: 'right' });

      y = 44;

      // ── Event meta row
      doc.setFillColor(253, 245, 239);
      doc.roundedRect(margin, y, colW, 18, 3, 3, 'F');
      const meta = [
        { label: 'City', val: formData.city || 'N/A' },
        { label: 'Guests', val: Number(formData.guests).toLocaleString('en-IN') },
        { label: 'Budget', val: `Rs.${Number(formData.budget).toLocaleString('en-IN')}` },
        { label: 'Date', val: new Date(formData.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
      ];
      const metaCellW = colW / meta.length;
      meta.forEach((m, i) => {
        const cx = margin + i * metaCellW + metaCellW / 2;
        doc.setFontSize(7); doc.setTextColor(107, 114, 128); doc.setFont('helvetica', 'normal');
        doc.text(m.label.toUpperCase(), cx, y + 6, { align: 'center' });
        doc.setFontSize(9); doc.setTextColor(34, 34, 34); doc.setFont('helvetica', 'bold');
        doc.text(m.val, cx, y + 13, { align: 'center' });
      });
      y += 26;

      // ── Section helper
      const sectionTitle = (title) => {
        checkPage(14);
        doc.setFillColor(241, 90, 36);
        doc.rect(margin, y, 3, 8, 'F');
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(34, 34, 34);
        doc.text(title, margin + 6, y + 6);
        y += 13;
      };

      const divider = () => {
        doc.setDrawColor(236, 236, 236);
        doc.line(margin, y, pageW - margin, y);
        y += 6;
      };

      // ── 1. Required Services
      sectionTitle('Required Services');
      const services = result.required_services;
      let sx = margin;
      services.forEach((svc, i) => {
        const icon = SERVICE_ICONS[svc] ?? '•';
        const label = `${icon} ${svc}`;
        const tw = doc.getTextWidth(label) + 8;
        if (sx + tw > pageW - margin) { sx = margin; y += 10; checkPage(10); }
        doc.setFillColor(253, 245, 239);
        doc.roundedRect(sx, y - 5, tw, 8, 2, 2, 'F');
        doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(34, 34, 34);
        doc.text(label, sx + 4, y + 0.5);
        sx += tw + 4;
      });
      y += 14;
      divider();

      // ── 2. Budget Distribution
      sectionTitle('Budget Distribution');
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(107, 114, 128);
      doc.text(`Total: Rs.${Number(formData.budget).toLocaleString('en-IN')}`, pageW - margin, y - 5, { align: 'right' });

      result.budget_distribution.forEach(item => {
        checkPage(14);
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(34, 34, 34);
        doc.text(item.category, margin, y);
        doc.setFont('helvetica', 'bold'); doc.setTextColor(163, 77, 18);
        doc.text(`Rs.${item.allocated.toLocaleString('en-IN')} (${item.percentage}%)`, pageW - margin, y, { align: 'right' });
        // bar track
        doc.setFillColor(240, 235, 230);
        doc.roundedRect(margin, y + 2, colW, 4, 1, 1, 'F');
        // bar fill
        doc.setFillColor(163, 77, 18);
        doc.roundedRect(margin, y + 2, colW * item.percentage / 100, 4, 1, 1, 'F');
        y += 13;
      });
      y += 4;
      divider();

      // ── 3. Timeline
      if (result.timeline?.length > 0) {
        sectionTitle('Event Timeline');
        result.timeline.forEach((item, i) => {
          checkPage(12);
          const eventDate = new Date(formData.event_date);
          const itemDate  = new Date(item.date);
          const daysLeft  = Math.ceil((eventDate - itemDate) / 86400000);
          const dateLabel = new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          // dot
          doc.setFillColor(163, 77, 18);
          doc.circle(margin + 2, y - 1, 2, 'F');
          // connector line
          if (i < result.timeline.length - 1) {
            doc.setDrawColor(163, 77, 18, 0.3);
            doc.line(margin + 2, y + 1, margin + 2, y + 11);
          }
          doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(163, 77, 18);
          doc.text(daysLeft > 0 ? `${daysLeft} days before` : 'Event Day', margin + 8, y);
          doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(34, 34, 34);
          doc.text(item.task, margin + 8, y + 5);
          doc.setFontSize(7); doc.setTextColor(156, 163, 175);
          doc.text(dateLabel, margin + 8, y + 9.5);
          y += 14;
        });
        // Event day cap
        checkPage(12);
        doc.setFillColor(253, 186, 59);
        doc.circle(margin + 2, y - 1, 2, 'F');
        doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(146, 102, 10);
        doc.text('EVENT DAY', margin + 8, y);
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(34, 34, 34);
        doc.text(
          `${eventType.label} — ${new Date(formData.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
          margin + 8, y + 5
        );
        y += 18;
        divider();
      }

      // ── 4. Checklist
      sectionTitle('Event Checklist');
      checklist.forEach(label => {
        checkPage(9);
        doc.setDrawColor(200, 200, 200);
        doc.roundedRect(margin, y - 4.5, 5, 5, 1, 1);
        doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(34, 34, 34);
        doc.text(label, margin + 8, y);
        y += 9;
      });
      y += 4;
      divider();

      // ── 5. Suggested Vendors
      sectionTitle('Suggested Vendors');
      vendors.forEach(v => {
        checkPage(16);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(margin, y - 4, colW, 14, 2, 2, 'F');
        doc.setDrawColor(236, 236, 236);
        doc.roundedRect(margin, y - 4, colW, 14, 2, 2);
        // Avatar
        doc.setFillColor(163, 77, 18);
        doc.roundedRect(margin + 3, y - 1, 8, 8, 1, 1, 'F');
        doc.setFontSize(6); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold');
        doc.text(v.name[0], margin + 7, y + 4.5, { align: 'center' });
        // Name & category
        doc.setFontSize(9); doc.setTextColor(34, 34, 34); doc.setFont('helvetica', 'bold');
        doc.text(v.name, margin + 14, y + 1.5);
        doc.setFontSize(7); doc.setTextColor(156, 163, 175); doc.setFont('helvetica', 'normal');
        doc.text(v.category, margin + 14, y + 6.5);
        // Rating
        doc.setFontSize(7); doc.setTextColor(107, 114, 128);
        doc.text(`★ ${v.rating}`, margin + 14, y + 11);
        // Price
        doc.setFontSize(8); doc.setTextColor(163, 77, 18); doc.setFont('helvetica', 'bold');
        doc.text(v.price, pageW - margin - 3, y + 4, { align: 'right' });
        y += 18;
      });
      divider();

      // ── 6. AI Suggestions
      sectionTitle('AI Suggestions');
      insights.forEach(tip => {
        checkPage(10);
        doc.setFillColor(163, 77, 18);
        doc.circle(margin + 1.5, y - 1.5, 1.5, 'F');
        doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(34, 34, 34);
        const lines = doc.splitTextToSize(tip, colW - 8);
        doc.text(lines, margin + 6, y);
        y += lines.length * 5 + 5;
      });

      // ── Footer on every page
      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFillColor(248, 245, 242);
        doc.rect(0, pageH - 10, pageW, 10, 'F');
        doc.setFontSize(7); doc.setTextColor(156, 163, 175); doc.setFont('helvetica', 'normal');
        doc.text('Generated by Ekatraa AI Event Planner · ekatraa-api.onrender.com', margin, pageH - 3.5);
        doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 3.5, { align: 'right' });
      }

      const filename = `Ekatraa_${eventType.label}_Plan_${formData.event_date}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Please try again.');
    }
    setExporting(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', flexDirection: 'column', transition: 'background 0.3s' }}>

      {/* Plan Hero Banner */}
      <div style={{ background: dark ? '#1A2E1A' : '#A34D12', borderRadius: '0 0 28px 28px', padding: '28px 20px 32px', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }} className="anim-fade-in">
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', right: 20, bottom: -60, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, position: 'relative', zIndex: 1 }}>
          <img src="/ekatraa-logo.png" alt="Ekatraa" style={{ height: 36, width: 'auto', filter: dark ? 'none' : 'brightness(0) invert(1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)' }}>✨ AI Generated Plan</span>
            <DarkToggle />
          </div>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#FFFFFF', margin: '0 0 18px', lineHeight: 1.25, position: 'relative', zIndex: 1 }}>
          Your {eventType.label} Plan
        </h1>

        {/* Meta chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {[
            { icon: '📍', val: formData.city || 'N/A' },
            { icon: '👥', val: `${Number(formData.guests).toLocaleString('en-IN')} Guests` },
            { icon: '💰', val: `₹${Number(formData.budget).toLocaleString('en-IN')}` },
            { icon: '📅', val: new Date(formData.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
          ].map(({ icon, val }) => (
            <span key={val} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(255,255,255,0.14)', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }}>
              {icon} {val}
            </span>
          ))}
        </div>
      </div>

      {/* Sticky Tab Bar */}
      <div style={{ background: t.bg, padding: '14px 16px', position: 'sticky', top: 0, zIndex: 40, transition: 'background 0.3s' }}>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: 4, background: t.tabBg, borderRadius: 14, border: `1px solid ${t.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', scrollbarWidth: 'none' }}>
          {RESULT_TABS.map(tab => (
            <button key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => scrollToTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, border: 'none', background: activeTab === tab.id ? t.sectionIcon : 'transparent', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: activeTab === tab.id ? t.primary : t.textMuted, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.18s' }}
            >
              <Icon d={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 500, width: '100%', margin: '0 auto', padding: '4px 16px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Services */}
          <div id="section-services" className="anim-fade-up delay-50">
            <SectionCard id="services-card" icon={IC.services} title="Required Services" subtitle="AI recommends these based on your event type & budget">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {result.required_services.map((service, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: t.surfaceAlt, color: t.text, borderRadius: 12, fontSize: 13, fontWeight: 500, border: `1px solid ${t.border}` }}>
                    <span style={{ fontSize: 16 }}>{SERVICE_ICONS[service] ?? '✦'}</span>
                    {service}
                  </span>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Budget */}
          <div id="section-budget" className="anim-fade-up delay-100">
            <SectionCard id="budget-card" icon={IC.budget} title="Budget Distribution" subtitle="How your budget is allocated across categories">
              {/* Total chip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: t.totalChip, borderRadius: 12, marginBottom: 20, border: `1px solid ${t.totalBorder}` }}>
                <span style={{ fontSize: 13, color: t.textSec, fontWeight: 600 }}>Total Budget</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: t.primary, fontFamily: "'Playfair Display', serif" }}>
                  ₹{Number(formData.budget).toLocaleString('en-IN')}
                </span>
              </div>
              {result.budget_distribution.map((item, i) => (
                <BudgetBar key={i} {...item} />
              ))}

              {/* ── BUDGET OPTIMIZER ── */}
              <BudgetOptimizer
                budgetDistribution={result.budget_distribution}
                totalBudget={formData.budget}
              />
            </SectionCard>
          </div>

          {/* Timeline */}
          {result.timeline?.length > 0 && (
            <div id="section-timeline" className="anim-fade-up delay-150">
              <SectionCard id="timeline-card" icon={IC.clock} title="Event Timeline" subtitle="Your planning milestones">
                <div style={{ position: 'relative', paddingLeft: 28, paddingTop: 4 }}>
                  <div style={{ position: 'absolute', left: 11, top: 14, bottom: 0, width: 2, background: `linear-gradient(180deg, ${t.primary} 0%, ${t.barTrack} 100%)`, borderRadius: 100 }} />
                  {result.timeline.map((item, i) => {
                    const eventDate = new Date(formData.event_date);
                    const itemDate  = new Date(item.date);
                    const daysLeft  = Math.ceil((eventDate - itemDate) / 86400000);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingBottom: i < result.timeline.length - 1 ? 24 : 0, position: 'relative' }}>
                        <div style={{ width: 10, height: 10, minWidth: 10, borderRadius: '50%', background: t.primary, border: `2px solid ${t.card}`, boxShadow: `0 0 0 2px ${t.primary}44`, marginTop: 4, position: 'absolute', left: -22 }} />
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: t.primary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>
                            {daysLeft > 0 ? `${daysLeft} Days Before` : 'Event Day 🎉'}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{item.task}</div>
                          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                            {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
                    <div style={{ width: 10, height: 10, minWidth: 10, borderRadius: '50%', background: '#FDBA3B', border: `2px solid ${t.card}`, boxShadow: '0 0 0 3px rgba(253,186,59,0.25)', marginTop: 4, position: 'absolute', left: -22 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#92660A', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>Event Day 🎉</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>
                        Your {eventType.label} — {new Date(formData.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* Checklist */}
          <div id="section-checklist" className="anim-fade-up delay-200">
            <SectionCard id="checklist-card" icon={IC.list} title="Event Checklist" subtitle="Tap to mark items as done">
              {checklist.map((label, i) => (
                <CheckItem key={i} label={label} checked={!!checkStates[label]} onToggle={() => toggleCheck(label)} />
              ))}
              {Object.values(checkStates).filter(Boolean).length > 0 && (
                <div style={{ marginTop: 14, padding: '8px 14px', background: t.savingsBg, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon d={IC.check} size={14} style={{ color: t.savingsTxt }} strokeWidth={2.5} />
                  <span style={{ fontSize: 13, color: t.savingsTxt, fontWeight: 600 }}>
                    {Object.values(checkStates).filter(Boolean).length} of {checklist.length} tasks completed
                  </span>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Vendors */}
          <div id="section-vendors" className="anim-fade-up delay-250">
            <SectionCard id="vendors-card" icon={IC.store} title="Suggested Vendors" subtitle="Verified professionals for your event">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {vendors.map((v, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: t.vendorCard, borderRadius: 14, border: `1px solid ${t.border}`, transition: 'border-color 0.2s' }}>
                    <div style={{ width: 42, height: 42, minWidth: 42, borderRadius: 12, background: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#6B3A10' }}>{v.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{v.name}</span>
                        <Icon d={IC.verified} size={13} style={{ color: '#16A34A' }} />
                      </div>
                      <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>{v.category}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ display: 'flex', gap: 1 }}>
                          {[1,2,3,4,5].map(s => <Icon key={s} d={IC.star} size={10} fill={s <= Math.floor(v.rating) ? '#FDBA3B' : 'none'} style={{ color: '#FDBA3B' }} />)}
                        </div>
                        <span style={{ fontSize: 11, color: t.textSec, fontWeight: 600 }}>{v.rating}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: t.primary, marginBottom: 6 }}>{v.price}</div>
                      <button style={{ padding: '5px 12px', fontSize: 11, fontWeight: 600, color: t.primary, background: t.sectionIcon, border: `1px solid ${t.optimizerBr}`, borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* AI Insights */}
          <div className="anim-fade-up delay-300">
            <div style={{ background: t.insightBg, border: `1px solid ${t.insightBdr}`, borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: t.primary }}>AI Suggestions</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {insights.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                    <span style={{ color: t.primary, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✦</span>
                    <span style={{ fontSize: 13, color: t.insightTxt, lineHeight: 1.55 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="anim-fade-up delay-350" style={{ paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              id="export-plan-btn"
              className="ek-btn-primary"
              onClick={exportToPDF}
              disabled={exporting}
              style={exporting ? { opacity: 0.7, cursor: 'wait' } : {}}
            >
              {exporting ? (
                <>
                  <span style={{ width: 17, height: 17, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.75s linear infinite' }} />
                  Generating PDF…
                </>
              ) : (
                <>
                  <Icon d={IC.share} size={17} style={{ color: '#fff' }} />
                  Export Plan as PDF
                </>
              )}
            </button>
            <button id="plan-another-btn" className="ek-btn-outline" onClick={onPlanAnother}>
              <Icon d={IC.arrowL} size={17} style={{ color: '#A34D12' }} />
              Plan Another Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT — App (all state & logic lives here, unchanged)
══════════════════════════════════════════════════════════ */
export default function App() {
  /* ── Dark mode state ── */
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('ek-dark') === 'true'; } catch { return false; }
  });
  const toggleDark = () => setDark(d => {
    const next = !d;
    try { localStorage.setItem('ek-dark', String(next)); } catch {}
    return next;
  });

  /* Sync <html> background to prevent flash */
  useEffect(() => {
    document.documentElement.style.background = dark ? '#0F172A' : '#FFF9F5';
    document.body.style.background = dark ? '#0F172A' : '#FFF9F5';
  }, [dark]);

  /* ── State — PRESERVED EXACTLY ── */
  const [formData, setFormData] = useState({
    event_type:              'wedding',
    city:                    '',
    guests:                  100,
    budget:                  500000,
    event_date:              '2026-10-25',
    additional_requirements: '',
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  /* ── Screen state (UI only) ── */
  const [screen, setScreen] = useState('splash');

  /* ── API call — PRESERVED EXACTLY ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setScreen('result');
    try {
      const response = await fetch('https://ekatraa-api.onrender.com/api/v1/predict-plan', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Error connecting to backend! Is your Python server running in the other terminal?');
      setScreen('form');
    }
    setLoading(false);
  };

  /* ── Plan Another ── */
  const handlePlanAnother = () => {
    setResult(null);
    setScreen('splash');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Screen routing ── */
  return (
    <DarkModeContext.Provider value={{ dark, toggle: toggleDark }}>
      {screen === 'splash' && <SplashScreen onStart={() => setScreen('form')} />}

      {screen === 'form' && !loading && (
        <EventDetailsScreen
          formData={formData}
          setFormData={setFormData}
          onBack={() => setScreen('splash')}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}

      {screen === 'result' && loading && <LoadingScreen />}

      {screen === 'result' && result && !loading && (
        <ResultScreen
          result={result}
          formData={formData}
          onPlanAnother={handlePlanAnother}
        />
      )}
    </DarkModeContext.Provider>
  );
}