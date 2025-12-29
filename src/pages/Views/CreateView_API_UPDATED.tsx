/**
 * Updated CreateView Component - WITH WORKING API INTEGRATION
 *
 * CHANGES MADE:
 * 1. Import API service functions
 * 2. Replace all fetch calls with API service calls
 * 3. Add proper error handling and user feedback
 * 4. Add validation before saving
 *
 * TO USE: Replace the existing CreateView.tsx with this file
 */

import React, { useState, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Save, Play, ArrowLeft, Plus, Trash2, Table, Users, Download } from 'lucide-react'

// Import shadcn/ui components
import { Button } from '../../components/ui/button'
import { Checkbox } from '../../components/ui/checkbox'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'

// Import API service - NEW!
import * as viewsApi from '../../api/viewsApi'

import "../../css/pages/Views/CreateViews.css"

// TypeScript interfaces
interface Column {
  name: string
  type: string
}

interface TableData {
  name: string
  columns: Column[]
}

interface SelectedColumn {
  key: string
  table: string
  column: string
  alias: string
  type: string
}

interface Join {
  id: number
  leftTable: string
  rightTable: string
  leftColumn: string
  rightColumn: string
  joinType: string
}

interface WhereCondition {
  id: number
  column: string
  operator: string
  value: string
  logicalOperator?: 'AND' | 'OR'
}

interface TeamMember {
  id: string
  name: string
  email: string
}

const CreateView = () => {
  // Route parameters
  const { viewId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isNewView = viewId === 'new'
  const folder = searchParams.get('folder')

  // View metadata
  const [viewName, setViewName] = useState('')
  const [sqlViewName, setSqlViewName] = useState('')
  const [description, setDescription] = useState('')

  // Table and column selection
  const [availableTables, setAvailableTables] = useState<TableData[]>([])
  const [selectedTables, setSelectedTables] = useState<TableData[]>([])
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumn[]>([])

  // Query building
  const [joins, setJoins] = useState<Join[]>([])
  const [whereConditions, setWhereConditions] = useState<WhereCondition[]>([])

  // Team members
  const [availableTeamMembers, setAvailableTeamMembers] = useState<TeamMember[]>([])
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])

  // Preview and SQL
  const [previewData, setPreviewData] = useState<any>(null)
  const [generatedSQL, setGeneratedSQL] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Load data when component mounts
   */
  useEffect(() => {
    fetchAvailableTables()
    fetchTeamMembers()
    if (!isNewView) {
      fetchViewData()
    }
  }, [viewId])

  /**
   * Fetch all available database tables - UPDATED WITH API
   */
  const fetchAvailableTables = async () => {
    try {
      setIsLoading(true)
      const data = await viewsApi.fetchTables()
      setAvailableTables(data)
    } catch (error) {
      console.error('Error fetching tables:', error)
      alert('Failed to load tables. Please refresh the page.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fetch team members - UPDATED WITH API
   */
  const fetchTeamMembers = async () => {
    try {
      const data = await viewsApi.fetchTeamMembers()
      setAvailableTeamMembers(data)
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  /**
   * Load existing view data - UPDATED WITH API
   */
  const fetchViewData = async () => {
    try {
      setIsLoading(true)
      const data = await viewsApi.fetchView(viewId!)

      setViewName(data.name)
      setSqlViewName(data.sql_view_name)
      setDescription(data.description || '')
      setSelectedTables(data.selected_tables)
      setSelectedColumns(data.selected_columns)
      setJoins(data.joins)
      setWhereConditions(data.where_conditions)
      setSelectedTeamMembers(data.team_members)
    } catch (error) {
      console.error('Error fetching view:', error)
      alert('Failed to load view data')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle dropping a table
   */
  const handleTableDrop = (table: TableData) => {
    if (!selectedTables.find(t => t.name === table.name)) {
      setSelectedTables([...selectedTables, table])
    }
  }

  /**
   * Toggle column selection
   */
  const handleColumnSelect = (table: TableData, column: Column) => {
    const columnKey = `${table.name}.${column.name}`
    const existing = selectedColumns.find(c => c.key === columnKey)

    if (existing) {
      setSelectedColumns(selectedColumns.filter(c => c.key !== columnKey))
    } else {
      setSelectedColumns([...selectedColumns, {
        key: columnKey,
        table: table.name,
        column: column.name,
        alias: column.name,
        type: column.type
      }])
    }
  }

  /**
   * Add a join
   */
  const addJoin = () => {
    if (selectedTables.length >= 2) {
      setJoins([...joins, {
        id: Date.now(),
        leftTable: selectedTables[0].name,
        rightTable: selectedTables[1].name,
        leftColumn: '',
        rightColumn: '',
        joinType: 'INNER'
      }])
    }
  }

  /**
   * Update join
   */
  const updateJoin = (id: number, field: string, value: string) => {
    setJoins(joins.map(j => j.id === id ? { ...j, [field]: value } : j))
  }

  /**
   * Remove join
   */
  const removeJoin = (id: number) => {
    setJoins(joins.filter(j => j.id !== id))
  }

  /**
   * Add WHERE condition
   */
  const addWhereCondition = () => {
    setWhereConditions([...whereConditions, {
      id: Date.now(),
      column: '',
      operator: '=',
      value: '',
      logicalOperator: 'AND'
    }])
  }

  /**
   * Update WHERE condition
   */
  const updateWhereCondition = (id: number, field: string, value: string) => {
    setWhereConditions(whereConditions.map(w =>
      w.id === id ? { ...w, [field]: value } : w
    ))
  }

  /**
   * Remove WHERE condition
   */
  const removeWhereCondition = (id: number) => {
    setWhereConditions(whereConditions.filter(w => w.id !== id))
  }

  /**
   * Toggle team member
   */
  const handleTeamMemberToggle = (memberId: string) => {
    if (selectedTeamMembers.includes(memberId)) {
      setSelectedTeamMembers(selectedTeamMembers.filter(id => id !== memberId))
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, memberId])
    }
  }

  /**
   * Generate SQL
   */
  const generateSQL = () => {
    const selectClause = selectedColumns.length > 0
      ? selectedColumns.map(c => `${c.table}.${c.column} AS ${c.alias}`).join(',\n    ')
      : '*'

    const fromClause = selectedTables.length > 0 ? selectedTables[0].name : ''

    const joinClauses = joins.map(j =>
      `${j.joinType} JOIN ${j.rightTable} ON ${j.leftTable}.${j.leftColumn} = ${j.rightTable}.${j.rightColumn}`
    ).join('\n')

    let whereClause = ''
    if (whereConditions.length > 0) {
      const conditions = whereConditions.map((w, index) => {
        const condition = `${w.column} ${w.operator} '${w.value}'`
        if (index === 0) return condition
        return `  ${w.logicalOperator || 'AND'} ${condition}`
      }).join('\n')
      whereClause = `WHERE ${conditions}`
    }

    const sql = `CREATE OR REPLACE VIEW ${sqlViewName} AS
SELECT
    ${selectClause}
FROM ${fromClause}
${joinClauses}
${whereClause};`

    setGeneratedSQL(sql)
    return sql
  }

  /**
   * Preview view - UPDATED WITH API
   */
  const handlePreview = async () => {
    try {
      setIsLoading(true)
      const sql = generateSQL()
      const data = await viewsApi.previewView(sql)
      setPreviewData(data)
    } catch (error: any) {
      console.error('Error previewing view:', error)
      alert('Error previewing view: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Save view - UPDATED WITH API
   */
  const handleSave = async () => {
    // Validation
    if (!viewName.trim()) {
      alert('Please enter a view name')
      return
    }
    if (!sqlViewName.trim()) {
      alert('Please enter a SQL view name')
      return
    }
    if (selectedColumns.length === 0) {
      alert('Please select at least one column')
      return
    }

    try {
      setIsLoading(true)
      const sql = generateSQL()
      const payload = {
        name: viewName,
        sql_view_name: sqlViewName,
        description,
        folder: folder || 'Default',
        selected_tables: selectedTables,
        selected_columns: selectedColumns,
        joins,
        where_conditions: whereConditions,
        team_members: selectedTeamMembers,
        sql
      }

      if (isNewView) {
        await viewsApi.createView(payload)
        alert('View created successfully!')
      } else {
        await viewsApi.updateView(viewId!, payload)
        alert('View updated successfully!')
      }

      navigate('/view-builder')
    } catch (error: any) {
      console.error('Error saving view:', error)
      alert('Error saving view: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Export to Looker Studio - NEW FEATURE
   */
  const handleLookerStudioExport = async () => {
    if (isNewView) {
      alert('Please save the view first before exporting to Looker Studio')
      return
    }

    try {
      const info = await viewsApi.getLookerStudioInfo(viewId!)

      // Show connection instructions in a modal or alert
      alert(info.connection_info.instructions)
    } catch (error: any) {
      console.error('Error getting Looker Studio info:', error)
      alert('Error: ' + error.message)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="create-view-container">
        {/* Header */}
        <div className="create-view-header">
          <Button variant="ghost" size="icon" onClick={() => navigate('/view-builder')}>
            <ArrowLeft size={20} />
          </Button>

          <h1>{isNewView ? 'Create New View' : 'Edit View'}</h1>

          <div className="header-actions flex gap-2">
            {!isNewView && (
              <Button variant="secondary" onClick={handleLookerStudioExport}>
                <Download size={16} />
                Looker Studio
              </Button>
            )}
            <Button variant="outline" onClick={handlePreview} disabled={isLoading}>
              <Play size={16} />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save View'}
            </Button>
          </div>
        </div>

        {/* View Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>View Information</CardTitle>
            <CardDescription>Basic information about your database view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="viewName">View Name</Label>
                <input
                  id="viewName"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="e.g., Active Jobs Overview"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sqlViewName">SQL View Name</Label>
                <input
                  id="sqlViewName"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={sqlViewName}
                  onChange={(e) => setSqlViewName(e.target.value)}
                  placeholder="e.g., vw_active_jobs"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <input
                  id="description"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this view show?"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        {availableTeamMembers.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Team Members Access
              </CardTitle>
              <CardDescription>Select team members who can access this view</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableTeamMembers.map(member => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selectedTeamMembers.includes(member.id)}
                      onCheckedChange={() => handleTeamMemberToggle(member.id)}
                    />
                    <Label htmlFor={`member-${member.id}`} className="text-sm font-normal cursor-pointer">
                      {member.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Builder Area */}
        <div className="builder-layout">
          {/* Left: Tables */}
          <div className="tables-panel">
            <h3>Available Tables</h3>
            <div className="tables-list">
              {availableTables.map(table => (
                <DraggableTable key={table.name} table={table} />
              ))}
            </div>
          </div>

          {/* Middle: Canvas */}
          <div className="canvas-panel">
            <h3>Selected Tables & Columns</h3>
            <TableDropZone onDrop={handleTableDrop}>
              {selectedTables.map(table => (
                <TableCard
                  key={table.name}
                  table={table}
                  selectedColumns={selectedColumns}
                  onColumnSelect={handleColumnSelect}
                  onRemove={() => setSelectedTables(selectedTables.filter(t => t.name !== table.name))}
                />
              ))}
            </TableDropZone>

            {/* Joins */}
            {selectedTables.length >= 2 && (
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Table Joins</CardTitle>
                    <Button onClick={addJoin} size="sm">
                      <Plus size={14} />
                      Add Join
                    </Button>
                  </div>
                  <CardDescription>Define how tables should be joined</CardDescription>
                </CardHeader>
                <CardContent>
                  {joins.map(join => (
                    <JoinBuilder
                      key={join.id}
                      join={join}
                      tables={selectedTables}
                      onChange={updateJoin}
                      onRemove={removeJoin}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* WHERE Conditions */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Filters (WHERE Conditions)</CardTitle>
                  <Button onClick={addWhereCondition} size="sm" variant="outline">
                    <Plus size={14} />
                    Add Filter
                  </Button>
                </div>
                <CardDescription>Add conditions to filter your data</CardDescription>
              </CardHeader>
              <CardContent>
                {whereConditions.map((condition, index) => (
                  <WhereConditionBuilder
                    key={condition.id}
                    condition={condition}
                    columns={selectedColumns}
                    onChange={updateWhereCondition}
                    onRemove={removeWhereCondition}
                    showLogicalOperator={index > 0}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: SQL Preview */}
          <div className="sql-panel">
            <h3>Generated SQL</h3>
            <pre className="sql-preview">
              {generatedSQL || 'Configure your view to see SQL...'}
            </pre>

            {previewData && (
              <div className="preview-data">
                <h4>Preview Data (First 10 rows)</h4>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(previewData[0] || {}).map(key => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 10).map((row: any, i: number) => (
                        <tr key={i}>
                          {Object.values(row).map((val: any, j: number) => (
                            <td key={j}>{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

// ============================================================================
// SUB-COMPONENTS (DraggableTable, TableDropZone, TableCard, etc.)
// These remain the same as before
// ============================================================================

const DraggableTable = ({ table }: { table: TableData }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'table',
    item: table,
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }))

  return (
    <div ref={drag as any} className={`draggable-table ${isDragging ? 'dragging' : ''}`}>
      <Table size={16} />
      <span>{table.name}</span>
      <span className="column-count">{table.columns?.length || 0} cols</span>
    </div>
  )
}

const TableDropZone = ({ children, onDrop }: { children: React.ReactNode, onDrop: (table: TableData) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'table',
    drop: (item: TableData) => onDrop(item),
    collect: (monitor) => ({ isOver: monitor.isOver() })
  }))

  return (
    <div ref={drop as any} className={`table-drop-zone ${isOver ? 'drag-over' : ''}`}>
      {!children || (Array.isArray(children) && children.length === 0) ? (
        <p className="drop-hint">Drag tables here to start building your view</p>
      ) : children}
    </div>
  )
}

const TableCard = ({ table, selectedColumns, onColumnSelect, onRemove }: any) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <Card className="table-card mb-4">
      <div className="table-card-header flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▼' : '▶'}
          </Button>
          <h4 className="font-semibold">{table.name}</h4>
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 size={14} />
        </Button>
      </div>

      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {table.columns?.map((column: Column) => {
              const columnKey = `${table.name}.${column.name}`
              const isSelected = selectedColumns.some((c: SelectedColumn) => c.key === columnKey)

              return (
                <div key={column.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={columnKey}
                      checked={isSelected}
                      onCheckedChange={() => onColumnSelect(table, column)}
                    />
                    <Label htmlFor={columnKey} className="text-sm font-normal cursor-pointer">
                      {column.name}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">{column.type}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

const JoinBuilder = ({ join, tables, onChange, onRemove }: any) => {
  return (
    <div className="flex items-center gap-2 mb-4 p-4 border rounded-lg">
      <Select value={join.leftTable} onValueChange={(v) => onChange(join.id, 'leftTable', v)}>
        <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          {tables.map((t: TableData) => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={join.leftColumn} onValueChange={(v) => onChange(join.id, 'leftColumn', v)}>
        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Column" /></SelectTrigger>
        <SelectContent>
          {tables.find((t: TableData) => t.name === join.leftTable)?.columns?.map((c: Column) => (
            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={join.joinType} onValueChange={(v) => onChange(join.id, 'joinType', v)}>
        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="INNER">INNER JOIN</SelectItem>
          <SelectItem value="LEFT">LEFT JOIN</SelectItem>
          <SelectItem value="RIGHT">RIGHT JOIN</SelectItem>
          <SelectItem value="FULL">FULL JOIN</SelectItem>
        </SelectContent>
      </Select>

      <Select value={join.rightTable} onValueChange={(v) => onChange(join.id, 'rightTable', v)}>
        <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          {tables.map((t: TableData) => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={join.rightColumn} onValueChange={(v) => onChange(join.id, 'rightColumn', v)}>
        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Column" /></SelectTrigger>
        <SelectContent>
          {tables.find((t: TableData) => t.name === join.rightTable)?.columns?.map((c: Column) => (
            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="icon" onClick={() => onRemove(join.id)}>
        <Trash2 size={14} />
      </Button>
    </div>
  )
}

const WhereConditionBuilder = ({ condition, columns, onChange, onRemove, showLogicalOperator }: any) => {
  return (
    <div className="flex items-center gap-2 mb-4 p-4 border rounded-lg">
      {showLogicalOperator && (
        <Select value={condition.logicalOperator || 'AND'} onValueChange={(v) => onChange(condition.id, 'logicalOperator', v)}>
          <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select value={condition.column} onValueChange={(v) => onChange(condition.id, 'column', v)}>
        <SelectTrigger className="w-[200px]"><SelectValue placeholder="Column" /></SelectTrigger>
        <SelectContent>
          {columns.map((c: SelectedColumn) => <SelectItem key={c.key} value={c.key}>{c.key}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={condition.operator} onValueChange={(v) => onChange(condition.id, 'operator', v)}>
        <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="=">=</SelectItem>
          <SelectItem value="!=">!=</SelectItem>
          <SelectItem value=">">{'>'}</SelectItem>
          <SelectItem value="<">{'<'}</SelectItem>
          <SelectItem value=">=">{'>='}</SelectItem>
          <SelectItem value="<=">{'<='}</SelectItem>
          <SelectItem value="LIKE">LIKE</SelectItem>
          <SelectItem value="IN">IN</SelectItem>
          <SelectItem value="NOT IN">NOT IN</SelectItem>
          <SelectItem value="IS NULL">IS NULL</SelectItem>
          <SelectItem value="IS NOT NULL">IS NOT NULL</SelectItem>
        </SelectContent>
      </Select>

      <input
        type="text"
        className="flex-1 px-3 py-2 border rounded-md"
        value={condition.value}
        onChange={(e) => onChange(condition.id, 'value', e.target.value)}
        placeholder="Value"
      />

      <Button variant="ghost" size="icon" onClick={() => onRemove(condition.id)}>
        <Trash2 size={14} />
      </Button>
    </div>
  )
}

export default CreateView
