// Per-vendor methodology / sampling-bias notes.
//
// CISO feedback called out that Mandiant skews to IR engagements, DBIR is
// voluntarily-reported, Coveware skews to victims who paid, etc. Without
// flagging this, charts get miscompared on a board deck.
//
// This file maps a vendor (by substring of the `source` string, same
// strategy as sourceBrandsData.mjs) to a one-line "Sampling: X" caption
// plus a longer hover note. Per-vendor by design — bias is a property of
// the data-collection method, not of an individual report. If a single
// report deviates from its vendor's usual method, override per-report by
// adding a `methodology_bias` field on the manual JSON (handled at render).
//
// `sourceType` is colocated here (rather than its own file) because both
// concerns derive from the same vendor classification.

export const BIAS = [
  // keyword (lowercase substring), sampling, source_type, longer note

  // Incident-response engagements (selection bias: only orgs that got
  // breached enough to call for help).
  { k: 'mandiant',    sampling: 'IR engagements',         source_type: 'IR-based',
    note: 'Mandiant findings come from cases where customers engaged Mandiant for incident response — orgs that already had a confirmed breach. Tilts toward more sophisticated intrusions; underrepresents quietly-resolved or undetected incidents.' },
  { k: 'crowdstrike', sampling: 'EDR telemetry + IR',     source_type: 'Vendor',
    note: 'CrowdStrike data blends Falcon EDR telemetry across customer endpoints with OverWatch threat-hunting findings. Skews toward orgs already running CrowdStrike (enterprise mid-large).' },
  { k: 'overwatch',   sampling: 'EDR telemetry + IR',     source_type: 'Vendor',
    note: 'CrowdStrike OverWatch is human-led threat hunting across the Falcon platform — same customer base bias as CrowdStrike overall.' },
  { k: 'unit 42',     sampling: 'IR engagements',         source_type: 'IR-based',
    note: 'Palo Alto Unit 42 reports draw from incident-response cases handled by their consulting arm. Enterprise-heavy; SMB underrepresented.' },
  { k: 'palo alto',   sampling: 'IR engagements',         source_type: 'IR-based',
    note: 'Palo Alto Unit 42 reports draw from incident-response cases handled by their consulting arm. Enterprise-heavy; SMB underrepresented.' },
  { k: 'rapid7',      sampling: 'IR + MDR telemetry',     source_type: 'Vendor',
    note: 'Rapid7 reports blend Insight platform telemetry with MDR/IR engagement data — customer-base biased.' },

  // Voluntary contribution from many partners (multi-source aggregation).
  { k: 'verizon',     sampling: 'Voluntary contributions', source_type: 'Consortium',
    note: 'Verizon DBIR aggregates breach data voluntarily contributed by 80+ partner organisations (law enforcement, ISACs, forensic firms). Coverage favours North America + sectors with mandatory disclosure.' },
  { k: 'dbir',        sampling: 'Voluntary contributions', source_type: 'Consortium',
    note: 'Verizon DBIR aggregates voluntarily-shared breach data from 80+ partners. Skews to North America + regulated sectors.' },
  { k: 'fs-isac',     sampling: 'Member submissions',     source_type: 'Consortium',
    note: 'FS-ISAC findings come from voluntary member submissions in the financial-services industry. Sector-specific.' },
  { k: 'enisa',       sampling: 'EU incident reports',    source_type: 'Government',
    note: 'ENISA Threat Landscape compiles publicly reported EU incidents + member-state cybersecurity authorities. EU-skewed.' },

  // Victim-disclosure / extortion-tracking (only what ransomware crews
  // publish or what paying victims disclose).
  { k: 'coveware',    sampling: 'Victim disclosures (paid)', source_type: 'IR-based',
    note: 'Coveware tracks ransomware cases where the victim engaged Coveware to negotiate — heavily skewed toward orgs that paid or considered paying.' },
  { k: 'kela',        sampling: 'Dark-web monitoring',     source_type: 'Vendor',
    note: 'KELA observes ransomware leak sites + dark-web actor chatter. Captures groups that publicly post victims; misses quiet payers.' },
  { k: 'huntress',    sampling: 'MDR telemetry (SMB)',     source_type: 'Vendor',
    note: 'Huntress data comes from their MDR platform deployed mostly across SMBs and MSPs. Counterweight to enterprise-heavy IR reports.' },
  { k: 'red canary',  sampling: 'MDR telemetry',           source_type: 'Vendor',
    note: 'Red Canary findings come from their MDR + threat detection platform. Customer-base biased toward US mid-market.' },

  // Network / web telemetry (vast sample but limited to traffic they see).
  { k: 'cloudflare',  sampling: 'Network telemetry',       source_type: 'Vendor',
    note: 'Cloudflare data is drawn from network-level telemetry across their CDN/proxy estate. Strong on DDoS, bot, and HTTP attack trends; weaker on endpoint or insider risk.' },
  { k: 'akamai',      sampling: 'Network telemetry',       source_type: 'Vendor',
    note: 'Akamai findings come from their CDN/security edge telemetry. Web/DDoS-focused.' },
  { k: 'f5',          sampling: 'WAF + bot telemetry',     source_type: 'Vendor',
    note: 'F5 Labs reports rely on WAF and bot-defense telemetry across their customer base. Web-app-focused.' },
  { k: 'fortinet',    sampling: 'FortiGuard telemetry',    source_type: 'Vendor',
    note: 'Fortinet FortiGuard data comes from sensors deployed across the Fortinet device fleet — network/perimeter heavy.' },
  { k: 'sophos',      sampling: 'Endpoint telemetry + surveys', source_type: 'Vendor',
    note: 'Sophos reports combine endpoint telemetry with annual operator surveys (e.g. State of Ransomware). Customer-base biased.' },
  { k: 'eset',        sampling: 'Endpoint telemetry',      source_type: 'Vendor',
    note: 'ESET threat reports draw from their endpoint protection telemetry across consumer + business products.' },
  { k: 'bitdefender', sampling: 'Endpoint telemetry',      source_type: 'Vendor',
    note: 'Bitdefender data is endpoint-protection telemetry across their installed base.' },
  { k: 'trellix',     sampling: 'XDR telemetry + research', source_type: 'Vendor',
    note: 'Trellix combines XDR platform telemetry with their threat-research labs. Enterprise endpoint biased.' },
  { k: 'trend micro', sampling: 'Endpoint + email telemetry', source_type: 'Vendor',
    note: 'Trend Micro draws on their Smart Protection Network — endpoint, email, and web telemetry across their customer base.' },
  { k: 'kaspersky',   sampling: 'Endpoint telemetry (KSN)', source_type: 'Vendor',
    note: 'Kaspersky Security Network telemetry — global endpoint base, though geopolitical headwinds reduce US-enterprise representation since 2022.' },
  { k: 'microsoft',   sampling: 'Microsoft Defender telemetry', source_type: 'Vendor',
    note: 'Microsoft Defender / Entra / 365 telemetry across an extremely large customer base. Cloud-identity heavy.' },
  { k: 'check point', sampling: 'Network + endpoint telemetry', source_type: 'Vendor',
    note: 'Check Point Research blends ThreatCloud sensor telemetry with their incident response cases.' },
  { k: 'checkpoint',  sampling: 'Network + endpoint telemetry', source_type: 'Vendor',
    note: 'Check Point Research blends ThreatCloud sensor telemetry with their incident response cases.' },
  { k: 'cisco talos', sampling: 'Network telemetry + IR',  source_type: 'Vendor',
    note: 'Cisco Talos draws from one of the largest threat-intel telemetry estates plus IR engagements.' },
  { k: 'talos',       sampling: 'Network telemetry + IR',  source_type: 'Vendor',
    note: 'Cisco Talos draws from one of the largest threat-intel telemetry estates plus IR engagements.' },
  { k: 'zscaler',     sampling: 'Cloud proxy telemetry',   source_type: 'Vendor',
    note: 'Zscaler ThreatLabz analyses traffic flowing through their cloud security platform. SaaS / browsing heavy; little visibility into east-west.' },
  { k: 'threatlabz',  sampling: 'Cloud proxy telemetry',   source_type: 'Vendor',
    note: 'Zscaler ThreatLabz analyses traffic flowing through their cloud security platform.' },

  // Identity + email + phishing-sim — voluntary or simulation-based.
  { k: 'okta',        sampling: 'IdP telemetry',           source_type: 'Vendor',
    note: 'Okta findings come from their identity-platform logs across customer tenants. Identity-attack focused.' },
  { k: 'proofpoint',  sampling: 'Email security telemetry', source_type: 'Vendor',
    note: 'Proofpoint reports rely on email-gateway telemetry across their customer base. Phishing / BEC focused.' },
  { k: 'knowbe4',     sampling: 'Phishing-simulation results', source_type: 'Vendor',
    note: 'KnowBe4 phishing benchmarks come from training simulations — measures *trainee click rates*, not real-attack outcomes.' },
  { k: 'hoxhunt',     sampling: 'Phishing-simulation results', source_type: 'Vendor',
    note: 'Hoxhunt benchmarks come from phishing-training simulations across their customer organisations.' },

  // Government / consortium (incident reports + advisories).
  { k: 'cisa',        sampling: 'Federal incident reports', source_type: 'Government',
    note: 'CISA findings draw from federal-civilian incident response, KEV cataloguing, and inter-agency coordination. US-government scope.' },
  { k: 'ncsc',        sampling: 'UK incident reports',     source_type: 'Government',
    note: 'NCSC UK annual review compiles UK incident response cases and threat assessments. UK-government scope.' },
  { k: 'fbi ic3',     sampling: 'Public complaints',       source_type: 'Government',
    note: 'IC3 reports are built from voluntary public complaints filed via ic3.gov — strong on cybercrime/fraud, lossy at the enterprise breach level.' },
  { k: 'ic3',         sampling: 'Public complaints',       source_type: 'Government',
    note: 'IC3 reports are built from voluntary public complaints filed via ic3.gov.' },
  { k: 'pci ssc',     sampling: 'Standards committee',     source_type: 'Consortium',
    note: 'PCI SSC publications are framework specifications and committee guidance — not empirical incident data.' },
  { k: 'dragos',      sampling: 'ICS/OT IR engagements',   source_type: 'IR-based',
    note: 'Dragos data comes from ICS/OT incident response engagements — industrial-sector specific.' },

  // Open-source software supply chain.
  { k: 'sonatype',    sampling: 'Public package registries', source_type: 'Vendor',
    note: 'Sonatype tracks open-source package registries (npm/PyPI/Maven). Captures malicious package uploads — not their downstream impact.' },
  { k: 'black duck',  sampling: 'SCA scans',               source_type: 'Vendor',
    note: 'Black Duck OSSRA draws from their software-composition-analysis customer scans. Sector mix tracks their enterprise customer base.' },

  // Combined OSINT + customer telemetry.
  { k: 'ibm',         sampling: 'IR + threat intel',       source_type: 'Vendor',
    note: 'IBM X-Force combines incident-response engagements, ICS sensors, and OSINT collection.' },
  { k: 'x-force',     sampling: 'IR + threat intel',       source_type: 'Vendor',
    note: 'IBM X-Force combines incident-response engagements, ICS sensors, and OSINT collection.' },
  { k: 'socradar',    sampling: 'Dark-web monitoring',     source_type: 'Vendor',
    note: 'SOCRadar XTI monitors dark-web, deep-web, and surface-web sources for exposed credentials, leaked data, and threat-actor chatter.' },
  { k: 'censys',      sampling: 'Internet-scan telemetry', source_type: 'Vendor',
    note: 'Censys data comes from internet-wide scanning — captures exposed infrastructure but not what happens after exposure.' },
  { k: 'cyfirma',     sampling: 'OSINT + dark-web',        source_type: 'Vendor',
    note: 'CYFIRMA blends OSINT, dark-web monitoring, and threat-actor profiling.' },
  { k: 'coalition',   sampling: 'Cyber-insurance claims',  source_type: 'Insurance',
    note: 'Coalition Cyber Claims Reports compile data from their cyber-insurance policyholder claims. Strong on SMB ransomware + BEC outcomes.' },
  { k: 'constella',   sampling: 'Identity exposure data',  source_type: 'Vendor',
    note: 'Constella tracks exposed identity records across breach corpora and dark-web sources.' },
  { k: 'securityscorecard', sampling: 'External scans',    source_type: 'Vendor',
    note: 'SecurityScorecard ratings come from external attack-surface scans — observable hygiene, not internal posture.' },

  // High-level outlook / surveys.
  { k: 'world economic forum', sampling: 'Executive surveys', source_type: 'Survey',
    note: 'WEF Global Cybersecurity Outlook is built from C-suite + board-level surveys at participating organisations. Sentiment data, not telemetry.' },
  { k: 'wef',         sampling: 'Executive surveys',       source_type: 'Survey',
    note: 'WEF Global Cybersecurity Outlook is built from C-suite + board-level surveys.' },
  { k: 'pwc',         sampling: 'Client engagements + survey', source_type: 'Consulting',
    note: 'PwC threat reports combine client-engagement findings with annual cyber survey responses. Sector mix tracks their enterprise client base.' },
]

const findBias = (source) => {
  if (!source) return null
  const s = String(source).toLowerCase()
  for (const b of BIAS) if (s.includes(b.k)) return b
  return null
}

export function methodologyBias(source) {
  const b = findBias(source)
  if (!b) return null
  return { sampling: b.sampling, note: b.note }
}

export function sourceType(source) {
  const b = findBias(source)
  return b?.source_type || null
}
