export default async function handler(req, res) {
    // const cookies = await cookie();
    if (!req.body) {
        res.statusCode = 400;
        return res.json({ error: 'Invalid credentials!' });
    }

    const { user_id, tag_id } = req.body;
    console.log(req.body)

    try {
        // Use async/await to fetch data from the API using GET method
        const response = await fetch('https://api.thintry.com/tag/upvote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify content type as JSON
            },
            body: JSON.stringify({
                uid: user_id,
                tagId: tag_id,
            }),
        });

        if (response.status === 200) {
            const resp = await response.json();
            console.log(resp)

            if (resp.status) {
                return res.json(true);
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
