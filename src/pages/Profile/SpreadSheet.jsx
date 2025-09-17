// import React, { useEffect, useRef, useState } from 'react';
// import { Download, Upload, Save, RefreshCw, Plus, Trash2 } from 'lucide-react';
// import Spreadsheet from 'x-data-spreadsheet';
// import 'x-data-spreadsheet/dist/xspreadsheet.css';
// import * as XLSX from 'xlsx';
// import axios from 'axios';

// const SpreadsheetComponent = () => {
//     const containerRef = useRef(null);
//     const spreadsheetRef = useRef(null);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [isError, setIsError] = useState(false);

//     // Initialize spreadsheet
//     useEffect(() => {
//         if (containerRef.current && !spreadsheetRef.current) {
//             try {
//                 spreadsheetRef.current = new Spreadsheet(containerRef.current, {
//                     mode: 'edit',
//                     showToolbar: true,
//                     showGrid: true,
//                     view: {
//                         height: () => containerRef.current.clientHeight,
//                         width: () => containerRef.current.clientWidth,
//                     },
//                     row: {
//                         len: 100,
//                         height: 25,
//                     },
//                     col: {
//                         len: 10,
//                         width: 120,
//                         indexWidth: 60,
//                         minWidth: 60,
//                     },
//                 });

//                 // Load initial empty structure
//                 loadInitialData();

//                 // Load data from backend
//                 fetchContacts();

//             } catch (error) {
//                 console.error('Error initializing spreadsheet:', error);
//                 setMessage('Failed to initialize spreadsheet');
//                 setIsError(true);
//             }
//         }

//         return () => {
//             if (spreadsheetRef.current && spreadsheetRef.current.destroy) {
//                 spreadsheetRef.current.destroy();
//                 spreadsheetRef.current = null;
//             }
//         };
//     }, []);

//     // Load initial structure
//     const loadInitialData = () => {
//         if (spreadsheetRef.current) {
//             spreadsheetRef.current.loadData({
//                 name: 'Contacts',
//                 rows: {
//                     0: {
//                         cells: {
//                             0: { text: 'Name' },
//                             1: { text: 'Email' },
//                             2: { text: 'Phone' }
//                         }
//                     }
//                 },
//                 cols: {
//                     0: { width: 200 },
//                     1: { width: 250 },
//                     2: { width: 180 }
//                 }
//             });
//         }
//     };

//     // Fetch contacts from backend
//     const fetchContacts = async () => {
//         setLoading(true);
//         setMessage('');
//         setIsError(false);

//         try {
//             const schemaData = {
//                 "schemaName": "lakshy_76190723",
//                 "tableName": "contacts"
//             }

//             const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`, schemaData);

//             console.log('Response:', response.data);

//             // Fix: Access the contacts data correctly
//             const contacts = response.data.data || response.data || [];
            
//             console.log('Contacts:', contacts);
            
//             loadContactsIntoSpreadsheet(contacts);

//             if (contacts.length > 0) {
//                 setMessage(`Loaded ${contacts.length} contacts`);
//                 setIsError(false);
//             } else {
//                 setMessage('No contacts found');
//                 setIsError(false);
//             }

//         } catch (error) {
//             console.error('Error fetching contacts:', error);
//             setMessage('Failed to load contacts from database');
//             setIsError(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Load contacts into spreadsheet
//     const loadContactsIntoSpreadsheet = (contacts) => {
//         if (!spreadsheetRef.current || !Array.isArray(contacts)) {
//             console.log('Invalid spreadsheet ref or contacts data');
//             return;
//         }

//         const spreadsheetData = {
//             name: 'Contacts',
//             rows: {
//                 0: {
//                     cells: {
//                         0: { text: 'Name' },
//                         1: { text: 'Email' },
//                         2: { text: 'Phone' }
//                     }
//                 }
//             },
//             cols: {
//                 0: { width: 200 },
//                 1: { width: 250 },
//                 2: { width: 180 }
//             }
//         };

//         // Add contact data
//         contacts.forEach((contact, index) => {
//             const rowIndex = index + 1;
//             spreadsheetData.rows[rowIndex] = {
//                 cells: {
//                     0: { text: contact.name || '' },
//                     1: { text: contact.email || '' },
//                     2: { text: contact.phone || '' }
//                 }
//             };
//         });

//         console.log('Loading data into spreadsheet:', spreadsheetData);
//         spreadsheetRef.current.loadData(spreadsheetData);
//     };

//     // Extract contacts from spreadsheet
//     const extractContacts = () => {
//         if (!spreadsheetRef.current) return [];

//         try {
//             const data = spreadsheetRef.current.getData();
//             const contacts = [];

//             if (data && data.rows) {
//                 Object.keys(data.rows).forEach(rowKey => {
//                     const rowIndex = parseInt(rowKey);
//                     if (rowIndex === 0) return; // Skip header

//                     const row = data.rows[rowKey];
//                     if (row && row.cells) {
//                         const name = row.cells[0]?.text || '';
//                         const email = row.cells[1]?.text || '';
//                         const phone = row.cells[2]?.text || '';

//                         if (name.trim()) {
//                             contacts.push({
//                                 name: name.trim(),
//                                 email: email.trim(),
//                                 phone: phone.trim()
//                             });
//                         }
//                     }
//                 });
//             }

//             return contacts;
//         } catch (error) {
//             console.error('Error extracting contacts:', error);
//             return [];
//         }
//     };

//     // Save contacts to backend
//     const saveContacts = async () => {
//         setLoading(true);
//         setMessage('');
//         setIsError(false);

//         try {
//             const contacts = extractContacts();

//             if (contacts.length === 0) {
//                 setMessage('No contacts to save');
//                 setIsError(true);
//                 setLoading(false);
//                 return;
//             }

//             const response = await fetch('/api/contacts', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ contacts })
//             });

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.message || `Save failed: ${response.status}`);
//             }

//             const result = await response.json();
//             setMessage(`Successfully saved ${result.count || contacts.length} contacts`);
//             setIsError(false);

//         } catch (error) {
//             console.error('Error saving contacts:', error);
//             setMessage('Failed to save contacts');
//             setIsError(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Import from Excel/CSV
//     const handleFileImport = (event) => {
//         const file = event.target.files[0];
//         if (!file) return;

//         setLoading(true);
//         setMessage('Importing file...');

//         const reader = new FileReader();

//         reader.onload = (e) => {
//             try {
//                 const data = new Uint8Array(e.target.result);
//                 const workbook = XLSX.read(data, { type: 'array' });
//                 const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//                 const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//                     header: 1,
//                     defval: '',
//                     raw: false
//                 });

//                 if (jsonData.length === 0) {
//                     throw new Error('No data found in file');
//                 }

//                 // Convert to spreadsheet format
//                 const spreadsheetData = {
//                     name: 'Contacts',
//                     rows: {},
//                     cols: {
//                         0: { width: 200 },
//                         1: { width: 250 },
//                         2: { width: 180 }
//                     }
//                 };

//                 jsonData.forEach((row, rowIndex) => {
//                     spreadsheetData.rows[rowIndex] = {
//                         cells: {
//                             0: { text: String(row[0] || '').trim() },
//                             1: { text: String(row[1] || '').trim() },
//                             2: { text: String(row[2] || '').trim() }
//                         }
//                     };
//                 });

//                 spreadsheetRef.current.loadData(spreadsheetData);
//                 setMessage(`Imported ${jsonData.length} rows`);
//                 setIsError(false);

//             } catch (error) {
//                 console.error('Import error:', error);
//                 setMessage('Failed to import file');
//                 setIsError(true);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         reader.onerror = () => {
//             setMessage('Error reading file');
//             setIsError(true);
//             setLoading(false);
//         };

//         reader.readAsArrayBuffer(file);
//         event.target.value = '';
//     };

//     // Export to Excel
//     const exportToExcel = () => {
//         try {
//             const contacts = extractContacts();

//             if (contacts.length === 0) {
//                 setMessage('No data to export');
//                 setIsError(true);
//                 return;
//             }

//             const exportData = [
//                 ['Name', 'Email', 'Phone'],
//                 ...contacts.map(contact => [contact.name, contact.email, contact.phone])
//             ];

//             const worksheet = XLSX.utils.aoa_to_sheet(exportData);
//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

//             const timestamp = new Date().toISOString().slice(0, 10);
//             const filename = `contacts_${timestamp}.xlsx`;

//             XLSX.writeFile(workbook, filename);

//             setMessage(`Exported ${contacts.length} contacts`);
//             setIsError(false);

//         } catch (error) {
//             console.error('Export error:', error);
//             setMessage('Failed to export');
//             setIsError(true);
//         }
//     };

//     // Add rows
//     const addRows = () => {
//         try {
//             const data = spreadsheetRef.current.getData();
//             const lastRowIndex = Math.max(...Object.keys(data.rows || {}).map(Number));

//             // Add 10 empty rows
//             for (let i = 1; i <= 10; i++) {
//                 const newRowIndex = lastRowIndex + i;
//                 spreadsheetRef.current.cell(newRowIndex, 0, '');
//                 spreadsheetRef.current.cell(newRowIndex, 1, '');
//                 spreadsheetRef.current.cell(newRowIndex, 2, '');
//             }

//             setMessage('Added 10 rows');
//             setIsError(false);
//         } catch (error) {
//             console.error('Error adding rows:', error);
//             setMessage('Failed to add rows');
//             setIsError(true);
//         }
//     };

//     // Clear all data
//     const clearAll = () => {
//         if (window.confirm('Clear all data? This won\'t affect the database until you save.')) {
//             loadInitialData();
//             setMessage('Data cleared');
//             setIsError(false);
//         }
//     };

//     return (
//         <div className="h-screen bg-gray-50 flex flex-col px-[6rem] ">
//             {/* Header */}
//             <div className="bg-white border-b border-gray-200  py-4">
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                         <button
//                             onClick={fetchContacts}
//                             disabled={loading}
//                             className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
//                         >
//                             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                             Refresh
//                         </button>

//                         <button
//                             onClick={saveContacts}
//                             disabled={loading}
//                             className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
//                         >
//                             <Save className="w-4 h-4" />
//                             Save to Database
//                         </button>

//                         <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer transition-colors">
//                             <Upload className="w-4 h-4" />
//                             Import
//                             <input
//                                 type="file"
//                                 accept=".xlsx,.xls,.csv"
//                                 onChange={handleFileImport}
//                                 disabled={loading}
//                                 className="hidden"
//                             />
//                         </label>

//                         <button
//                             onClick={exportToExcel}
//                             disabled={loading}
//                             className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
//                         >
//                             <Download className="w-4 h-4" />
//                             Export
//                         </button>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <button
//                             onClick={addRows}
//                             className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
//                         >
//                             <Plus className="w-4 h-4" />
//                             Add Rows
//                         </button>

//                         <button
//                             onClick={clearAll}
//                             className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
//                         >
//                             <Trash2 className="w-4 h-4" />
//                             Clear
//                         </button>
//                     </div>
//                 </div>

//                 {/* Status Message */}
//                 {message && (
//                     <div className={`mt-3 px-4 py-2 rounded-lg text-sm ${isError
//                             ? 'bg-red-50 text-red-700 border border-red-200'
//                             : 'bg-green-50 text-green-700 border border-green-200'
//                         }`}>
//                         {message}
//                     </div>
//                 )}
//             </div>

//             {/* Spreadsheet */}
//             <div className="flex-1 ">
//                 <div className="h-[calc(100%-5rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                     <div
//                         ref={containerRef}
//                         className="w-full h-full"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SpreadsheetComponent;

import React, { useEffect, useRef, useState } from 'react';
import { Download, Upload, Save, RefreshCw, Plus, Trash2 } from 'lucide-react';
import Spreadsheet from 'x-data-spreadsheet';
import 'x-data-spreadsheet/dist/xspreadsheet.css';
import * as XLSX from 'xlsx';
import axios from 'axios';

const SpreadsheetComponent = () => {
    const containerRef = useRef(null);
    const spreadsheetRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState(null);

    // Initialize spreadsheet
    useEffect(() => {
        if (containerRef.current && !spreadsheetRef.current) {
            try {
                spreadsheetRef.current = new Spreadsheet(containerRef.current, {
                    mode: 'edit',
                    showToolbar: true,
                    showGrid: true,
                    view: {
                        height: () => containerRef.current.clientHeight,
                        width: () => containerRef.current.clientWidth,
                    },
                    row: {
                        len: 100,
                        height: 25,
                    },
                    col: {
                        len: 10,
                        width: 120,
                        indexWidth: 60,
                        minWidth: 60,
                    },
                });

                loadInitialData();
                fetchContacts();

            } catch (error) {
                console.error('Error initializing spreadsheet:', error);
                setMessage('Failed to initialize spreadsheet');
                setIsError(true);
            }
        }

        return () => {
            if (spreadsheetRef.current && spreadsheetRef.current.destroy) {
                spreadsheetRef.current.destroy();
                spreadsheetRef.current = null;
            }
        };
    }, []);

    const loadInitialData = () => {
        if (spreadsheetRef.current) {
            spreadsheetRef.current.loadData({
                name: 'Contacts',
                rows: {
                    0: {
                        cells: {
                            0: { text: 'ID' },
                            1: { text: 'Name' },
                            2: { text: 'Email' },
                            3: { text: 'Phone' }
                        }
                    }
                },
                cols: {
                    0: { width: 80 },
                    1: { width: 200 },
                    2: { width: 250 },
                    3: { width: 180 }
                }
            });
        }
    };

    const fetchContacts = async () => {
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const schemaData = {
                "schemaName": "lakshy_76190723",
                "tableName": "contacts"
            };

            const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`, schemaData);
            const contacts = response.data.data || response.data || [];

            loadContactsIntoSpreadsheet(contacts);

            if (contacts.length > 0) {
                setMessage(`Loaded ${contacts.length} contacts`);
            } else {
                setMessage('No contacts found');
            }
            setIsError(false);

        } catch (error) {
            console.error('Error fetching contacts:', error);
            setMessage('Failed to load contacts from database');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const loadContactsIntoSpreadsheet = (contacts) => {
        if (!spreadsheetRef.current || !Array.isArray(contacts)) {
            return;
        }

        const spreadsheetData = {
            name: 'Contacts',
            rows: {
                0: {
                    cells: {
                        0: { text: 'ID' },
                        1: { text: 'Name' },
                        2: { text: 'Email' },
                        3: { text: 'Phone' }
                    }
                }
            },
            cols: {
                0: { width: 80 },
                1: { width: 200 },
                2: { width: 250 },
                3: { width: 180 }
            }
        };

        contacts.forEach((contact, index) => {
            const rowIndex = index + 1;
            spreadsheetData.rows[rowIndex] = {
                cells: {
                    0: { text: contact.id ? String(contact.id) : '' },
                    1: { text: contact.name || '' },
                    2: { text: contact.email || '' },
                    3: { text: contact.phone || '' }
                }
            };
        });

        spreadsheetRef.current.loadData(spreadsheetData);
    };

    const extractContacts = () => {
        if (!spreadsheetRef.current) return [];

        try {
            const data = spreadsheetRef.current.getData();
            const contacts = [];

            if (data && data.rows) {
                Object.keys(data.rows).forEach(rowKey => {
                    const rowIndex = parseInt(rowKey);
                    if (rowIndex === 0) return; // Skip header

                    const row = data.rows[rowKey];
                    if (row && row.cells) {
                        const id = row.cells[0]?.text?.trim() || null;
                        const name = row.cells[1]?.text?.trim() || '';
                        const email = row.cells[2]?.text?.trim() || '';
                        const phone = row.cells[3]?.text?.trim() || '';

                        if (name || email || phone) {
                            contacts.push({
                                id: id && !isNaN(id) && id !== '' ? parseInt(id) : null,
                                name,
                                email,
                                phone
                            });
                        }
                    }
                });
            }

            return contacts;
        } catch (error) {
            console.error('Error extracting contacts:', error);
            return [];
        }
    };

    // SIMPLE SAVE - NO CHANGE DETECTION
    const saveContacts = async () => {
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const allContacts = extractContacts();
            console.log('Saving all contacts:', allContacts);

            const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/contacts/replace-all`, {
                schemaName: "lakshy_76190723",
                tableName: "contacts",
                contacts: allContacts
            });

            const result = response.data;

            if (result.success) {
                await fetchContacts();
                setLastSavedTime(new Date());
                setMessage(`Successfully saved ${allContacts.length} contacts`);
                setIsError(false);
            } else {
                throw new Error(result.message || 'Save failed');
            }

        } catch (error) {
            console.error('Error saving contacts:', error);
            setMessage(`Failed to save contacts: ${error.response?.data?.message || error.message}`);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        setMessage('Importing file...');

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: '',
                    raw: false
                });

                if (jsonData.length === 0) {
                    throw new Error('No data found in file');
                }

                const spreadsheetData = {
                    name: 'Contacts',
                    rows: {},
                    cols: {
                        0: { width: 80 },
                        1: { width: 200 },
                        2: { width: 250 },
                        3: { width: 180 }
                    }
                };

                jsonData.forEach((row, rowIndex) => {
                    if (rowIndex === 0) {
                        spreadsheetData.rows[rowIndex] = {
                            cells: {
                                0: { text: 'ID' },
                                1: { text: 'Name' },
                                2: { text: 'Email' },
                                3: { text: 'Phone' }
                            }
                        };
                    } else {
                        spreadsheetData.rows[rowIndex] = {
                            cells: {
                                0: { text: '' },
                                1: { text: String(row[0] || '').trim() },
                                2: { text: String(row[1] || '').trim() },
                                3: { text: String(row[2] || '').trim() }
                            }
                        };
                    }
                });

                spreadsheetRef.current.loadData(spreadsheetData);
                setMessage(`Imported ${jsonData.length - 1} rows`);
                setIsError(false);

            } catch (error) {
                console.error('Import error:', error);
                setMessage('Failed to import file');
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };

        reader.onerror = () => {
            setMessage('Error reading file');
            setIsError(true);
            setLoading(false);
        };

        reader.readAsArrayBuffer(file);
        event.target.value = '';
    };

    const exportToExcel = () => {
        try {
            const contacts = extractContacts();

            if (contacts.length === 0) {
                setMessage('No data to export');
                setIsError(true);
                return;
            }

            const exportData = [
                ['ID', 'Name', 'Email', 'Phone'],
                ...contacts.map(contact => [contact.id || '', contact.name, contact.email, contact.phone])
            ];

            const worksheet = XLSX.utils.aoa_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `contacts_${timestamp}.xlsx`;

            XLSX.writeFile(workbook, filename);

            setMessage(`Exported ${contacts.length} contacts`);
            setIsError(false);

        } catch (error) {
            console.error('Export error:', error);
            setMessage('Failed to export');
            setIsError(true);
        }
    };

    const addRows = () => {
        try {
            const data = spreadsheetRef.current.getData();
            const lastRowIndex = Math.max(...Object.keys(data.rows || {}).map(Number));

            for (let i = 1; i <= 10; i++) {
                const newRowIndex = lastRowIndex + i;
                spreadsheetRef.current.cell(newRowIndex, 0, '');
                spreadsheetRef.current.cell(newRowIndex, 1, '');
                spreadsheetRef.current.cell(newRowIndex, 2, '');
                spreadsheetRef.current.cell(newRowIndex, 3, '');
            }

            setMessage('Added 10 rows');
            setIsError(false);

        } catch (error) {
            console.error('Error adding rows:', error);
            setMessage('Failed to add rows');
            setIsError(true);
        }
    };

    const clearAll = () => {
        if (window.confirm("Clear all data? This won't affect the database until you save.")) {
            loadInitialData();
            setMessage('Data cleared');
            setIsError(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col px-[6rem]">
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchContacts}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>

                        <button
                            onClick={saveContacts}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                        >
                            <Save className="w-4 h-4" />
                            Save All Data
                        </button>

                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            Import
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileImport}
                                disabled={loading}
                                className="hidden"
                            />
                        </label>

                        <button
                            onClick={exportToExcel}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={addRows}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Rows
                        </button>

                        <button
                            onClick={clearAll}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear
                        </button>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    {message && (
                        <div className={`px-4 py-2 rounded-lg text-sm ${
                            isError
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                            {message}
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        {lastSavedTime && (
                            <div className="text-xs text-gray-500">
                                Last saved: {lastSavedTime.toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="h-[calc(100%-5rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div ref={containerRef} className="w-full h-full" />
                </div>
            </div>
        </div>
    );
};

export default SpreadsheetComponent;