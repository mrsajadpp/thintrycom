// import { cookies as cookie } from 'next/headers';
import jwt from 'jsonwebtoken';

const KEY = 'dmekdnendedhsdcwbshwbhwd';

export default async function handler(req, res) {
    // const cookies = await cookie();
    if (!req.body) {
        res.statusCode = 400;
        return res.json({ error: 'Invalid credentials!' });
    }

    const { firstname, lastname, username, password, email } = req.body;

    try {
        // Use async/await to fetch data from the API using GET method
        const response = await fetch(`https://api.thintry.com/auth/signup?firstname=${firstname}&lastname=${lastname}&username=${username}&password=${password}&email=${email}`);

        if (response.status === 200) {
            const resp = await response.json();

            if (resp.user) {
                const token = jwt.sign({
                    userData: resp.user
                }, KEY);


                // cookies.get('user-token', token)
                // res.setHeader('Set-Cookie', `user-token=${token}; Path=/; HttpOnly; SameSite=Strict;`);

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
