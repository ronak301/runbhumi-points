import { create } from "zustand";

const useStore = create((set) => ({
  usersWithPoints: [],
  setUsersWithPoints: (users) => set(() => ({ usersWithPoints: users })),
  bookingsRefreshKey: 0,
  triggerBookingsRefresh: () => set((s) => ({ bookingsRefreshKey: s.bookingsRefreshKey + 1 })),
  membershipsRefreshKey: 0,
  triggerMembershipsRefresh: () => set((s) => ({ membershipsRefreshKey: s.membershipsRefreshKey + 1 })),
  requestedTabIndex: null,
  requestTabSwitch: (index) => set({ requestedTabIndex: index }),
  clearTabSwitch: () => set({ requestedTabIndex: null }),
}));

export default useStore;
