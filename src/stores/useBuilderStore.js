import { create } from 'zustand'

export const useBuilderStore = create((set) => ({
  topic: 'Ransomware',
  metric: 'Attack volume by industry',
  region: 'Global',
  industry: 'All industries',
  chartType: 'bar',
  theme: 'dark',
  setTopic: (topic) => set({ topic }),
  setMetric: (metric) => set({ metric }),
  setRegion: (region) => set({ region }),
  setIndustry: (industry) => set({ industry }),
  setChartType: (chartType) => set({ chartType }),
  setTheme: (theme) => set({ theme }),
}))
