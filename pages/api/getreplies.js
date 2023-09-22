export default async function handler(req, res) {
    // const cookies = await cookie();
    if (!req.body) {
        res.statusCode = 400;
        return res.json({ error: 'Invalid credentials!' });
    }

    const { tag_id } = req.body;
    console.log(tag_id)

    try {
        const response = await fetch(`https://api.thintry.com/fetch/tag/replies?tagId=${tag_id}`);

        if (response.status === 200) {
            const resp = await response.json();

            if (resp.status) {
                return res.json(JSON.stringify(resp.replies));
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
