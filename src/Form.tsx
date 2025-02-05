import React from 'react';
import TextInput from './TextInput.tsx';

function Form() {
  return (
    <div className="container">
      <h4>Form</h4>
      <TextInput data="first" />
      <TextInput data="last" />
    </div>
  );
}

export default Form;
