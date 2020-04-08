import { useEffect } from 'react';

export default function usePromise(
  watchlist,
  promiseCreator,
  handleSuccess,
  handleFailure
) {
  useEffect(() => {
    let ignoreResponse;
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
