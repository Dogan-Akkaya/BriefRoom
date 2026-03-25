-- Brief Room Seed Data
-- Migrated from briefradar_v2.html prototype dummy data

-- ===== ATTACK TYPES =====
INSERT INTO attack_types (slug, name, icon, color, description, sort_order) VALUES
  ('ransomware',     'Ransomware',                    '⬡', '#E8463A', 'Payment trends, attack volume, recovery costs, targeted sectors', 1),
  ('phishing',       'Phishing & social engineering',  '◇', '#F5A623', 'Click rates, BEC losses, delivery methods, success by sector', 2),
  ('data-breaches',  'Data breaches',                  '◈', '#4B83EE', 'Breach volume, records exposed, cost per breach, root causes', 3),
  ('vulnerabilities','Vulnerability exploitation',     '△', '#8B7CF6', 'CVE trends, time-to-exploit, patch rates, most exploited', 4),
  ('supply-chain',   'Supply chain attacks',           '◯', '#E8578A', 'Third-party breach frequency, software supply chain incidents', 5),
  ('dark-web',       'Dark web & threat intel',        '⬢', '#2DD4A8', 'Credential leaks, market activity, access broker trends', 6);

-- ===== INDUSTRIES =====
INSERT INTO industries (slug, name, sort_order) VALUES
  ('healthcare',     'Healthcare',           1),
  ('financial',      'Financial services',   2),
  ('manufacturing',  'Manufacturing & OT',   3),
  ('government',     'Government',           4),
  ('technology',     'Technology',            5),
  ('energy',         'Energy',               6),
  ('education',      'Education',            7),
  ('retail',         'Retail',               8),
  ('pharma',         'Pharmaceuticals',      9);

-- ===== REGIONS =====
INSERT INTO regions (slug, name, sort_order) VALUES
  ('north-america',       'North America',        1),
  ('europe',              'Europe',               2),
  ('asia-pacific',        'Asia-Pacific',         3),
  ('latin-america',       'Latin America',        4),
  ('middle-east-africa',  'Middle East & Africa', 5);

-- ===== COUNTRIES (sample) =====
INSERT INTO countries (code, name, region_id, sort_order) VALUES
  ('US', 'United States',   (SELECT id FROM regions WHERE slug='north-america'),      1),
  ('CA', 'Canada',          (SELECT id FROM regions WHERE slug='north-america'),      2),
  ('GB', 'United Kingdom',  (SELECT id FROM regions WHERE slug='europe'),             3),
  ('DE', 'Germany',         (SELECT id FROM regions WHERE slug='europe'),             4),
  ('FR', 'France',          (SELECT id FROM regions WHERE slug='europe'),             5),
  ('JP', 'Japan',           (SELECT id FROM regions WHERE slug='asia-pacific'),       6),
  ('AU', 'Australia',       (SELECT id FROM regions WHERE slug='asia-pacific'),       7),
  ('BR', 'Brazil',          (SELECT id FROM regions WHERE slug='latin-america'),      8),
  ('MX', 'Mexico',          (SELECT id FROM regions WHERE slug='latin-america'),      9),
  ('AE', 'UAE',             (SELECT id FROM regions WHERE slug='middle-east-africa'), 10),
  ('SA', 'Saudi Arabia',    (SELECT id FROM regions WHERE slug='middle-east-africa'), 11),
  ('TR', 'Turkey',          (SELECT id FROM regions WHERE slug='europe'),             12),
  ('IN', 'India',           (SELECT id FROM regions WHERE slug='asia-pacific'),       13),
  ('SG', 'Singapore',       (SELECT id FROM regions WHERE slug='asia-pacific'),       14);

-- ===== METRICS =====
-- Ransomware
INSERT INTO metrics (slug, name, attack_type_id, unit, chart_type, sort_order) VALUES
  ('ransomware-volume-by-industry',  'Attack volume by industry',  (SELECT id FROM attack_types WHERE slug='ransomware'), 'count',   'bar',   1),
  ('ransomware-avg-payment',         'Avg ransom payment',         (SELECT id FROM attack_types WHERE slug='ransomware'), 'usd',     'line',  2),
  ('ransomware-payment-rate',        'Payment rate over time',     (SELECT id FROM attack_types WHERE slug='ransomware'), 'percent', 'line',  3),
  ('ransomware-recovery-time',       'Recovery time by sector',    (SELECT id FROM attack_types WHERE slug='ransomware'), 'days',    'bar',   4),
  ('ransomware-top-groups',          'Top ransomware groups',      (SELECT id FROM attack_types WHERE slug='ransomware'), 'count',   'bar',   5);

-- Phishing
INSERT INTO metrics (slug, name, attack_type_id, unit, chart_type, sort_order) VALUES
  ('phishing-click-rates',           'Click rates by sector',      (SELECT id FROM attack_types WHERE slug='phishing'), 'percent', 'bar',   1),
  ('phishing-bec-losses',            'BEC losses by quarter',      (SELECT id FROM attack_types WHERE slug='phishing'), 'usd',     'line',  2),
  ('phishing-delivery-methods',      'Delivery methods',           (SELECT id FROM attack_types WHERE slug='phishing'), 'percent', 'bar',   3),
  ('phishing-impersonation',         'Impersonation targets',      (SELECT id FROM attack_types WHERE slug='phishing'), 'percent', 'bar',   4),
  ('phishing-credential-volume',     'Credential harvesting volume',(SELECT id FROM attack_types WHERE slug='phishing'),'count',   'line',  5);

-- Data breaches
INSERT INTO metrics (slug, name, attack_type_id, unit, chart_type, sort_order) VALUES
  ('breach-cost-by-industry',        'Breach cost by industry',    (SELECT id FROM attack_types WHERE slug='data-breaches'), 'usd',     'bar',   1),
  ('breach-records-exposed',         'Records exposed trend',      (SELECT id FROM attack_types WHERE slug='data-breaches'), 'count',   'line',  2),
  ('breach-root-causes',             'Root causes breakdown',      (SELECT id FROM attack_types WHERE slug='data-breaches'), 'percent', 'bar',   3),
  ('breach-time-to-detect',          'Time to detect',             (SELECT id FROM attack_types WHERE slug='data-breaches'), 'days',    'bar',   4),
  ('breach-volume-by-region',        'Breach volume by region',    (SELECT id FROM attack_types WHERE slug='data-breaches'), 'count',   'bar',   5);

-- Vulnerabilities
INSERT INTO metrics (slug, name, attack_type_id, unit, chart_type, sort_order) VALUES
  ('vuln-volume-by-type',            'CVE volume by type',         (SELECT id FROM attack_types WHERE slug='vulnerabilities'), 'count',   'bar',   1),
  ('vuln-time-to-exploit',           'Time to exploit trend',      (SELECT id FROM attack_types WHERE slug='vulnerabilities'), 'days',    'line',  2),
  ('vuln-patch-rate',                'Patch rate by severity',     (SELECT id FROM attack_types WHERE slug='vulnerabilities'), 'percent', 'bar',   3),
  ('vuln-most-exploited',            'Most exploited CVEs',        (SELECT id FROM attack_types WHERE slug='vulnerabilities'), 'count',   'bar',   4),
  ('vuln-exploit-availability',      'Exploit availability',       (SELECT id FROM attack_types WHERE slug='vulnerabilities'), 'count',   'line',  5);

-- Supply chain
INSERT INTO metrics (slug, name, attack_type_id, unit, chart_type, sort_order) VALUES
  ('supply-incidents-by-ecosystem',  'Incidents by ecosystem',     (SELECT id FROM attack_types WHERE slug='supply-chain'), 'count',   'bar',   1),
  ('supply-third-party-rate',        'Third-party breach rate',    (SELECT id FROM attack_types WHERE slug='supply-chain'), 'percent', 'line',  2),
  ('supply-malicious-packages',      'Malicious packages trend',   (SELECT id FROM attack_types WHERE slug='supply-chain'), 'count',   'line',  3),
  ('supply-impact-by-industry',      'Impact by industry',         (SELECT id FROM attack_types WHERE slug='supply-chain'), 'count',   'bar',   4),
  ('supply-attack-vectors',          'Attack vector breakdown',    (SELECT id FROM attack_types WHERE slug='supply-chain'), 'percent', 'bar',   5);

-- Dark web
INSERT INTO metrics (slug, name, attack_type_id, unit, chart_type, sort_order) VALUES
  ('darkweb-credential-volume',      'Credential listings volume', (SELECT id FROM attack_types WHERE slug='dark-web'), 'count', 'line',  1),
  ('darkweb-access-pricing',         'Access broker pricing',      (SELECT id FROM attack_types WHERE slug='dark-web'), 'usd',   'bar',   2),
  ('darkweb-market-activity',        'Market activity trend',      (SELECT id FROM attack_types WHERE slug='dark-web'), 'count', 'line',  3),
  ('darkweb-leaked-data-types',      'Leaked data by type',        (SELECT id FROM attack_types WHERE slug='dark-web'), 'percent','bar',  4),
  ('darkweb-forum-volume',           'Forum post volume',          (SELECT id FROM attack_types WHERE slug='dark-web'), 'count', 'line',  5);

-- ===== SAMPLE DATA POINTS =====
-- Ransomware: Attack volume by industry (Q1 2026 global)
INSERT INTO data_points (metric_id, industry_id, period_type, period_start, period_label, value, previous_value, source, created_by) VALUES
  ((SELECT id FROM metrics WHERE slug='ransomware-volume-by-industry'), (SELECT id FROM industries WHERE slug='healthcare'),    'quarterly', '2026-01-01', 'Q1 2026', 98, 82, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-volume-by-industry'), (SELECT id FROM industries WHERE slug='financial'),     'quarterly', '2026-01-01', 'Q1 2026', 87, 90, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-volume-by-industry'), (SELECT id FROM industries WHERE slug='manufacturing'), 'quarterly', '2026-01-01', 'Q1 2026', 72, 60, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-volume-by-industry'), (SELECT id FROM industries WHERE slug='government'),    'quarterly', '2026-01-01', 'Q1 2026', 58, 52, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-volume-by-industry'), (SELECT id FROM industries WHERE slug='technology'),    'quarterly', '2026-01-01', 'Q1 2026', 45, 42, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-volume-by-industry'), (SELECT id FROM industries WHERE slug='energy'),        'quarterly', '2026-01-01', 'Q1 2026', 38, 35, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-volume-by-industry'), (SELECT id FROM industries WHERE slug='education'),     'quarterly', '2026-01-01', 'Q1 2026', 32, 30, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-volume-by-industry'), (SELECT id FROM industries WHERE slug='retail'),        'quarterly', '2026-01-01', 'Q1 2026', 24, 22, 'SOCRadar', 'seed');

-- Ransomware: Avg payment trend
INSERT INTO data_points (metric_id, period_type, period_start, period_label, value, source, created_by) VALUES
  ((SELECT id FROM metrics WHERE slug='ransomware-avg-payment'), 'quarterly', '2025-01-01', 'Q1 25', 980,  'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-avg-payment'), 'quarterly', '2025-04-01', 'Q2 25', 1050, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-avg-payment'), 'quarterly', '2025-07-01', 'Q3 25', 1120, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-avg-payment'), 'quarterly', '2025-10-01', 'Q4 25', 1150, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-avg-payment'), 'quarterly', '2026-01-01', 'Q1 26', 1200, 'SOCRadar', 'seed');

-- Ransomware: Top groups
INSERT INTO data_points (metric_id, period_type, period_start, period_label, value, previous_value, source, created_by) VALUES
  ((SELECT id FROM metrics WHERE slug='ransomware-top-groups'), 'quarterly', '2026-01-01', 'LockBit 4.0',     142, 118, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-top-groups'), 'quarterly', '2026-01-01', 'BlackCat/ALPHV',  98,  82,  'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-top-groups'), 'quarterly', '2026-01-01', 'Cl0p',            85,  72,  'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-top-groups'), 'quarterly', '2026-01-01', 'Play',            67,  55,  'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-top-groups'), 'quarterly', '2026-01-01', 'Royal',           52,  45,  'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-top-groups'), 'quarterly', '2026-01-01', 'Akira',           48,  35,  'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-top-groups'), 'quarterly', '2026-01-01', 'Medusa',          38,  28,  'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='ransomware-top-groups'), 'quarterly', '2026-01-01', 'NoEscape',        31,  22,  'SOCRadar', 'seed');

-- Phishing: Click rates by sector
INSERT INTO data_points (metric_id, industry_id, period_type, period_start, period_label, value, previous_value, source, created_by) VALUES
  ((SELECT id FROM metrics WHERE slug='phishing-click-rates'), (SELECT id FROM industries WHERE slug='healthcare'),    'quarterly', '2026-01-01', 'Q1 2026', 5.2, 4.8, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='phishing-click-rates'), (SELECT id FROM industries WHERE slug='financial'),     'quarterly', '2026-01-01', 'Q1 2026', 3.8, 3.5, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='phishing-click-rates'), (SELECT id FROM industries WHERE slug='education'),     'quarterly', '2026-01-01', 'Q1 2026', 4.6, 4.1, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='phishing-click-rates'), (SELECT id FROM industries WHERE slug='government'),    'quarterly', '2026-01-01', 'Q1 2026', 3.1, 2.8, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='phishing-click-rates'), (SELECT id FROM industries WHERE slug='retail'),        'quarterly', '2026-01-01', 'Q1 2026', 2.9, 2.6, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='phishing-click-rates'), (SELECT id FROM industries WHERE slug='technology'),    'quarterly', '2026-01-01', 'Q1 2026', 2.2, 2.0, 'SOCRadar', 'seed');

-- Data breaches: Cost by industry
INSERT INTO data_points (metric_id, industry_id, period_type, period_start, period_label, value, previous_value, source, created_by) VALUES
  ((SELECT id FROM metrics WHERE slug='breach-cost-by-industry'), (SELECT id FROM industries WHERE slug='healthcare'),    'yearly', '2026-01-01', '2026', 10.9, 10.1, 'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-cost-by-industry'), (SELECT id FROM industries WHERE slug='financial'),     'yearly', '2026-01-01', '2026', 5.9,  5.5,  'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-cost-by-industry'), (SELECT id FROM industries WHERE slug='pharma'),        'yearly', '2026-01-01', '2026', 4.8,  4.5,  'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-cost-by-industry'), (SELECT id FROM industries WHERE slug='technology'),    'yearly', '2026-01-01', '2026', 4.7,  4.4,  'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-cost-by-industry'), (SELECT id FROM industries WHERE slug='energy'),        'yearly', '2026-01-01', '2026', 4.6,  4.2,  'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-cost-by-industry'), (SELECT id FROM industries WHERE slug='education'),     'yearly', '2026-01-01', '2026', 3.7,  3.5,  'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-cost-by-industry'), (SELECT id FROM industries WHERE slug='government'),    'yearly', '2026-01-01', '2026', 2.6,  2.4,  'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-cost-by-industry'), (SELECT id FROM industries WHERE slug='retail'),        'yearly', '2026-01-01', '2026', 2.4,  2.2,  'IBM/Ponemon', 'seed');

-- Data breaches: Avg cost trend (global)
INSERT INTO data_points (metric_id, period_type, period_start, period_label, value, source, created_by) VALUES
  ((SELECT id FROM metrics WHERE slug='breach-records-exposed'), 'yearly', '2020-01-01', '2020', 3.86, 'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-records-exposed'), 'yearly', '2021-01-01', '2021', 4.24, 'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-records-exposed'), 'yearly', '2022-01-01', '2022', 4.35, 'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-records-exposed'), 'yearly', '2023-01-01', '2023', 4.45, 'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-records-exposed'), 'yearly', '2024-01-01', '2024', 4.88, 'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-records-exposed'), 'yearly', '2025-01-01', '2025', 4.95, 'IBM/Ponemon', 'seed'),
  ((SELECT id FROM metrics WHERE slug='breach-records-exposed'), 'yearly', '2026-01-01', '2026', 4.90, 'IBM/Ponemon', 'seed');

-- Vulnerabilities: CVE volume by type
INSERT INTO data_points (metric_id, period_type, period_start, period_label, value, previous_value, source, created_by) VALUES
  ((SELECT id FROM metrics WHERE slug='vuln-volume-by-type'), 'quarterly', '2026-01-01', 'RCE',         340, 290, 'NVD', 'seed'),
  ((SELECT id FROM metrics WHERE slug='vuln-volume-by-type'), 'quarterly', '2026-01-01', 'Priv Esc',    285, 250, 'NVD', 'seed'),
  ((SELECT id FROM metrics WHERE slug='vuln-volume-by-type'), 'quarterly', '2026-01-01', 'XSS',         220, 200, 'NVD', 'seed'),
  ((SELECT id FROM metrics WHERE slug='vuln-volume-by-type'), 'quarterly', '2026-01-01', 'SQLi',        175, 160, 'NVD', 'seed'),
  ((SELECT id FROM metrics WHERE slug='vuln-volume-by-type'), 'quarterly', '2026-01-01', 'SSRF',        142, 128, 'NVD', 'seed'),
  ((SELECT id FROM metrics WHERE slug='vuln-volume-by-type'), 'quarterly', '2026-01-01', 'Auth Bypass', 118, 105, 'NVD', 'seed');

-- Supply chain: Incidents by ecosystem
INSERT INTO data_points (metric_id, period_type, period_start, period_label, value, previous_value, source, created_by) VALUES
  ((SELECT id FROM metrics WHERE slug='supply-incidents-by-ecosystem'), 'quarterly', '2026-01-01', 'npm',            85, 52, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='supply-incidents-by-ecosystem'), 'quarterly', '2026-01-01', 'PyPI',           72, 45, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='supply-incidents-by-ecosystem'), 'quarterly', '2026-01-01', 'Maven',          48, 32, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='supply-incidents-by-ecosystem'), 'quarterly', '2026-01-01', 'Docker Hub',     62, 40, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='supply-incidents-by-ecosystem'), 'quarterly', '2026-01-01', 'GitHub Actions', 55, 38, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='supply-incidents-by-ecosystem'), 'quarterly', '2026-01-01', 'NuGet',          35, 22, 'SOCRadar', 'seed');

-- Dark web: Access broker pricing
INSERT INTO data_points (metric_id, period_type, period_start, period_label, value, previous_value, source, created_by) VALUES
  ((SELECT id FROM metrics WHERE slug='darkweb-access-pricing'), 'quarterly', '2026-01-01', 'Corporate VPN', 4500,  3800, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='darkweb-access-pricing'), 'quarterly', '2026-01-01', 'RDP',           2800,  2200, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='darkweb-access-pricing'), 'quarterly', '2026-01-01', 'Citrix',        3200,  2800, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='darkweb-access-pricing'), 'quarterly', '2026-01-01', 'Cloud admin',   8500,  7200, 'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='darkweb-access-pricing'), 'quarterly', '2026-01-01', 'Domain admin',  12000, 10000,'SOCRadar', 'seed'),
  ((SELECT id FROM metrics WHERE slug='darkweb-access-pricing'), 'quarterly', '2026-01-01', 'Database',      5200,  4500, 'SOCRadar', 'seed');

-- ===== INSIGHTS =====
INSERT INTO insights (text_html, attack_type_id, priority) VALUES
  ('Ransomware payments increased <strong style="color:#E8463A">18% QoQ</strong> to $1.2M average — Healthcare remains the #1 targeted sector globally.',
   (SELECT id FROM attack_types WHERE slug='ransomware'), 5),
  ('Time-to-exploit for critical CVEs dropped to <strong style="color:#8B7CF6">5 days</strong>, down from 17 days in 2024. Patch windows are shrinking fast.',
   (SELECT id FROM attack_types WHERE slug='vulnerabilities'), 4),
  ('Supply chain attacks surged <strong style="color:#E8578A">245% YoY</strong> — npm and PyPI ecosystems account for 65% of malicious package incidents.',
   (SELECT id FROM attack_types WHERE slug='supply-chain'), 3),
  ('Phishing click rates rose to <strong style="color:#F5A623">3.4%</strong> in Q1 2026, with QR-code phishing ("quishing") up 340% since last year.',
   (SELECT id FROM attack_types WHERE slug='phishing'), 2),
  ('Dark web credential listings hit <strong style="color:#2DD4A8">24 billion</strong> records. Corporate VPN access sells for $4,500 average on access broker markets.',
   (SELECT id FROM attack_types WHERE slug='dark-web'), 1);
