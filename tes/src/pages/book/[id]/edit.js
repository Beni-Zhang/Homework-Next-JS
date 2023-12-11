import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import BookForm from "../../../components/bookForm";

const EditBookPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [bookData, setBookData] = useState(null);

  // Fetch book data by ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!id) return; // Ensure id is available before making the API call
        const response = await fetch(`/api/books/${id}`);
        const data = await response.json();
        setBookData(data); // Set fetched book data
      } catch (error) {
        console.error("Error fetching book data:", error);
        // Handle error fetching book data
      }
    };

    fetchBook();
  }, [id]);

  // Handle book editing
  const handleEditBook = async (editedBookData) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedBookData),
      });

      const data = await response.json();
      // Handle success/failure based on the response
      // Redirect to the edited book's detailed page or handle as needed
    } catch (error) {
      console.error("Error editing book:", error);
      // Handle error
    }
  };

  return (
    <Box>
      {bookData ? (
        <BookForm bookData={bookData} onEdit={handleEditBook} />
      ) : (
        <p>Loading...</p>
      )}
    </Box>
  );
};

export default EditBookPage;