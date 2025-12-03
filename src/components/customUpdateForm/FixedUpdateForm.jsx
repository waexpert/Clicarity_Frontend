import React from 'react'
import RecordDetails from './RecordDetails'
import { Button } from '../ui/button'
import '../../css/components/fixedUpdateForm.css'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';



const FixedUpdateForm = ({ data, loading, visibleColumns,setupData,tableName,selectedColumns }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const schemaName = userData?.schema_name || 'default_schema';
  
  // Filter data to keep only keys that exist in visibleColumns
  const filteredData = React.useMemo(() => {
    if (!data || !visibleColumns || visibleColumns.length === 0) {
      return data;
    }
    
    return Object.keys(data)
      .filter(key => visibleColumns.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
  }, [data, visibleColumns]);
  

  const handleUpdateRecord = async () =>{
    const updateRecord = `${import.meta.env.VITE_APP_BASE_URL}/data/updateMultiple`;
    const processSteps = setupData?.process_steps || []; 
    const currentStatusIndex = processSteps.indexOf(data?.status)
    const params = new URLSearchParams({
      schemaName,
      tableName,
      recordId: data?.id,
      ownerId: 'bde74e9b-ee21-4687-8040-9878b88593fb',
      col1: 'status',
      val1: currentStatusIndex-1 < processSteps.length-2 ? processSteps[currentStatusIndex + 1] : data?.status,
    });


   try{

    const response = await axios.get(`${updateRecord}?${params.toString()}`)
    console.log("Update Response:", response.data);
    window.location.reload();

   }catch(err){
    console.error("Error updating record:", err);
   }
  }
  console.log("Original Data:", data);
  console.log("Column Names:", visibleColumns);
  console.log("Filtered Data:", filteredData);
  console.log("setupData:", setupData)
  return (
    <div className="">
      <RecordDetails data={filteredData} loading={loading} selectedColumns={selectedColumns}/>
      <div className="action-buttons">
        <Button 
          className="button" 
          onClick={() => {
            // navigate(`/status-update?schemaName=${schemaName}&tableName=leadstatus&recordId=` + data?.id);
            handleUpdateRecord()
          }}
          disabled={loading || !data}
          aria-label="Search for lead status"
        >
          Move to Next Stage Fixed
        </Button>
        <Button 
          className="button" 
          onClick={() => console.log('Add Comment clicked')}
          aria-label="Search for lead status"
          disabled={loading || !data}
        >
          Add Comment
        </Button>
      </div>
    </div>
  )
}

export default FixedUpdateForm
