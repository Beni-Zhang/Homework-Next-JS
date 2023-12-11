export default async function handler(req, res) {
    const { id } = req.query;
  
    if (req.method === 'GET') {
      try {
        const response = await fetch(`http://localhost:8000/books/${id}`);
        const data = await response.json();
        res.status(response.status).json(data);
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
      }
    } else if (req.method === 'DELETE') {
      try {
        const response = await fetch(`http://localhost:8000/books/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        res.status(response.status).json(data);
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
      }
    } else if (req.method === 'PUT') {
      try {
        const response = await fetch(`http://localhost:8000/books/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(response.status).json(data);
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }