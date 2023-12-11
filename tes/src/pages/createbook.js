import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import BookForm from "../components/bookForm";

const CreateBookPage = () => {
  const router = useRouter();

  // Handle book creation
  const handleCreateBook = async (newBookData) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBookData),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the newly created book's detailed page
        router.push(`/book/${data.id}`);
      } else {
        // Handle non-successful response (e.g., show error message)
        console.error("Book creation failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating book:", error);
      // Handle other error scenarios (network, server errors, etc.)
    }
  };

  return (
    <Box>
      <BookForm onCreate={handleCreateBook} />
    </Box>
  );
};

export default CreateBookPage;