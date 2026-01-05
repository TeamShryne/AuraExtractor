import { postToInnerTube } from "../utils/innertube";
import { SearchContext, SearchItem } from "./types";

export const query = async (searchTerm: string): Promise<SearchContext> => {
  const data = await postToInnerTube("search", {
    query: searchTerm
  });

  // 1. Locate the main list
  const primaryContents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents;
  const sectionList = primaryContents?.sectionListRenderer?.contents;
  
  if (!sectionList) throw new Error("Unexpected YouTube response structure");

  // 2. Extract Items (handling Shelves and Standard Lists)
  let items: SearchItem[] = [];
  let continuation = null;

  // Loop through sections (usually just one main section + continuation)
  for (const section of sectionList) {
    if (section.itemSectionRenderer) {
      const rawItems = section.itemSectionRenderer.contents || [];
      
      for (const item of rawItems) {
        // Case A: Standard Video
        if (item.videoRenderer) {
          items.push(parseVideo(item.videoRenderer));
        }
        // Case B: Channel
        else if (item.channelRenderer) {
          items.push(parseChannel(item.channelRenderer));
        }
        // Case C: Shelf (e.g., "Latest from Bog") - This contains nested videos!
        else if (item.shelfRenderer) {
          const shelfItems = item.shelfRenderer.content?.verticalListRenderer?.items || [];
          for (const shelfItem of shelfItems) {
            if (shelfItem.videoRenderer) {
              items.push(parseVideo(shelfItem.videoRenderer));
            }
          }
        }
      }
    } 
    // 3. Find Continuation Token
    else if (section.continuationItemRenderer) {
      continuation = section.continuationItemRenderer.continuationEndpoint?.continuationCommand?.token;
    }
  }

  return {
    items,
    suggestion: null, // Web API usually puts this in a separate section, simplified for now
    isCorrected: false,
    continuation
  };
};

// --- Helpers to clean up the code ---

const parseVideo = (v: any): SearchItem => ({
  type: "video",
  id: v.videoId,
  title: v.title?.runs?.[0]?.text || v.title?.simpleText || "Unknown",
  thumbnail: v.thumbnail?.thumbnails?.pop()?.url, // Get largest
  author: v.ownerText?.runs?.[0]?.text || v.shortBylineText?.runs?.[0]?.text || "Unknown",
  views: v.viewCountText?.simpleText,
  published: v.publishedTimeText?.simpleText
});

const parseChannel = (c: any): SearchItem => ({
  type: "channel",
  id: c.channelId,
  title: c.title?.simpleText || "Unknown",
  thumbnail: c.thumbnail?.thumbnails?.pop()?.url,
  author: c.title?.simpleText,
  views: c.subscriberCountText?.simpleText
});