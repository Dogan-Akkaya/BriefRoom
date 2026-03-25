import { create } from 'zustand'

export const useBriefingStore = create((set, get) => ({
  count: 0,
  add: () => set({ count: get().count + 1 }),
}))
