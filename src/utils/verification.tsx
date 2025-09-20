import { useState } from 'react';

const useIdentityVerification = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST;

  const verifyIdentity = async (fullname: string, idNumber: string) => {
    const url = 'https://identity-verification-from-id.p.rapidapi.com/verify-identity';
    const data = new FormData();
    data.append('fullname', fullname);
    data.append('id_number', idNumber); 

    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
      body: data,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options as any);
      const result = await response.json(); 
      setResult(result);
    } catch (err: any) {
      setError(err?.message as any);
    } finally {
      setLoading(false);
    }
  };

  return { verifyIdentity, loading, result, error };
};

export default useIdentityVerification;
