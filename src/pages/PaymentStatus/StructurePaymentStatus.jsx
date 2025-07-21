import React, { useState } from 'react'
import LeadStatusReportDataStore from './PaymentStatusReportDataStore'
import CaptureWebhook from './CaptureWebhook'
  import { useLocation } from 'react-router-dom';

const StructurePaymentStatus = () => {
  const [columnFields,setColumnFields] = useState([]);
  const location = useLocation();

  const splittedArray = location.pathname.split('/');
  console.log(splittedArray)
  console.log(location)
  const column = splittedArray[splittedArray.length-1];
  return (
    <div style={{display:"flex"}}>
        <LeadStatusReportDataStore columnFields={columnFields}/>
        <CaptureWebhook setColumnFields={setColumnFields} columnName={`in_${column}_webhook`}/>
    </div>
  )
}

export default StructurePaymentStatus