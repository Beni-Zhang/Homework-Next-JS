import {
    Button,
    FormControl,
    FormLabel,
    Image,
    Input,
    useToast,
    VStack,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import Navbar from "./navbar";
  
  export default function BookForm({ bookData }) {
    const toast = useToast();
    const [selectedImage, setSelectedImage] = useState(null);
  
    async function handleSubmit(event) {
      event.preventDefault();
      if (!bookData && !selectedImage) {
        toast({
          title: "Error",
          description: "Please select an image",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
  
      const formData = new FormData(event.target);
      const title = formData.get("title");
      const author = formData.get("author");
      const publisher = formData.get("publisher");
      const year = parseInt(formData.get("year"));
      const pages = parseInt(formData.get("pages"));
  
      try {
        const res = await fetch(`http://localhost:8000/books/${bookData.id}`, {
          method: bookData ? 'PUT' : 'POST',
          body: JSON.stringify({ title, author, publisher, year, pages }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!res.ok) {
          throw new Error('Network response was not ok.');
        }
  
        const data = await res.json();
  
        if (bookData) {
          toast({
            title: "Success",
            description: "Book edited successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          event.target.reset();
          setSelectedImage("");
          toast({
            title: "Success",
            description: "Book created successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  
    useEffect(() => {
      if (bookData?.image) {
        setSelectedImage(`http://localhost:8000/${bookData?.image}`);
      }
    }, [bookData]);
  
    return (
      <>
      <Navbar/>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} borderRadius="2xl" bgColor="#E1E1E0" padding="1rem" shadow="2xl">
          {/* Form controls */}
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input name="title" required defaultValue={bookData?.title} borderColor="black" borderWidth={2} borderRadius="xl" />
          </FormControl>
          <FormControl>
          <FormLabel>Author</FormLabel>
          <Input
            name="author"
            required
            defaultValue={bookData?.author}
            borderColor="black"
            borderWidth={2}
            borderRadius="xl"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Publisher</FormLabel>
          <Input
            name="publisher"
            required
            defaultValue={bookData?.publisher}
            borderColor="black"
            borderWidth={2}
            borderRadius="xl"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Year</FormLabel>
          <Input
            name="year"
            type="number"
            required
            defaultValue={bookData?.year}
            borderColor="black"
            borderWidth={2}
            borderRadius="xl"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Pages</FormLabel>
          <Input
            name="pages"
            type="number"
            required
            defaultValue={bookData?.pages}
            borderColor="black"
            borderWidth={2}
            borderRadius="xl"
          />
          </FormControl>
          {selectedImage && <Image w={64} src={selectedImage} alt="Selected Image" />}
          {!bookData?.image && (
            <FormControl>
              <FormLabel>Image</FormLabel>
              <Input
                name="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSelectedImage(URL.createObjectURL(file));
                }}
                borderColor="black"
                borderWidth={2}
                borderRadius="xl"
                pt="3px"
              />
            </FormControl>
          )}
  
          <Button type="submit" colorScheme="blue">
            {bookData ? "Edit Book" : "Create Book"}
          </Button>
        </VStack>
      </form>
      </>
    );
  }  