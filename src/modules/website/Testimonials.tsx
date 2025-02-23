import { Box, Text, VStack, Image, HStack } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Mohit Fattawat",
    position: "Director, LBS Sports Junction, Chittor",
    testimonial:
      "TurfWale provided excellent service! The turf quality is top-notch.",
    image:
      "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-845.jpg?semt=ais_incoming",
  },
  {
    name: "Ronak Kothari",
    position: "Founder, Runbhumi Mewar",
    testimonial:
      "The team at TurfWale was incredibly professional and timely. Highly recommend!",
    image:
      "https://cdni.iconscout.com/illustration/premium/thumb/man-illustration-download-in-svg-png-gif-file-formats--portrait-beard-glasses-portraits-pack-people-illustrations-2790260.png",
  },
  {
    name: "Amit Sharma",
    position: "Owner, Elite Sports Arena",
    testimonial:
      "Amazing experience with TurfWale. The turf quality and service were outstanding!",
    image:
      "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/4_avatar-512.png",
  },
  {
    name: "Sneha Mehta",
    position: "Manager, Pro Sports Hub",
    testimonial:
      "Highly satisfied with the professionalism and dedication of the TurfWale team.",
    image:
      "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png",
  },
  {
    name: "Rohan Verma",
    position: "CEO, ActivePlay Arena",
    testimonial:
      "Great experience! The turf is durable and perfect for high-intensity sports.",
    image: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
  },
];

const Testimonials = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box
      bgGradient="linear(to-r, gray.200, gray.100)"
      py={10}
      px={5}
      textAlign="center">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        WHAT OUR CLIENTS SAY
      </Text>
      <Box maxW="900px" mx="auto" overflow="hidden">
        <Slider {...settings}>
          {testimonials.map((testimonial) => (
            <Box key={testimonial.name} px={2}>
              <VStack
                bg="white"
                p={5}
                borderRadius="xl"
                boxShadow="lg"
                spacing={3}
                align="center"
                mx={3}
                maxW="280px"
                height="320px">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  borderRadius="full"
                  boxSize="60px"
                  objectFit="cover"
                />
                <HStack spacing={1}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} color="yellow.400" />
                  ))}
                </HStack>
                <Text fontWeight="bold" fontSize="lg">
                  {testimonial.name}
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  {testimonial.position}
                </Text>
                <Text fontSize="sm" textAlign="center" color="gray.700">
                  "{testimonial.testimonial}"
                </Text>
              </VStack>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default Testimonials;
