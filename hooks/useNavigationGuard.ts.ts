import { useCallback, useRef } from 'react';

const useDebounce = (callback: (...args: any[]) => void, delay = 500) => {
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const isDebouncing = useRef(false);

  const debouncedFunction = useCallback((...args: any) => {
    if (isDebouncing.current) return;
    
    isDebouncing.current = true;
    callback(...args);
    
    timeoutRef.current = setTimeout(() => {
      isDebouncing.current = false;
    }, delay);
  }, [callback, delay]);

  return debouncedFunction;
};

export { useDebounce };

