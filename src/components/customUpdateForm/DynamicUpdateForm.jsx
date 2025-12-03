import React from 'react'
import RecordDetails from './RecordDetails'
import { Button } from '../ui/button'
import '../../css/components/fixedUpdateForm.css'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DynamicUpdateForm = ({ data, loading, visibleColumns,selectedColumns }) => {
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
  
  console.log("Original Data:", data);
  console.log("Column Names:", visibleColumns);
  console.log("Filtered Data:", filteredData);
  
  return (
    <div className="">
      <RecordDetails data={filteredData} loading={loading} selectedColumns={selectedColumns}/>
      <div className="action-buttons">
        <Button 
          className="button" 
          onClick={() => {
            navigate(`/status-update?schemaName=${schemaName}&current_process=${data?.status}&tableName=leadstatus&recordId=` + data?.id);
          }}
          disabled={loading || !data}
          aria-label="Search for lead status"
        >
          Move to Next Stage Dynamic
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

export default DynamicUpdateForm