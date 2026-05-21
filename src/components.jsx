// Reusable UI components for the personal site.
// All Babel scripts share window scope but each transpiles independently —
// so anything used elsewhere has to be hoisted onto window at the bottom.

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ──────────────────────────────────────────────────────────────────────────
// Box-drawing utilities. ASCII density (0-10) maps to one of three modes:
//   bare    (0-3)  — no frames, hairline CSS rules
//   light   (4-7)  — single-line box drawing (┌ ─ ┐ │ └ ┘)
//   heavy   (8-10) — double-line + corner glyphs (╔ ═ ╗ ║ ╚ ╝ + ◆ ornaments)
// ──────────────────────────────────────────────────────────────────────────

function densityMode(d) {
  if (d <= 3) return 'bare';
  if (d <= 7) return 'light';
  return 'heavy';
}

const GLYPHS = {
  bare:  { tl:'',   tr:'',   bl:'',   br:'',   h:'',  v:'',  cross:'',  prefix:'',  bullet:'·' },
  light: { tl:'┌',  tr:'┐',  bl:'└',  br:'┘',  h:'─', v:'│', cross:'┼', prefix:'─', bullet:'•' },
  heavy: { tl:'╔',  tr:'╗',  bl:'╚',  br:'╝',  h:'═', v:'║', cross:'╬', prefix:'═', bullet:'◆' },
};

// Section header: "─── 03 ── ./work ──────────"  with adaptive rule length.
function SectionHeader({ index, name, density, count }) {
  const m = densityMode(density);
  const g = GLYPHS[m];
  const num = String(index).padStart(2, '0');
  const after = count != null ? `   [${count}]` : '';
  return (
    <header className={`sec-h sec-h--${m}`} id={`sec-${name.replace(/[^a-z0-9]+/gi,'-')}`}>
      {m === 'bare' ? (
        <>
          <span className="sec-h-num">{num}</span>
          <span className="sec-h-name">./{name}</span>
          <span className="sec-h-after">{after}</span>
          <span className="sec-h-rule" aria-hidden="true" />
        </>
      ) : (
        <>
          <span className="sec-h-pre" aria-hidden="true">{g.h.repeat(3)}{' '}</span>
          <span className="sec-h-num">{num}</span>
          <span className="sec-h-pre" aria-hidden="true">{' '}{g.h.repeat(2)}{' '}</span>
          <span className="sec-h-name">./{name}</span>
          {count != null && <span className="sec-h-after">{`  [${count}]`}</span>}
          <span className="sec-h-rule sec-h-rule--ascii" aria-hidden="true">{g.h.repeat(200)}</span>
        </>
      )}
    </header>
  );
}

// AsciiRule — a horizontal divider that switches glyph by density.
function AsciiRule({ density, double=false }) {
  const m = densityMode(density);
  if (m === 'bare') return <hr className="rule" />;
  const ch = double && m === 'heavy' ? '═' : (m === 'heavy' ? '═' : '─');
  return <div className="rule rule--ascii" aria-hidden="true">{ch.repeat(300)}</div>;
}

// PromptLine — a single shell-prompt line.  `you@host:~$ command`
// Optional blinking cursor at the end.
function PromptLine({ host = 'localhost', user = 'you', path = '~', cmd = '', cursor = false, children }) {
  return (
    <div className="prompt">
      <span className="prompt-user">{user}</span>
      <span className="prompt-at">@</span>
      <span className="prompt-host">{host}</span>
      <span className="prompt-sep">:</span>
      <span className="prompt-path">{path}</span>
      <span className="prompt-sigil">$</span>
      <span className="prompt-cmd">{cmd || children}</span>
      {cursor && <span className="prompt-cursor" aria-hidden="true">█</span>}
    </div>
  );
}

// Tag — small inline pill for status / stack chips.
function Tag({ children, tone }) {
  return <span className={`tag ${tone ? 'tag--' + tone : ''}`}>{children}</span>;
}

// Link with the "terminal selection" hover treatment. Reuse for all anchors.
function TermLink({ href, children, arrow = false, ...rest }) {
  return (
    <a href={href} className="t-link" {...rest}>
      {arrow && <span className="t-link-arrow" aria-hidden="true">→ </span>}
      <span className="t-link-text">{children}</span>
    </a>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SpecCard — the signature project rendering.
// At density >= light it draws a real box-drawing frame; at bare density
// it falls back to a hairline-ruled card.
// ──────────────────────────────────────────────────────────────────────────
function SpecCard({ project, density }) {
  return (
    <article className="spec spec--bare" aria-labelledby={`spec-${project.id}`}>
      <div className="spec-body">
        <div className="spec-banner">
          <span id={`spec-${project.id}`} className="spec-banner-name">{project.name}</span>
          <span className="spec-banner-meta">
            {project.version ? `${project.version} · ${project.date}` : project.date}
          </span>
        </div>

        <h3 className="spec-tagline">{project.tagline}</h3>

        <dl className="spec-fields">
          <Field label="ROLE"  value={project.role} />
          <Field label="STAGE" value={project.team} />
          <Field label="STACK" value={project.stack.join(' · ')} />
        </dl>

        <hr className="rule" />

        <p className="spec-body-text">{project.body}</p>

        {project.links && project.links.length > 0 && (
          <>
            <hr className="rule" />
            <ul className="spec-links">
              {project.links.map((l, i) => (
                <li key={i}>
                  <span className="spec-link-key">→ {l.label.padEnd(7, ' ')}</span>
                  <TermLink href={l.href}>{l.display}</TermLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}

function Field({ label, value }) {
  return (
    <>
      <dt className="spec-dt">{label}</dt>
      <dd className="spec-dd">{value}</dd>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// CommandPalette — cmd-K / ctrl-K to jump between sections.
// ──────────────────────────────────────────────────────────────────────────
function CommandPalette({ items, open, onClose }) {
  const [query, setQuery] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      (it.label + ' ' + (it.hint || '')).toLowerCase().includes(q)
    );
  }, [query, items]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIdx(0);
      // focus after the panel mounts
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => { setIdx(0); }, [query]);

  const run = (i) => {
    const it = filtered[i];
    if (!it) return;
    onClose();
    setTimeout(() => it.action(), 0);
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(idx); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  if (!open) return null;
  return (
    <div className="cmdk-backdrop" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command palette">
        <div className="cmdk-prompt" aria-hidden="true">$</div>
        <input
          ref={inputRef}
          className="cmdk-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="goto, find, run …"
          spellCheck={false}
          autoComplete="off"
        />
        <ul className="cmdk-list">
          {filtered.length === 0 && <li className="cmdk-empty">no matches</li>}
          {filtered.map((it, i) => (
            <li
              key={it.id}
              className={`cmdk-item ${i === idx ? 'is-active' : ''}`}
              onMouseEnter={() => setIdx(i)}
              onClick={() => run(i)}
            >
              <span className="cmdk-arrow" aria-hidden="true">{i === idx ? '▸' : ' '}</span>
              <span className="cmdk-label">{it.label}</span>
              {it.hint && <span className="cmdk-hint">{it.hint}</span>}
            </li>
          ))}
        </ul>
        <div className="cmdk-foot">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> dismiss</span>
        </div>
      </div>
    </div>
  );
}

// Live clock + uptime in footer. Updates every second.
function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  const ss = String(now.getUTCSeconds()).padStart(2, '0');
  return <span className="clock"><span className="clock-val">{hh}:{mm}:{ss}</span> UTC</span>;
}

// ──────────────────────────────────────────────────────────────────────────
// Harness-style components: makes the page read as a coding-agent transcript
// rather than a static homepage. The visual grammar is borrowed from CLI
// REPLs (banner → user turn → tool call → output → status line).
// ──────────────────────────────────────────────────────────────────────────

// HarnessBanner — the rounded welcome box at the top. Plain CSS border.
function HarnessBanner({ identity, host = 'localhost' }) {
  return (
    <header className="banner" id="sec-top">
      <div className="banner-body">
        <div className="banner-hero">
          <span className="banner-avatar" aria-hidden="true" />
          <h1 className="banner-name">
            <strong>joseph.breitreiter</strong>
          </h1>
        </div>
        <p className="banner-meta">
          {identity.role}
          <span className="banner-sep"> · </span>
          {identity.location}
          <span className="banner-sep"> · </span>
          {identity.pronouns}
        </p>
        <p className="banner-status-row">
          <span className="banner-dot" aria-hidden="true">●</span>{' '}
          {identity.status}
        </p>
        <div className="banner-spacer" />
        <p className="banner-hint-row">
          <span className="banner-hint-label">❯</span>{' '}
          Type <kbd>/</kbd> for commands, or scroll for a tour.
        </p>
        <p className="banner-cwd">
          <span className="dim">cwd:</span> ~/sites/{identity.handle}.dev
        </p>
      </div>
    </header>
  );
}

// HarnessTip — single dimmed line below the banner; like the "※ Tip:" lines.
function HarnessTip({ children }) {
  return (
    <div className="tip">
      <span className="tip-glyph" aria-hidden="true">※</span>
      <span className="tip-text">{children}</span>
    </div>
  );
}

// UserTurn — the boxed `❯ prompt` block. Plain CSS border.
function UserTurn({ id, children }) {
  return (
    <div className="turn" id={id}>
      <div className="turn-body">
        <span className="turn-caret" aria-hidden="true">❯</span>
        <span className="turn-text">{children}</span>
      </div>
    </div>
  );
}

// ToolCall — `● Tool(args)` line with the corner-bracket result row beneath.
// Optionally collapsible (closed = hides the children below; open = shows).
function ToolCall({ tool, args, summary, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`tool ${open ? 'is-open' : 'is-closed'}`}>
      <button
        type="button"
        className="tool-head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="tool-bullet" aria-hidden="true">●</span>
        <span className="tool-name">{tool}</span>
        <span className="tool-paren">(</span>
        <span className="tool-args">{args}</span>
        <span className="tool-paren">)</span>
        {summary && (
          <span className="tool-caret" aria-hidden="true">{open ? '−' : '+'}</span>
        )}
      </button>
      {summary && (
        <div className="tool-result" aria-hidden={!open ? 'true' : 'false'}>
          <span className="tool-corner" aria-hidden="true">⤷</span>
          <span className="tool-summary">{summary}</span>
        </div>
      )}
      {open && children && <div className="tool-body">{children}</div>}
    </div>
  );
}

// Turn — composite: user prompt → tool call → assistant content.
// This is what each section becomes. id is used by cmd-K for jump targets.
function Turn({ id, prompt, tool, args, summary, children }) {
  return (
    <section className="conv-turn" data-section={id}>
      <UserTurn id={'sec-' + id}>{prompt}</UserTurn>
      {tool && <ToolCall tool={tool} args={args} summary={summary} />}
      <div className="assistant">{children}</div>
    </section>
  );
}

// HarnessStatusBar — bottom strip; cwd · session uptime · clock · ready dot.
function HarnessStatusBar({ identity, showClock }) {
  const [uptime, setUptime] = useState('00:00:00');
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      const hh = String(Math.floor(s / 3600)).padStart(2, '0');
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      setUptime(`${hh}:${mm}:${ss}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="statusbar">
      <span className="statusbar-l">
        <span className="dim">~/sites/</span>
        <span>{identity.handle}.dev</span>
      </span>
      <span className="statusbar-c">
        {showClock && (
          <>
            <span className="dim">session</span>
            <span className="tab-num">{uptime}</span>
            <span className="statusbar-sep">·</span>
            <LiveClock />
          </>
        )}
      </span>
      <span className="statusbar-r">
        <span className="dot dot--green" aria-hidden="true">●</span>
        <span>ready</span>
        <span className="statusbar-sep">·</span>
        <span><kbd>⌘</kbd><kbd>K</kbd></span>
      </span>
    </div>
  );
}

Object.assign(window, {
  densityMode, GLYPHS,
  SectionHeader, AsciiRule, PromptLine, Tag, TermLink,
  SpecCard, Field, CommandPalette, LiveClock,
  HarnessBanner, HarnessTip, UserTurn, ToolCall, Turn, HarnessStatusBar,
});
