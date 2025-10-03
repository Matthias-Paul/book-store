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


export const fetchBooks = async ({ pageParam = 1, token }) =>{
  const res = await fetch(`${BASE_URL}/api/books?page=${pageParam}`,{
    method:"GET",
    headers:{
      "Content-Type":"application/json",
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()

  if(!res.ok){
    throw new Error(data.message ||  "Failed to fetch books")
  }

  return data
}


export const fetchUserBook = async ( token ) =>{
  const res = await fetch(`${BASE_URL}/api/userBooks`,{
    method:"GET",
    headers:{
      "Content-Type":"application/json",
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()

  if(!res.ok){
    throw new Error(data.message ||  "Failed to fetch books")
  }

  return data
}

export const deleteBook = async ( token,  bookId ) =>{
  const res = await fetch(`${BASE_URL}/api/book/${bookId}`,{
    method:"DELETE",
    headers:{
      "Content-Type":"application/json",
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()

  if(!res.ok){
    throw new Error(data.message ||  "Failed to delete book")
  }

  return data
}