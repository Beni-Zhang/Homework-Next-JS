import Cookies from "js-cookie";
import https from 'https'

const fetchDataWithToken = async (url, method = 'GET', body = null) => {
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found, unauthorized access');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    // Other headers as needed
  };

  const options = {
    method: method.toUpperCase(),
    headers,
    body: body ? JSON.stringify(body) : null,
    // Add the following line to specify the SSL/TLS version
    agent: new https.Agent({ rejectUnauthorized: false }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data with token:', error);
    throw new Error('Failed to fetch data with token');
  }
};

export default fetchDataWithToken;