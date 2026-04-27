"use client";

import { useState, useCallback } from "react";

const SIDES_OPTIONS = [4, 6, 8, 10, 12, 20] as const;
type DieSides = (typeof SIDES_OPTIONS)[number];

const DIE_COLORS: Record<DieSides, { bg: string; border: string; text: string }> = {
  4:  { bg: "#1e1b4b", border: "#6366f1", text: "#a5b4fc" },
  6:  { bg: "#14532d", border: "#22c55e", text: "#86efac" },
  8:  { bg: "#7c2d12", border: "#f97316", text: "#fdba74" },
  10: { bg: "#1e3a5f", border: "#38bdf8", text: "#7dd3fc" },
  12: { bg: "#4a044e", border: "#d946ef", text: "#f0abfc" },
  20: { bg: "#7f1d1d", border: "#ef4444", text: "#fca5a5" },
};

function rollDie(sides: DieSides): number {
  return Math.floor(Math.random() * sides) + 1;
}

interface DieResult {
  id: number;
  value: number;
  sides: DieSides;
}

export default function DiceRoller() {
  const [numDice, setNumDice] = useState(2);
  const [sides, setSides] = useState<DieSides>(6);
  const [results, setResults] = useState<DieResult[]>([]);
  const [rolling, setRolling] = useState(false);
  const [flashFrame, setFlashFrame] = useState(0);

  const handleRoll = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    setResults([]);

    let frame = 0;
    const flicker = setInterval(() => {
      frame++;
      setFlashFrame(frame);
      // Show scrambled values during animation
      setResults(
        Array.from({ length: numDice }, (_, i) => ({
          id: i,
          value: rollDie(sides),
          sides,
        }))
      );
    }, 80);

    setTimeout(() => {
      clearInterval(flicker);
      setResults(
        Array.from({ length: numDice }, (_, i) => ({
          id: i,
          value: rollDie(sides),
          sides,
        }))
      );
      setRolling(false);
      setFlashFrame(0);
    }, 700);
  }, [rolling, numDice, sides]);

  const total = results.reduce((sum, d) => sum + d.value, 0);
  const colors = DIE_COLORS[sides];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
        🎲 Dice Roller
      </h1>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
          background: "#1a1a24",
          border: "1px solid #2d2d3d",
          borderRadius: "1rem",
          padding: "1.5rem 2rem",
        }}
      >
        {/* Number of dice */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8" }}>
            Number of dice
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={() => setNumDice((n) => Math.max(1, n - 1))}
              style={stepBtnStyle}
              aria-label="Decrease"
            >
              −
            </button>
            <span style={{ fontSize: "2rem", fontWeight: 700, minWidth: "2rem", textAlign: "center" }}>
              {numDice}
            </span>
            <button
              onClick={() => setNumDice((n) => Math.min(10, n + 1))}
              style={stepBtnStyle}
              aria-label="Increase"
            >
              +
            </button>
          </div>
        </div>

        {/* Die type */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8" }}>
            Die type
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {SIDES_OPTIONS.map((s) => {
              const c = DIE_COLORS[s];
              const selected = sides === s;
              return (
                <button
                  key={s}
                  onClick={() => setSides(s)}
                  style={{
                    padding: "0.4rem 0.9rem",
                    borderRadius: "0.5rem",
                    border: `2px solid ${selected ? c.border : "#2d2d3d"}`,
                    background: selected ? c.bg : "#0f0f13",
                    color: selected ? c.text : "#64748b",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  d{s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Roll button */}
      <button
        onClick={handleRoll}
        disabled={rolling}
        style={{
          padding: "0.85rem 3rem",
          fontSize: "1.25rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          borderRadius: "0.75rem",
          border: `2px solid ${colors.border}`,
          background: rolling ? "#1a1a24" : colors.bg,
          color: rolling ? "#64748b" : colors.text,
          cursor: rolling ? "not-allowed" : "pointer",
          transition: "all 0.15s",
          boxShadow: rolling ? "none" : `0 0 20px ${colors.border}44`,
        }}
      >
        {rolling ? "Rolling…" : "Roll!"}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              maxWidth: "720px",
            }}
          >
            {results.map((die, i) => {
              const c = DIE_COLORS[die.sides];
              return (
                <div
                  key={die.id}
                  style={{
                    width: "5rem",
                    height: "5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.75rem",
                    border: `2px solid ${c.border}`,
                    background: c.bg,
                    boxShadow: rolling ? "none" : `0 0 14px ${c.border}66`,
                    animation: rolling ? "shake 0.1s infinite" : `popIn 0.25s ease-out ${i * 0.04}s both`,
                  }}
                >
                  <span style={{ fontSize: "2rem", fontWeight: 800, color: c.text, lineHeight: 1 }}>
                    {die.value}
                  </span>
                  <span style={{ fontSize: "0.6rem", color: c.border, fontWeight: 600, marginTop: "0.1rem" }}>
                    d{die.sides}
                  </span>
                </div>
              );
            })}
          </div>

          {!rolling && results.length > 1 && (
            <div
              style={{
                fontSize: "1.1rem",
                color: "#94a3b8",
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
              }}
            >
              <span>Total:</span>
              <span style={{ fontSize: "2.5rem", fontWeight: 900, color: colors.text }}>{total}</span>
              <span style={{ fontSize: "0.85rem" }}>
                ({numDice}d{sides})
              </span>
            </div>
          )}
          {!rolling && results.length === 1 && (
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
              1d{sides}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        @keyframes shake {
          0%   { transform: translate(0, 0) rotate(0deg); }
          25%  { transform: translate(2px, -2px) rotate(2deg); }
          50%  { transform: translate(-2px, 2px) rotate(-2deg); }
          75%  { transform: translate(2px, 2px) rotate(1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

const stepBtnStyle: React.CSSProperties = {
  width: "2rem",
  height: "2rem",
  borderRadius: "0.4rem",
  border: "1px solid #2d2d3d",
  background: "#1a1a24",
  color: "#e2e8f0",
  fontSize: "1.2rem",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
};
