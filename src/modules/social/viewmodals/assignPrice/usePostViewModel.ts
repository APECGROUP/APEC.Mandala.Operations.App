import {useState, useEffect, useCallback} from 'react';
import {Post} from '../../models/Post';
import {fetchPosts} from '../../services/api';

export const usePostViewModel = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchPosts(1);
    setPosts(data);
    setPage(2);
    setIsLoading(false);
  }, []);

  const refreshPosts = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchPosts(1);
    setPosts(data);
    setPage(2);
    setRefreshing(false);
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (loadingMore) {
      return;
    }
    setLoadingMore(true);
    const moreData = await fetchPosts(page);
    setPosts(prev => [...prev, ...moreData]);
    setPage(p => p + 1);
    setLoadingMore(false);
  }, [page, loadingMore]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    posts,
    isLoading,
    refreshing,
    loadingMore,
    refreshPosts,
    loadMorePosts,
  };
};
