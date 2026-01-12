import { isProduction } from "../../redux/api/baseApi";
import { getBaseUrl } from "../../redux/api/baseUrl";

export const getImageUrl = (path) => {
  if (
    typeof path === "string" &&
    (path.startsWith("http://") || path.startsWith("https://"))
  ) {
    return path;
  } else if (typeof path === "string" && path.trim() !== "") {
    const baseUrl = getBaseUrl(isProduction);
    // const baseUrl = "https://api.yogawithjen.life";
    return `${baseUrl}/${path}`;
  } else {
    return "";
  }
};

// export const getVideoAndThumbnail = (Url) => {
//   return `${Url}`;
// };



export const getVideoAndThumbnail = (url) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : getImageUrl(url);
};
