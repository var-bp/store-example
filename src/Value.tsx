import React from 'react';
import { useStore } from './Store.tsx';

function Value({ data }: { data: "first" | "last" }) {
  const [fieldValue] = useStore((store) => store[data]);
  return (
    <div className="value">
      {data}: {fieldValue}
    </div>
  );
}

export default Value;
