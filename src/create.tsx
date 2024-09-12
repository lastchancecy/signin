import React, { useState } from 'react';
import { 
  Box, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Button, 
  VStack, 
  Heading, 
  useToast, 
  Stack, 
  Alert, 
  AlertIcon, 
  HStack, 
  IconButton, 
  Text 
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import Layout from './Layout';  // Import the Layout component

const CreateAd: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [djCount, setDjCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [prCount, setPrCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertStatus, setAlertStatus] = useState<'error' | 'success' | 'warning' | 'info' | ''>('');
  const toast = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dj', djCount.toString());   // Add DJ count to form data
    formData.append('staff', staffCount.toString()); // Add Staff count to form data
    formData.append('pr', prCount.toString());  // Add PR count to form data
    if (image) formData.append('image', image);
    formData.append('userId', '1'); // Assuming userId is 1 for this example

    try {
      const response = await fetch('http://localhost:5000/ads', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setAlertStatus('success');
        setTitle('');
        setDescription('');
        setImage(null);
        setDjCount(0); // Reset DJ count
        setStaffCount(0); // Reset Staff count
        setPrCount(0); // Reset PR count
      } else {
        setAlertStatus('error');
      }
    } catch (error) {
      console.error('Error creating ad', error);
      setAlertStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box maxW="500px" mx="auto" mt={8} p={6} boxShadow="lg" borderRadius="md" bg="white">
        <Heading mb={6} textAlign="center" fontSize="2xl" color="teal.600">
          Create New Ad
        </Heading>

        {/* Alert Messages */}
        <Stack spacing={3} mb={4}>
          {alertStatus === 'error' && (
            <Alert status="error">
              <AlertIcon />
              There was an error processing your request.
            </Alert>
          )}
          {alertStatus === 'success' && (
            <Alert status="success">
              <AlertIcon />
              Ad created successfully! Fire on!
            </Alert>
          )}
          {alertStatus === 'info' && (
            <Alert status="info">
              <AlertIcon />
              Please fill in all required fields.
            </Alert>
          )}
          {alertStatus === 'warning' && (
            <Alert status="warning">
              <AlertIcon />
              Warning: Something might be wrong, double-check your info.
            </Alert>
          )}
        </Stack>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            {/* Title Field */}
            <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter ad title"
                focusBorderColor="teal.500"
              />
            </FormControl>

            {/* Description Field */}
            <FormControl id="description" isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter ad description"
                focusBorderColor="teal.500"
              />
            </FormControl>

            {/* Image Upload */}
            <FormControl id="image" isRequired>
              <FormLabel>Image</FormLabel>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                p={1}
              />
            </FormControl>

            {/* DJ, Staff, PR Fields */}
            <VStack spacing={4} align="start" width="100%">
              <HStack justify="space-between" width="100%">
                <FormLabel>DJ</FormLabel>
                <HStack>
                  <IconButton
                    aria-label="Decrease DJ"
                    icon={<MinusIcon />}
                    onClick={() => setDjCount(djCount > 0 ? djCount - 1 : 0)}
                    size="sm"
                    colorScheme="teal"
                  />
                  <Text>{djCount}</Text>
                  <IconButton
                    aria-label="Increase DJ"
                    icon={<AddIcon />}
                    onClick={() => setDjCount(djCount + 1)}
                    size="sm"
                    colorScheme="teal"
                  />
                </HStack>
              </HStack>

              <HStack justify="space-between" width="100%">
                <FormLabel>Staff</FormLabel>
                <HStack>
                  <IconButton
                    aria-label="Decrease Staff"
                    icon={<MinusIcon />}
                    onClick={() => setStaffCount(staffCount > 0 ? staffCount - 1 : 0)}
                    size="sm"
                    colorScheme="teal"
                  />
                  <Text>{staffCount}</Text>
                  <IconButton
                    aria-label="Increase Staff"
                    icon={<AddIcon />}
                    onClick={() => setStaffCount(staffCount + 1)}
                    size="sm"
                    colorScheme="teal"
                  />
                </HStack>
              </HStack>

              <HStack justify="space-between" width="100%">
                <FormLabel>PR</FormLabel>
                <HStack>
                  <IconButton
                    aria-label="Decrease PR"
                    icon={<MinusIcon />}
                    onClick={() => setPrCount(prCount > 0 ? prCount - 1 : 0)}
                    size="sm"
                    colorScheme="teal"
                  />
                  <Text>{prCount}</Text>
                  <IconButton
                    aria-label="Increase PR"
                    icon={<AddIcon />}
                    onClick={() => setPrCount(prCount + 1)}
                    size="sm"
                    colorScheme="teal"
                  />
                </HStack>
              </HStack>
            </VStack>

            {/* Submit Button */}
            <Button 
              colorScheme="teal" 
              isLoading={isSubmitting}
              type="submit"
              width="full"
              mt={4}
            >
              Create Ad
            </Button>
          </VStack>
        </form>
      </Box>
    </Layout>
  );
};

export default CreateAd;
