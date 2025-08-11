import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import CustomCaptureWebhook from './CustomCaptureWebhook';
import CustomReportDataStore from './CustomReportDataStore';

const CustomStructure = () => {
  const [columnFields,setColumnFields] = useState([]);
  const location = useLocation();

  const splittedArray = location.pathname.split('/');
  console.log(splittedArray)
  console.log(location)
  const column = splittedArray[splittedArray.length-1];
  return (
    <div style={{display:"flex"}} className='w-full px-6 py-6'>
        <CustomReportDataStore columnFields={columnFields}/>
        <CustomCaptureWebhook setColumnFields={setColumnFields} columnName={`in_${column}_webhook`}/>
    </div>
  )
}

export default CustomStructure