import jwt from 'jsonwebtoken';

const KEY = 'dmekdnendedhsdcwbshwbhwd';

export default async function handler(req, res) {
  if (!req.body) {
    res.statusCode = 400;
    return res.json({ error: 'Invalid credentials!' });
  }

  const { username, password } = req.body;

  try {
    // Use async/await to fetch data from the API using GET method
    const response = await fetch(`https://api.thintry.com/auth/login?username=${username}&password=${password}`);

    if (response.status === 200) {
      const resp = await response.json();
      console.log(resp)

      if (resp.user) {
        const token = jwt.sign({
          userData: resp.user
        }, KEY);

        return res.json({ token });
      } else {
        res.statusCode = 401;
        return res.json({ error: 'Invalid credentials!' });
      }
    } else {
      res.statusCode = response.status;
      return res.json({ error: 'API request failed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.statusCode = 500;
    return res.json({ error: 'An internal server error occurred' });
  }
}
