import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

const useFetch = (url) => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);
  const token = useSelector((state) => state.token);
  const domain = useSelector((state) => state.domain);

  const params = useMemo(() => ({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }), [token]);

  const fetchData = useCallback(async () => {
    if (!url) return;
    try {
      setStatus("fetching");
      const response = await fetch(domain + url, params);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      setStatus("fetched");
    } catch (error) {
      setStatus("error");
      console.error("Error fetching data:", error);
    }
  }, [url, domain, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { status, data };
};

export default useFetch;
