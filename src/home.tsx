import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Image, 
  SimpleGrid, 
  VStack, 
  Button, 
  Badge 
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Layout from './Layout';  // Import the Layout component

interface Ad {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

const Home: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('http://localhost:5000/ads');
        const result = await response.json();

        if (response.ok) {
          setAds(result);
        } else {
          console.error('Error fetching ads:', result.message);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };

    fetchAds();
  }, []);

  return (
    <Layout>  {/* Wrap the content inside Layout */}
      <Box p={6} bg="gray.50" minH="100vh">
        <Heading mb={8} textAlign="center" color="teal.600">
          Featured Ads
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {ads.map((ad) => (
            <Box
              key={ad.id}
              bg="white"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="lg"
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.05)' }}
            >
              {/* Image with overlay */}
              <Box position="relative">
                <Image 
                  src={ad.image_url} 
                  alt={ad.title} 
                  objectFit="cover" 
                  w="100%" 
                  h="200px" 
                />
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  bg="teal.500"
                  color="white"
                  borderRadius="md"
                  px={2}
                  py={1}
                >
                  New
                </Badge>
              </Box>

              {/* Content */}
              <VStack spacing={4} align="center" p={5}>
                <Heading fontSize="xl" color="teal.700" textAlign="center">
                  {ad.title}
                </Heading>
                <Text color="gray.600" noOfLines={2} textAlign="center">
                  {ad.description}
                </Text>

                {/* Action Button */}
                <Link to={`/ads/${ad.id}`}>
                  <Button colorScheme="teal" variant="solid" size="sm">
                    Learn More
                  </Button>
                </Link>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Layout>  
  );
};

export default Home;
