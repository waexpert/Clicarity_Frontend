import React, { useCallback, useEffect, useState } from 'react'
import SearchBox from './components/SearchBox'
import SelectForm from './components/SelectForm'
import FormViewer from '../FormBuilder/FormViewer'
import { Button } from '../../components/ui/button'
import { useSelector } from 'react-redux'
import axios from 'axios'
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const SmartActions = () => {
    const [formId,setFormId] = useState('');
    const [formSchema,setFormSchema] = useState([]);
    const [submit,setSubmit] = useState(false);
    const [recordId,setRecordId] = useState('');
    const [usId,setUsId] = useState('');

    const userData = useSelector((state) => state.user);
    const schemaName = userData.schema_name;
    const tableName = formSchema?.table_name

    const fetchRecordByTarget = useCallback(async (targetColumn, targetValue) => {
        const { data } = await axios.post(`${BASE_URL}/data/getRecordByTarget`, {
            schemaName,
            tableName: tableName,
            targetColumn,
            targetValue,
            userId: userData.id,
            userEmail: userData.email
        });
        return data;
    }, [schemaName,tableName, userData.id, userData.email]);

useEffect(() => {
    if (!usId || !tableName) return; // guard: don't fetch if values aren't ready

    const fetchRecord = async () => {
        try {
            const result = await fetchRecordByTarget('us_id', usId); // await + no destructure
            console.log("data", result);
            console.log("us_id", usId);
            setRecordId(result?.id ?? result?.[0]?.id);
        } catch (err) {
            console.error('Failed to fetch record:', err);
        }
    };

    fetchRecord();
}, [usId, tableName]);

const handleSubmit = () => {
  setSubmit(true);

  setTimeout(() => {
    window.location.reload();
  }, 2000);
};

    return (
        <div style={{
            maxWidth: '500px',
            margin: '10px auto',
            padding: '30px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '8px'
        }}>
            <div className="bg-[var(--color-primary)] flex items-center justify-center -mx-[30px] mb-4">
                <h2 className='text-2xl font-semibold text-center py-2 !text-white'>Smart Actions</h2>
            </div>

            <SearchBox setRecordId={setRecordId} setUsId={setUsId}/>
            <SelectForm setFormId={setFormId} setFormSchema={setFormSchema} />
            <FormViewer prop_form_id={formId} formData={formSchema} submit={submit} recordId={recordId}/>
            <Button onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    )
}

export default SmartActions