async function post(endpoint, data ){
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const params = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',},
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