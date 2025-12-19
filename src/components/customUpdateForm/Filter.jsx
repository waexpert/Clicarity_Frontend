import React, { useState, useEffect, use } from 'react';
import { X, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import '../../css/components/Filter.css';
import { se } from 'date-fns/locale/se';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { set } from 'date-fns/set';

const Filter = ({
    isOpen,
    onClose,
    columns = [],
    visibleColumns = [],
    onApplyFilter,
    tableName,
    setSelectedColumns,
    selectedColumns
}) => {
    // const [selectedColumns, setSelectedColumns] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [setupExists, setSetupExists] = useState(false);
    const [setupData, setSetupData] = useState(null);

    console.log(selectedColumns);
    const userData = useSelector((state) => state.user);
const owner_id = userData.owner_id === null ? userData.id : userData.owner_id;
    const user = useSelector((state) => state.user);


const [isInitialized, setIsInitialized] = useState(false);

useEffect(() => {
    const fetchSetupData = async () => {
        try {
            const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`;
            const { data } = await axios.get(route);
            
            if (data.exists && data.setup) {
                setSetupExists(true);
                setSetupData(data.setup);
                setSelectedColumns(Array.isArray(data.setup.filter_form_columns) ? data.setup.filter_form_columns : []);
            } else {
                setSetupExists(false);
                // Set default columns if no setup exists
                if (visibleColumns.length > 0) {
                    setSelectedColumns(visibleColumns);
                } else if (columns.length > 0) {
                    setSelectedColumns(columns.map(col => col.name || col));
                }
            }
            setIsInitialized(true);
        } catch (err) {
            console.error('Error fetching setup:', err);
            setSetupExists(false);
            // Set default on error
            if (visibleColumns.length > 0) {
                setSelectedColumns(visibleColumns);
            } else if (columns.length > 0) {
                setSelectedColumns(columns.map(col => col.name || col));
            }
            setIsInitialized(true);
        }
    };
    
    fetchSetupData();
}, [user.id, tableName]);

const saveFilter = async (cols) => {
  const route = `${import.meta.env.VITE_APP_BASE_URL}/data/createRecord`;
  const payload = {
    "schemaName": "public",
    "tableName": "dropdown_setup",
    "record": {
      "owner_id": owner_id,
      "product_name": tableName,
      "us_id":`${owner_id}_${tableName}`,
      "filter_form_columns": JSON.stringify(cols) // Use 'cols' parameter, not 'selectedColumns'
    }
  }
  
  try {
    const result = await axios.post(route, payload); // Add 'await'
    console.log("✅ Filter saved:", result);
  } catch (error) {
    console.error("❌ Error saving filter:", error);
  }
}

    // Format column name for display - MOVED TO TOP
    const formatColumnName = (columnName) => {
        return columnName
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    };

    // Initialize selected columns when component mounts or columns change
    // useEffect(() => {
    //     if (visibleColumns.length > 0) {
    //         setSelectedColumns(visibleColumns);
    //     } else if (columns.length > 0) {
    //         // By default, select all columns
    //         setSelectedColumns(columns.map(col => col.name || col));
    //     }
    // }, [columns, visibleColumns]);

    // Handle individual checkbox toggle
    const handleToggleColumn = (columnName) => {
        setSelectedColumns(prev => {
            if (prev.includes(columnName)) {
                return prev.filter(col => col !== columnName);
            } else {
                return [...prev, columnName];
            }
        });
    };

    // Filter columns based on search query - MOVED AFTER formatColumnName
    const filteredColumns = columns.filter(col => {
        const columnName = col.name || col;
        const displayName = formatColumnName(columnName);
        return displayName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Handle select all
    const handleSelectAll = () => {
        const allColumnNames = filteredColumns.map(col => col.name || col);
        setSelectedColumns(allColumnNames);
    };

    // Handle deselect all
    const handleDeselectAll = () => {
        setSelectedColumns([]);
    };

    // Handle apply filter
    const handleApply = () => {
        onApplyFilter(selectedColumns);
        saveFilter(selectedColumns);
        onClose();
    };

    // Handle reset to default (all columns visible)
    const handleReset = () => {
        const allColumnNames = columns.map(col => col.name || col);
        setSelectedColumns(allColumnNames);
    };

    // Check if all filtered columns are selected
    const allSelected = filteredColumns.length > 0 &&
        filteredColumns.every(col => selectedColumns.includes(col.name || col));

    // Check if some but not all filtered columns are selected
    const someSelected = filteredColumns.some(col => selectedColumns.includes(col.name || col)) && !allSelected;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="filter-sheet">
                <SheetHeader>
                    <SheetTitle className="filter-title">
                        Column Visibility
                    </SheetTitle>
                    <SheetDescription className="filter-description">
                        Select which columns you want to display in the table
                    </SheetDescription>
                </SheetHeader>

                <div className="filter-content">
                    {/* Search Input */}
                    <div className="filter-search">
                        <Search className="icon icon-sm icon-secondary search-icon" />
                        <Input
                            type="text"
                            placeholder="Search columns..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="clear-search-btn"
                                aria-label="Clear search"
                            >
                                <X className="icon icon-xs" />
                            </button>
                        )}
                    </div>

                    {/* Select/Deselect All */}
                    <div className="filter-actions">
                        <div className="select-all-wrapper">
                            <Checkbox
                                id="select-all"
                                checked={allSelected}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        handleSelectAll();
                                    } else {
                                        handleDeselectAll();
                                    }
                                }}
                                className={someSelected ? 'checkbox-indeterminate' : ''}
                            />
                            <Label htmlFor="select-all" className="select-all-label">
                                Select All ({selectedColumns?.length}/{columns.length})
                            </Label>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="reset-btn"
                        >
                            Reset
                        </Button>
                    </div>

                    {/* Column List */}
                    <ScrollArea className="filter-scroll-area">
                        <div className="column-list">
                            {filteredColumns.length > 0 ? (
                                filteredColumns.map((column) => {
                                    const columnName = column.name || column;
                                    const displayName = formatColumnName(columnName);
                                    const isChecked = selectedColumns.includes(columnName);

                                    return (
                                        <div key={columnName} className="column-item">
                                            <Checkbox
                                                id={`column-${columnName}`}
                                                checked={isChecked}
                                                onCheckedChange={() => handleToggleColumn(columnName)}
                                            />
                                            <Label
                                                htmlFor={`column-${columnName}`}
                                                className="column-label"
                                            >
                                                {displayName}
                                            </Label>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-results">
                                    <p>No columns found matching "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <SheetFooter className="filter-footer">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="cancel-btn"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="apply-btn"
                        disabled={selectedColumns.length === 0}
                    >
                        Apply ({selectedColumns.length})
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default Filter;