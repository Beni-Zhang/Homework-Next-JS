export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        const response = await fetch('http://localhost:8000/books');
        const data = await response.json();
        res.status(response.status).json(data);
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
      }
    } else if (req.method === 'POST') {
      try {
        const formData = new FormData();
  
        // Append form data fields (title, author, publisher, year, pages)
        formData.append('title', req.body.title);
        formData.append('author', req.body.author);
        formData.append('publisher', req.body.publisher);
        formData.append('year', req.body.year);
        formData.append('pages', req.body.pages);
  
        // Append the 'image' file if it exists
        if (req.body.image) {
          formData.append('image', req.body.image);
        }
  
        const response = await fetch('http://localhost:8000/books', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        res.status(response.status).json(data);
      } catch (error) {
        res.status(500).json({ message: 'Failed to create book' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }