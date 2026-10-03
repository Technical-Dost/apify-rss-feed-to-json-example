# RSS feed to JSON: a bounded Apify example

This small example turns one public RSS feed into JSON rows using [Technical Dost's RSS Feed Scraper](https://apify.com/technicaldost/rss-feed-scraper). It is for developers who want to inspect the result shape before putting a feed into an automation. The Actor is a paid Apify Store product; this repository is a free usage example from its creator.

## What the run returns

The Actor writes a `feed_metadata` row for a successfully parsed feed and up to five `feed_item` rows for this input. If a feed cannot be parsed, it writes an `error` row instead. [sample-output.json](examples/sample-output.json) is an illustrative fixture, not a claim about the live feed's current content.

One successful feed capped at five items produces at most six dataset rows. At the price shown when this guide was written, $0.008 per row, that is at most $0.048. Apify's [live Pricing tab](https://apify.com/technicaldost/rss-feed-scraper) is the source to check before running. Running either example below starts a billable Actor run.

## Run in Apify Console

1. Open the [Actor input page](https://apify.com/technicaldost/rss-feed-scraper/input).
2. Paste the contents of [sample-input.json](examples/sample-input.json).
3. Check the Pricing tab, then start the run and inspect the default dataset.
4. Filter rows where `type` is `feed_item` when you need only entries. `feed_metadata` and `error` rows have other uses and should be handled separately.

Prefer a preconfigured example? The Actor also has [published Apify tasks](https://apify.com/technicaldost/rss-feed-scraper/examples) for news, AI research blogs, and a YouTube channel feed. Their inputs and item limits differ from this five-item guide. Review the selected task's input and the live Actor pricing before starting a billable run.

## Run from Node.js

Requires Node.js 18+ and your own Apify API token. Keep the token in the environment; never put it in a URL, a commit, or an issue.

```bash
export APIFY_TOKEN='your-token-here'
node examples/fetch-hn-rss.mjs
```

The script uses the synchronous dataset-items endpoint and prints a compact view of the item rows. It makes one billable run each time it is executed. For a scheduled pipeline that should return only new entries across runs, evaluate [RSS Feed Monitor](https://apify.com/technicaldost/rss-feed-monitor) separately.

## Try the API request in Postman

Download [the Postman collection](examples/postman-collection.json) and import the JSON file, or import its [raw JSON URL](https://raw.githubusercontent.com/Technical-Dost/apify-rss-feed-to-json-example/main/examples/postman-collection.json). In your own local Postman environment, create a secret variable named `APIFY_TOKEN` with your Apify API token and select that environment. The collection sends the token as a bearer header, never in the URL. Review the request body and the Actor's live Pricing tab before selecting **Send**: every Send starts a paid run. The included input uses one public feed and caps items at five. The collection contains no token or live-run response.

## Data contract to plan around

| Row type | When it appears | Useful fields |
| --- | --- | --- |
| `feed_metadata` | One per successfully parsed feed | `feedUrl`, `title`, `itemCount`, `scrapedAt` |
| `feed_item` | Up to `maxItemsPerFeed` per successful feed | `title`, `link`, `pubDate`, `summary`, `content`, `categories` |
| `error` | A feed failed to parse | `feedUrl`, `error`, `scrapedAt` |

`itemCount` is the count reported by the parsed feed, not the number retained by the five-item cap. Publishers choose which fields appear; an absent author or full content is normal. The Actor returns feed-provided content and does not crawl linked articles.

For multiple feeds, add URLs to `feedUrls` and budget for up to `1 + maxItemsPerFeed` rows per successful feed. Set `maxItemsPerFeed` explicitly in API requests: the Actor's omitted-input default is 50.

## Verify this example without an Actor run

```bash
node --check examples/fetch-hn-rss.mjs
node -e "JSON.parse(require('fs').readFileSync('examples/sample-input.json'))"
node -e "JSON.parse(require('fs').readFileSync('examples/sample-output.json'))"
node -e "JSON.parse(require('fs').readFileSync('examples/postman-collection.json'))"
```

This repository has no tracking, affiliate links, or credentials. The Actor's owner is Technical Dost Solutions.
