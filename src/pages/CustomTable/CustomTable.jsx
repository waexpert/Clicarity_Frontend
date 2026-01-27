import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import Papa from 'papaparse';

// Hooks
import { useTableData } from './hooks/useTableData';
import { useColumnPreferences } from './hooks/useColumnPreferences';
import { useTableFilters } from './hooks/useTableFilters';
import { usePagination } from './hooks/usePagination';
import { useRecordForm } from './hooks/useRecordForm';
import { useDropdownSetup } from './hooks/useDropdownSetup';

// Components
import TableHeaderSection from './components/TableHeaderSection';
import TableToolbar from './components/TableToolbar';
import TableFilters from './components/TableFilters';
import ColumnVisibilityMenu from './components/ColumnVisibilityMenu';
import DataTable from './components/DataTable';
import RecordFormModal from './components/RecordFormModal';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import ResponsivePagination from './components/Pagination';

// Services & Utils
import { tableApi } from './services/tableApi';
import { generateUsId } from './utils/tableHelpers';
import { logger } from './utils/logger';

// CSS
import '../../css/components/CustomTable.css';

/**
 * Custom Table Component - Main Entry Point
 * Professional, modular table component with full CRUD operations
 */
const CustomTable = ({ type = 'normal' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userData = useSelector((state) => state.user);

  // URL Parameters
  const urlParams = useMemo(() => ({
    pa_id: searchParams.get('pa_id'),
    us_id: searchParams.get('us_id'),
    show: searchParams.get('show'),
    status: searchParams.get('status'),
    process_name: searchParams.get('process_name'),
  }), [searchParams]);

  // API Parameters

// To this (more readable):
const { tableName1: tableNameFromUrl } = useParams();

// Then use it:
const apiParams = useMemo(() => ({
  schemaName: userData.schema_name,
  tableName: tableNameFromUrl ,
  userId: userData.id,
  userEmail: userData.email
}), [userData.schema_name, tableNameFromUrl, userData.id, userData.email]);

  const owner_id = userData?.owner_id ?? userData?.id;

  // State
  const [editEnabled, setEditEnabled] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [counterConfig, setCounterConfig] = useState({
    counter: 0,
    prefix: "",
    isActive: false,
    recordId: null
  });

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Custom Hooks
  const {
    records: allRecords,
    setRecords: setAllRecords,
    originalRecords,
    columns: baseColumns,
    setColumns: setBaseColumns,
    metaData,
    loading,
    refreshData
  } = useTableData(apiParams, type, owner_id);

  const {
    columns,
    setColumns,
    toggleColumnVisibility,
    resetColumnVisibility,
    hideAllColumns,
    visibleColumns
  } = useColumnPreferences(owner_id, apiParams.tableName, apiParams.schemaName, baseColumns);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    priorityFilter,
    filteredRecords,
    uniqueStatuses,
    uniquePriorities,
    toggleStatusFilter,
    togglePriorityFilter,
    clearFilters,
    hasActiveFilters
  } = useTableFilters(originalRecords);

  const {
    currentPage,
    pageSize,
    totalRecords,
    totalPages,
    currentRecords,
    setCurrentPage,
    resetPagination
  } = usePagination(filteredRecords);

  const {
    formData,
    isSubmitting,
    isOpen: isFormOpen,
    handleFieldChange,
    submitForm,
    openForm,
    closeForm
  } = useRecordForm(apiParams, type, refreshData);

  const {
    dropdownSetup,
    columnOrder,
    setupExists: dropdownSetupExists,
    getDropdownOptions,
    hasDropdown
  } = useDropdownSetup(owner_id, apiParams.tableName);

  /**
   * Sync base columns with preference columns
   */
useEffect(() => {
  if (
    baseColumns.length > 0 &&
    columns.length === 0
  ) {
    setColumns(baseColumns);
  }
}, [baseColumns]);

  /**
   * Handle search from URL params
   */
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(decodeURIComponent(searchQuery));
    }
  }, [searchParams, setSearchTerm]);

  /**
   * Auto-open form modal if show=true
   */
  useEffect(() => {
    if (urlParams.show === 'true' && columns.length > 0) {
      handleOpenAddModal();
    }
  }, [urlParams.show, columns]);

  /**
   * Handle counter update from WorkflowCounter
   */
  const handleCounterUpdate = useCallback((config) => {
    setCounterConfig(config);
    logger.debug('Counter config updated:', config);
  }, []);

  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(() => {
    refreshData();
    clearFilters();
    resetPagination();
    toast.success('Data refreshed');
  }, [refreshData, clearFilters, resetPagination]);

  /**
   * Handle search input
   */
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    resetPagination();
  }, [setSearchTerm, resetPagination]);

  /**
   * Handle sort
   */
  const handleSort = useCallback((columnId) => {
    if (sortColumn === columnId) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }

    const sortedRecords = [...filteredRecords].sort((a, b) => {
      const valueA = a[columnId] || '';
      const valueB = b[columnId] || '';

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }
    });

    setAllRecords(sortedRecords);
  }, [sortColumn, sortDirection, filteredRecords, setAllRecords]);

  /**
   * Export to CSV
   */
  const handleExportCSV = useCallback(() => {
    if (!filteredRecords.length) {
      toast.error('No records to export');
      return;
    }

    try {
      const exportData = filteredRecords.map(record => {
        const filteredRecord = {};
        visibleColumns.forEach(column => {
          filteredRecord[column.name] = record[column.id];
        });
        return filteredRecord;
      });

      const csv = Papa.unparse(exportData, {
        quotes: true,
        quoteChar: '"',
        delimiter: ",",
        header: true
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      const filename = `${apiParams.tableName}_export_${date}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${exportData.length} records to CSV`);
    } catch (error) {
      logger.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  }, [filteredRecords, visibleColumns, apiParams.tableName]);

  /**
   * Handle open add modal
   */
  const handleOpenAddModal = useCallback(async () => {
    const initialData = {};

    // Pre-fill from URL params
    columns.forEach(column => {
      if (urlParams[column.id]) {
        initialData[column.id] = urlParams[column.id];
      } else if (column.id === 'us_id') {
        initialData[column.id] = counterConfig.isActive
          ? `${counterConfig.prefix}${counterConfig.counter}`
          : generateUsId();
      } else {
        initialData[column.id] = '';
      }
    });

    openForm(initialData);

    // Clear show param
    if (urlParams.show === 'true') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('show');
      setSearchParams(newParams, { replace: true });
    }
  }, [columns, urlParams, counterConfig, openForm, searchParams, setSearchParams]);

  /**
   * Handle create record
   */
  const handleCreateRecord = useCallback(async () => {
    try {
      // Add balance calculation if process_name exists
      let additionalData = {};

      if (urlParams.process_name) {
        const balanceFieldName = `${urlParams.process_name}_balance`;
        const quantityField = columns.find(col =>
          col.id.toLowerCase().includes('quantity')
        );

        if (quantityField) {
          const quantity = formData[quantityField.id];
          if (quantity) {
            additionalData[balanceFieldName] = quantity;
          }
        }
      }

      // Add PA_ID separator if needed
      if ((urlParams.status && urlParams.pa_id) || (urlParams.process_name && urlParams.pa_id)) {
        additionalData.us_id = `${urlParams.pa_id} -S- ${formData.us_id}`;
      }

      await submitForm(additionalData);

      // Increment counter if active
      if (counterConfig.isActive && counterConfig.recordId) {
        try {
          await tableApi.updateRecord(
            { schemaName: 'public', tableName: 'counter_setup' },
            counterConfig.recordId,
            owner_id,
            { counter: counterConfig.counter + 1 }
          );

          setCounterConfig(prev => ({
            ...prev,
            counter: prev.counter + 1
          }));
        } catch (error) {
          logger.error('Counter increment failed:', error);
          toast.warning('Record created but counter increment failed');
        }
      }

      // Clear URL params
      setSearchParams({});

    } catch (error) {
      logger.error('Create record failed:', error);
    }
  }, [formData, columns, urlParams, counterConfig, submitForm, owner_id, setSearchParams]);

  /**
   * Handle delete click
   */
  const handleDeleteClick = useCallback((record) => {
    setRecordToDelete(record);
    setDeleteConfirmInput('');
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle delete confirm
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!recordToDelete || deleteConfirmInput.trim() !== recordToDelete.us_id) {
      toast.error('Entered us_id does not match');
      return;
    }

    try {
      setIsDeleting(true);
      await tableApi.deleteRecord(apiParams, recordToDelete.id);
      toast.success('Record deleted successfully');
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
      setDeleteConfirmInput('');
      refreshData();
    } catch (error) {
      logger.error('Delete failed:', error);
      toast.error('Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  }, [recordToDelete, deleteConfirmInput, apiParams, refreshData]);

  /**
   * Handle save record (inline edit)
   */
  const handleSaveRecord = useCallback(async (recordId, updates) => {
    try {
      // Filter out unchanged values
      const originalRecord = originalRecords.find(r => r.id === recordId);
      const changes = {};

      Object.entries(updates).forEach(([key, val]) => {
        if (val !== originalRecord[key] && key !== 'id' && key !== 'pa_id' && key !== 'us_id') {
          changes[key] = val;
        }
      });

      if (Object.keys(changes).length === 0) {
        toast.warning('No changes to save');
        return;
      }

      await tableApi.updateRecord(apiParams, recordId, owner_id, changes);
      toast.success('Record updated successfully');
      refreshData();
    } catch (error) {
      logger.error('Update failed:', error);
      toast.error('Failed to update record');
    }
  }, [originalRecords, apiParams, owner_id, refreshData]);

  // Don't render if show=true (modal will handle it)
  if (urlParams.show === 'true') return null;

  return (
    <Card className="tableCard shadow-sm border-slate-200 mx-[6rem]">
      <CardHeader className="pb-3">
        <TableHeaderSection
          title="All Records"
          description="View and manage all database records"
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          tableName={apiParams.tableName}
          onCounterUpdate={handleCounterUpdate}
          urlParams={urlParams}
          dropdownSetupExists={dropdownSetupExists}
          columnOrderExists={Object.keys(columnOrder).length > 0}
        />
      </CardHeader>

      <CardContent>
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <TableToolbar
              onRefresh={handleRefresh}
              onAddRecord={handleOpenAddModal}
              onExportCSV={handleExportCSV}
              onToggleEdit={() => setEditEnabled(!editEnabled)}
              editEnabled={editEnabled}
              canEdit={userData.owner_id === null}
              isLoading={loading}
            />

            <TableFilters
              uniqueStatuses={uniqueStatuses}
              uniquePriorities={uniquePriorities}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onToggleStatus={toggleStatusFilter}
              onTogglePriority={togglePriorityFilter}
              onClearStatusFilter={() => toggleStatusFilter([])}
              onClearPriorityFilter={() => togglePriorityFilter([])}
            />

            <ColumnVisibilityMenu
              columns={columns}
              onToggleColumn={toggleColumnVisibility}
              onResetVisibility={resetColumnVisibility}
              onHideAll={hideAllColumns}
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          records={currentRecords}
          columns={columns}
          loading={loading}
          editEnabled={editEnabled}
          canDelete={userData.owner_id === null}
          onSort={handleSort}
          onDeleteRecord={handleDeleteClick}
          onSaveRecord={handleSaveRecord}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          emptyMessage={hasActiveFilters ? 'No records match filters' : 'No records found'}
          onClearFilters={hasActiveFilters ? clearFilters : null}
        />

        {/* Pagination */}
        <ResponsivePagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </CardContent>

      {/* Add/Edit Record Modal */}
      <RecordFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleCreateRecord}
        formData={formData}
        onFieldChange={handleFieldChange}
        columns={columns}
        metaData={metaData}
        dropdownSetup={dropdownSetup}
        columnOrder={columnOrder}
        processName={urlParams.process_name}
        isSubmitting={isSubmitting}
        mode="create"
      />

{/* <RecordFormModal
  isOpen={isFormOpen}
  onClose={closeForm}
  onSubmit={handleCreateRecord}
  formData={formData}
  onFieldChange={handleFieldChange}
  columns={columns}
  metaData={metaData}
  dropdownSetup={dropdownSetup}
  columnOrder={columnOrder}
  processName={urlParams.process_name}
  isSubmitting={isSubmitting}
  mode="create"
/> */}
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        record={recordToDelete}
        confirmInput={deleteConfirmInput}
        onConfirmInputChange={setDeleteConfirmInput}
        isDeleting={isDeleting}
      />
    </Card>
  );
};

export default CustomTable;