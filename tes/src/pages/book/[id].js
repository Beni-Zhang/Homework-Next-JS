import { Box, Button, Image, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import fetchDataWithToken from "@/middleware/auth";

const BookDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched book data:", data);

          if (data && data.book) { // Ensure data.book exists
            console.log("Keys of book data:", Object.keys(data.book));
            setBookData(data.book); // Set only the book object
          } else {
            throw new Error("Book details not found");
          }
        } else {
          throw new Error("Book not found");
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  // Handle book deletion
  const handleDeleteBook = async () => {
    try {
      await fetchDataWithToken(`https:localhost:8000/books/${id}`, 'DELETE');
      console.log('Book deleted successfully');
      // Handle success message or other actions

      if (response.ok) {
        router.push("/"); // Redirect to homepage after deletion
      } else {
        // Handle deletion failure
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      // Handle error
    }
  };

  // Redirect to edit book page
  const handleEditBook = () => {
    router.push(`/book/${id}/edit`);
  };

  return (
    <>
      <Navbar />
      <Center>
      <Box mt={4} >
        {loading ? (
          <p>Loading...</p>
        ) : bookData ? (
          <>
            <Image
              boxSize="200px"
              src={`http://localhost:8000/${bookData.image.replace(/\\/g, '/')}`}
              alt={bookData.title}
            />
            <p>Title: {bookData.title}</p>
            <p>Author: {bookData.author}</p>
            <p>Publisher: {bookData.publisher}</p>
            <p>Published: {bookData.year}</p>
            <p>Pages: {bookData.pages}</p>
            {/* Display other book details */}

            <Button onClick={handleDeleteBook}>Delete Book</Button>
            <Button onClick={handleEditBook}>Edit Book</Button>
          </>
        ) : (
          <p>Book not found</p>
        )}
      </Box>
      </Center>
    </>
  );
};

export default BookDetailPage;