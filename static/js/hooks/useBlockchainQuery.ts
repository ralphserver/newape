import { QueryFunction, QueryKey, useQuery } from "react-query";
import { UseQueryOptions } from "react-query/types/react/types";

function useBlockchainQuery<T>(queryKey: QueryKey, queryFn: QueryFunction<T>, options?: UseQueryOptions<T>) {
  return useQuery(queryKey, queryFn, {
    refetchInterval: 5000,
    staleTime: 15000,
    ...options,
  });
}

export default useBlockchainQuery;
