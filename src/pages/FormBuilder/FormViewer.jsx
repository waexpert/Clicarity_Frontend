import FormPreview from './components/FormPreview';

function FormViewer() {
  const formSchema = {
  "form_id": "form_a3mtjm7w",
  "fields": [
    {
      "id": 1770714838237,
      "type": "subheading",
      "name": "field_1770714838237",
      "label": "Subheading",
      "placeholder": "",
      "required": false,
      "columnName": "",
      "options": [],
      "content": "Enter your text here"
    },
    {
      "id": 1770714847925,
      "type": "body",
      "name": "field_1770714847925",
      "label": "Body Text",
      "placeholder": "",
      "required": false,
      "columnName": "",
      "options": [],
      "content": "Enter your text here"
    },
    {
      "id": 1770714849525,
      "type": "text",
      "name": "field_1770714849525",
      "label": "Text Input",
      "placeholder": "",
      "required": false,
      "columnName": "",
      "options": [],
      "content": ""
    },
    {
      "id": 1770714849933,
      "type": "email",
      "name": "field_1770714849933",
      "label": "Email",
      "placeholder": "",
      "required": false,
      "columnName": "",
      "options": [],
      "content": ""
    },
    {
      "id": 1770714853157,
      "type": "select",
      "name": "field_1770714853157",
      "label": "Dropdown",
      "placeholder": "",
      "required": false,
      "columnName": "quality",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3"
      ],
      "content": ""
    }
  ]
}

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div style={{}}>
      <FormPreview 
        fields={formSchema.fields} 
        onSubmit={handleFormSubmit}
        formId={formSchema.form_id}
      />
    </div>
  );
}

export default FormViewer;