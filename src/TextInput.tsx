import React from 'react';
import { useStore } from './Store.tsx';

function TextInput({ data }: { data: "first" | "last" }) {
  const [store, dispatch] = useStore();

  return (
    <div className="field">
      {data}:{" "}
      <input
        value={store[data]}
        onChange={(e) => { dispatch({ type: "SET", payload: { [data]: e.target.value }})} }
      />
    </div>
  );
}

export default TextInput;
