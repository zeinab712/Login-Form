
import Form from "./Form";
import type { FormValues } from './Form';

import "./App.css";

function App() {
  const handleFormSubmit = (data: FormValues) => {
    console.log("Data from child form:", data);
  };

  return (
    <>
      <Form
        includeEmail={true}
        includeFullname={true}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}

export default App;

