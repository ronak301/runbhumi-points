import { create } from "zustand";

const useStore = create((set) => ({
  usersWithPoints: [],
  setUsersWithPoints: (users) => set(() => ({ usersWithPoints: users })),
}));

export default useStore;
