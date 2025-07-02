import React from 'react'
import CustomTable from '../components/CustomTable'

const Testing = () => {
  return (
    <CustomTable apiParams={{
        "schemaName": "public",
        "tableName": "users"
    }}/>
  )
}

export default Testing