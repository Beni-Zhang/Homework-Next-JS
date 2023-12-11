import { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const isLoggedIn = Cookies.get('token');
    if (isLoggedIn) {
      setIsLogin(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', response.status, data);

      if (response.status === 200) {
        // Set JWT token as a cookie
        Cookies.set('token', data.token, { expires: 7 }); // 'token' is the name of the cookie
        setIsLogin(true);
        onClose();
      } else {
        // Handle login failure
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error
    }
  };

  const handleLogout = () => {
    // Perform logout logic, e.g., clear tokens, reset states
    setIsLogin(false);
    Cookies.remove('token'); // Remove the 'token' cookie
    router.push('/');
  };

  return (
    <Flex
      w="full"
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="gray.800"
      color="white"
    >
      <Link href="/">
        <Text fontSize="xl" fontWeight="bold" _hover={{ color: `blue` }}>
          Beny's Books
        </Text>
      </Link>

      {isLogin ? (
        <Flex align="right">
          <Link href="/createbook">
            <Button colorScheme="blue" mr={4}>
              Create New Book
            </Button>
          </Link>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      ) : (
        <Button colorScheme="blue" onClick={onOpen}>
          Login
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="gray.700">
          <ModalHeader color="white">Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel color="white">Email</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email address"
                bgColor="white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="white">Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                bgColor="white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleLogin} colorScheme="blue" mr={3}>
              Login
            </Button>
            <Link href="/register">
              <Button
                color="white"
                bgColor="green"
                _hover={{ bgColor: 'darkgreen' }}
                onClick={onClose}
              >
                Doesn't Have Account? Click here
              </Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Navbar;