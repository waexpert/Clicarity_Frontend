import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import '../../css/components/RecordDetails.css';

const RecordDetails = ({data , loading ,visibleColumns,selectedColumns}) => {
  const [error, setError] = useState(null);

  // Format field names to be more readable
  const formatFieldName = (fieldName) => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatValue = (value, key) => {
    if (value === null || value === undefined || value === '') {
      return <span className="empty-value">Not set</span>;
    }

    if (key === 'status') {
      return (
        <Badge className={`status-badge status-${value.toLowerCase()}`}>
          {value}
        </Badge>
      );
    }

if (key.includes('date') && value && value !== '') {
  try {
    return new Date(value).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return value;
  }
}

    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    return value;
  };

  // Loading state
  if (loading) {
    return (
      <div className="record-details-container">
        <Card>
          <CardHeader>
            <Skeleton className="loading-title" />
          </CardHeader>
          <CardContent>
            <div className="table-wrapper">
              <table className="record-table">
                <thead>
                  <tr>
                    <th>Column Name</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <tr key={i}>
                      <td><Skeleton className="loading-field" /></td>
                      <td><Skeleton className="loading-value" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="record-details-container">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading data: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="record-details-container">
        <Alert>
          <AlertDescription>
            No data found for the specified record.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

const allFields = Object.keys(data || {});

  console.log("fields in RecordDetails:", allFields);
  console.log("Visible Columns in RecordDetails:", visibleColumns);
  console.log("Selected Columns in RecordDetails:", selectedColumns);

  // 🔹 Start with all fields
  let fieldsToShow = allFields;

  // 🔹 If visibleColumns is passed, filter by it
  if (Array.isArray(visibleColumns) && visibleColumns.length > 0) {
    fieldsToShow = fieldsToShow.filter(key => visibleColumns.includes(key));
  }

  // 🔹 Then intersect with selectedColumns
  if (Array.isArray(selectedColumns) && selectedColumns.length > 0) {
    fieldsToShow = fieldsToShow.filter(key => selectedColumns.includes(key));
  }

  
  return (
  
    <div className="">
      <Card className="record-details-card">
        <CardHeader className="record-details-header">
          <CardTitle className="record-details-title">Details</CardTitle>
          <p className="record-details-subtitle">
            ID: {data.us_id || data.id}
          </p>
        </CardHeader>
        <CardContent className="record-details-content">
          <div className="table-wrapper">
            <table className="record-table">
              <thead>
                <tr>
                  <th>Column Name</th>
                  <th>Value</th>
                </tr>
              </thead>
<tbody>
  {fieldsToShow.map((key) => (
    <tr key={key}>
      <td className="column-name">{formatFieldName(key)}</td>
      <td className="column-value">{formatValue(data[key], key)}</td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordDetails;