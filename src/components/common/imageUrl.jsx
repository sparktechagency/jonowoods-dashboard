export const getImageUrl = (path) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "http://10.0.70.208:5000";
    return `${baseUrl}/${path}`;
  }
};
