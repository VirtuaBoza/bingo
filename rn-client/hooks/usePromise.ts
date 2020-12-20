import { useEffect } from 'react';

export default function usePromise<T>(
  watchlist: any[],
  promiseCreator: () => Promise<T>,
  handleSuccess: (res: T) => any,
  handleFailure?: (err: any) => any
) {
  useEffect(() => {
    let ignoreResponse = false;
    promiseCreator()
      .then((res) => {
        if (!ignoreResponse && handleSuccess) {
          handleSuccess(res);
        }
      })
      .catch((res) => {
        if (__DEV__) {
          console.error(res);
        }
        if (!ignoreResponse && handleFailure) {
          handleFailure(res);
        }
      });

    return () => {
      ignoreResponse = true;
    };
  }, watchlist);
}
