import React from 'react';
import Form from 'react-bootstrap/Form';

function SelectorComponent({ onChange, selectedValue, optionsList }) {
  return (
    <Form>
      <Form.Select
        aria-label="Selector"
        onChange={(e) => onChange(e.target.value)}
        value={selectedValue}
      >
        <option value="">Select an option</option>
        {optionsList.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
      {selectedValue && (
        <p>Selected: {selectedValue}</p>
      )}
    </Form>
  );
}

export default SelectorComponent;
