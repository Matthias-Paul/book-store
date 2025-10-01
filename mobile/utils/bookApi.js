const BASE_URL = "https://book-store-59ah.onrender.com";

export const postBook = async ({ title, image, rating, caption, token }) => {
  const res = await fetch(`${BASE_URL}/api/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      image,
      rating,
      caption,
    }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to share book");
  }

  return data;
};
