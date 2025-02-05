import React, { useRef, useCallback, createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';

type Store = { first: string; last: string };

function useStoreData(): {
  get: () => Store;
  set: (value: Partial<Store>) => void;
  subscribe: (callback: () => void) => () => void;
} {
  const store = useRef({
    first: '',
    last: '',
  });

  const get = useCallback(() => store.current, []);

  const subscribers = useRef(new Set<() => void>());

  const set = useCallback((value: Partial<Store>) => {
    store.current = { ...store.current, ...value };
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);

  return {
    get,
    set,
    subscribe,
  };
}

type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

const StoreContext = createContext<UseStoreDataReturnType | null>(null);

export function Provider({ children }: { children: ReactNode }) {
  const store = useStoreData();

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore<SelectorOutput>(selector: (store: Store) => SelectorOutput): [SelectorOutput, (value: Partial<Store>) => void] {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('Store not found');
  }

  const state = useSyncExternalStore(store.subscribe, () => selector(store.get()));

  return [state, store.set];
}