import React, { useRef, useCallback, createContext, useContext, useSyncExternalStore, useMemo, type ReactNode, type Reducer } from 'react';

type InitialState = {
  first: string;
  last: string;
};

const INITIAL_STATE: InitialState = {
  first: "",
  last: "",
};

type Action = {
  type: string;
  payload?: any;
};

interface Store<State> {
  get: () => State;
  set: (action: Action) => void;
  subscribe: (callback: () => void) => () => void;
}

// Utility to detect execution environment
function canUseDOM(): boolean {
  return typeof window !== 'undefined' && typeof window.requestAnimationFrame !== 'undefined';
}

function useConfiguredStore<State>(initialState: State, reducer: Reducer<State, Action>): Store<State> {
  const storeRef = useRef(initialState);
  const subscribersRef = useRef(new Set<() => void>());
  const reducerRef = useRef(reducer);
  const pendingUpdatesRef = useRef<(() => void)[]>([]);

  // Update reducer ref when config changes
  reducerRef.current = reducer;

  const get = useCallback(() => storeRef.current, []);

  // SSR-safe batch updates implementation
  const batchUpdates = useCallback((updates: (() => void)[]) => {
    if (canUseDOM()) {
      // Browser environment: use requestAnimationFrame to batch updates
      if (pendingUpdatesRef.current.length === 0) {
        window.requestAnimationFrame(() => {
          const updates = pendingUpdatesRef.current;
          pendingUpdatesRef.current = [];
          updates.forEach(update => update());
        });
      }
      pendingUpdatesRef.current.push(...updates);
    } else {
      // Server environment: execute immediately
      updates.forEach(update => update());
    }
  }, []);

  const set = useCallback((action: Action) => {
    const nextState = reducerRef.current(storeRef.current, action);
    // Only update if the state has changed
    if (nextState !== storeRef.current) {
      storeRef.current = nextState;
      // Notify all subscribers of the state change
      const callbacks = Array.from(subscribersRef.current);
      batchUpdates(callbacks);
    }
  }, [batchUpdates]);

  const subscribe = useCallback((callback: () => void) => {
    subscribersRef.current.add(callback);
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  // Memoize the store object to prevent unnecessary re-creations
  return useMemo(() => ({
    get,
    set,
    subscribe
  }), [get, set, subscribe]);
}

const StoreContext = createContext<Store<any> | null>(null);

function exampleReducer<Store>(state: Store, action: Action): Store {
  const { type, payload } = action;

  switch (type) {
    case 'SET':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}

export function Provider({ children }: { children: ReactNode }) {
  const store = useConfiguredStore(INITIAL_STATE, exampleReducer);

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): [InitialState, (action: Action) => void] {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error("Store must be used within a Provider");
  }

  const state = useSyncExternalStore(store.subscribe, store.get, store.get);

  return [state, store.set];
}