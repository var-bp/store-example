import React from 'react';
import { useStore } from './Store.tsx';

function Value({ data }: { data: "first" | "last" }) {
  const [store] = useStore();

  return (
    <div className="value">
      {data}: {store[data]}
    </div>
  );
}

export default Value;
