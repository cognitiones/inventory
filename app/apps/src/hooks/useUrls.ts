const VITE_IMG_BASEURL = import.meta.env.VITE_IMG_BASEURL

type Url = 'imgUrl'

export const useUrls = (url: Url) => {
  const urls = {
    "imgUrl": VITE_IMG_BASEURL
  }

  return urls[url] || urls
}
