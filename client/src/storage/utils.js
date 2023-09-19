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
async function get(endpoint){
    const token = localStorage.getItem("token"); 
    const params = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
    };
    const response = await fetch(endpoint, params);
    if (!response.ok) {
      throw new Error(`Get request failed`);
    }
    return await response.json();
  
}

export {
    post,
    get
}