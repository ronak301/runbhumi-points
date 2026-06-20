import { create } from "zustand";

const useStore = create((set) => ({
  usersWithPoints: [],
  setUsersWithPoints: (users) => set(() => ({ usersWithPoints: users })),
  bookingsRefreshKey: 0,
  triggerBookingsRefresh: () => set((s) => ({ bookingsRefreshKey: s.bookingsRefreshKey + 1 })),
}));

export default useStore;
