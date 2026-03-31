const imageArray = document.querySelectorAll("img.fallback");
imageArray.forEach((image) => {
  image.addEventListener(
    "error",
    () => (image.src = "/images/placeholder.jpeg"),
  );
  if (image.complete && image.naturalWidth === 0) {
    image.src = "/images/placeholder.jpeg";
  }
});
