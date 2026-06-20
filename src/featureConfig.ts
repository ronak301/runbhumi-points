const featureConfig: Record<
  string,
  { name: string; points?: boolean; bookings?: boolean; profile?: boolean; membership?: boolean }
> = {
  iNANAwfMb6EXNtp7MRwJ: {
    name: "Runbhumi Mewar",
    points: true,
    bookings: true,
    profile: true,
    membership: false,
  },
  "4HJl3JYH5TzUeylFEHKj": {
    name: "Velocity Turf",
    points: false,
    bookings: true,
    profile: true,
    membership: false,
  },
  D5FfylDnU6NXlmTtPtoj: {
    name: "Satyam Sports Arena",
    points: false,
    bookings: true,
    profile: true,
    membership: false,
  },
  "2H3Ld4uq17AeCtfXpuo0": {
    name: "PickleX",
    points: false,
    bookings: true,
    profile: true,
    membership: true,
  },
};

export default featureConfig;
