import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Stack, Image, Center, Spinner, useToast, VStack, Divider } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import Layout from './Layout'; // Assuming you have a Layout component

interface User {
  id: number;
  name: string;
  email: string;
  profile_picture?: string; // Profile picture is optional
  // Add other fields as per your database schema
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = Cookies.get('userId');
      if (!userId) {
        setError('User ID not found in cookies');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`);
        const result = await response.json();

        if (response.ok) {
          setUser(result);
        } else {
          throw new Error(result.message || 'Failed to fetch user profile');
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to load user profile',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Layout>
      <Box p={6} bg="gray.50" minH="100vh">
        <Center>
          <Box maxW="md" bg="white" p={6} borderRadius="md" boxShadow="lg">
            <VStack spacing={4} align="center">
              <Image
                src={user?.profile_picture || 'https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg'}
                alt="Profile Picture"
                borderRadius="full"
                boxSize="150px"
                objectFit="cover"
              />
              <Heading fontSize="2xl">{user?.name}</Heading>
              <Text fontSize="lg" color="gray.600">{user?.email}</Text>
              {/* Add other user details here */}
            </VStack>
            <Divider my={6} />
            {/* You can add additional sections or information here */}
          </Box>
        </Center>
      </Box>
    </Layout>
  );
};

export default Profile;
