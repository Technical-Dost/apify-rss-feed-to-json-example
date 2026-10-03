const token = process.env.APIFY_TOKEN;

if (!token) {
    console.error('Set APIFY_TOKEN before running. This script starts a billable Actor run.');
    process.exitCode = 1;
} else {
    const input = {
        feedUrls: ['https://news.ycombinator.com/rss'],
        maxItemsPerFeed: 5,
        includeContent: true,
    };

    const response = await fetch(
        'https://api.apify.com/v2/acts/technicaldost~rss-feed-scraper/run-sync-get-dataset-items?timeout=120',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        },
    );

    if (!response.ok) {
        console.error(`Apify returned HTTP ${response.status}. Check the run in Console.`);
        process.exitCode = 1;
    } else {
        const rows = await response.json();
        for (const row of rows) {
            if (row.type === 'feed_item') {
                console.log(JSON.stringify({ title: row.title, link: row.link, pubDate: row.pubDate }));
            } else if (row.type === 'error') {
                console.error(`Feed error for ${row.feedUrl}: ${row.error}`);
                process.exitCode = 1;
            }
        }
    }
}
