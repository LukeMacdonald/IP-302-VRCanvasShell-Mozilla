import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

const usePost = (url, data) => {
  const [status, setStatus] = useState("idle");
  
  const [data, setData] = useState([]);
  
  const token = useSelector((state) => state.token);
  
  const domain = useSelector((state) => state.domain);

  const params = useMemo(() => ({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }), [token]);

  const postData = useCallback(async () => {
    if (!url) return;
    try {
      setStatus("sending");
      const response = await fetch(domain + url, params);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);

      setStatus("sent");

    } catch (error) {

      setStatus("error");

      console.error("Error fetching data:", error);
    }
  }, [url, domain, params]);

  useEffect(() => {
    postData();
  }, [fetchData]);

  return { status, data };
};

export default usePost;