import React from 'react'
import CustomTable from '../../components/CustomTable'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
const RecordPaymentDashboard = () => {

 const userData = useSelector((state) => state.user)
const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const firstSegment = pathSegments[1]
  console.log(userData);
  return (
<CustomTable apiParams={{
  "schemaName":`${userData.schema_name}`,
  "tableName":`${firstSegment}`
}}/>
  )
}

export default RecordPaymentDashboard;