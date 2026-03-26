import React from "react";
import { DATA_POINTS_BY_CATEGORY, THREAT_GROUPS } from '../lib/data'

const CHART_TYPES = ["bar", "line", "area", "pie"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COUNTRIES = [
  { name: "United States", region: "North America" },
  { name: "Canada", region: "North America" },
  { name: "United Kingdom", region: "Europe" },
  { name: "Germany", region: "Europe" },
  { name: "France", region: "Europe" },
  { name: "Netherlands", region: "Europe" },
  { name: "Turkey", region: "Middle East" },
  { name: "UAE", region: "Middle East" },
  { name: "Saudi Arabia", region: "Middle East" },
  { name: "Israel", region: "Middle East" },
  { name: "Japan", region: "Asia Pacific" },
  { name: "Australia", region: "Asia Pacific" },
  { name: "Singapore", region: "Asia Pacific" },
  { name: "India", region: "Asia Pacific" },
  { name: "Brazil", region: "Latin America" },
  { name: "Mexico", region: "Latin America" },
];
const REGIONS = [...new Set(COUNTRIES.map((c) => c.region))];
const INDUSTRIES = [
  "Financial Services",
  "Healthcare",
  "Technology",
  "Government",
  "Manufacturing",
  "Energy & Utilities",
  "Retail & E-Commerce",
  "Telecommunications",
  "Education",
  "Transportation",
];

const ctrlLabel = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  letterSpacing: "0.08em",
  color: "rgba(232,236,241,0.3)",
  textTransform: "uppercase",
  marginBottom: 8,
};

const chipBtn = (active, catColor) => ({
  flex: 1,
  textTransform: "capitalize",
  fontSize: 11,
  padding: "7px 8px",
  borderRadius: 10,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.25s",
  border: active
    ? `1px solid ${catColor}45`
    : "1px solid rgba(255,255,255,0.07)",
  background: active ? `${catColor}0C` : "rgba(255,255,255,0.02)",
  color: active ? catColor : "rgba(232,236,241,0.5)",
  fontFamily: "'Satoshi', sans-serif",
  backdropFilter: "blur(8px)",
  boxShadow: active ? `0 0 12px ${catColor}10` : "none",
});

const selInput = {
  width: "100%",
  padding: "9px 12px",
  fontSize: 12,
  fontFamily: "'Satoshi', sans-serif",
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 10,
  color: "#E8ECF1",
  outline: "none",
  backdropFilter: "blur(8px)",
  transition: "all 0.3s",
  appearance: "none",
  cursor: "pointer",
  boxSizing: "border-box",
};

const elRowBase = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.04)",
  background: "rgba(255,255,255,0.02)",
  transition: "all 0.2s",
  marginBottom: 5,
  backdropFilter: "blur(8px)",
};

const smallBtn = (active, color, isBg) => ({
  width: 26,
  height: 26,
  borderRadius: 7,
  border: "none",
  cursor: "pointer",
  background: active
    ? isBg
      ? "rgba(255,69,98,0.06)"
      : `${color}15`
    : "rgba(255,255,255,0.03)",
  color: active
    ? isBg
      ? "#FF4562"
      : color
    : "rgba(232,236,241,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: isBg ? 10 : 11,
  transition: "all 0.2s",
  boxShadow: !isBg && active ? `0 0 8px ${color}12` : "none",
});

export default function ControlPanel({
  chartType,
  setChartType,
  dateRange,
  setDateRange,
  country,
  setCountry,
  regionMode,
  setRegionMode,
  industry,
  setIndustry,
  dataPoint,
  setDataPoint,
  dataPoints,
  threatGroup,
  setThreatGroup,
  rawData,
  hiddenElements,
  toggleElement,
  highlightedElement,
  toggleHighlight,
  activeMonths,
  totalSum,
  catColor,
}) {
  const countryList = regionMode
    ? REGIONS
    : COUNTRIES.map((c) => c.name);

  const panelStyle = {
    width: 350,
    flexShrink: 0,
    overflowY: "auto",
    background: "rgba(255,255,255,0.012)",
    backdropFilter: "blur(24px)",
    borderLeft: "1px solid rgba(255,255,255,0.05)",
    boxShadow:
      "inset 1px 0 0 rgba(255,255,255,0.02),-8px 0 40px rgba(0,0,0,0.12)",
    padding: "20px 18px",
    position: "relative",
  };

  const accentLine = {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1,
    height: "100%",
    background: `linear-gradient(180deg,transparent,${catColor}12,transparent)`,
  };

  const monthBadge = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: catColor,
    fontWeight: 500,
    padding: "2px 8px",
    borderRadius: 5,
    background: `${catColor}0C`,
    border: `1px solid ${catColor}18`,
  };

  return (
    <div style={panelStyle}>
      <div style={accentLine} />

      {/* Chart Type */}
      <div style={{ marginBottom: 22 }}>
        <div style={ctrlLabel}>Chart Type</div>
        <div style={{ display: "flex", gap: 5 }}>
          {CHART_TYPES.map((t) => (
            <button
              key={t}
              style={chipBtn(chartType === t, catColor)}
              onClick={() => setChartType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div style={{ marginBottom: 22 }}>
        <div style={ctrlLabel}>Date Range</div>
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={monthBadge}>{MONTHS[dateRange[0]]}</span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: `linear-gradient(90deg,${catColor}25,rgba(255,255,255,0.04))`,
              }}
            />
            <span style={monthBadge}>{MONTHS[dateRange[1]]}</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "rgba(232,236,241,0.2)",
              }}
            >
              2025
            </span>
          </div>
          <div style={{ marginBottom: 6 }}>
            <label
              style={{
                fontSize: 10,
                color: "rgba(232,236,241,0.2)",
                display: "block",
                marginBottom: 3,
              }}
            >
              From
            </label>
            <input
              type="range"
              min={0}
              max={dateRange[1]}
              value={dateRange[0]}
              onChange={(e) =>
                setDateRange([+e.target.value, dateRange[1]])
              }
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 10,
                color: "rgba(232,236,241,0.2)",
                display: "block",
                marginBottom: 3,
              }}
            >
              To
            </label>
            <input
              type="range"
              min={dateRange[0]}
              max={11}
              value={dateRange[1]}
              onChange={(e) =>
                setDateRange([dateRange[0], +e.target.value])
              }
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Country / Region */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            ...ctrlLabel,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{regionMode ? "Region" : "Country"}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, color: "rgba(232,236,241,0.2)" }}>
              Region
            </span>
            <div
              onClick={() => {
                setRegionMode(!regionMode);
                setCountry("");
              }}
              style={{
                width: 34,
                height: 18,
                borderRadius: 9,
                background: regionMode
                  ? `${catColor}30`
                  : "rgba(255,255,255,0.08)",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: regionMode
                    ? catColor
                    : "rgba(232,236,241,0.3)",
                  position: "absolute",
                  top: 2,
                  left: regionMode ? 18 : 2,
                  transition: "all 0.3s",
                  boxShadow: regionMode
                    ? `0 0 8px ${catColor}40`
                    : "none",
                }}
              />
            </div>
          </div>
        </div>
        <select
          style={selInput}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">
            All {regionMode ? "Regions" : "Countries"}
          </option>
          {countryList.map((c) => (
            <option
              key={c}
              value={c}
              style={{ background: "#0E1220", color: "#E8ECF1" }}
            >
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Industry */}
      <div style={{ marginBottom: 22 }}>
        <div style={ctrlLabel}>Industry</div>
        <select
          style={selInput}
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <option value="">All Industries</option>
          {INDUSTRIES.map((ind) => (
            <option
              key={ind}
              value={ind}
              style={{ background: "#0E1220", color: "#E8ECF1" }}
            >
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Threat Actor / Group */}
      <div style={{marginBottom:22}}>
        <div style={ctrlLabel}>Threat Actor / Group</div>
        <select style={selInput} value={threatGroup} onChange={e => setThreatGroup(e.target.value)}>
          {THREAT_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)",
          marginBottom: 18,
        }}
      />

      {/* Data Point */}
      <div style={{marginBottom:22}}>
        <div style={ctrlLabel}>Data Point</div>
        <select style={selInput} value={dataPoint} onChange={e => setDataPoint(e.target.value)}>
          {dataPoints.map(dp => <option key={dp.id} value={dp.id}>{dp.label}</option>)}
        </select>
      </div>

      {/* Elements */}
      <div>
        <div
          style={{
            ...ctrlLabel,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Elements</span>
          <button
            onClick={() => {
              // Reset is handled by parent; calling toggleElement/toggleHighlight
              // with special reset logic. Parent should provide a reset callback,
              // but to match the original we call the props in a way that clears state.
              // The parent is expected to handle this via hiddenElements/highlightedElement setters.
              if (rawData) {
                rawData.forEach((d) => {
                  if (hiddenElements.has(d.name)) toggleElement(d.name);
                });
                if (highlightedElement) toggleHighlight(highlightedElement);
              }
            }}
            style={{
              background: "none",
              border: "none",
              color: catColor,
              cursor: "pointer",
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              opacity: 0.7,
            }}
          >
            Reset
          </button>
        </div>
        {rawData &&
          rawData.map((d) => {
            const hidden = hiddenElements.has(d.name);
            const hl = highlightedElement === d.name;
            const elTotal = activeMonths.reduce(
              (s, m) => s + (d[m] || 0),
              0
            );
            const elPct =
              totalSum > 0
                ? ((elTotal / totalSum) * 100).toFixed(1)
                : "0.0";

            const rowStyle = {
              ...elRowBase,
              opacity: hidden ? 0.3 : 1,
              ...(hl
                ? {
                    borderColor: `${catColor}35`,
                    background: `${catColor}06`,
                  }
                : {}),
            };

            return (
              <div key={d.name} style={rowStyle}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: d.color,
                    flexShrink: 0,
                    opacity: hidden ? 0.3 : 1,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#E8ECF1",
                    }}
                  >
                    {d.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: "rgba(232,236,241,0.22)",
                    }}
                  >
                    {elTotal.toLocaleString()} · {elPct}%
                  </div>
                </div>
                <button
                  onClick={() => toggleHighlight(d.name)}
                  style={smallBtn(hl, catColor, false)}
                >
                  ◉
                </button>
                <button
                  onClick={() => toggleElement(d.name)}
                  style={smallBtn(hidden, catColor, true)}
                >
                  {hidden ? "✕" : "👁"}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
