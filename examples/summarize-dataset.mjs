import { readFile } from 'node:fs/promises';

const file = process.argv[2];
if (!file) {
    console.error('Usage: node examples/summarize-dataset.mjs path/to/exported-dataset.json');
    process.exit(2);
}

try {
    const rows = JSON.parse(await readFile(file, 'utf8'));
    if (!Array.isArray(rows)) {
        throw new Error('Expected a JSON array of Actor dataset rows.');
    }

    const receipt = {
        successfulFeeds: 0,
        returnedItems: 0,
        failedFeeds: 0,
        failedFeedUrls: [],
        otherRows: 0,
    };

    for (const row of rows) {
        if (row?.type === 'feed_metadata') {
            receipt.successfulFeeds += 1;
        } else if (row?.type === 'feed_item') {
            receipt.returnedItems += 1;
        } else if (row?.type === 'error') {
            receipt.failedFeeds += 1;
            receipt.failedFeedUrls.push(row.feedUrl ?? null);
        } else {
            receipt.otherRows += 1;
        }
    }

    console.log(JSON.stringify(receipt, null, 2));
    if (receipt.failedFeeds > 0 || rows.length === 0) {
        process.exitCode = 1;
    }
} catch (error) {
    console.error(`Cannot summarize dataset: ${error.message}`);
    process.exitCode = 2;
}
