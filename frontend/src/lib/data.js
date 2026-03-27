// Phase 1: Local dummy data (will be replaced by PostgreSQL API in Phase 3)

// Categories for the builder (10 total, 6 with data)
export const CATEGORIES = [
  { id: 'ransomware', label: 'Ransomware', svgPath: 'M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2v2H10V6a2 2 0 0 1 2-2zm0 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z', desc: 'Attack frequency, ransom demands, targeted sectors and recovery metrics', hasData: true },
  { id: 'phishing', label: 'Phishing', svgPath: 'M21 10a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7zM3 10l9 4 9-4M7 4h10l2 4H5l2-4z', desc: 'Campaign volumes, click-through rates, delivery vectors and targets', hasData: true },
  { id: 'infostealer', label: 'Infostealer Logs', svgPath: 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z', desc: 'Stolen credential volumes, affected domains and malware families', hasData: false },
  { id: 'logs_on_sale', label: 'Logs on Sale', svgPath: 'M3 3h18v4H3V3zm1 6h6v12H4V9zm8 0h8v5h-8V9zm0 7h8v5h-8v-5z', desc: 'Dark web marketplace activity, pricing trends and access types', hasData: false },
  { id: 'data_leaks', label: 'Data Leaks', svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 9h8v1c0 2.21-1.79 4-4 4s-4-1.79-4-4v-1z', desc: 'Breach volumes, exposed record counts and leak sources', hasData: true },
  { id: 'employee_exposure', label: 'Employee Data Exposure', svgPath: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-6 8a6 6 0 0 1 12 0H6z', desc: 'Compromised corporate credentials and exposed PII', hasData: false },
  { id: 'dark_web_mentions', label: 'Dark Web Mentions', svgPath: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 7a5 5 0 0 0-3.54 1.46l1.42 1.42A3 3 0 0 1 15 12h2a5 5 0 0 0-5-5zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z', desc: 'Brand mentions, threat actor chatter and sentiment tracking', hasData: true },
  { id: 'vulnerability', label: 'Vulnerability Exploits', svgPath: 'M12 2L4 7v6c0 5.25 3.4 10.15 8 11.35 4.6-1.2 8-6.1 8-11.35V7l-8-5zM11 10v4h2v-4h-2zm0 5v2h2v-2h-2z', desc: 'CVE trends, exploit availability and patch gaps', hasData: true },
  { id: 'ddos', label: 'DDoS Attacks', svgPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', desc: 'Attack volumes, peak bandwidth and duration trends', hasData: false },
  { id: 'supply_chain', label: 'Supply Chain Threats', svgPath: 'M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.414-1.414m-1.414-8.486a4 4 0 0 1 5.656 0l4 4a4 4 0 1 1-5.656 5.656l-1.414-1.414', desc: 'Third-party compromises and software supply chain attacks', hasData: true },
]

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Threat groups / actors
export const THREAT_GROUPS = [
  'All Groups', 'LockBit 4.0', 'BlackCat/ALPHV', 'Cl0p', 'Play', 'Akira',
  'Royal', 'Medusa', 'NoEscape', 'Black Basta', 'RansomHub', 'Rhysida', 'BianLian'
]

// Data points per category — each has its own element set
export const DATA_POINTS_BY_CATEGORY = {
  ransomware: [
    { id: 'attack_volume', label: 'Attack Volume', elements: ['Healthcare', 'Finance', 'Manufacturing', 'Government', 'Education', 'Energy', 'Retail', 'Technology'] },
    { id: 'ransom_demands', label: 'Ransom Demands ($)', elements: ['< $100K', '$100K-$500K', '$500K-$1M', '$1M-$5M', '$5M-$10M', '> $10M'] },
    { id: 'recovery_time', label: 'Recovery Time (days)', elements: ['Healthcare', 'Finance', 'Manufacturing', 'Government', 'Education', 'Energy'] },
    { id: 'payment_rate', label: 'Payment Rate (%)', elements: ['2021', '2022', '2023', '2024', '2025', '2026'] },
    { id: 'targeted_sectors', label: 'Targeted Sectors', elements: ['Healthcare', 'Financial Services', 'Manufacturing', 'Government', 'Technology', 'Education', 'Energy', 'Retail'] },
  ],
  phishing: [
    { id: 'campaign_volume', label: 'Campaign Volume', elements: ['Email', 'SMS/Smishing', 'QR Code', 'Social Media', 'Spear Phishing', 'Voice/Vishing'] },
    { id: 'click_rate', label: 'Click-Through Rate (%)', elements: ['Healthcare', 'Finance', 'Education', 'Government', 'Retail', 'Technology'] },
    { id: 'bec_losses', label: 'BEC Losses ($)', elements: ['Wire Transfer', 'Gift Cards', 'Payroll Diversion', 'Invoice Fraud', 'Real Estate', 'Vendor Impersonation'] },
    { id: 'delivery_vectors', label: 'Delivery Vectors', elements: ['Email Link', 'Attachment', 'QR Code', 'SMS', 'Voice', 'Social Media'] },
    { id: 'impersonation', label: 'Impersonation Targets', elements: ['Microsoft', 'Google', 'DHL', 'Amazon', 'LinkedIn', 'Apple', 'Meta', 'Netflix'] },
  ],
  data_leaks: [
    { id: 'records_exposed', label: 'Records Exposed', elements: ['PII Records', 'Financial Data', 'Credentials', 'Health Records', 'Intellectual Property', 'Source Code'] },
    { id: 'breach_cost', label: 'Breach Cost ($M)', elements: ['Healthcare', 'Financial', 'Pharma', 'Technology', 'Energy', 'Education', 'Government', 'Retail'] },
    { id: 'root_causes', label: 'Root Causes', elements: ['Stolen Creds', 'Phishing', 'Misconfiguration', 'Vulnerability', 'Insider Threat', 'Physical', 'Unknown'] },
    { id: 'time_to_detect', label: 'Time to Detect (days)', elements: ['Healthcare', 'Finance', 'Government', 'Technology', 'Retail', 'Energy'] },
    { id: 'leak_sources', label: 'Leak Sources', elements: ['Dark Web Forums', 'Paste Sites', 'Telegram', 'Ransomware Sites', 'Public Repos', 'Social Media'] },
  ],
  vulnerability: [
    { id: 'cve_volume', label: 'CVE Volume', elements: ['RCE', 'Privilege Escalation', 'SQLi', 'XSS', 'Auth Bypass', 'SSRF', 'DoS', 'Info Disclosure'] },
    { id: 'time_to_exploit', label: 'Time to Exploit (days)', elements: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'] },
    { id: 'patch_rate', label: 'Patch Rate (%)', elements: ['Critical', 'High', 'Medium', 'Low'] },
    { id: 'exploit_availability', label: 'Exploit Availability', elements: ['PoC Published', 'Weaponized', 'In-the-Wild', 'Kit Available', 'No Known Exploit'] },
    { id: 'severity_dist', label: 'Severity Distribution', elements: ['Critical', 'High', 'Medium', 'Low', 'Informational'] },
  ],
  supply_chain: [
    { id: 'incident_count', label: 'Incident Count', elements: ['npm', 'PyPI', 'Maven', 'Docker Hub', 'GitHub Actions', 'NuGet', 'RubyGems', 'Go Modules'] },
    { id: 'malicious_packages', label: 'Malicious Packages', elements: ['Typosquatting', 'Dependency Confusion', 'Account Takeover', 'Build Injection', 'Backdoor', 'Data Exfil'] },
    { id: 'third_party_rate', label: 'Third-Party Breach Rate', elements: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'] },
    { id: 'impact_sector', label: 'Impact by Sector', elements: ['Technology', 'Financial', 'Healthcare', 'Government', 'Manufacturing', 'Retail'] },
    { id: 'attack_vectors', label: 'Attack Vectors', elements: ['Open Source', 'CI/CD Pipeline', 'Cloud Provider', 'SaaS Vendor', 'Managed Services', 'CDN/Infrastructure'] },
  ],
  dark_web_mentions: [
    { id: 'credential_listings', label: 'Credential Listings', elements: ['Corporate Email', 'VPN Credentials', 'Cloud Accounts', 'Database Access', 'Admin Panels', 'API Keys'] },
    { id: 'access_pricing', label: 'Access Broker Pricing ($)', elements: ['Corporate VPN', 'RDP', 'Citrix', 'Cloud Admin', 'Domain Admin', 'Database', 'Email Server'] },
    { id: 'market_activity', label: 'Market Activity', elements: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'] },
    { id: 'forum_posts', label: 'Forum Posts', elements: ['Brand Name', 'Executives', 'Products', 'Domains', 'Code Repos', 'Partners'] },
    { id: 'data_types', label: 'Data Types Listed', elements: ['Credentials', 'PII', 'Credit Cards', 'Health Records', 'Corporate Docs', 'Source Code'] },
  ],
}

// Seeded RNG data generator — uses composite key for unique data per category+datapoint
export function generateData(compositeKey) {
  const seed = compositeKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const rng = (i) => Math.abs(Math.sin(seed * 9301 + i * 49297) * 233280) % 1

  // Look up elements from DATA_POINTS_BY_CATEGORY if key contains underscore
  const parts = compositeKey.split('/')
  const catId = parts[0]
  const dpId = parts[1]
  let elementNames

  if (dpId && DATA_POINTS_BY_CATEGORY[catId]) {
    const dp = DATA_POINTS_BY_CATEGORY[catId].find(d => d.id === dpId)
    elementNames = dp ? dp.elements : null
  }

  if (!elementNames) {
    // Fallback to legacy element sets
    const elements = {
      ransomware: ['Healthcare', 'Finance', 'Manufacturing', 'Government', 'Education', 'Energy'],
      phishing: ['Email', 'SMS', 'QR Code', 'Social Media', 'Spear Phishing', 'BEC'],
      data_leaks: ['PII Records', 'Financial Data', 'Credentials', 'Health Records', 'IP', 'Source Code'],
      dark_web_mentions: ['Brand Name', 'Executives', 'Products', 'Domains', 'Code Repos', 'Partners'],
      vulnerability: ['RCE', 'Privilege Escalation', 'SQLi', 'XSS', 'Auth Bypass', 'SSRF'],
      supply_chain: ['Open Source', 'CI/CD', 'Cloud Provider', 'SaaS Vendor', 'Managed Services', 'CDN/Infra'],
      infostealer: ['Redline', 'Raccoon', 'Vidar', 'Lumma', 'StealC', 'Risepro'],
      logs_on_sale: ['RDP Access', 'VPN Creds', 'Admin Panels', 'Email Access', 'Cloud Accounts', 'SSH Keys'],
      employee_exposure: ['Email/Pass', 'Phone Numbers', 'Corporate ID', 'Social Media', 'Financial Info', 'Home Address'],
      ddos: ['UDP Flood', 'SYN Flood', 'HTTP Flood', 'DNS Amplification', 'NTP Reflection', 'QUIC Flood'],
    }
    elementNames = elements[catId] || elements.ransomware
  }

  return elementNames.map((name, i) => {
    const vals = {}
    MONTHS.forEach((m, mi) => { vals[m] = Math.round(rng(i * 100 + mi * 7 + seed) * 600 + 100 + rng(mi * 13 + i) * 300) })
    return { name, ...vals, color: `hsl(${(i * 55 + seed * 3) % 360},55%,58%)` }
  })
}

// Popular charts for the landing page — 8 charts
export const POPULAR = [
  { title: 'Ransomware Attacks by Sector', views: '12.4k', tag: 'THREAT INTEL', trend: '+23% YoY', up: true, color: '#FF4562', data: [12, 19, 15, 25, 22, 30, 28, 35, 40, 38, 45, 52], sources: '2,400+ incident reports', updated: 'Mar 2026', detail: 'Healthcare and manufacturing remain the most targeted sectors. Median ransom demand increased 40% to $1.2M.', metrics: [{ label: 'Avg. Ransom', value: '$1.2M' }, { label: 'Top Sector', value: 'Healthcare' }], categoryId: 'ransomware' },
  { title: 'Mean Time to Detect (MTTD)', views: '9.8k', tag: 'OPERATIONS', trend: '-18% YoY', up: false, color: '#3B82F6', data: [200, 195, 180, 175, 160, 155, 140, 130, 125, 110, 105, 98], sources: 'Global SOC benchmark data', updated: 'Mar 2026', detail: 'Organizations with XDR reduced detection time by 34%. Average MTTD now at 98 days, down from 120 in 2024.', metrics: [{ label: 'Current Avg.', value: '98 days' }, { label: 'Best-in-class', value: '12 days' }], categoryId: 'data_leaks' },
  { title: 'Cloud Misconfiguration Trends', views: '8.2k', tag: 'CLOUD SEC', trend: '-12% YoY', up: false, color: '#10B981', data: [45, 42, 48, 40, 38, 35, 33, 36, 30, 28, 25, 22], sources: 'Multi-cloud scanning data', updated: 'Feb 2026', detail: 'Public S3 buckets down 62%. IAM over-provisioning remains the #1 misconfiguration across AWS and Azure.', metrics: [{ label: '#1 Misconfig', value: 'IAM Excess' }, { label: 'Public Buckets', value: '-62%' }], categoryId: 'vulnerability' },
  { title: 'Phishing Click-Through Rates', views: '7.5k', tag: 'AWARENESS', trend: '-31% YoY', up: false, color: '#F59E0B', data: [18, 16, 19, 15, 14, 12, 13, 11, 10, 9, 8, 7], sources: 'Simulated phishing campaigns', updated: 'Mar 2026', detail: 'QR-code phishing (quishing) saw 400% growth. Traditional email click rates dropping but lateral vectors evolve.', metrics: [{ label: 'Click Rate', value: '7.1%' }, { label: 'Quishing', value: '+400%' }], categoryId: 'phishing' },
  { title: 'Vulnerability Exploits in the Wild', views: '6.9k', tag: 'CVE TRACKING', trend: '+34% YoY', up: true, color: '#A855F7', data: [28, 32, 30, 38, 42, 45, 50, 55, 48, 52, 58, 64], sources: 'NVD + CISA KEV catalog', updated: 'Mar 2026', detail: 'Time-to-exploit for critical CVEs dropped to 5 days. Zero-day exploitation up 40% compared to 2024.', metrics: [{ label: 'Avg. TTE', value: '5 days' }, { label: 'Zero-Days', value: '+40%' }], categoryId: 'vulnerability' },
  { title: 'Supply Chain Incidents by Ecosystem', views: '5.6k', tag: 'SUPPLY CHAIN', trend: '+245% YoY', up: true, color: '#EC4899', data: [8, 10, 12, 15, 18, 22, 28, 35, 42, 48, 55, 62], sources: 'SOCRadar supply chain monitoring', updated: 'Mar 2026', detail: 'npm and PyPI account for 65% of malicious package incidents. Typosquatting remains the dominant attack vector.', metrics: [{ label: '#1 Ecosystem', value: 'npm' }, { label: 'Packages', value: '745+' }], categoryId: 'supply_chain' },
  { title: 'Dark Web Credential Listings', views: '4.8k', tag: 'DARK WEB', trend: '+31% YoY', up: true, color: '#14B8A6', data: [180, 195, 210, 200, 225, 240, 255, 270, 260, 280, 295, 310], sources: 'SOCRadar dark web monitoring', updated: 'Mar 2026', detail: 'Corporate VPN credentials sell for $4,500 average. Domain admin access prices jumped 20% to $12,000.', metrics: [{ label: 'VPN Price', value: '$4,500' }, { label: 'Total Listed', value: '24B+' }], categoryId: 'dark_web_mentions' },
  { title: 'DDoS Attack Bandwidth Trends', views: '3.9k', tag: 'INFRASTRUCTURE', trend: '+67% YoY', up: true, color: '#F97316', data: [120, 135, 128, 145, 160, 175, 190, 210, 225, 240, 255, 280], sources: 'Global DDoS monitoring network', updated: 'Feb 2026', detail: 'Peak attack bandwidth exceeded 3.5 Tbps in Q1 2026. QUIC flood attacks emerged as the fastest-growing vector.', metrics: [{ label: 'Peak BW', value: '3.5 Tbps' }, { label: '#1 Vector', value: 'QUIC Flood' }], categoryId: 'ransomware' },
]

export const SEARCH_SUGGESTIONS = [
  { text: 'Ransomware trends in healthcare', cat: 'Threat Intel' },
  { text: 'MTTD benchmarks financial services', cat: 'Operations' },
  { text: 'Cloud security posture by region', cat: 'Cloud' },
  { text: 'Zero-day frequency 2024 vs 2025', cat: 'Threat Intel' },
  { text: 'Phishing click rates by industry', cat: 'Awareness' },
  { text: 'Dark web credential pricing trends', cat: 'Dark Web' },
  { text: 'Supply chain malicious packages npm', cat: 'Supply Chain' },
  { text: 'DDoS attack volume Q1 2026', cat: 'Infrastructure' },
]

export const insights = [
  'Ransomware payments increased <strong style="color:#FF4562">18% QoQ</strong> to $1.2M average — Healthcare remains the #1 targeted sector globally.',
  'Time-to-exploit for critical CVEs dropped to <strong style="color:#A855F7">5 days</strong>, down from 17 days in 2024. Patch windows are shrinking fast.',
  'Supply chain attacks surged <strong style="color:#FF4562">245% YoY</strong> — npm and PyPI ecosystems account for 65% of malicious package incidents.',
  'Phishing click rates rose to <strong style="color:#F59E0B">3.4%</strong> in Q1 2026, with QR-code phishing ("quishing") up 340% since last year.',
  'Dark web credential listings hit <strong style="color:#10B981">24 billion</strong> records. Corporate VPN access sells for $4,500 average on access broker markets.',
]

// Extended date range: Jan 2024 — Dec 2026 (36 months)
export const ALL_MONTHS = []
const YEARS = [2024, 2025, 2026]
YEARS.forEach(y => {
  MONTHS.forEach(m => {
    ALL_MONTHS.push({ month: m, year: y, label: `${m} ${y}` })
  })
})

// Seeded RNG for deterministic data availability (same pattern as generateData)
const _availRng = (i) => Math.abs(Math.sin(7919 * 9301 + i * 49297) * 233280) % 1

// Data availability — varies by month (lower in 2024, peaks in late 2025)
export const DATA_AVAILABILITY = ALL_MONTHS.map((m, i) => {
  const r = _availRng(i * 17 + 3)
  const base = i < 12 ? 40 + r * 30 : i < 24 ? 65 + r * 25 : 55 + r * 35
  return { ...m, index: i, sources: Math.round(base) }
})

// Quick date presets
export const DATE_PRESETS = [
  { label: 'Last 3 months', start: 33, end: 35 },
  { label: 'Last 6 months', start: 30, end: 35 },
  { label: 'Last year', start: 24, end: 35 },
  { label: 'YTD 2026', start: 24, end: 26 },
  { label: 'All time', start: 0, end: 35 },
]

// Extended countries list (for searchable dropdown)
export const ALL_COUNTRIES = [
  { name: 'United States', region: 'North America' },
  { name: 'Canada', region: 'North America' },
  { name: 'United Kingdom', region: 'Europe' },
  { name: 'Germany', region: 'Europe' },
  { name: 'France', region: 'Europe' },
  { name: 'Netherlands', region: 'Europe' },
  { name: 'Spain', region: 'Europe' },
  { name: 'Italy', region: 'Europe' },
  { name: 'Sweden', region: 'Europe' },
  { name: 'Norway', region: 'Europe' },
  { name: 'Finland', region: 'Europe' },
  { name: 'Poland', region: 'Europe' },
  { name: 'Switzerland', region: 'Europe' },
  { name: 'Turkey', region: 'Middle East' },
  { name: 'UAE', region: 'Middle East' },
  { name: 'Saudi Arabia', region: 'Middle East' },
  { name: 'Israel', region: 'Middle East' },
  { name: 'Qatar', region: 'Middle East' },
  { name: 'Japan', region: 'Asia Pacific' },
  { name: 'Australia', region: 'Asia Pacific' },
  { name: 'Singapore', region: 'Asia Pacific' },
  { name: 'India', region: 'Asia Pacific' },
  { name: 'South Korea', region: 'Asia Pacific' },
  { name: 'Indonesia', region: 'Asia Pacific' },
  { name: 'Brazil', region: 'Latin America' },
  { name: 'Mexico', region: 'Latin America' },
  { name: 'Colombia', region: 'Latin America' },
  { name: 'Argentina', region: 'Latin America' },
  { name: 'South Africa', region: 'Africa' },
  { name: 'Nigeria', region: 'Africa' },
  { name: 'Kenya', region: 'Africa' },
]
export const ALL_REGIONS = [...new Set(ALL_COUNTRIES.map(c => c.region))]

// Global Threat Reports — fixed charts from trusted external sources
export const GLOBAL_REPORTS = [
  { id: 'ibm-breach-cost', source: 'IBM X-Force', sourceShort: 'IBM', title: 'Cost of a Data Breach by Industry', year: 2025, category: 'Data Breaches', color: '#3B82F6', description: 'Healthcare leads at $10.9M average breach cost, followed by financial services at $5.9M. Overall average reached $4.88M globally.', chartType: 'bar', dummyData: [10.9, 5.9, 4.8, 4.7, 4.6, 3.7, 2.6], dummyLabels: ['Healthcare', 'Financial', 'Pharma', 'Tech', 'Energy', 'Education', 'Gov'] },
  { id: 'ibm-breach-lifecycle', source: 'IBM X-Force', sourceShort: 'IBM', title: 'Average Breach Lifecycle (days)', year: 2025, category: 'Data Breaches', color: '#3B82F6', description: 'Mean time to identify a breach: 194 days. Mean time to contain: 68 days. Total lifecycle: 262 days average.', chartType: 'line', dummyData: [287, 280, 277, 272, 268, 262], dummyLabels: ['2020', '2021', '2022', '2023', '2024', '2025'] },
  { id: 'cs-threat-actors', source: 'CrowdStrike', sourceShort: 'CS', title: 'Top Threat Actors by Region', year: 2025, category: 'Threat Actors', color: '#EF4444', description: 'Nation-state actors from China, Russia, and Iran remain the most prolific. eCrime groups increasingly target healthcare and manufacturing.', chartType: 'bar', dummyData: [142, 98, 76, 45, 38, 28], dummyLabels: ['China', 'Russia', 'Iran', 'N. Korea', 'Criminal', 'Other'] },
  { id: 'cs-ecrime-index', source: 'CrowdStrike', sourceShort: 'CS', title: 'eCrime Index Trend 2020-2025', year: 2025, category: 'eCrime', color: '#EF4444', description: 'The CrowdStrike eCrime Index (ECX) tracks the volume and sophistication of cybercriminal activity. 2025 saw a 34% increase.', chartType: 'line', dummyData: [100, 118, 135, 158, 182, 210], dummyLabels: ['2020', '2021', '2022', '2023', '2024', '2025'] },
  { id: 'vz-attack-patterns', source: 'Verizon DBIR', sourceShort: 'DBIR', title: 'Attack Patterns by Industry', year: 2025, category: 'Breaches', color: '#8B5CF6', description: 'System intrusion, social engineering, and basic web application attacks account for 83% of all breaches across industries.', chartType: 'bar', dummyData: [38, 27, 18, 9, 5, 3], dummyLabels: ['System Intrusion', 'Social Eng.', 'Web App', 'Misuse', 'Error', 'Other'] },
  { id: 'vz-threat-actions', source: 'Verizon DBIR', sourceShort: 'DBIR', title: 'Threat Action Varieties in Breaches', year: 2025, category: 'Breaches', color: '#8B5CF6', description: 'Use of stolen credentials remains the #1 action in breaches at 31%, followed by ransomware deployment at 24%.', chartType: 'bar', dummyData: [31, 24, 18, 12, 9, 6], dummyLabels: ['Stolen Creds', 'Ransomware', 'Phishing', 'Exploit Vuln', 'Backdoor', 'Other'] },
  { id: 'mand-dwell-time', source: 'Mandiant M-Trends', sourceShort: 'Mandiant', title: 'Median Dwell Time 2016-2025', year: 2025, category: 'Detection', color: '#F59E0B', description: 'Global median dwell time dropped to 10 days in 2025, continuing a decade-long decline from 146 days in 2016.', chartType: 'line', dummyData: [146, 99, 78, 56, 24, 21, 16, 13, 11, 10], dummyLabels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'] },
  { id: 'mand-initial-vectors', source: 'Mandiant M-Trends', sourceShort: 'Mandiant', title: 'Initial Infection Vectors', year: 2025, category: 'Intrusion', color: '#F59E0B', description: 'Exploits remain the top initial access vector at 38%, with phishing second at 22%. Supply chain compromises rose to 12%.', chartType: 'bar', dummyData: [38, 22, 15, 12, 8, 5], dummyLabels: ['Exploits', 'Phishing', 'Stolen Creds', 'Supply Chain', 'Brute Force', 'Other'] },
  { id: 'pa-ransomware-leaks', source: 'Palo Alto Unit 42', sourceShort: 'Unit 42', title: 'Ransomware Leak Site Activity', year: 2025, category: 'Ransomware', color: '#10B981', description: 'Ransomware leak site postings increased 49% YoY. LockBit, BlackCat, and Cl0p accounted for 58% of all posts.', chartType: 'line', dummyData: [320, 380, 420, 510, 580, 650, 720, 810, 880, 940, 1020, 1100], dummyLabels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] },
  { id: 'pa-ransom-demand', source: 'Palo Alto Unit 42', sourceShort: 'Unit 42', title: 'Average Ransom Demand by Sector ($K)', year: 2025, category: 'Ransomware', color: '#10B981', description: 'Healthcare faced the highest average demands at $1.4M, while education saw the steepest increase at +67% YoY.', chartType: 'bar', dummyData: [1400, 1200, 980, 850, 720, 580], dummyLabels: ['Healthcare', 'Finance', 'Mfg', 'Gov', 'Tech', 'Education'] },
  { id: 'enisa-top-threats', source: 'ENISA', sourceShort: 'ENISA', title: 'Top Threats in EU 2025', year: 2025, category: 'Threat Landscape', color: '#06B6D4', description: 'Ransomware remains the prime threat in the EU, followed by malware and social engineering. Supply chain attacks entered the top 5.', chartType: 'bar', dummyData: [92, 78, 65, 52, 48, 35, 28], dummyLabels: ['Ransomware', 'Malware', 'Social Eng.', 'DDoS', 'Supply Chain', 'Data Breach', 'Disinformation'] },
  { id: 'enisa-sector-landscape', source: 'ENISA', sourceShort: 'ENISA', title: 'Threat Landscape by Sector (EU)', year: 2025, category: 'Threat Landscape', color: '#06B6D4', description: 'Public administration and digital infrastructure remain the most targeted sectors in the EU, accounting for 38% of incidents.', chartType: 'bar', dummyData: [22, 16, 14, 12, 11, 9, 8, 8], dummyLabels: ['Public Admin', 'Digital Infra', 'Finance', 'Transport', 'Health', 'Energy', 'Telecom', 'Other'] },
]
