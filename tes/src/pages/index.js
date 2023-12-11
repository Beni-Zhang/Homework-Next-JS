import Head from 'next/head';
import { VStack, Heading, Image, Text, Box, HStack } from '@chakra-ui/react';
import Navbar from '../components/navbar';
import { useEffect, useState } from 'react';
import Link from 'next/link'

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch all books from your backend
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        const data = await response.json();
  
        // Check the structure of the received data
        console.log('Fetched data:', data);
  
        // Assuming the books are stored in an object key 'books'
        const booksArray = data.books || []; // If 'books' key doesn't exist, default to empty array
  
        setBooks(booksArray); // Set the fetched books in state
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <Head>
        <title>Bookstore</title>
        <meta name="description" content="Bookstore Homepage" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <VStack p={8} spacing={6}>
        <Heading as="h1" size="xl">
          Welcome to the Bookstore
        </Heading>
        <HStack align="stretch" spacing={4}>
          {books.map((book) => (
            <Link key={book.id} href={`/book/${book.id}`}>
            <Box
              key={book.id}
              boxShadow="lg"
              rounded="lg"
              p={4}
              bg="white"
              w="full"
            >
              <Image w={24} h={24} src={`http://localhost:8000/${book.image}`} />
              <Text fontSize="xl" fontWeight="semibold">
                {book.title}
              </Text>
              <Text>Author: {book.author}</Text>
              <Text>Publisher: {book.publisher}</Text>
              <Text>Year: {book.year}</Text>
              <Text>Pages: {book.pages}</Text>
            </Box>
            </Link>
          ))}
        </HStack>
      </VStack>
    </>
  );
};

export default Home;