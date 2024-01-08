import "../css/InputField.css";
import { Form } from "react-bootstrap";

export default function InputField({
  htmlFor,
  type,
  name,
  id,
  placeholder,
  value,
  handleNewDrawerChange,
}) {
  const handleChange = (e) => {
    let value = e.target.value;
    // Change the name - handleNewDrawerChange
    handleNewDrawerChange(value);
  };

  return (
    <div className="InputField-main-div">
      <Form.Group className="mb-3">
        <Form.Label hidden htmlFor={htmlFor}>
          {placeholder}
        </Form.Label>
        <Form.Control
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </Form.Group>
    </div>
  );
}
