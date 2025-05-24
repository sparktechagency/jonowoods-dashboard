export const getImageUrl = (path) => {
  if (
    typeof path === "string" &&
    (path.startsWith("http://") || path.startsWith("https://"))
  ) {
    return path;
  } else if (typeof path === "string" && path.trim() !== "") {
    const baseUrl = "http://10.0.60.126:7000";
    return `${baseUrl}/${path}`;
  } else {
    return "";
  }
};

export const getVideoAndThumbnail = (Url) => {
  return `https://${Url}`;
};
