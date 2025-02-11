export const projects = [
  {
    id: 1,
    title: "LBS Sports Junction",
    slug: "lbs-sports-junction-chittor", // SEO-friendly URL
    location: "Chittor, Rajasthan, India",
    image: "https://justurf.club/assets/upload/1735213410.jpg",
    shortDescription:
      "A premium sports facility in Chittor with high-quality synthetic turf for football, cricket, and multi-sport use.",
    description:
      "LBS Sports Junction is a state-of-the-art sports complex in Chittor, equipped with professional-grade synthetic turf, excellent drainage, and shock-absorbing layers. It is ideal for football, cricket, and other sports. The facility features floodlights for night matches, comfortable seating for spectators, and a spacious environment for tournaments, training, and recreational games.",
    keywords: [
      "sports complex in Chittor",
      "synthetic turf in Rajasthan",
      "best football ground Chittor",
      "cricket training facility Chittor",
      "multi-sport stadium Chittor",
      "night sports ground Rajasthan",
    ], // Targeted SEO keywords
    metaTitle: "LBS Sports Junction - Best Sports Complex in Chittor",
    metaDescription:
      "LBS Sports Junction in Chittor offers premium synthetic turf for football, cricket, and multi-sports. A top sports facility in Rajasthan for athletes and tournaments.",
    openingHours: "6:00 AM - 10:00 PM",
    contactNumber: "+91 9876543210",
    address: "XYZ Road, Chittor, Rajasthan, India",
    latitude: 24.8881,
    longitude: 74.6225,
    reviews: [
      {
        user: "Amit Sharma",
        rating: 4.8,
        comment: "Amazing turf quality! Loved playing here.",
      },
      {
        user: "Priya Verma",
        rating: 5,
        comment: "One of the best sports complexes in Chittor.",
      },
    ],
    rating: 4.9, // Aggregate rating
    tags: ["Football", "Cricket", "Turf", "Sports Complex", "Chittor"],
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      name: "LBS Sports Junction",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chittor",
        addressRegion: "Rajasthan",
        addressCountry: "India",
      },
      image: "https://justurf.club/assets/upload/1735213410.jpg",
      telephone: "+91 9876543210",
      geo: {
        "@type": "GeoCoordinates",
        latitude: 24.8881,
        longitude: 74.6225,
      },
    }, // JSON-LD Schema for better Google ranking
  },
  {
    id: 2,
    title: "The Velocity Turf",
    slug: "velocity-turf-udaipur",
    location: "Udaipur, Rajasthan, India",
    image: "https://justurf.club/assets/upload/1732193865.jpg",
    shortDescription:
      "A high-performance synthetic turf in Udaipur designed for football, cricket, and multi-sport use.",
    description:
      "The Velocity Turf in Udaipur provides a world-class synthetic playing surface designed for football, cricket, and various other sports. Featuring advanced shock absorption, superior drainage, and floodlights for night play, this facility ensures a top-tier experience for athletes and spectators alike. Whether for competitions, training, or recreational matches, it's the best sports venue in Udaipur.",
    keywords: [
      "sports complex Udaipur",
      "best synthetic turf in Rajasthan",
      "football ground in Udaipur",
      "cricket stadium Udaipur",
      "sports training Udaipur",
      "multi-sport facility Udaipur",
    ],
    metaTitle: "The Velocity Turf - Best Synthetic Sports Ground in Udaipur",
    metaDescription:
      "Velocity Turf in Udaipur is a high-quality synthetic playing field for football, cricket, and other sports. Perfect for tournaments, training, and night matches.",
    openingHours: "5:30 AM - 11:00 PM",
    contactNumber: "+91 9876543211",
    address: "ABC Road, Udaipur, Rajasthan, India",
    latitude: 24.5833,
    longitude: 73.6833,
    reviews: [
      {
        user: "Rahul Gupta",
        rating: 5,
        comment: "Great facility for football training!",
      },
      {
        user: "Sneha Joshi",
        rating: 4.7,
        comment: "Well-maintained turf with excellent amenities.",
      },
    ],
    rating: 4.8,
    tags: ["Football", "Cricket", "Sports Complex", "Udaipur", "Turf"],
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      name: "The Velocity Turf",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Udaipur",
        addressRegion: "Rajasthan",
        addressCountry: "India",
      },
      image: "https://justurf.club/assets/upload/1732193865.jpg",
      telephone: "+91 9876543211",
      geo: {
        "@type": "GeoCoordinates",
        latitude: 24.5833,
        longitude: 73.6833,
      },
    },
  },
];
