// Main app for the personal homepage.
// Layout: coding-harness transcript — banner → user turns → tool calls → output.

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ──────────────────────────────────────────────────────────────────────────
// Tweak defaults — the EDITMODE block. Host rewrites this in place when the
// user changes a tweak, so values persist across reloads.
// ──────────────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#0a0e14", "#c8d3df", "#5fbef0"],
  "font": "'JetBrains Mono'",
  "density": 6,
  "voice": "warm",
  "showClock": true
}/*EDITMODE-END*/;

const PALETTE_OPTIONS = [
  ["#0a0e14", "#c8d3df", "#5fbef0"],   // schematic (dark + cyan)  ← default
  ["#ece6d2", "#1a1812", "#b8421c"],   // bone + rust
  ["#0d0d0d", "#e8e2d0", "#e87042"],   // dark + amber
  ["#ece6d2", "#1a1812", "#525252"],   // ledger (achromatic)
];

const FONT_OPTIONS = [
  { value: "'JetBrains Mono'", label: 'JetBrains' },
  { value: "'Geist Mono'",     label: 'Geist' },
  { value: "'IBM Plex Mono'",  label: 'Plex' },
  { value: "'Fira Code'",      label: 'Fira' },
  { value: "'Space Mono'",     label: 'Space' },
];

// Per-section copy. Two voice registers:
//   warm  — natural questions, like a user typing to a coding agent
//   terse — shell-command style, dropped into the same slot
// Tool calls and summaries stay the same across registers; the framing voice
// is what changes.
const SECTIONS = [
  {
    id: 'about',
    warm:  'tell me about yourself',
    terse: 'whoami --long',
    tool:  'Read',
    args:  './about.txt',
  },
  {
    id: 'work',
    warm:  'where have you worked?',
    terse: 'ls -lh ./work',
    tool:  'List',
    args:  './work',
  },
  {
    id: 'now',
    warm:  'what are you working on right now?',
    terse: 'cat ~/.now',
    tool:  'Read',
    args:  '~/.now',
  },
  {
    id: 'elsewhere',
    warm:  'where else can I find you?',
    terse: 'cat ./contact.toml',
    tool:  'Read',
    args:  './contact.toml',
  },
];

// ──────────────────────────────────────────────────────────────────────────
// Root app
// ──────────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [bootDone, setBootDone] = useState(false);

  const data = window.SITE;
  const m = densityMode(t.density);

  // Apply palette + font as CSS variables on :root so the whole tree updates.
  useEffect(() => {
    const r = document.documentElement;
    const [bg, ink, accent] = t.palette;
    r.style.setProperty('--bg', bg);
    r.style.setProperty('--ink', ink);
    r.style.setProperty('--accent', accent);
    r.style.setProperty('--font-mono', t.font + ', ui-monospace, monospace');
    r.dataset.theme = isLight(bg) ? 'light' : 'dark';
  }, [t.palette, t.font]);

  useEffect(() => {
    const id = setTimeout(() => setBootDone(true), 60);
    return () => clearTimeout(id);
  }, []);

  // Build per-section summaries (these go in the ⎿ result row).
  const summaries = useMemo(() => ({
    about:     `Read ${data.about.split(/\s+/).length} words`,
    work:      `Found ${data.work.length} projects`,
    now:       `Read ${data.now.length} entries`,
    elsewhere: `Read ${data.elsewhere.length} entries`,
  }), [data]);

  // Cmd-K palette items.
  const cmdItems = useMemo(() => {
    const goto = (id) => () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const items = [
      { id: 'go-top', label: '/home', hint: 'banner', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
      ...SECTIONS.map((s) => ({
        id: 'go-' + s.id,
        label: '/' + s.id,
        hint: s.warm,
        action: goto('sec-' + s.id),
      })),
      ...data.work.map((p) => ({
        id: 'p-' + p.id, label: '/open ' + p.name, hint: p.tagline,
        action: goto('spec-' + p.id),
      })),
      ...data.elsewhere.map((e) => ({
        id: 'e-' + e.label, label: '/' + e.label + ' ' + e.handle, hint: 'open',
        action: () => window.open(e.href, '_blank'),
      })),
      { id: 'copy-email', label: '/copy email', hint: data.elsewhere[0]?.handle,
        action: () => navigator.clipboard?.writeText(data.elsewhere[0]?.handle || '') },
    ];
    return items;
  }, [data]);

  // Keyboard: ⌘K / Ctrl-K / "/" opens the palette.
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      const inField = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      if (mod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCmdkOpen((v) => !v);
      } else if (e.key === '/' && !cmdkOpen && !inField) {
        e.preventDefault();
        setCmdkOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cmdkOpen]);

  const promptFor = (sec) => t.voice === 'terse' ? sec.terse : sec.warm;

  return (
    <div className={`page page--harness ${bootDone ? 'is-ready' : ''}`}>
      <main className="column">

        <HarnessBanner identity={data.identity} />

        {/* ── about ── */}
        <Turn
          id="about"
          prompt={promptFor(SECTIONS[0])}
          tool={SECTIONS[0].tool}
          args={SECTIONS[0].args}
          summary={summaries.about}
        >
          <p className="prose">{data.about}</p>
          <dl className="whoami-fields whoami-fields--inline">
            <Field label="role"     value={data.identity.role} />
            <Field label="location" value={
              <span>{data.identity.location} <span className="dim">· {data.identity.lat} {data.identity.lon}</span></span>
            } />
            <Field label="status"   value={<span className="status-on">{data.identity.status}</span>} />
          </dl>
        </Turn>

        {/* ── work ── */}
        <Turn
          id="work"
          prompt={promptFor(SECTIONS[1])}
          tool={SECTIONS[1].tool}
          args={SECTIONS[1].args}
          summary={summaries.work}
        >
          <div className="work-list">
            {data.work.map((p) => (
              <SpecCard key={p.id} project={p} density={t.density} />
            ))}
          </div>
        </Turn>

        {/* ── now ── */}
        <Turn
          id="now"
          prompt={promptFor(SECTIONS[2])}
          tool={SECTIONS[2].tool}
          args={SECTIONS[2].args}
          summary={summaries.now}
        >
          <dl className="now-grid">
            {data.now.map((row) => (
              <React.Fragment key={row.label}>
                <dt className="now-dt">{row.label.toLowerCase()}</dt>
                <dd className="now-dd">
                  {row.href
                    ? <TermLink href={row.href}>{row.text}</TermLink>
                    : row.text}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </Turn>

        {/* ── elsewhere ── */}
        <Turn
          id="elsewhere"
          prompt={promptFor(SECTIONS[3])}
          tool={SECTIONS[3].tool}
          args={SECTIONS[3].args}
          summary={summaries.elsewhere}
        >
          <ul className="elsewhere">
            {data.elsewhere.map((e) => (
              <li key={e.label}>
                <span className="elsewhere-key">{e.label}</span>
                <span className="elsewhere-eq" aria-hidden="true">=</span>
                <TermLink href={e.href}>"{e.handle}"</TermLink>
              </li>
            ))}
          </ul>
        </Turn>

        {/* end-of-transcript marker */}
        <div className="eot" aria-hidden="true">
          <span className="eot-line" />
          <span className="eot-text">end of transcript</span>
          <span className="eot-line" />
        </div>
      </main>

      <HarnessStatusBar identity={data.identity} showClock={t.showClock} />

      <CommandPalette items={cmdItems} open={cmdkOpen} onClose={() => setCmdkOpen(false)} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Look" />
        <TweakColor
          label="Palette"
          value={t.palette}
          options={PALETTE_OPTIONS}
          onChange={(v) => setTweak('palette', v)}
        />
        <TweakSelect
          label="Typeface"
          value={t.font}
          options={FONT_OPTIONS}
          onChange={(v) => setTweak('font', v)}
        />
        <TweakSlider
          label="ASCII density"
          value={t.density}
          min={0}
          max={10}
          step={1}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakSection label="Voice" />
        <TweakRadio
          label="Register"
          value={t.voice}
          options={[
            { value: 'warm', label: 'natural' },
            { value: 'terse', label: 'shell' },
          ]}
          onChange={(v) => setTweak('voice', v)}
        />
        <TweakSection label="Footer" />
        <TweakToggle
          label="Live UTC clock"
          value={t.showClock}
          onChange={(v) => setTweak('showClock', v)}
        />
      </TweaksPanel>
    </div>
  );
}

// Luminance check for dark-vs-light theme inference from the bg color.
function isLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
