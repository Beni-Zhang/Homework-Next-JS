const express = require("express");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

function authenticateTokenMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  const user = jwt.verify(token, JWT_SECRET);
  req.userId = user.userId;
  next();
}

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    optionsSuccessStatus: 200,
  })
);

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + "-" + fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ user, token });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      res.status(400).json({ message: "Email already registered" });
    } else {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid credentials" });
  }
});

app.get("/user", async (req, res) => {
  const user = await prisma.User.findMany();
  res.json({ user });
});

app.post(
  "/books",
  authenticateTokenMiddleware,
  upload.single("image"),
  async (req, res) => {
    const { title, author, publisher, year, pages } = req.body;
    try {
      const book = await prisma.book.create({
        data: {
          title,
          author,
          publisher,
          year: parseInt(year),
          pages: parseInt(pages),
          image: req.file.path,
        },
      });
      res.json({ book });
    } catch (err) {
      console.log("err", err);
      res.status(400).json({ message: "Book already exists" });
    }
  }
);

app.get("/books", async (req, res) => {
  const books = await prisma.book.findMany();
  res.json({ books });
});

app.put("/books/:id", authenticateTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publisher, year, pages } = req.body;
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title,
        author,
        publisher,
        year,
        pages,
      },
    });
    res.json({ "Book Updated": book });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
});

app.delete("/books/:id", authenticateTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.delete({
      where: { id: Number(id) },
    });
    res.json({ book });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something went wrong" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
    });
    res.json({ book });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something went wrong" });
  }
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});