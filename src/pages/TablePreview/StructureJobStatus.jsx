import React, { useState } from 'react'
import JobStatusReportDataStore from '../../components/JobStatusReportDataStore'
import CaptureWebhook from '../../components/CaptureWebhook'
  import { useLocation } from 'react-router-dom';

const StructureJobStatus = () => {
  const [columnFields,setColumnFields] = useState([]);
  const location = useLocation();

  const splittedArray = location.pathname.split('/');
  console.log(splittedArray)
  console.log(location)
  const column = splittedArray[splittedArray.length-1];
  return (
    <div style={{display:"flex"}}>
        <JobStatusReportDataStore columnFields={columnFields}/>
        <CaptureWebhook setColumnFields={setColumnFields} columnName={`in_${column}_webhook`}/>
    </div>
  )
}

export default StructureJobStatus