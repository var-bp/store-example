import React from 'react';
import { useStore } from './Store.tsx';

function TextInput({ data }: { data: "first" | "last" }) {
  const [fieldValue, setStore] = useStore((store) => store[data]);
  return (
    <div className="field">
      {data}:{" "}
      <input
        value={fieldValue}
        onChange={(e) => setStore({ [data]: e.target.value })}
      />
    </div>
  );
}

export default TextInput;
