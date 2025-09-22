const BASE_URL = "https://book-store-59ah.onrender.com";

export const fetchLoginApi = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to log in");
  }

  return data;
};

export const fetchSignUpApi = async ({ username, email, password }) => {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to sign up");
  }

  return data;
};
