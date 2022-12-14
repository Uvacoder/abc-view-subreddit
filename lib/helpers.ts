/**
 * Global fetcher function for useSWR.
 */
export async function fetcher(url: RequestInfo, init?: RequestInit) {
  const response = await fetch(url, init)

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  return response.json()
}

interface FetchPostsProps {
  lastPost?: string
  limit?: number
  sort?: string
  subReddit: string
}

/**
 * Fetches posts from internal Reddit API.
 */
export async function fetchPosts({
  limit,
  lastPost,
  sort,
  subReddit
}: FetchPostsProps) {
  const after = lastPost ? lastPost : ''
  const number = limit ? limit : '24'
  const sortBy = sort ? sort : 'hot'
  const sub = subReddit ? subReddit : 'itookapicture'

  try {
    // Try and fetch posts.
    const response = await fetch(
      `/api/reddit?sub=${sub}&sort=${sortBy}&limit=${number}&after=${after}`,
      {
        cache: 'default'
      }
    )

    // Bad response? Bail...
    if (response.status != 200) {
      return {
        error: `${response.statusText}`
      }
    }

    // Return posts.
    return await response.json()
  } catch (error) {
    // Issue? Leave a message and bail.
    console.error(error)
    return {
      error: `${error}`
    }
  }
}

interface CleanIframeProps {
  html: string
}

/**
 * Replace the src attribute with a less terrible version.
 */
export function cleanIframe({html}: CleanIframeProps) {
  // Grab the src URL.
  const source = html.match(/(src="([^"]+)")/gi)

  return `<iframe
      ${source}
      allow="autoplay fullscreen"
      loading="lazy"
      referrerpolicy="no-referrer"
      sandbox="allow-scripts allow-same-origin allow-presentation"
      style="height: auto; width: 100%;"
      title="iframe"
    />`
}
