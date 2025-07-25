export const getImageUrl = (path) => {
  if (
    typeof path === "string" &&
    (path.startsWith("http://") || path.startsWith("https://"))
  ) {
    return path;
  } else if (typeof path === "string" && path.trim() !== "") {
    // const baseUrl = "http://10.10.7.37:7000";
    const baseUrl = "https://api.yogawithjen.life/";
    return `${baseUrl}/${path}`;
  } else {
    return "";
  }
};

export const getVideoAndThumbnail = (Url) => {
  return `https://${Url}`;
};
