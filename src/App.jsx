import React, { useEffect, useRef, useState } from 'react';
import { Trophy, Clock, Zap, Shield, Flame, Crown } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const TEAMS = {
  FF: { name: 'Fire Falcon',      short: 'FF', logo: '/images/fire_falcon.png',      accent: '#FF5500', glow: '#FF5500' },
  GT: { name: 'Gujarat Titans',   short: 'GT', logo: '/images/Gujarat_Titans.png',   accent: '#3B9EFF', glow: '#3B9EFF' },
  LO: { name: 'Lords',            short: 'LO', logo: '/images/Lords.png',            accent: '#FFD700', glow: '#FFD700' },
  HA: { name: 'Hackers',          short: 'HA', logo: '/images/Hackers.png',          accent: '#39FF14', glow: '#39FF14' },
  MS: { name: 'Miracle Strikers', short: 'MS', logo: '/images/Miracle_strikers.png', accent: '#00CFFF', glow: '#00CFFF' },
  PH: { name: 'Power Hitters',    short: 'PH', logo: '/images/Power_Hitters.png',    accent: '#FF8C00', glow: '#FF8C00' },
};

const scheduleData = [
  {
    day: 'Day 1', date: '22 April 2026', weekday: 'Wednesday',
    matches: [
      { id: 1,    t1: TEAMS.FF, t2: TEAMS.GT, time: '9:00 PM' },
      { id: 2,    t1: TEAMS.LO, t2: TEAMS.HA, time: '9:30 PM' },
      { id: 3,    t1: TEAMS.GT, t2: TEAMS.PH, time: '10:00 PM' },
      { id: 4,    t1: TEAMS.FF, t2: TEAMS.HA, time: '10:30 PM' },
    ],
  },
  {
    day: 'Day 2', date: '23 April 2026', weekday: 'Thursday',
    matches: [
      { id: 5,    t1: TEAMS.LO, t2: TEAMS.MS, time: '9:00 PM' },
      { id: 6,    t1: TEAMS.PH, t2: TEAMS.LO, time: '9:30 PM' },
    ],
  },
  {
    day: 'Day 3', date: '24 April 2026', weekday: 'Friday',
    matches: [
      { id: 7,    t1: TEAMS.FF, t2: TEAMS.MS, time: '9:00 PM' },
      { id: 8,    t1: TEAMS.GT, t2: TEAMS.MS, time: '9:30 PM' },
      { id: 9,    t1: TEAMS.HA, t2: TEAMS.PH, time: '10:00 PM' },
      {
        id: 'QF', isQF: true, time: '10:30 PM',
        t1: { name: 'Rank 3', short: '#3', logo: null, accent: '#FFD700', glow: '#FFD700' },
        t2: { name: 'Rank 4', short: '#4', logo: null, accent: '#00CFFF', glow: '#00CFFF' },
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════ */
function useFadeIn(delay = 0) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
        { threshold: 0.06 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);
  return [ref, vis];
}

/* ═══════════════════════════════════════════════════════
   LOGO BOX  — handles both dark & white-bg logos cleanly
═══════════════════════════════════════════════════════ */
function LogoBox({ team, size = 88, hover = false }) {
  return (
    <div
      className={hover ? 'group/logo' : ''}
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        background: 'linear-gradient(145deg, #0e1330, #0a0e26)',
        border: `1.5px solid ${team.accent}45`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 0 22px ${team.glow}20, inset 0 1px 0 rgba(255,255,255,0.06)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* corner accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${team.accent}60, transparent)`,
      }} />
      {/* hover glow bloom */}
      <div
        className={hover ? 'opacity-0 group-hover/logo:opacity-100' : 'opacity-0'}
        style={{
          position: 'absolute', inset: 0, borderRadius: 16,
          background: `radial-gradient(circle at center, ${team.glow}18, transparent 70%)`,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />
      {team.logo ? (
        <img
          src={team.logo}
          alt={team.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'contain',
            position: 'relative', zIndex: 1,
            filter: `drop-shadow(0 2px 12px ${team.glow}50)`,
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center relative w-full h-full opacity-60">
          <div className="absolute inset-2 rounded-xl border border-dashed border-white/10 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-[40%] h-[40%] rounded-full blur-xl" style={{ background: team.accent }} />
          </div>
          <Shield size={size * 0.35} style={{ color: team.accent }} className="relative z-10" />
          <span className="font-orbitron font-black mt-1 relative z-10" style={{ fontSize: 8, color: team.accent }}>{team.short}</span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MATCH CARD
═══════════════════════════════════════════════════════ */
function MatchCard({ match, idx }) {
  const [ref, vis] = useFadeIn(idx * 80);
  const { t1, t2 } = match;

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden cursor-default select-none mb-3"
      style={{
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.55s ease ${idx * 0.07}s, transform 0.55s ease ${idx * 0.07}s`,
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 rounded-2xl"
        style={{ background: `linear-gradient(120deg, ${t1.glow}08, transparent 50%, ${t2.glow}08)` }}
      />
      {/* Top border glow on hover */}
      <div
        className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${t1.glow}, ${t2.glow}, transparent)` }}
      />

      {/* QF Badge - Upgraded */}
      {match.isQF && (
        <div
          className="absolute top-0 right-10 flex items-center gap-1.5 px-4 py-1.5 rounded-b-xl font-orbitron font-black tracking-[0.2em]"
          style={{
            fontSize: 9,
            background: 'linear-gradient(180deg, rgba(255,215,0,0.2) 0%, rgba(135,110,0,0.4) 100%)',
            border: '1px solid rgba(255,215,0,0.4)',
            borderTop: 'none',
            color: '#FFD700',
            boxShadow: '0 0 20px rgba(255,215,0,0.15), inset 0 0 10px rgba(255,215,0,0.1)',
            zIndex: 20
          }}
        >
          <Trophy size={10} className="animate-pulse" /> QUARTER FINAL
        </div>
      )}

      {/* Robust Grid Layout */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center" 
        style={{ padding: '24px', gap: '20px' }}
      >
        {/* Team 1 (Left Side) - Aligned Center-Right to push towards VS */}
        <div className="flex items-center gap-4 justify-center sm:justify-end">
          <div className="text-right">
            <p className="font-orbitron font-bold tracking-widest uppercase opacity-40 mb-1" style={{ fontSize: 9 }}>Team</p>
            <h3 className="font-orbitron font-black uppercase leading-tight" 
                style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: t1.accent, textShadow: `0 0 20px ${t1.glow}60` }}>
              {t1.name}
            </h3>
          </div>
          <LogoBox team={t1} size={84} hover={true} />
        </div>

        {/* Center Block (VS + Match Info) */}
        <div className="flex flex-col items-center justify-center px-4">
          <span className="font-orbitron font-black tracking-[0.4em] uppercase opacity-20 mb-2" style={{ fontSize: 9 }}>
            Match {match.id}
          </span>
          <div className="relative flex items-center justify-center mb-2" style={{ width: 64, height: 64 }}>
            <div className="absolute inset-0 rounded-full animate-ping opacity-10" style={{ background: '#FFD700' }} />
            <div className="absolute inset-0 rounded-full bg-yellow-400/5 border border-yellow-400/20 shadow-[0_0_20px_rgba(255,215,0,0.1)]" />
            <span className="font-orbitron font-black text-yellow-400 text-xl tracking-widest z-10" style={{ textShadow: '0 0 15px rgba(255,215,0,0.5)' }}>VS</span>
          </div>
          {match.time !== 'TBD' ? (
            <div className="flex items-center gap-1 font-orbitron font-bold text-cyan-400" style={{ fontSize: 10 }}>
              <Clock size={10} /> {match.time}
            </div>
          ) : (
            <span className="font-orbitron text-[9px] opacity-20 tracking-widest">TBD</span>
          )}
        </div>

        {/* Team 2 (Right Side) - Aligned Center-Left to push towards VS */}
        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <LogoBox team={t2} size={84} hover={true} />
          <div className="text-left">
            <p className="font-orbitron font-bold tracking-widest uppercase opacity-40 mb-1" style={{ fontSize: 9 }}>Team</p>
            <h3 className="font-orbitron font-black uppercase leading-tight" 
                style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: t2.accent, textShadow: `0 0 20px ${t2.glow}60` }}>
              {t2.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div style={{ height: 1, margin: '0 24px', background: `linear-gradient(90deg, transparent, ${t1.glow}25, ${t2.glow}25, transparent)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DAY SECTION
═══════════════════════════════════════════════════════ */
function DaySection({ dayData, sectionIdx }) {
  const [ref, vis] = useFadeIn(sectionIdx * 100);
  const dayColors = ['#00CFFF', '#FFD700', '#FF5500'];
  const color = dayColors[sectionIdx] || '#FFD700';

  return (
    <div
      ref={ref}
      className="mb-14"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Day Header */}
      <div className="flex items-center gap-4 md:gap-5 mb-7">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}40)` }} />
        <div
          className="flex flex-col items-center text-center relative"
          style={{
            padding: '14px 28px',
            borderRadius: 12,
            border: `1px solid ${color}25`,
            background: `linear-gradient(135deg, ${color}08, transparent)`,
          }}
        >
          <div className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ background: `radial-gradient(ellipse at center, ${color}08 0%, transparent 70%)` }} />
          <p className="font-orbitron font-black tracking-[0.5em] uppercase relative z-10"
            style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
            {dayData.weekday}
          </p>
          <h2 className="font-orbitron font-black uppercase tracking-widest relative z-10"
            style={{ fontSize: 'clamp(20px, 4vw, 30px)', color, textShadow: `0 0 30px ${color}50` }}>
            {dayData.day}
          </h2>
          <p className="font-poppins font-bold tracking-[0.2em] relative z-10"
            style={{ fontSize: 11, color: `${color}CC`, marginTop: 4 }}>
            {dayData.date}
          </p>
        </div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, transparent, ${color}40)` }} />
      </div>

      <div>
        {dayData.matches.map((match, idx) => (
          <MatchCard key={match.id} match={match} idx={idx} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PLAYOFF CARD
═══════════════════════════════════════════════════════ */
const playoffStages = [
  {
    label: 'Qualifier 1', desc: 'Rank 1', desc2: 'vs', desc3: 'Rank 2',
    subtext: 'Top 2 teams battle for a direct FINAL spot',
    color: '#3B9EFF', icon: <Zap size={20} />, number: '01', time: '9:00 PM'
  },
  {
    label: 'Qualifier 2', desc: 'Winner of QF', desc2: 'vs', desc3: 'Loser of Q1',
    subtext: 'Redemption match — last chance to reach the Final',
    color: '#B06FFF', icon: <Flame size={20} />, number: '02', time: '9:30 PM'
  },
  {
    label: 'Grand Final', desc: 'Winner of Q1', desc2: 'vs', desc3: 'Winner of Q2',
    subtext: 'The ultimate battle for the Championship Crown',
    color: '#FFD700', icon: <Crown size={22} />, number: '🏆', isFinal: true, time: '10:00 PM'
  },
];

function PlayoffCard({ stage, idx }) {
  const [ref, vis] = useFadeIn(idx * 120);
  return (
    <div
      ref={ref}
      className="group cursor-default relative overflow-hidden flex flex-col items-center text-center"
      style={{
        borderRadius: 20,
        border: `1px solid ${stage.color}25`,
        background: stage.isFinal
          ? 'linear-gradient(145deg, rgba(255,215,0,0.07), rgba(255,140,0,0.04))'
          : 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        backdropFilter: 'blur(20px)',
        padding: '32px 24px',
        boxShadow: stage.isFinal
          ? `0 0 60px ${stage.color}15, 0 8px 32px rgba(0,0,0,0.5)`
          : '0 8px 32px rgba(0,0,0,0.4)',
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
        transition: `opacity 0.6s ease ${idx * 0.1}s, transform 0.6s ease ${idx * 0.1}s`,
      }}
    >
      {/* Radial glow bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${stage.color}12 0%, transparent 65%)` }} />
      {/* Top glow line */}
      <div className="absolute top-0 left-[20%] right-[20%] h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${stage.color}, transparent)`, borderRadius: 1 }} />

      {/* Stage number */}
      <div className="font-orbitron font-black relative z-10"
        style={{ fontSize: stage.isFinal ? 28 : 12, color: `${stage.color}40`, marginBottom: 8, lineHeight: 1 }}>
        {stage.number}
      </div>

      {/* Icon */}
      <div className="relative z-10 mb-2" style={{ color: stage.color, filter: `drop-shadow(0 0 8px ${stage.color})` }}>
        {stage.icon}
      </div>

      {/* Label */}
      <h3 className="font-orbitron font-black uppercase tracking-widest relative z-10"
        style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: stage.color, marginBottom: 16 }}>
        {stage.label}
      </h3>

      {/* Divider */}
      <div className="relative z-10 mb-4" style={{ width: 40, height: 1, background: `${stage.color}40`, borderRadius: 1 }} />

      {/* Match text */}
      <div className="relative z-10 mb-4">
        <p className="font-orbitron font-black text-white" style={{ fontSize: 13, letterSpacing: '0.05em', marginBottom: 4 }}>{stage.desc}</p>
        <p className="font-orbitron font-black" style={{ fontSize: 11, color: `${stage.color}80`, letterSpacing: '0.2em', marginBottom: 4 }}>{stage.desc2}</p>
        <p className="font-orbitron font-black text-white" style={{ fontSize: 13, letterSpacing: '0.05em' }}>{stage.desc3}</p>
      </div>

      {/* Time & Subtext */}
      <div className="flex flex-col items-center gap-2 relative z-10">
        <div className="flex items-center gap-1.5 font-orbitron font-bold text-cyan-400 mb-1" style={{ fontSize: 10 }}>
          <Clock size={11} /> {stage.time}
        </div>
        <p className="font-poppins" style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
          {stage.subtext}
        </p>
      </div>

      {/* Trophy for final */}
      {stage.isFinal && (
        <img src="/images/trophy.png" alt="Trophy"
          className="group-hover:scale-110 transition-transform duration-500 relative z-10"
          style={{ width: 90, height: 90, objectFit: 'contain', marginTop: 20, filter: 'drop-shadow(0 0 24px rgba(255,215,0,0.7))' }} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PLAYOFF SECTION
═══════════════════════════════════════════════════════ */
function PlayoffSection() {
  const [ref, vis] = useFadeIn(0);
  return (
    <div
      ref={ref}
      className="mt-20"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      {/* Header */}
      <div className="relative text-center mb-14">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: 400, height: 160, background: 'radial-gradient(ellipse, rgba(255,215,0,0.08) 0%, transparent 70%)' }} />
        </div>
        <p className="font-orbitron font-black tracking-[0.5em] uppercase"
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
          25 April 2026 &nbsp;·&nbsp; Saturday
        </p>
        <h2 className="font-orbitron font-black uppercase relative z-10"
          style={{
            fontSize: 'clamp(24px, 5.5vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 50%, #FFD700 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
          DAY 4 — PLAYOFF STAGE
        </h2>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #FFD700)' }} />
          <Trophy size={18} color="#FFD700" style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))' }} />
          <div style={{ width: 60, height: 1, background: 'linear-gradient(270deg, transparent, #FFD700)' }} />
        </div>
      </div>

      {/* Playoff Cards Grid — 1 col mobile, 3 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {playoffStages.map((stage, i) => (
          <PlayoffCard key={i} stage={stage} idx={i} />
        ))}
      </div>

      {/* Team Directory */}
      <div
        className="mt-12 rounded-2xl border border-white/[0.06] p-6 md:p-8"
        style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)' }}
      >
        <p className="font-orbitron font-black tracking-[0.45em] uppercase text-center mb-6"
          style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
          ⚡ Participating Teams
        </p>
        {/* 3 cols on mobile, 6 on desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 md:gap-6">
          {Object.entries(TEAMS).map(([code, team]) => (
            <div key={code} className="flex flex-col items-center gap-2">
              <LogoBox team={team} size={64} />
              <p className="font-orbitron font-black text-center uppercase"
                style={{ fontSize: 11, color: team.accent, textShadow: `0 0 10px ${team.glow}40` }}>
                {code}
              </p>
              <p className="font-poppins text-center leading-tight"
                style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>
                {team.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO BANNER
═══════════════════════════════════════════════════════ */
function HeroBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] mb-16"
      style={{ minHeight: 260 }}>
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2070)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.25) saturate(0.6)',
        }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0b0f2a 0%, transparent 60%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #050816 0%, transparent 60%)' }} />
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)' }} />

      <div className="relative z-10 p-8 md:p-12 flex flex-col h-full justify-end">
        {/* Live tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500"
            style={{ boxShadow: '0 0 8px #FF2222', animation: 'livePing 1.5s ease infinite' }} />
          <span className="font-orbitron font-black tracking-[0.4em] uppercase" style={{ fontSize: 10, color: '#00CFFF' }}>
            Season 02 &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; Vrajnidhi-box
          </span>
        </div>

        <h1 className="font-orbitron font-black uppercase leading-tight mb-4"
          style={{ fontSize: 'clamp(32px, 7vw, 68px)', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#FFFFFF' }}>STREET BOX</span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            TOURNAMENT
          </span>
        </h1>

        <p className="font-poppins mb-6" style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>
          6 Teams &nbsp;·&nbsp; 4 Days &nbsp;·&nbsp; 1 Champion
        </p>

        {/* Team logos strip — wraps on mobile */}
        <div className="flex flex-wrap gap-4">
          {Object.values(TEAMS).map((team, i) => (
            <LogoBox key={i} team={team} size={48} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════ */
function Navbar({ scrolled }) {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-400"
      style={{
        padding: scrolled ? '12px 24px' : '18px 24px',
        background: scrolled ? 'rgba(5,8,22,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1100px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #FFD700, #FF8C00)', boxShadow: '0 0 20px rgba(255,215,0,0.35)' }}>
            <Trophy size={20} color="#050816" />
          </div>
          <div>
            <p className="font-orbitron font-black text-white tracking-widest" style={{ fontSize: 15, lineHeight: 1 }}>
              STREET BOX
            </p>
            <p className="font-orbitron font-bold tracking-[0.4em]" style={{ fontSize: 9, color: '#FFD700', lineHeight: 1, marginTop: 3 }}>
              S2 · VRAJINDHI-BOX
            </p>
          </div>
        </div>

        <a
          href="https://meet.google.com/jxb-msie-mro" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-orbitron font-black rounded-lg no-underline"
          style={{
            padding: '10px 18px', fontSize: 10,
            background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
            border: 'none', cursor: 'pointer', color: '#050816',
            letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(255,215,0,0.25)',
          }}
          title="Join the Live Meeting"
        >
          WATCH LIVE
          <span className="inline-block w-2 h-2 bg-red-600 rounded-full" style={{ boxShadow: '0 0 6px #FF2222', animation: 'livePing 1.5s ease infinite' }} />
        </a>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════ */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen font-poppins"
      style={{ background: 'linear-gradient(160deg, #0b0f2a 0%, #07091e 50%, #050816 100%)' }}>
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,207,255,0.05) 0%, transparent 70%)' }} />
      </div>

      <Navbar scrolled={scrolled} />

      <main className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-8 pt-24 pb-16">
        <HeroBanner />

        {scheduleData.map((day, i) => (
          <DaySection key={i} dayData={day} sectionIdx={i} />
        ))}

        <PlayoffSection />

        <footer className="mt-20 pt-8 border-t border-white/[0.05] text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: 'rgba(255,215,0,0.2)' }} />
            <Trophy size={12} color="rgba(255,215,0,0.35)" />
            <div className="h-px w-12" style={{ background: 'rgba(255,215,0,0.2)' }} />
          </div>
          <p className="font-orbitron font-bold" style={{ fontSize: 8, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.5em' }}>
            © 2026 TOURNAMENT CHAMPIONSHIP · ALL RIGHTS RESERVED
          </p>
        </footer>
      </main>
    </div>
  );
}
