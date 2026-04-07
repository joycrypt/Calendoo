import React, { useState, useMemo } from 'react';
import './App.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const IMAGES = [
  'https://res.cloudinary.com/dffke2hbp/image/upload/v1775583992/OIP_ey6jar.jpg',
  'https://res.cloudinary.com/dffke2hbp/image/upload/v1775584049/photo-1506905925346-21bda4d32df4_kkpobj.jpg',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&h=400&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=900&h=400&fit=crop',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=900&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=400&fit=crop',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=900&h=400&fit=crop',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&h=400&fit=crop',
  'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&h=400&fit=crop',
];

const HOLIDAYS = {
  '0-1': 'New Year',
  '1-14': "Valentine's",
  '2-17': "St. Patrick's",
  '3-1': 'April Fools',
  '6-4': 'Indep. Day',
  '9-31': 'Halloween',
  '11-25': 'Christmas',
  '11-31': 'New Year Eve',
};

function fmt(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function sameDay(a, b) {
  return a && b && fmt(a) === fmt(b);
}
function buildGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const pos = i - offset;
    if (pos < 0)
      cells.push({ date: new Date(year, month - 1, prevDays + pos + 1), cur: false });
    else if (pos >= daysInMonth)
      cells.push({ date: new Date(year, month + 1, pos - daysInMonth + 1), cur: false });
    else
      cells.push({ date: new Date(year, month, pos + 1), cur: true });
  }
  return cells;
}

export default function WallCalendar() {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [monthNotes, setMonthNotes] = useState({});
  const [rangeNotes, setRangeNotes] = useState({});

  const grid = useMemo(() => buildGrid(view.y, view.m), [view]);
  const imgSrc = IMAGES[view.m];

  function prevM() { setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }); }
  function nextM() { setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }); }
  function goToday() { setView({ y: today.getFullYear(), m: today.getMonth() }); }

  function handleClick(date) {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date); setRangeEnd(null);
    } else {
      if (date < rangeStart) { setRangeEnd(rangeStart); setRangeStart(date); }
      else { setRangeEnd(date); }
    }
  }

  function cellClass({ date, cur }) {
    const dow = date.getDay();
    const classes = ['day-cell'];
    if (!cur) classes.push('other-month');
    if (dow === 0 || dow === 6) classes.push('weekend');
    if (sameDay(date, today)) classes.push('is-today');
    if (sameDay(date, rangeStart)) classes.push('range-start');
    if (sameDay(date, rangeEnd)) classes.push('range-end');
    if (rangeStart && rangeEnd && date > rangeStart && date < rangeEnd) classes.push('in-range');
    return classes.join(' ');
  }

  const mnKey = `${view.y}-${view.m}`;
  const rnKey = rangeStart && rangeEnd
    ? `${fmt(rangeStart)}_${fmt(rangeEnd)}`
    : rangeStart ? fmt(rangeStart) : null;

  function hasNote(date) {
    const k = fmt(date);
    return Object.keys(rangeNotes).some(rk => rk === k || rk.startsWith(k + '_') || rk.endsWith('_' + k));
  }

  const rangeLabel = rangeStart && rangeEnd
    ? `${rangeStart.toLocaleDateString()} – ${rangeEnd.toLocaleDateString()}`
    : rangeStart ? rangeStart.toLocaleDateString() : null;

  return (
    <>

      {/* ── Wall scene wrapper ───────────────────────────────────── */}
      <div className="wall-scene">
        <div className="hang-wrap">

          {/* Nail */}
          <div className="nail">
            <div className="nail-head" />
            <div className="nail-shaft" />
          </div>

          {/* Hanging string – natural droop from nail to left/right ends of spiral binding */}
          <svg className="string-svg" viewBox="0 0 200 48" preserveAspectRatio="none">
            {/* Left string – nail to left edge of spiral bar */}
            <path
              className="string-path"
              d="M100 2 C 70 8, 30 28, 10 42"
            />
            {/* Right string – nail to right edge of spiral bar */}
            <path
              className="string-path"
              d="M100 2 C 130 8, 170 28, 190 42"
            />
          </svg>

          {/* ── The calendar card ─────────────────────────────────── */}
          <div className="cal-card">

            {/* Spiral binding */}
            {/* <div className="spiral-bar">
              {[...Array(10)].map((_, i) => <div key={i} className="spiral-hole" />)}
            </div> */}

            <div className="spiral-bar">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="spiral-ring">
                  <div className="spiral-ring-core" />
                  <div className="spiral-ring-highlight" />
                  <div className="spiral-ring-shadow" />
                </div>
              ))}
            </div>

            {/* Hero image */}
            <div className="hero-section">
              <img className="hero-img" src={imgSrc} alt={MONTHS[view.m]} />
              <div className="hero-overlay" />
              <div className="hero-badge">
                <div className="year-lbl">{view.y}</div>
                <div className="month-lbl">{MONTHS[view.m]}</div>
              </div>
            </div>

            {/* Body */}
            <div className="body-wrap">

              {/* Calendar panel */}
              <div className="cal-panel">
                <div className="nav-row">
                  <div className="nav-group">
                    <button className="nav-btn" onClick={prevM}>&#8592;</button>
                    <button className="nav-btn today" onClick={goToday}>Today</button>
                    <button className="nav-btn" onClick={nextM}>&#8594;</button>
                  </div>
                  <span className="range-hint">
                    {rangeLabel ?? 'Click to select'}
                  </span>
                </div>

                <div className="wd-row">
                  {WEEKDAYS.map(d => <div key={d} className="wd-lbl">{d}</div>)}
                </div>

                <div className="days-grid">
                  {grid.map(({ date, cur }, i) => {
                    const hKey = `${date.getMonth()}-${date.getDate()}`;
                    const holiday = HOLIDAYS[hKey];
                    return (
                      <div
                        key={i}
                        className={cellClass({ date, cur })}
                        onClick={() => handleClick(date)}
                        title={holiday || undefined}
                      >
                        <span className="day-num">{date.getDate()}</span>
                        {holiday && cur && (
                          <span className="holiday-badge">{holiday.slice(0, 6)}</span>
                        )}
                        {hasNote(date) && <span className="note-dot" />}
                      </div>
                    );
                  })}
                </div>

                <div className="range-info">
                  <span>
                    {rangeLabel ?? <em style={{ opacity: 0.6 }}>No dates selected</em>}
                  </span>
                  {(rangeStart || rangeEnd) && (
                    <button
                      className="clear-btn"
                      onClick={() => { setRangeStart(null); setRangeEnd(null); }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Notes panel */}
              <div className="notes-panel">
                <div className="notes-heading">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <rect x="2" y="1" width="12" height="14" rx="2" stroke="#6b7280" strokeWidth="1" fill="none" />
                    <line x1="5" y1="5" x2="11" y2="5" stroke="#6b7280" strokeWidth="0.8" />
                    <line x1="5" y1="8" x2="11" y2="8" stroke="#6b7280" strokeWidth="0.8" />
                    <line x1="5" y1="11" x2="8.5" y2="11" stroke="#6b7280" strokeWidth="0.8" />
                  </svg>
                  Notes
                </div>

                <div className="notes-label">This month</div>
                <textarea
                  className="notes-ta"
                  rows={4}
                  placeholder="Goals, reminders…"
                  value={monthNotes[mnKey] ?? ''}
                  onChange={e => setMonthNotes(n => ({ ...n, [mnKey]: e.target.value }))}
                />

                {rnKey ? (
                  <>
                    <div className="notes-label">Selected period</div>
                    <textarea
                      className="notes-ta"
                      rows={4}
                      placeholder={`Notes for ${rangeLabel}…`}
                      value={rangeNotes[rnKey] ?? ''}
                      onChange={e => setRangeNotes(n => ({ ...n, [rnKey]: e.target.value }))}
                    />
                    <div className="notes-hint">Saved per range</div>
                  </>
                ) : (
                  <div className="notes-hint" style={{ marginTop: 8 }}>
                    Select a date or range to attach notes.
                  </div>
                )}
              </div>

            </div>
          </div>
          {/* end cal-card */}

        </div>
        {/* end hang-wrap */}
      </div>
    </>
  );
}
