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

// Seeded RNG data generator from brief-room1.jsx
export function generateData(catId) {
  const seed = catId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const rng = (i) => Math.abs(Math.sin(seed * 9301 + i * 49297) * 233280) % 1
  const elements = {
    ransomware: ['Healthcare', 'Finance', 'Manufacturing', 'Government', 'Education', 'Energy'],
    phishing: ['Email', 'SMS', 'QR Code', 'Social Media', 'Spear Phishing', 'BEC'],
    infostealer: ['Redline', 'Raccoon', 'Vidar', 'Lumma', 'StealC', 'Risepro'],
    logs_on_sale: ['RDP Access', 'VPN Creds', 'Admin Panels', 'Email Access', 'Cloud Accounts', 'SSH Keys'],
    data_leaks: ['PII Records', 'Financial Data', 'Credentials', 'Health Records', 'IP', 'Source Code'],
    employee_exposure: ['Email/Pass', 'Phone Numbers', 'Corporate ID', 'Social Media', 'Financial Info', 'Home Address'],
    dark_web_mentions: ['Brand Name', 'Executives', 'Products', 'Domains', 'Code Repos', 'Partners'],
    vulnerability: ['RCE', 'Privilege Escalation', 'SQLi', 'XSS', 'Auth Bypass', 'SSRF'],
    ddos: ['UDP Flood', 'SYN Flood', 'HTTP Flood', 'DNS Amplification', 'NTP Reflection', 'QUIC Flood'],
    supply_chain: ['Open Source', 'CI/CD', 'Cloud Provider', 'SaaS Vendor', 'Managed Services', 'CDN/Infra'],
  }
  return (elements[catId] || elements.ransomware).map((name, i) => {
    const vals = {}
    MONTHS.forEach((m, mi) => { vals[m] = Math.round(rng(i * 100 + mi * 7 + seed) * 600 + 100 + rng(mi * 13 + i) * 300) })
    return { name, ...vals, color: `hsl(${(i * 55 + seed * 3) % 360},55%,58%)` }
  })
}

// Popular charts for the landing page
export const POPULAR = [
  { title: 'Ransomware Attacks by Sector', views: '12.4k', tag: 'THREAT INTEL', trend: '+23% YoY', up: true, color: '#FF4562', data: [12, 19, 15, 25, 22, 30, 28, 35, 40, 38, 45, 52], sources: '2,400+ incident reports', updated: 'Mar 2026', detail: 'Healthcare and manufacturing remain the most targeted sectors. Median ransom demand increased 40% to $1.2M.', metrics: [{ label: 'Avg. Ransom', value: '$1.2M' }, { label: 'Top Sector', value: 'Healthcare' }] },
  { title: 'Mean Time to Detect (MTTD)', views: '9.8k', tag: 'OPERATIONS', trend: '-18% YoY', up: false, color: '#3B82F6', data: [200, 195, 180, 175, 160, 155, 140, 130, 125, 110, 105, 98], sources: 'Global SOC benchmark data', updated: 'Mar 2026', detail: 'Organizations with XDR reduced detection time by 34%. Average MTTD now at 98 days, down from 120 in 2024.', metrics: [{ label: 'Current Avg.', value: '98 days' }, { label: 'Best-in-class', value: '12 days' }] },
  { title: 'Cloud Misconfiguration Trends', views: '8.2k', tag: 'CLOUD SEC', trend: '-12% YoY', up: false, color: '#10B981', data: [45, 42, 48, 40, 38, 35, 33, 36, 30, 28, 25, 22], sources: 'Multi-cloud scanning data', updated: 'Feb 2026', detail: 'Public S3 buckets down 62%. IAM over-provisioning remains the #1 misconfiguration across AWS and Azure.', metrics: [{ label: '#1 Misconfig', value: 'IAM Excess' }, { label: 'Public Buckets', value: '-62%' }] },
  { title: 'Phishing Click-Through Rates', views: '7.5k', tag: 'AWARENESS', trend: '-31% YoY', up: false, color: '#F59E0B', data: [18, 16, 19, 15, 14, 12, 13, 11, 10, 9, 8, 7], sources: 'Simulated phishing campaigns', updated: 'Mar 2026', detail: 'QR-code phishing (quishing) saw 400% growth. Traditional email click rates dropping but lateral vectors evolve.', metrics: [{ label: 'Click Rate', value: '7.1%' }, { label: 'Quishing', value: '+400%' }] },
]

export const SEARCH_SUGGESTIONS = [
  { text: 'Ransomware trends in healthcare', cat: 'Threat Intel' },
  { text: 'MTTD benchmarks financial services', cat: 'Operations' },
  { text: 'Cloud security posture by region', cat: 'Cloud' },
  { text: 'Zero-day frequency 2024 vs 2025', cat: 'Threat Intel' },
]

export const insights = [
  'Ransomware payments increased <strong style="color:#FF4562">18% QoQ</strong> to $1.2M average — Healthcare remains the #1 targeted sector globally.',
  'Time-to-exploit for critical CVEs dropped to <strong style="color:#A855F7">5 days</strong>, down from 17 days in 2024. Patch windows are shrinking fast.',
  'Supply chain attacks surged <strong style="color:#FF4562">245% YoY</strong> — npm and PyPI ecosystems account for 65% of malicious package incidents.',
  'Phishing click rates rose to <strong style="color:#F59E0B">3.4%</strong> in Q1 2026, with QR-code phishing ("quishing") up 340% since last year.',
  'Dark web credential listings hit <strong style="color:#10B981">24 billion</strong> records. Corporate VPN access sells for $4,500 average on access broker markets.',
]
