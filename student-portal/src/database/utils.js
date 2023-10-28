async function post(endpoint, data ){

  const token = localStorage.getItem("token");


  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(endpoint, requestOptions);
  if (!response.ok) {
    throw new Error(`Post request failed`);
  }
  return await response.json();
}
async function get(endpoint) {
try {
  const token = localStorage.getItem("token");


  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error);
  }

  const data = await response.json();

  return data;
} catch (error) {
  console.log(error)
  console.error("Error:", error);
  throw error; // Re-throw the error for the calling code to handle
}
}

export {
  post,
  get
}