import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Image, Stack, Spinner, Center, Grid, GridItem, Button } from '@chakra-ui/react';
import Layout from './Layout';

interface Ad {
  id: number;
  title: string;
  description: string;
  image_url: string;
  dj: number;
  staff: number;
  pr: number;
}

const AdDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/ads/${id}`);
        const result = await response.json();

        if (response.ok) {
          setAd(result);
        } else {
          console.error('Error fetching ad details:', result.message);
        }
      } catch (error) {
        console.error('Error fetching ad details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [id]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (!ad) {
    return (
      <Center h="100vh">
        <Text fontSize="lg" color="red.500">
          Ad not found.
        </Text>
      </Center>
    );
  }

  return (
    <Layout>
  <Box p={6} bg="gray.50" minH="100vh">
      <Stack spacing={6} align="center">
        <Image src={ad.image_url} alt={ad.title} objectFit="cover" w="100%" maxW="600px" />
        <Heading fontSize="3xl" color="teal.600">
          {ad.title}
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          {ad.description}
        </Text>

        {/* 3x3 Table */}
        <Grid templateColumns="repeat(3, 1fr)" gap={6} w="100%" maxW="600px">
          {/* First row (labels) */}
          <GridItem>
            <Text fontWeight="bold" textAlign="center" fontSize="lg" color="teal.700">DJ</Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" textAlign="center" fontSize="lg" color="teal.700">Staff</Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" textAlign="center" fontSize="lg" color="teal.700">PR</Text>
          </GridItem>

          {/* Second row (values) */}
          <GridItem>
            <Text textAlign="center" fontSize="lg" color="gray.600">{ad.dj}</Text>
          </GridItem>
          <GridItem>
            <Text textAlign="center" fontSize="lg" color="gray.600">{ad.staff}</Text>
          </GridItem>
          <GridItem>
            <Text textAlign="center" fontSize="lg" color="gray.600">{ad.pr}</Text>
          </GridItem>

          {/* Third row (buttons) */}
          <GridItem>
            <Button colorScheme="teal" w="100px" onClick={() => alert('Apply for DJ')}>Apply for DJ</Button>
          </GridItem>
          <GridItem>
            <Button colorScheme="teal" w="100px" onClick={() => alert('Apply for Staff')}>Apply for Staff</Button>
          </GridItem>
          <GridItem>
            <Button colorScheme="teal" w="100px" onClick={() => alert('Apply for PR')}>Apply for PR</Button>
          </GridItem>
        </Grid>
      </Stack>
    </Box>
    </Layout>
  
  );
};

export default AdDetails;
