export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const { email, password } = req.body;
  
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      res.status(response.status).json(data); // Send response to frontend
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }  