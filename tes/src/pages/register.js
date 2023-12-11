import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast({
        title: "Registered",
        description: "You have successfully registered.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    } catch (error) {
      console.error("Registration Error:", error.message);
      toast({
        title: "An error occurred.",
        description: error.message || "An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Navbar />
      <Box w="65%" py={4} px={10} mx={2} mt={8} bgColor="#E1E1E0" borderRadius="xl">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Register
        </Text>

        <Box borderWidth="1px" borderRadius="lg" p={4} border="none">
          <form onSubmit={handleSubmit}>
            {error && (
              <Box color="red.500" mb={4}>
                {error}
              </Box>
            )}

            <FormControl isRequired mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                borderColor="black"
                borderWidth={2}
                borderRadius="xl"
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                borderColor="black"
                borderWidth={2}
                borderRadius="xl"
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password"
                borderColor="black"
                borderWidth={2}
                borderRadius="xl"
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                borderColor="black"
                borderWidth={2}
                borderRadius="xl"
              />
              {password !== confirmPassword && (
                <Text fontSize="xs" color="red.500">
                  The passwords do not match
                </Text>
              )}
            </FormControl>

            <Button mt={6} colorScheme="teal" type="submit">
              Register
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Register;