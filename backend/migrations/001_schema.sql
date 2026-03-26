-- Brief Room Database Schema
-- Two verticals: Attack Type + Context (Industry/Region/Country)

-- ===== DIMENSION TABLES =====

CREATE TABLE attack_types (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  icon        TEXT,
  color       TEXT,
  description TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE industries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  sort_order  INT DEFAULT 0
);

CREATE TABLE regions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  sort_order  INT DEFAULT 0
);

CREATE TABLE countries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  region_id   UUID REFERENCES regions(id),
  sort_order  INT DEFAULT 0
);

-- ===== METRIC DEFINITIONS =====

CREATE TABLE metrics (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  attack_type_id UUID REFERENCES attack_types(id),
  unit           TEXT DEFAULT 'count',
  chart_type     TEXT DEFAULT 'bar',
  description    TEXT,
  sort_order     INT DEFAULT 0
);

-- ===== CORE DATA TABLE =====

CREATE TABLE data_points (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id      UUID NOT NULL REFERENCES metrics(id),
  industry_id    UUID REFERENCES industries(id),
  country_id     UUID REFERENCES countries(id),
  region_id      UUID REFERENCES regions(id),
  period_type    TEXT NOT NULL,
  period_start   DATE NOT NULL,
  period_label   TEXT,
  value          NUMERIC NOT NULL,
  previous_value NUMERIC,
  source         TEXT,
  source_url     TEXT,
  confidence     TEXT DEFAULT 'high',
  is_estimate    BOOLEAN DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  created_by     TEXT
);

CREATE INDEX idx_dp_query ON data_points(metric_id, period_start DESC, region_id, industry_id);
CREATE INDEX idx_dp_country ON data_points(metric_id, country_id, period_start DESC);

-- ===== INSIGHTS =====

CREATE TABLE insights (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_html      TEXT NOT NULL,
  attack_type_id UUID REFERENCES attack_types(id),
  is_active      BOOLEAN DEFAULT true,
  priority       INT DEFAULT 0,
  valid_from     DATE,
  valid_until    DATE,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ===== BRIEFING DECK =====

CREATE TABLE briefing_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT NOT NULL,
  metric_id   UUID REFERENCES metrics(id),
  config_json JSONB,
  added_at    TIMESTAMPTZ DEFAULT now()
);
