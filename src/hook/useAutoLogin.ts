import { useState, useEffect } from 'react';
import DataLocal from '../data/DataLocal';
import { CredentialsType } from '../data/DataLocal';

export const useAutoLogin = () => {
  const [credentials, setCredentials] = useState<CredentialsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      const savedCredentials = await DataLocal.getCredentials();
      setCredentials(savedCredentials);
    } catch (error) {
      console.error('Error loading credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCredentials = () => {
    setCredentials(null);
  };

  return {
    credentials,
    loading,
    loadCredentials,
    clearCredentials,
  };
};
