// import { useState } from 'react';
// import {
//   Heading,
//   Type,
//   AlignLeft,
//   TextQuote,
//   Image,
//   TextCursorInput,
//   Hash,
//   Mail,
//   Lock,
//   KeyRound,
//   Phone,
//   AlignJustify,
//   CheckSquare,
//   ChevronDown,
//   CircleDot,
//   Calendar,
//   BadgeCheck,
//   ImageUp,
//   Paperclip,
//   GripVertical,
//   Eye,
//   Settings,
//   Copy,
//   Download,
//   Plus,
//   X,
//   Save,
//   Trash2
// } from 'lucide-react';
// import shortId from '../utils/randomId';
// import FormPreview from './FormBuilder/components/FormPreview';
// // import { button } from '@mui/material';

// // ---------------- ICON REGISTRY ----------------
// const ICONS = {
//   heading: Heading,
//   subheading: Type,
//   body: AlignLeft,
//   caption: TextQuote,
//   image: Image,
//   text: TextCursorInput,
//   number: Hash,
//   email: Mail,
//   password: Lock,
//   passcode: KeyRound,
//   tel: Phone,
//   textarea: AlignJustify,
//   checkbox: CheckSquare,
//   select: ChevronDown,
//   radio: CircleDot,
//   date: Calendar,
//   optin: BadgeCheck,
//   'file-image': ImageUp,
//   file: Paperclip,
// };

// // ---------------- FIELD DEFINITIONS ----------------
// const FIELD_TYPES = {
//   HEADING: { type: 'heading', label: 'Heading', category: 'content', icon: 'heading' },
//   SUBHEADING: { type: 'subheading', label: 'Subheading', category: 'content', icon: 'subheading' },
//   BODY: { type: 'body', label: 'Body Text', category: 'content', icon: 'body' },
//   CAPTION: { type: 'caption', label: 'Caption', category: 'content', icon: 'caption' },
//   IMAGE: { type: 'image', label: 'Image', category: 'content', icon: 'image' },
//   TEXT: { type: 'text', label: 'Text Input', category: 'input', icon: 'text' },
//   NUMBER: { type: 'number', label: 'Number', category: 'input', icon: 'number' },
//   EMAIL: { type: 'email', label: 'Email', category: 'input', icon: 'email' },
//   PASSWORD: { type: 'password', label: 'Password', category: 'input', icon: 'password' },
//   PASSCODE: { type: 'passcode', label: 'Passcode', category: 'input', icon: 'passcode' },
//   PHONE: { type: 'tel', label: 'Phone', category: 'input', icon: 'tel' },
//   TEXTAREA: { type: 'textarea', label: 'Textarea', category: 'input', icon: 'textarea' },
//   CHECKBOX: { type: 'checkbox', label: 'Checkbox', category: 'input', icon: 'checkbox' },
//   DROPDOWN: { type: 'select', label: 'Dropdown', category: 'input', icon: 'select' },
//   RADIO: { type: 'radio', label: 'Radio button', category: 'input', icon: 'radio' },
//   DATE: { type: 'datetime-local', label: 'Date', category: 'input', icon: 'date' },
//   OPTIN: { type: 'optin', label: 'Opt-in', category: 'input', icon: 'optin' },
//   IMAGE_UPLOAD: { type: 'file-image', label: 'Image Upload', category: 'input', icon: 'file-image' },
//   FILE_UPLOAD: { type: 'file', label: 'File Upload', category: 'input', icon: 'file' },
// };

// // ---------------- MAIN COMPONENT ----------------
// function FormBuilder() {
//   const [formSchema, setFormSchema] = useState({
//     form_id: `form_${shortId()}`,
//     fields: []
//   });

//   const [formMetadata, setFormMetadata] = useState({
//     schema_name: '',
//     table_name: '',
//     owner_id: '' // This should come from your auth system
//   });
//   const [selectedField, setSelectedField] = useState(null);
//   const [draggedItem, setDraggedItem] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showProperties, setShowProperties] = useState(true);
//   const [showSaveModal, setShowSaveModal] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   const saveFormToDatabase = async () => {
//     setIsSaving(true);
//     try {
//       const payload = {
//         us_id: formSchema.form_id,
//         owner_id: formMetadata.owner_id, // Get from auth context
//         schema_name: formMetadata.schema_name,
//         table_name: formMetadata.table_name,
//         form_schema: formSchema
//       };

//       const response = await fetch('/api/forms', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save form');
//       }

//       const result = await response.json();
//       alert('Form saved successfully!');
//       setShowSaveModal(false);
//     } catch (error) {
//       console.error('Error saving form:', error);
//       alert('Error saving form: ' + error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const addField = (fieldType) => {
//     const fieldConfig = Object.values(FIELD_TYPES).find(f => f.type === fieldType);

//     const newField = {
//       id: Date.now(),
//       type: fieldType,
//       name: `field_${Date.now()}`,
//       label: fieldConfig?.label || 'New Field',
//       placeholder: '',
//       required: false,
//       columnName: '',
//       options: ['select', 'radio'].includes(fieldType)
//         ? ['Option 1', 'Option 2', 'Option 3']
//         : [],
//       content: ['heading', 'subheading', 'body', 'caption'].includes(fieldType)
//         ? 'Enter your text here'
//         : '',
//       accept: fieldType === 'file-image' ? 'image/*' : fieldType === 'file' ? '*' : undefined,
//       maxLength: fieldType === 'passcode' ? 6 : undefined,
//     };

//     setFormSchema(prev => ({
//       ...prev,
//       fields: [...prev.fields, newField]
//     }));
//     setSelectedField(newField.id);
//   };

//   const updateField = (id, updates) => {
//     setFormSchema(prev => ({
//       ...prev,
//       fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
//     }));
//   };

//   const removeField = (id) => {
//     setFormSchema(prev => ({
//       ...prev,
//       fields: prev.fields.filter(f => f.id !== id)
//     }));
//     setSelectedField(null);
//   };

//   const handleDragStart = (e, index) => {
//     setDraggedItem(index);
//     e.dataTransfer.effectAllowed = 'move';
//   };

//   const handleDragOver = (e, index) => {
//     e.preventDefault();
//     if (draggedItem === null || draggedItem === index) return;

//     const newFields = [...formSchema.fields];
//     const draggedItemContent = newFields[draggedItem];
//     newFields.splice(draggedItem, 1);
//     newFields.splice(index, 0, draggedItemContent);

//     setDraggedItem(index);
//     setFormSchema(prev => ({
//       ...prev,
//       fields: newFields
//     }));
//   };

//   const handleDragEnd = () => {
//     setDraggedItem(null);
//   };

//   const exportJSON = () => {
//     const jsonStr = JSON.stringify(formSchema, null, 2);
//     navigator.clipboard.writeText(jsonStr);
//     alert('JSON copied to clipboard!');
//   };

//   const downloadJSON = () => {
//     const jsonStr = JSON.stringify(formSchema, null, 2);
//     const blob = new Blob([jsonStr], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${formSchema.form_id}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const contentFields = Object.values(FIELD_TYPES).filter(f => f.category === 'content');
//   const inputFields = Object.values(FIELD_TYPES).filter(f => f.category === 'input');

//   const currentField = formSchema.fields.find(f => f.id === selectedField);

//   return (
//     <div style={{ display: 'flex', height: '100vh' }} className='mx-[6rem]'>
//       {/* LEFT SIDEBAR */}
//       <div style={{ display: 'flex',flexDirection:"column", height: '100vh' }}>
//      <Sidebar style={{overflowY:"hidden"}} title="Content Components" fields={contentFields} onAdd={addField} />
//       <Sidebar title="Form Input Components" fields={inputFields} onAdd={addField} />
//       </div>
 

//       {/* FORM BUILDER */}
//       <div style={{ flex: 1, overflowY: 'auto' }}>
//         <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: 20, borderRadius: 8 }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 ,flexDirection:"column"}}>
//             <div>
//               <h2 style={{ margin: 0 }}>Form Builder</h2>
//               <small style={{ color: '#666' }}>Form ID: {formSchema.form_id}</small>
//             </div>
//             <div style={{ display: 'flex', gap: 10 }}>
//               <button
//                 onClick={() => setShowSaveModal(true)}
//                 className="
//     bg-primary 
//     text-white
//     p-2
//     rounded-md
//     cursor-pointer
//     flex
//     flex-col
//     items-center
//     gap-2
//     text-[12px]
//     w-24
//   "
//               >
//                 <Save size={18} />
//                 Save Form
//               </button>
//               <button
//                 onClick={exportJSON}
//                 className="
//     bg-primary 
//     text-white
//     p-2
//     rounded-md
//     cursor-pointer
//     flex
//     flex-col
//     items-center
//     gap-2
//     text-[12px]
//     w-24
//   "
//               >
//                 <Copy size={18} />
//                 Copy JSON
//               </button>
//               <button
//                 onClick={downloadJSON}
//                 className="
//     bg-primary 
//     text-white
//     p-2
//     rounded-md
//     cursor-pointer
//     flex
//     flex-col
//     items-center
//     gap-2
//     text-[12px]
//     w-24
//   "
//               >
//                 <Download size={18} />
//                 Download JSON
//               </button>
//               <button
//                 onClick={() => setShowProperties(!showProperties)}
//                 className="
//     bg-primary 
//     text-white
//     p-2
//     rounded-md
//     cursor-pointer
//     flex
//     flex-col
//     items-center
//     gap-2
//     text-[12px]
//     w-24
//   "
//               >
//                 <Settings size={18} />
//                 Properties
//               </button>
//               <button
//                 onClick={() => setShowPreview(!showPreview)}
//                 className="
//     bg-primary 
//     text-white
//     p-2
//     rounded-md
//     cursor-pointer
//     flex
//     flex-col
//     items-center
//     gap-2
//     text-[12px]
//     w-24
//   "
//               >
//                 <Eye size={18} />
//                 {showPreview ? 'Hide Preview' : 'Show Preview'}
//               </button>
//             </div>
//           </div>

//           {/* SAVE MODAL */}
//           {showSaveModal && (
//             <div style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background: 'rgba(0,0,0,0.5)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               zIndex: 1000
//             }}>
//               <div style={{
//                 background: '#fff',
//                 padding: 30,
//                 borderRadius: 8,
//                 maxWidth: 500,
//                 width: '90%'
//               }}>
//                 <h3 style={{ marginTop: 0 }}>Save Form to Database</h3>

//                 <div style={{ marginBottom: 15 }}>
//                   <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                     Schema Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={formMetadata.schema_name}
//                     onChange={(e) => setFormMetadata(prev => ({ ...prev, schema_name: e.target.value }))}
//                     placeholder="e.g., public"
//                     style={{
//                       width: '100%',
//                       padding: 10,
//                       border: '1px solid #ddd',
//                       borderRadius: 4,
//                       fontSize: 14
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 15 }}>
//                   <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                     Table Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={formMetadata.table_name}
//                     onChange={(e) => setFormMetadata(prev => ({ ...prev, table_name: e.target.value }))}
//                     placeholder="e.g., user_submissions"
//                     style={{
//                       width: '100%',
//                       padding: 10,
//                       border: '1px solid #ddd',
//                       borderRadius: 4,
//                       fontSize: 14
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 20 }}>
//                   <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                     Form ID
//                   </label>
//                   <input
//                     type="text"
//                     value={formSchema.form_id}
//                     disabled
//                     style={{
//                       width: '100%',
//                       padding: 10,
//                       border: '1px solid #ddd',
//                       borderRadius: 4,
//                       fontSize: 14,
//                       background: '#f5f5f5',
//                       color: '#666'
//                     }}
//                   />
//                 </div>

//                 <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//                   <button
//                     onClick={() => setShowSaveModal(false)}
//                     disabled={isSaving}
//                     style={{
//                       padding: '10px 20px',
//                       background: '#ccc',
//                       color: '#333',
//                       border: 'none',
//                       borderRadius: 6,
//                       cursor: isSaving ? 'not-allowed' : 'pointer'
//                     }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={saveFormToDatabase}
//                     disabled={isSaving || !formMetadata.schema_name || !formMetadata.table_name}
//                     style={{
//                       padding: '10px 20px',
//                       background: isSaving || !formMetadata.schema_name || !formMetadata.table_name ? '#ccc' : '#4CAF50',
//                       color: '#fff',
//                       border: 'none',
//                       borderRadius: 6,
//                       cursor: isSaving || !formMetadata.schema_name || !formMetadata.table_name ? 'not-allowed' : 'pointer'
//                     }}
//                   >
//                     {isSaving ? 'Saving...' : 'Save Form'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {formSchema.fields.length === 0 && (
//             <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
//               Click on components from the sidebar to start building your form
//             </div>
//           )}

//           {formSchema.fields.map((field, index) => (
//             <div
//               key={field.id}
//               draggable
//               onDragStart={(e) => handleDragStart(e, index)}
//               onDragOver={(e) => handleDragOver(e, index)}
//               onDragEnd={handleDragEnd}
//               onClick={() => setSelectedField(field.id)}
//               style={{
//                 border: selectedField === field.id ? '2px solid #2196F3' : '1px solid #ddd',
//                 padding: 15,
//                 marginBottom: 10,
//                 borderRadius: 8,
//                 background: draggedItem === index ? '#e3f2fd' : '#fafafa',
//                 cursor: 'move',
//                 opacity: draggedItem === index ? 0.5 : 1,
//               }}
//             >
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <GripVertical size={18} color="#999" />
//                   <strong>{field.label}</strong>
//                   {field.columnName && (
//                     <span style={{
//                       fontSize: 11,
//                       background: '#E3F2FD',
//                       padding: '2px 8px',
//                       borderRadius: 4,
//                       color: '#1976D2'
//                     }}>
//                       → {field.columnName}
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     removeField(field.id);
//                   }}
//                   style={{
//                     padding: '4px 12px',
//                     color: '#f44336',
//                     border: 'none',
//                     borderRadius: 4,
//                     cursor: 'pointer'
//                   }}
//                 >
//                 <Trash2 />
//                 </button>
//               </div>
//               <FieldPreview field={field} />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* PROPERTIES PANEL */}
//       {showProperties && currentField && (
//         <PropertiesPanel
//           field={currentField}
//           onUpdate={(updates) => updateField(currentField.id, updates)}
//           onClose={() => setSelectedField(null)}
//         />
//       )}

//       {/* PREVIEW PANEL */}
//       {showPreview && (
//         <div style={{
//           width: 400,
//           background: '#fff',
//           borderLeft: '1px solid #ddd',
//           overflowY: 'auto',
//           padding: 20
//         }}>
//           <h3 style={{ marginTop: 0 }}>Live Preview</h3>
//           <div style={{
//             border: '1px solid #ddd',
//             borderRadius: 8,
//             padding: 20,
//             background: '#fafafa'
//           }}>
//             {formSchema.fields.length === 0 ? (
//               <p style={{ color: '#999', textAlign: 'center' }}>No fields added yet</p>
//             ) : (
//               <FormPreview fields={formSchema.fields} formId={formSchema.form_id}/>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ---------------- PROPERTIES PANEL ----------------
// function PropertiesPanel({ field, onUpdate, onClose }) {
//   const hasOptions = ['select', 'radio'].includes(field.type);
//   const isContent = ['heading', 'subheading', 'body', 'caption'].includes(field.type);
//   const isInput = !isContent && field.type !== 'image';

//   const addOption = () => {
//     const newOptions = [...field.options, `Option ${field.options.length + 1}`];
//     onUpdate({ options: newOptions });
//   };

//   const updateOption = (index, value) => {
//     const newOptions = [...field.options];
//     newOptions[index] = value;
//     onUpdate({ options: newOptions });
//   };

//   const removeOption = (index) => {
//     const newOptions = field.options.filter((_, i) => i !== index);
//     onUpdate({ options: newOptions });
//   };

//   return (
//     <div style={{
//       width: 350,
//       background: '#fff',
//       borderLeft: '1px solid #ddd',
//       overflowY: 'auto',
//       padding: 20
//     }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//         <h3 style={{ margin: 0 }}>Properties</h3>
//         <button
//           onClick={onClose}
//           style={{
//             background: 'transparent',
//             border: 'none',
//             cursor: 'pointer',
//             padding: 5
//           }}
//         >
//           <X size={20} />
//         </button>
//       </div>

//       {/* Label */}
//       <div style={{ marginBottom: 15 }}>
//         <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', fontSize: 14 }}>
//           Label
//         </label>
//         <input
//           type="text"
//           value={field.label}
//           onChange={(e) => onUpdate({ label: e.target.value })}
//           style={{
//             width: '100%',
//             padding: 8,
//             border: '1px solid #ddd',
//             borderRadius: 4,
//             fontSize: 14
//           }}
//         />
//       </div>

//       {/* Column Name (for input fields) */}
//       {isInput && (
//         <div style={{ marginBottom: 15 }}>
//           <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', fontSize: 14 }}>
//             Database Column Name
//           </label>
//           <input
//             type="text"
//             value={field.columnName}
//             onChange={(e) => onUpdate({ columnName: e.target.value })}
//             placeholder="e.g., user_email, phone_number"
//             style={{
//               width: '100%',
//               padding: 8,
//               border: '1px solid #ddd',
//               borderRadius: 4,
//               fontSize: 14
//             }}
//           />
//           <small style={{ color: '#666', fontSize: 12 }}>
//             The database column this field will update
//           </small>
//         </div>
//       )}

//       {/* Field Name */}
//       {isInput && (
//         <div style={{ marginBottom: 15 }}>
//           <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', fontSize: 14 }}>
//             Field Name
//           </label>
//           <input
//             type="text"
//             value={field.name}
//             onChange={(e) => onUpdate({ name: e.target.value })}
//             style={{
//               width: '100%',
//               padding: 8,
//               border: '1px solid #ddd',
//               borderRadius: 4,
//               fontSize: 14
//             }}
//           />
//         </div>
//       )}

//       {/* Content (for content fields) */}
//       {isContent && (
//         <div style={{ marginBottom: 15 }}>
//           <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', fontSize: 14 }}>
//             Content
//           </label>
//           <textarea
//             value={field.content}
//             onChange={(e) => onUpdate({ content: e.target.value })}
//             rows={4}
//             style={{
//               width: '100%',
//               padding: 8,
//               border: '1px solid #ddd',
//               borderRadius: 4,
//               fontSize: 14,
//               fontFamily: 'inherit'
//             }}
//           />
//         </div>
//       )}

//       {/* Placeholder (for input fields) */}
//       {isInput && !['checkbox', 'radio', 'optin'].includes(field.type) && (
//         <div style={{ marginBottom: 15 }}>
//           <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', fontSize: 14 }}>
//             Placeholder
//           </label>
//           <input
//             type="text"
//             value={field.placeholder}
//             onChange={(e) => onUpdate({ placeholder: e.target.value })}
//             style={{
//               width: '100%',
//               padding: 8,
//               border: '1px solid #ddd',
//               borderRadius: 4,
//               fontSize: 14
//             }}
//           />
//         </div>
//       )}

//       {/* Required (for input fields) */}
//       {isInput && (
//         <div style={{ marginBottom: 15 }}>
//           <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//             <input
//               type="checkbox"
//               checked={field.required}
//               onChange={(e) => onUpdate({ required: e.target.checked })}
//               style={{ marginRight: 8 }}
//             />
//             <span style={{ fontWeight: 'bold', fontSize: 14 }}>Required Field</span>
//           </label>
//         </div>
//       )}

//       {/* Options (for select and radio) */}
//       {hasOptions && (
//         <div style={{ marginBottom: 15 }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
//             <label style={{ fontWeight: 'bold', fontSize: 14 }}>Options</label>
//             <button
//               onClick={addOption}
//               style={{
//                 padding: '5px 10px',
//                 background: '#4CAF50',
//                 color: '#fff',
//                 border: 'none',
//                 borderRadius: 4,
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 5,
//                 fontSize: 12
//               }}
//             >
//               <Plus size={14} />
//               Add
//             </button>
//           </div>
//           {field.options.map((option, index) => (
//             <div key={index} style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
//               <input
//                 type="text"
//                 value={option}
//                 onChange={(e) => updateOption(index, e.target.value)}
//                 style={{
//                   flex: 1,
//                   padding: 8,
//                   border: '1px solid #ddd',
//                   borderRadius: 4,
//                   fontSize: 14
//                 }}
//               />
//               <button
//                 onClick={() => removeOption(index)}
//                 disabled={field.options.length <= 1}
//                 style={{
//                   padding: '5px 10px',
//                   background: field.options.length <= 1 ? '#ccc' : '#f44336',
//                   color: '#fff',
//                   border: 'none',
//                   borderRadius: 4,
//                   cursor: field.options.length <= 1 ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 <X size={14} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Max Length (for passcode) */}
//       {field.type === 'passcode' && (
//         <div style={{ marginBottom: 15 }}>
//           <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', fontSize: 14 }}>
//             Max Length
//           </label>
//           <input
//             type="number"
//             value={field.maxLength}
//             onChange={(e) => onUpdate({ maxLength: parseInt(e.target.value) })}
//             min="1"
//             style={{
//               width: '100%',
//               padding: 8,
//               border: '1px solid #ddd',
//               borderRadius: 4,
//               fontSize: 14
//             }}
//           />
//         </div>
//       )}

//       {/* Field Info */}
//       <div style={{
//         marginTop: 20,
//         padding: 15,
//         background: '#f5f5f5',
//         borderRadius: 6,
//         fontSize: 13
//       }}>
//         <div style={{ marginBottom: 8 }}>
//           <strong>Field Type:</strong> {field.type}
//         </div>
//         <div style={{ marginBottom: 8 }}>
//           <strong>Field ID:</strong> {field.id}
//         </div>
//         {field.columnName && (
//           <div>
//             <strong>Maps to Column:</strong> {field.columnName}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ---------------- SIDEBAR COMPONENT ----------------
// function Sidebar({ title, fields, onAdd }) {
//   return (
//     <div style={{ width: 380, background: '#fff', padding: 20, borderRight: '1px solid #ddd', overflowY: 'auto' }}>
//       <h3>{title}</h3>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
//         {fields.map(field => {
//           const Icon = ICONS[field.icon];
//           return (
//             <button
//               key={field.type}
//               onClick={() => onAdd(field.type)}
//               style={{
//                 padding: 15,
//                 borderRadius: 8,
//                 border: '1px solid #90caf9',
//                 background: '#e3f2fd',
//                 textAlign: 'center',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 gap: 6
//               }}
//             >
//               {Icon && <Icon size={20} />}
//               <span style={{ fontSize: 12 }}>{field.label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ---------------- FIELD PREVIEW (Builder) ----------------
// function FieldPreview({ field }) {
//   const style = { width: '100%', padding: 8, marginTop: 8, pointerEvents: 'none' };

//   switch (field.type) {
//     case 'heading': return <h1>{field.content}</h1>;
//     case 'subheading': return <h2>{field.content}</h2>;
//     case 'body': return <p>{field.content}</p>;
//     case 'caption': return <small>{field.content}</small>;
//     case 'image': return <div style={{ padding: 40, background: '#eee', marginTop: 8 }}>Image Placeholder</div>;
//     case 'textarea': return <textarea style={style} rows={4} placeholder={field.placeholder} />;
//     case 'select':
//       return (
//         <select style={style}>
//           <option>Select...</option>
//           {field.options.map((o, i) => <option key={i}>{o}</option>)}
//         </select>
//       );
//     case 'radio':
//       return (
//         <div style={{ marginTop: 8 }}>
//           {field.options.map((o, i) => (
//             <label key={i} style={{ display: 'block', marginBottom: 4 }}>
//               <input type="radio" name={field.name} /> {o}
//             </label>
//           ))}
//         </div>
//       );
//     case 'checkbox': return <input type="checkbox" style={{ marginTop: 8 }} />;
//     case 'optin': return <label style={{ marginTop: 8, display: 'block' }}><input type="checkbox" /> {field.label}</label>;
//     case 'file':
//     case 'file-image': return <input type="file" style={style} accept={field.accept} />;
//     case 'passcode': return <input type="text" maxLength={field.maxLength} style={style} placeholder={field.placeholder} />;
//     default: return <input type={field.type} style={style} placeholder={field.placeholder} />;
//   }
// }



// export default FormBuilder;







import { useState } from 'react';
import {
  Heading,
  Type,
  AlignLeft,
  TextQuote,
  Image,
  TextCursorInput,
  Hash,
  Mail,
  Lock,
  KeyRound,
  Phone,
  AlignJustify,
  CheckSquare,
  ChevronDown,
  CircleDot,
  Calendar,
  BadgeCheck,
  ImageUp,
  Paperclip,
  GripVertical,
  Eye,
  Settings,
  Copy,
  Download,
  Plus,
  X,
  Save,
  Trash2
} from 'lucide-react';
import shortId from '../utils/randomId';
import FormPreview from './FormBuilder/components/FormPreview';

// ---------------- ICON REGISTRY ----------------
const ICONS = {
  heading: Heading,
  subheading: Type,
  body: AlignLeft,
  caption: TextQuote,
  image: Image,
  text: TextCursorInput,
  number: Hash,
  email: Mail,
  password: Lock,
  passcode: KeyRound,
  tel: Phone,
  textarea: AlignJustify,
  checkbox: CheckSquare,
  select: ChevronDown,
  radio: CircleDot,
  date: Calendar,
  optin: BadgeCheck,
  'file-image': ImageUp,
  file: Paperclip,
};

// ---------------- FIELD DEFINITIONS ----------------
const FIELD_TYPES = {
  HEADING: { type: 'heading', label: 'Heading', category: 'content', icon: 'heading' },
  SUBHEADING: { type: 'subheading', label: 'Subheading', category: 'content', icon: 'subheading' },
  BODY: { type: 'body', label: 'Body Text', category: 'content', icon: 'body' },
  CAPTION: { type: 'caption', label: 'Caption', category: 'content', icon: 'caption' },
  IMAGE: { type: 'image', label: 'Image', category: 'content', icon: 'image' },
  TEXT: { type: 'text', label: 'Text Input', category: 'input', icon: 'text' },
  NUMBER: { type: 'number', label: 'Number', category: 'input', icon: 'number' },
  EMAIL: { type: 'email', label: 'Email', category: 'input', icon: 'email' },
  PASSWORD: { type: 'password', label: 'Password', category: 'input', icon: 'password' },
  PASSCODE: { type: 'passcode', label: 'Passcode', category: 'input', icon: 'passcode' },
  PHONE: { type: 'tel', label: 'Phone', category: 'input', icon: 'tel' },
  TEXTAREA: { type: 'textarea', label: 'Textarea', category: 'input', icon: 'textarea' },
  CHECKBOX: { type: 'checkbox', label: 'Checkbox', category: 'input', icon: 'checkbox' },
  DROPDOWN: { type: 'select', label: 'Dropdown', category: 'input', icon: 'select' },
  RADIO: { type: 'radio', label: 'Radio button', category: 'input', icon: 'radio' },
  DATE: { type: 'datetime-local', label: 'Date', category: 'input', icon: 'date' },
  OPTIN: { type: 'optin', label: 'Opt-in', category: 'input', icon: 'optin' },
  IMAGE_UPLOAD: { type: 'file-image', label: 'Image Upload', category: 'input', icon: 'file-image' },
  FILE_UPLOAD: { type: 'file', label: 'File Upload', category: 'input', icon: 'file' },
};

// ---------------- MAIN COMPONENT ----------------
function FormBuilder() {
  const [formSchema, setFormSchema] = useState({
    form_id: `form_${shortId()}`,
    fields: []
  });

  const [formMetadata, setFormMetadata] = useState({
    schema_name: '',
    table_name: '',
    owner_id: '' // This should come from your auth system
  });
  const [selectedField, setSelectedField] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showProperties, setShowProperties] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveFormToDatabase = async () => {
    setIsSaving(true);
    try {
      const payload = {
        us_id: formSchema.form_id,
        owner_id: formMetadata.owner_id, // Get from auth context
        schema_name: "public",
        table_name: "form_setup",
        form_schema: formSchema
      };

      const response = await fetch('/api/createRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save form');
      }

      const result = await response.json();
      alert('Form saved successfully!');
      setShowSaveModal(false);
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addField = (fieldType) => {
    const fieldConfig = Object.values(FIELD_TYPES).find(f => f.type === fieldType);

    const newField = {
      id: Date.now(),
      type: fieldType,
      name: `field_${Date.now()}`,
      label: fieldConfig?.label || 'New Field',
      placeholder: '',
      required: false,
      columnName: '',
      options: ['select', 'radio'].includes(fieldType)
        ? ['Option 1', 'Option 2', 'Option 3']
        : [],
      content: ['heading', 'subheading', 'body', 'caption'].includes(fieldType)
        ? 'Enter your text here'
        : '',
      accept: fieldType === 'file-image' ? 'image/*' : fieldType === 'file' ? '*' : undefined,
      maxLength: fieldType === 'passcode' ? 6 : undefined,
    };

    setFormSchema(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField.id);
  };

  const updateField = (id, updates) => {
    setFormSchema(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const removeField = (id) => {
    setFormSchema(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== id)
    }));
    setSelectedField(null);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newFields = [...formSchema.fields];
    const draggedItemContent = newFields[draggedItem];
    newFields.splice(draggedItem, 1);
    newFields.splice(index, 0, draggedItemContent);

    setDraggedItem(index);
    setFormSchema(prev => ({
      ...prev,
      fields: newFields
    }));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const exportJSON = () => {
    const jsonStr = JSON.stringify(formSchema, null, 2);
    navigator.clipboard.writeText(jsonStr);
    alert('JSON copied to clipboard!');
  };

  const downloadJSON = () => {
    const jsonStr = JSON.stringify(formSchema, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formSchema.form_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const contentFields = Object.values(FIELD_TYPES).filter(f => f.category === 'content');
  const inputFields = Object.values(FIELD_TYPES).filter(f => f.category === 'input');

  const currentField = formSchema.fields.find(f => f.id === selectedField);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }} className='mx-[6rem]'>
      {/* LEFT SIDEBAR */}
      <div style={{ display: 'flex', flexDirection: "column", height: '100vh' }}>
        <Sidebar title="Content Components" fields={contentFields} onAdd={addField} />
        <Sidebar title="Form Input Components" fields={inputFields} onAdd={addField} />
      </div>

      {/* FORM BUILDER */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: 20, borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexDirection: "column", gap: '16px' }}>
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: '600',
                color: '#2C3E50',
                letterSpacing: '-0.5px'
              }}>
                Form Builder
              </h2>
              <small style={{ 
                color: '#7F8C8D',
                fontSize: '13px',
                fontWeight: '500',
                display: 'block',
                marginTop: '4px'
              }}>
                Form ID: {formSchema.form_id}
              </small>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={saveFormToDatabase}
                className="bg-primary text-white p-2 rounded-md cursor-pointer flex flex-col items-center gap-1 w-24 hover:opacity-90 transition-opacity"
                style={{
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                <Save size={18} />
                <span>Save Form</span>
              </button>
              <button
                onClick={exportJSON}
                className="bg-primary text-white p-2 rounded-md cursor-pointer flex flex-col items-center gap-1 w-24 hover:opacity-90 transition-opacity"
                style={{
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                <Copy size={18} />
                <span>Copy JSON</span>
              </button>
              <button
                onClick={downloadJSON}
                className="bg-primary text-white p-2 rounded-md cursor-pointer flex flex-col items-center gap-1 w-24 hover:opacity-90 transition-opacity"
                style={{
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                <Download size={18} />
                <span>Download</span>
              </button>
              <button
                onClick={() => setShowProperties(!showProperties)}
                className="bg-primary text-white p-2 rounded-md cursor-pointer flex flex-col items-center gap-1 w-24 hover:opacity-90 transition-opacity"
                style={{
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                <Settings size={18} />
                <span>Properties</span>
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="bg-primary text-white p-2 rounded-md cursor-pointer flex flex-col items-center gap-1 w-24 hover:opacity-90 transition-opacity"
                style={{
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                <Eye size={18} />
                <span>{showPreview ? 'Hide' : 'Preview'}</span>
              </button>
            </div>
          </div>

          {/* SAVE MODAL */}
          {showSaveModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#fff',
                padding: 30,
                borderRadius: 8,
                maxWidth: 500,
                width: '90%'
              }}>
                <h3 style={{ 
                  marginTop: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#2C3E50'
                }}>
                  Save Form to Database
                </h3>

                <div style={{ marginBottom: 15 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 6, 
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#34495E'
                  }}>
                    Schema Name *
                  </label>
                  <input
                    type="text"
                    value={formMetadata.schema_name}
                    onChange={(e) => setFormMetadata(prev => ({ ...prev, schema_name: e.target.value }))}
                    placeholder="e.g., public"
                    style={{
                      width: '100%',
                      padding: 10,
                      border: '1px solid #ddd',
                      borderRadius: 4,
                      fontSize: '14px',
                      fontWeight: '400'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 15 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 6, 
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#34495E'
                  }}>
                    Table Name *
                  </label>
                  <input
                    type="text"
                    value={formMetadata.table_name}
                    onChange={(e) => setFormMetadata(prev => ({ ...prev, table_name: e.target.value }))}
                    placeholder="e.g., user_submissions"
                    style={{
                      width: '100%',
                      padding: 10,
                      border: '1px solid #ddd',
                      borderRadius: 4,
                      fontSize: '14px',
                      fontWeight: '400'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 6, 
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#34495E'
                  }}>
                    Form ID
                  </label>
                  <input
                    type="text"
                    value={formSchema.form_id}
                    disabled
                    style={{
                      width: '100%',
                      padding: 10,
                      border: '1px solid #ddd',
                      borderRadius: 4,
                      fontSize: '14px',
                      fontWeight: '400',
                      background: '#f5f5f5',
                      color: '#666'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowSaveModal(false)}
                    disabled={isSaving}
                    style={{
                      padding: '10px 20px',
                      background: '#ccc',
                      color: '#333',
                      border: 'none',
                      borderRadius: 6,
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveFormToDatabase}
                    disabled={isSaving || !formMetadata.schema_name || !formMetadata.table_name}
                    style={{
                      padding: '10px 20px',
                      background: isSaving || !formMetadata.schema_name || !formMetadata.table_name ? '#ccc' : '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      cursor: isSaving || !formMetadata.schema_name || !formMetadata.table_name ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save Form'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {formSchema.fields.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: 40, 
              color: '#95A5A6',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Click on components from the sidebar to start building your form
            </div>
          )}

          {formSchema.fields.map((field, index) => (
            <div
              key={field.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => setSelectedField(field.id)}
              style={{
                border: selectedField === field.id ? '2px solid #2196F3' : '1px solid #ddd',
                padding: 15,
                marginBottom: 10,
                borderRadius: 8,
                background: draggedItem === index ? '#e3f2fd' : '#fafafa',
                cursor: 'move',
                opacity: draggedItem === index ? 0.5 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GripVertical size={18} color="#999" />
                  <strong style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#2C3E50'
                  }}>
                    {field.label}
                  </strong>
                  {field.columnName && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      background: '#E3F2FD',
                      padding: '2px 8px',
                      borderRadius: 4,
                      color: '#1976D2'
                    }}>
                      → {field.columnName}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeField(field.id);
                  }}
                  style={{
                    padding: '6px',
                    color: '#f44336',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ffebee'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <FieldPreview field={field} />
            </div>
          ))}
        </div>
      </div>

      {/* PROPERTIES PANEL */}
      {showProperties && currentField && (
        <PropertiesPanel
          field={currentField}
          onUpdate={(updates) => updateField(currentField.id, updates)}
          onClose={() => setSelectedField(null)}
        />
      )}

      {/* PREVIEW PANEL */}
      {showPreview && (
        <div style={{
          width: 400,
          background: '#fff',
          borderLeft: '1px solid #ddd',
          overflowY: 'auto',
          padding: 20
        }}>
          <h3 style={{ 
            marginTop: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#2C3E50'
          }}>
            Live Preview
          </h3>
          <div style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 20,
            background: '#fafafa'
          }}>
            {formSchema.fields.length === 0 ? (
              <p style={{ 
                color: '#95A5A6', 
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                No fields added yet
              </p>
            ) : (
              <FormPreview fields={formSchema.fields} formId={formSchema.form_id} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- PROPERTIES PANEL ----------------
function PropertiesPanel({ field, onUpdate, onClose }) {
  const hasOptions = ['select', 'radio'].includes(field.type);
  const isContent = ['heading', 'subheading', 'body', 'caption'].includes(field.type);
  const isInput = !isContent && field.type !== 'image';

  const addOption = () => {
    const newOptions = [...field.options, `Option ${field.options.length + 1}`];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...field.options];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <div style={{
      width: 350,
      background: '#fff',
      borderLeft: '1px solid #ddd',
      overflowY: 'auto',
      padding: 20
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ 
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#2C3E50'
        }}>
          Properties
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 5
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Label */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 6, 
          fontWeight: '600', 
          fontSize: '14px',
          color: '#34495E'
        }}>
          Label
        </label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: '14px',
            fontWeight: '400'
          }}
        />
      </div>

      {/* Column Name (for input fields) */}
      {isInput && (
        <div style={{ marginBottom: 15 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 6, 
            fontWeight: '600', 
            fontSize: '14px',
            color: '#34495E'
          }}>
            Database Column Name
          </label>
          <input
            type="text"
            value={field.columnName}
            onChange={(e) => onUpdate({ columnName: e.target.value })}
            placeholder="e.g., user_email, phone_number"
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '14px',
              fontWeight: '400'
            }}
          />
          <small style={{ 
            color: '#7F8C8D', 
            fontSize: '12px',
            fontWeight: '400',
            display: 'block',
            marginTop: '4px'
          }}>
            The database column this field will update
          </small>
        </div>
      )}

      {/* Field Name */}
      {isInput && (
        <div style={{ marginBottom: 15 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 6, 
            fontWeight: '600', 
            fontSize: '14px',
            color: '#34495E'
          }}>
            Field Name
          </label>
          <input
            type="text"
            value={field.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '14px',
              fontWeight: '400'
            }}
          />
        </div>
      )}

      {/* Content (for content fields) */}
      {isContent && (
        <div style={{ marginBottom: 15 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 6, 
            fontWeight: '600', 
            fontSize: '14px',
            color: '#34495E'
          }}>
            Content
          </label>
          <textarea
            value={field.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            rows={4}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: 'inherit'
            }}
          />
        </div>
      )}

      {/* Placeholder (for input fields) */}
      {isInput && !['checkbox', 'radio', 'optin'].includes(field.type) && (
        <div style={{ marginBottom: 15 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 6, 
            fontWeight: '600', 
            fontSize: '14px',
            color: '#34495E'
          }}>
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '14px',
              fontWeight: '400'
            }}
          />
        </div>
      )}

      {/* Required (for input fields) */}
      {isInput && (
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            <span style={{ 
              fontWeight: '600', 
              fontSize: '14px',
              color: '#34495E'
            }}>
              Required Field
            </span>
          </label>
        </div>
      )}

      {/* Options (for select and radio) */}
      {hasOptions && (
        <div style={{ marginBottom: 15 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <label style={{ 
              fontWeight: '600', 
              fontSize: '14px',
              color: '#34495E'
            }}>
              Options
            </label>
            <button
              onClick={addOption}
              style={{
                padding: '5px 10px',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          {field.options.map((option, index) => (
            <div key={index} style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  fontSize: '14px',
                  fontWeight: '400'
                }}
              />
              <button
                onClick={() => removeOption(index)}
                disabled={field.options.length <= 1}
                style={{
                  padding: '5px 10px',
                  background: field.options.length <= 1 ? '#ccc' : '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: field.options.length <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Max Length (for passcode) */}
      {field.type === 'passcode' && (
        <div style={{ marginBottom: 15 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 6, 
            fontWeight: '600', 
            fontSize: '14px',
            color: '#34495E'
          }}>
            Max Length
          </label>
          <input
            type="number"
            value={field.maxLength}
            onChange={(e) => onUpdate({ maxLength: parseInt(e.target.value) })}
            min="1"
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '14px',
              fontWeight: '400'
            }}
          />
        </div>
      )}

      {/* Field Info */}
      <div style={{
        marginTop: 20,
        padding: 15,
        background: '#f5f5f5',
        borderRadius: 6,
        fontSize: '13px',
        fontWeight: '400',
        color: '#34495E'
      }}>
        <div style={{ marginBottom: 8 }}>
          <strong style={{ fontWeight: '600' }}>Field Type:</strong> {field.type}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong style={{ fontWeight: '600' }}>Field ID:</strong> {field.id}
        </div>
        {field.columnName && (
          <div>
            <strong style={{ fontWeight: '600' }}>Maps to Column:</strong> {field.columnName}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- SIDEBAR COMPONENT ----------------
function Sidebar({ title, fields, onAdd }) {
  return (
    <div style={{ width: 380, background: '#fff', padding: 20, borderRight: '1px solid #ddd', overflowY: 'auto' }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: '16px'
      }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {fields.map(field => {
          const Icon = ICONS[field.icon];
          return (
            <button
              key={field.type}
              onClick={() => onAdd(field.type)}
              style={{
                padding: 15,
                borderRadius: 8,
                border: '1px solid #90caf9',
                background: '#e3f2fd',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6
              }}
            >
              {Icon && <Icon size={20} />}
              <span style={{ 
                fontSize: '12px',
                fontWeight: '500',
                color: '#2C3E50'
              }}>
                {field.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- FIELD PREVIEW (Builder) ----------------
function FieldPreview({ field }) {
  const style = { 
    width: '100%', 
    padding: 8, 
    marginTop: 8, 
    pointerEvents: 'none',
    fontSize: '14px',
    fontWeight: '400'
  };

  switch (field.type) {
    case 'heading': 
      return <h1 style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0' }}>{field.content}</h1>;
    case 'subheading': 
      return <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '8px 0' }}>{field.content}</h2>;
    case 'body': 
      return <p style={{ fontSize: '14px', fontWeight: '400', margin: '8px 0' }}>{field.content}</p>;
    case 'caption': 
      return <small style={{ fontSize: '12px', fontWeight: '400', color: '#7F8C8D' }}>{field.content}</small>;
    case 'image': 
      return <div style={{ padding: 40, background: '#eee', marginTop: 8, fontSize: '14px', fontWeight: '500', color: '#95A5A6' }}>Image Placeholder</div>;
    case 'textarea': 
      return <textarea style={style} rows={4} placeholder={field.placeholder} />;
    case 'select':
      return (
        <select style={style}>
          <option>Select...</option>
          {field.options.map((o, i) => <option key={i}>{o}</option>)}
        </select>
      );
    case 'radio':
      return (
        <div style={{ marginTop: 8 }}>
          {field.options.map((o, i) => (
            <label key={i} style={{ display: 'block', marginBottom: 4, fontSize: '14px', fontWeight: '400' }}>
              <input type="radio" name={field.name} /> {o}
            </label>
          ))}
        </div>
      );
    case 'checkbox': 
      return <input type="checkbox" style={{ marginTop: 8 }} />;
    case 'optin': 
      return <label style={{ marginTop: 8, display: 'block', fontSize: '14px', fontWeight: '400' }}><input type="checkbox" /> {field.label}</label>;
    case 'file':
    case 'file-image': 
      return <input type="file" style={style} accept={field.accept} />;
    case 'passcode': 
      return <input type="text" maxLength={field.maxLength} style={style} placeholder={field.placeholder} />;
    default: 
      return <input type={field.type} style={style} placeholder={field.placeholder} />;
  }
}

export default FormBuilder;