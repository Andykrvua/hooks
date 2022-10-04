import { useEffect, useState } from 'react';

export default function useRequest(req) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    req()
      .then((res) => setData(res.data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return [data, loading, error];
}
