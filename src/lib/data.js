// Phase 1: Local dummy data (will be replaced by Supabase queries in Phase 2)

export const attackTypes = [
  { slug: 'ransomware', name: 'Ransomware', icon: '⬡', color: '#E8463A', chartCount: 14, description: 'Payment trends, attack volume, recovery costs, targeted sectors', statVal: '$1.2M', statDelta: '↑18%', statDeltaUp: true, statLabel: 'avg payment' },
  { slug: 'phishing', name: 'Phishing & social engineering', icon: '◇', color: '#F5A623', chartCount: 12, description: 'Click rates, BEC losses, delivery methods, success by sector', statVal: '3.4%', statDelta: '↑0.6%', statDeltaUp: true, statLabel: 'avg click rate' },
  { slug: 'data-breaches', name: 'Data breaches', icon: '◈', color: '#4B83EE', chartCount: 13, description: 'Breach volume, records exposed, cost per breach, root causes', statVal: '$4.9M', statDelta: '↑8%', statDeltaUp: true, statLabel: 'avg breach cost' },
  { slug: 'vulnerabilities', name: 'Vulnerability exploitation', icon: '△', color: '#8B7CF6', chartCount: 11, description: 'CVE trends, time-to-exploit, patch rates, most exploited', statVal: '5d', statDelta: '↓12d', statDeltaUp: false, statLabel: 'time to exploit' },
  { slug: 'supply-chain', name: 'Supply chain attacks', icon: '◯', color: '#E8578A', chartCount: 10, description: 'Third-party breach frequency, software supply chain incidents', statVal: '245%', statDelta: '↑78%', statDeltaUp: true, statLabel: 'yoy increase' },
  { slug: 'dark-web', name: 'Dark web & threat intel', icon: '⬢', color: '#2DD4A8', chartCount: 12, description: 'Credential leaks, market activity, access broker trends', statVal: '24B', statDelta: '↑31%', statDeltaUp: true, statLabel: 'leaked creds' },
]

export const metricsByTopic = {
  'Ransomware': ['Attack volume by industry', 'Avg ransom payment', 'Payment rate over time', 'Recovery time by sector', 'Top ransomware groups'],
  'Phishing': ['Click rates by sector', 'BEC losses by quarter', 'Delivery methods', 'Impersonation targets', 'Credential harvesting volume'],
  'Data breaches': ['Breach cost by industry', 'Records exposed trend', 'Root causes breakdown', 'Time to detect', 'Breach volume by region'],
  'Vulnerabilities': ['CVE volume by type', 'Time to exploit trend', 'Patch rate by severity', 'Most exploited CVEs', 'Exploit availability'],
  'Supply chain': ['Incidents by ecosystem', 'Third-party breach rate', 'Malicious packages trend', 'Impact by industry', 'Attack vector breakdown'],
  'Dark web': ['Credential listings volume', 'Access broker pricing', 'Market activity trend', 'Leaked data by type', 'Forum post volume'],
}

export const topicNameBySlug = {
  'ransomware': 'Ransomware',
  'phishing': 'Phishing',
  'data-breaches': 'Data breaches',
  'vulnerabilities': 'Vulnerabilities',
  'supply-chain': 'Supply chain',
  'dark-web': 'Dark web',
}

export const builderData = {
  'Ransomware': {
    'Attack volume by industry': { labels: ['Healthcare', 'Financial', 'Mfg & OT', 'Government', 'Technology', 'Energy', 'Education', 'Retail'], q1: [98, 87, 72, 58, 45, 38, 32, 24], q0: [82, 90, 60, 52, 42, 35, 30, 22] },
    'Avg ransom payment': { labels: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26'], q1: [980, 1050, 1120, 1150, 1200], q0: null },
    'Payment rate over time': { labels: ['2021', '2022', '2023', '2024', '2025', '2026'], q1: [54, 41, 37, 32, 28, 25], q0: null },
    'Recovery time by sector': { labels: ['Healthcare', 'Financial', 'Government', 'Manufacturing', 'Education', 'Retail'], q1: [23, 18, 21, 16, 14, 12], q0: [20, 16, 18, 14, 12, 10] },
    'Top ransomware groups': { labels: ['LockBit 4.0', 'BlackCat/ALPHV', 'Cl0p', 'Play', 'Royal', 'Akira', 'Medusa', 'NoEscape'], q1: [142, 98, 85, 67, 52, 48, 38, 31], q0: [118, 82, 72, 55, 45, 35, 28, 22] },
  },
  'Phishing': {
    'Click rates by sector': { labels: ['Healthcare', 'Financial', 'Education', 'Government', 'Retail', 'Technology'], q1: [5.2, 3.8, 4.6, 3.1, 2.9, 2.2], q0: [4.8, 3.5, 4.1, 2.8, 2.6, 2.0] },
    'BEC losses by quarter': { labels: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26'], q1: [680, 720, 695, 750, 810], q0: null },
    'Delivery methods': { labels: ['Email link', 'Attachment', 'QR code', 'SMS/Smishing', 'Voice/Vishing', 'Social media'], q1: [42, 28, 12, 9, 5, 4], q0: [45, 30, 8, 7, 6, 4] },
    'Impersonation targets': { labels: ['Microsoft', 'Google', 'DHL', 'Amazon', 'LinkedIn', 'Apple', 'Meta', 'Netflix'], q1: [22, 18, 11, 10, 9, 8, 7, 5], q0: null },
    'Credential harvesting volume': { labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], q1: [1200, 1350, 1420, 1380, 1500, 1450, 1550, 1620, 1700, 1580, 1650, 1720], q0: null },
  },
  'Data breaches': {
    'Breach cost by industry': { labels: ['Healthcare', 'Financial', 'Pharma', 'Technology', 'Energy', 'Education', 'Government', 'Retail'], q1: [10.9, 5.9, 4.8, 4.7, 4.6, 3.7, 2.6, 2.4], q0: [10.1, 5.5, 4.5, 4.4, 4.2, 3.5, 2.4, 2.2] },
    'Records exposed trend': { labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'], q1: [37, 22, 15, 8.2, 6.1, 4.8, 5.2], q0: null },
    'Root causes breakdown': { labels: ['Stolen creds', 'Phishing', 'Misconfiguration', 'Vuln exploit', 'Business email', 'Insider', 'Physical', 'Unknown'], q1: [19, 16, 15, 13, 12, 11, 9, 5], q0: null },
    'Time to detect': { labels: ['Healthcare', 'Financial', 'Government', 'Technology', 'Retail', 'Energy'], q1: [231, 177, 259, 165, 192, 218], q0: [246, 188, 272, 178, 205, 230] },
    'Breach volume by region': { labels: ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East', 'Africa'], q1: [42, 28, 18, 6, 4, 2], q0: [40, 26, 20, 7, 5, 2] },
  },
  'Vulnerabilities': {
    'CVE volume by type': { labels: ['RCE', 'Priv Esc', 'XSS', 'SQLi', 'SSRF', 'Auth Bypass', 'DoS', 'Info Disc'], q1: [340, 285, 220, 175, 142, 118, 95, 88], q0: [290, 250, 200, 160, 128, 105, 82, 75] },
    'Time to exploit trend': { labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'], q1: [42, 35, 21, 15, 9, 7, 5], q0: null },
    'Patch rate by severity': { labels: ['Critical', 'High', 'Medium', 'Low'], q1: [72, 58, 34, 18], q0: [65, 52, 30, 15] },
    'Most exploited CVEs': { labels: ['Log4Shell', 'ProxyShell', 'MOVEit', 'Citrix Bleed', 'Fortinet SSL', 'Ivanti Connect', 'ScreenConnect', 'GoAnywhere'], q1: [95, 82, 78, 72, 68, 65, 58, 42], q0: null },
    'Exploit availability': { labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], q1: [45, 52, 48, 62, 58, 72, 65, 78, 82, 68, 75, 88], q0: null },
  },
  'Supply chain': {
    'Incidents by ecosystem': { labels: ['npm', 'PyPI', 'Maven', 'NuGet', 'Docker Hub', 'GitHub Actions', 'RubyGems', 'Go modules'], q1: [85, 72, 48, 35, 62, 55, 28, 22], q0: [52, 45, 32, 22, 40, 38, 18, 15] },
    'Third-party breach rate': { labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'], q1: [12, 18, 24, 35, 48, 62, 78], q0: null },
    'Malicious packages trend': { labels: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26'], q1: [420, 510, 580, 650, 745], q0: null },
    'Impact by industry': { labels: ['Technology', 'Financial', 'Healthcare', 'Government', 'Manufacturing', 'Retail'], q1: [32, 24, 18, 15, 12, 8], q0: [25, 20, 14, 12, 10, 6] },
    'Attack vector breakdown': { labels: ['Typosquatting', 'Dependency confusion', 'Account takeover', 'Build system', 'Code injection', 'Backdoor'], q1: [35, 22, 18, 12, 8, 5], q0: null },
  },
  'Dark web': {
    'Credential listings volume': { labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], q1: [2400, 2200, 2600, 2350, 2800, 2550, 2900, 3100, 2750, 2950, 3200, 3400], q0: null },
    'Access broker pricing': { labels: ['Corporate VPN', 'RDP', 'Citrix', 'Cloud admin', 'Database', 'Email server', 'Domain admin', 'API keys'], q1: [4500, 2800, 3200, 8500, 5200, 1800, 12000, 6500], q0: [3800, 2200, 2800, 7200, 4500, 1500, 10000, 5800] },
    'Market activity trend': { labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'], q1: [1200, 1850, 2400, 2100, 2800, 3200, 3600], q0: null },
    'Leaked data by type': { labels: ['Credentials', 'PII', 'CC Data', 'Health records', 'Corporate docs', 'Source code'], q1: [42, 22, 15, 8, 8, 5], q0: null },
    'Forum post volume': { labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], q1: [8500, 9200, 8800, 9500, 10200, 9800, 10500, 11200, 10800, 11500, 12200, 12800], q0: null },
  },
}

export const insights = [
  'Ransomware payments increased <strong style="color:#E8463A">18% QoQ</strong> to $1.2M average — Healthcare remains the #1 targeted sector globally.',
  'Time-to-exploit for critical CVEs dropped to <strong style="color:#8B7CF6">5 days</strong>, down from 17 days in 2024. Patch windows are shrinking fast.',
  'Supply chain attacks surged <strong style="color:#E8578A">245% YoY</strong> — npm and PyPI ecosystems account for 65% of malicious package incidents.',
  'Phishing click rates rose to <strong style="color:#F5A623">3.4%</strong> in Q1 2026, with QR-code phishing ("quishing") up 340% since last year.',
  'Dark web credential listings hit <strong style="color:#2DD4A8">24 billion</strong> records. Corporate VPN access sells for $4,500 average on access broker markets.',
]

export const trendingCharts = [
  { id: 't1', title: 'Ransomware attack volume', tag: 'Ransomware', tagColor: '#E8463A', sub: 'Trailing 12 months · Global', topic: 'ransomware' },
  { id: 't2', title: 'Attacks by industry', tag: 'Ransomware', tagColor: '#E8463A', sub: 'Q1 2026 vs Q1 2025', topic: 'ransomware' },
  { id: 't3', title: 'Phishing click rates by sector', tag: 'Phishing', tagColor: '#F5A623', sub: 'Q1 2026 · Global', topic: 'phishing' },
  { id: 't4', title: 'Avg cost of a data breach', tag: 'Breaches', tagColor: '#4B83EE', sub: '2020-2026 · By year', topic: 'data-breaches' },
]

export const regionMultipliers = { 'Global': 1, 'North America': 1.15, 'Europe': 0.92, 'Latin America': 0.65, 'Asia-Pacific': 0.88, 'Middle East & Africa': 0.55 }
export const industryMultipliers = { 'All industries': 1, 'Healthcare': 1.2, 'Financial services': 1.1, 'Manufacturing & OT': 0.85, 'Government': 0.9, 'Technology': 0.95 }
