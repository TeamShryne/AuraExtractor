# Aura Extractor

A lightweight YouTube search extractor that provides clean search results without requiring API keys. Built with TypeScript and designed for simplicity.

## Features

- 🔍 **Search YouTube videos and channels** without API keys
- 🚀 **Lightweight and fast** - minimal dependencies
- 📦 **TypeScript support** with full type definitions
- 🔄 **Pagination support** with continuation tokens
- 🎯 **Clean data structure** - no unnecessary clutter

## Installation

coming soon

## Quick Start

```javascript
import aura from 'aura-extractor';

// Search for videos and channels
const results = await aura.search.query('javascript tutorial');

console.log(results.items);
// [
//   {
//     type: 'video',
//     id: 'dQw4w9WgXcQ',
//     title: 'JavaScript Tutorial for Beginners',
//     thumbnail: 'https://i.ytimg.com/vi/...',
//     author: 'CodeWithMosh',
//     views: '1.2M views',
//     published: '2 years ago'
//   },
//   // ... more results
// ]

// Get next page of results
if (results.continuation) {
  const nextPage = await aura.search.next(results.continuation);
  console.log(nextPage.items);
}
```

## API Reference

### `aura.search.query(searchTerm: string)`

Search YouTube for videos and channels.

**Parameters:**
- `searchTerm` (string): The search query

**Returns:** `Promise<SearchContext>`

```typescript
interface SearchContext {
  items: SearchItem[];           // Array of search results
  suggestion: string | null;     // "Did you mean..." suggestion
  isCorrected: boolean;         // Whether query was auto-corrected
  continuation: string | null;   // Token for next page
}
```

### `aura.search.next(continuationToken: string)`

Get the next page of search results.

**Parameters:**
- `continuationToken` (string): Token from previous search result

**Returns:** `Promise<SearchContext>`

## Data Types

### SearchItem

```typescript
interface SearchItem {
  type: "video" | "channel" | "playlist";
  id: string;              // YouTube video/channel ID
  title: string;           // Title of the video/channel
  thumbnail: string;       // Thumbnail URL
  author: string;          // Channel name
  views?: string;          // View count (formatted)
  published?: string;      // Publication date (formatted)
  videoCount?: string;     // For playlists only
}
```

## Examples

### Basic Search

```javascript
import aura from 'aura-extractor';

async function searchVideos() {
  try {
    const results = await aura.search.query('nodejs tutorial');
    
    results.items.forEach(item => {
      if (item.type === 'video') {
        console.log(`📺 ${item.title} by ${item.author}`);
        console.log(`   Views: ${item.views} | Published: ${item.published}`);
      }
    });
  } catch (error) {
    console.error('Search failed:', error);
  }
}

searchVideos();
```

### Pagination

```javascript
import aura from 'aura-extractor';

async function getAllResults(query, maxPages = 3) {
  let allItems = [];
  let continuation = null;
  let page = 0;

  // First page
  const firstResults = await aura.search.query(query);
  allItems.push(...firstResults.items);
  continuation = firstResults.continuation;
  page++;

  // Additional pages
  while (continuation && page < maxPages) {
    const nextResults = await aura.search.next(continuation);
    allItems.push(...nextResults.items);
    continuation = nextResults.continuation;
    page++;
  }

  return allItems;
}

// Get first 3 pages of results
const allVideos = await getAllResults('react hooks', 3);
console.log(`Found ${allVideos.length} total results`);
```

### Filter by Type

```javascript
import aura from 'aura-extractor';

async function findChannels(query) {
  const results = await aura.search.query(query);
  
  const channels = results.items.filter(item => item.type === 'channel');
  
  channels.forEach(channel => {
    console.log(`📺 ${channel.title}`);
    console.log(`   Subscribers: ${channel.views}`);
  });
  
  return channels;
}

const techChannels = await findChannels('programming tutorials');
```

## Error Handling

```javascript
import aura from 'aura-extractor';

async function safeSearch(query) {
  try {
    const results = await aura.search.query(query);
    return results;
  } catch (error) {
    if (error.message.includes('InnerTube API Error')) {
      console.error('YouTube API temporarily unavailable');
    } else {
      console.error('Search failed:', error.message);
    }
    return { items: [], continuation: null, suggestion: null, isCorrected: false };
  }
}
```

## How It Works

Aura Extractor uses YouTube's internal InnerTube API (the same API used by the YouTube web interface) to fetch search results. This approach:

- ✅ Doesn't require API keys or quotas
- ✅ Returns the same data you see on YouTube
- ✅ Handles various result types (videos, channels, shelves)
- ✅ Supports pagination through continuation tokens

## Limitations

- Rate limiting may apply for excessive requests
- YouTube may occasionally require CAPTCHA verification
- Results structure may change if YouTube updates their internal API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/shrawan/aura-extractor/issues) page
2. Create a new issue with detailed information
3. Include error messages and code examples when possible

---

Made with ❤️ for the developer community
