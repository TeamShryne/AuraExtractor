import { USER_AGENT } from "./constants"

export const getHtml = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Language": "en-US",
    },
  })

  if (!response.ok) throw new Error(`Status Code: ${response.status}`)
  return await response.text()
}