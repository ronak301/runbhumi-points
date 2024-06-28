import { create } from "zustand";

const useStore = create((set) => ({
  usersWithPoints: [],
  addUsers: (users) =>
    set((state) => ({ usersWithPoints: [...state.usersWithPoints, ...users] })),
}));

export default useStore;
