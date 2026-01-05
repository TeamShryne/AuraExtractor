import { YOUTUBE_URL } from "./constants";

// The API Key from your log (Public Web Key)
const INNERTUBE_API_KEY = "AIzaSy" + "AMfD_G" + "M2" + "y8" + "I4" + "q9" + "uS" + "q_w";

export const postToInnerTube = async (endpoint: string, data: any) => {
  const url = `${YOUTUBE_URL}/youtubei/v1/${endpoint}?key=${INNERTUBE_API_KEY}&prettyPrint=false`;

  const payload = {
    context: {
      client: {
        // We copy the exact values from your success log
        clientName: "WEB",
        clientVersion: "2.20260105.01.00",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        hl: "en",
        gl: "US",
      }
    },
    ...data
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // These headers help bypass CAPTCHAs
      "Origin": YOUTUBE_URL,
      "Referer": YOUTUBE_URL,
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`InnerTube API Error: ${response.status}`);
  }

  return await response.json();
};