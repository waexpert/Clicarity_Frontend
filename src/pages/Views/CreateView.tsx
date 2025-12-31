import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Save,
  Play,
  ArrowLeft,
  Plus,
  Trash2,
  Table,
  Users,
  Download
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";

import "../../css/pages/Views/CreateViews.css";

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;


const CreateView = () => {
  const { viewId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isNewView = viewId === "new";
  const folder = searchParams.get("folder") || "Default";

  const [viewName, setViewName] = useState("");
  const [sqlViewName, setSqlViewName] = useState("");
  const [description, setDescription] = useState("");

  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const [joins, setJoins] = useState([]);
  const [whereConditions, setWhereConditions] = useState([]);

  const [availableTeamMembers, setAvailableTeamMembers] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

  const [previewData, setPreviewData] = useState(null);
  const [generatedSQL, setGeneratedSQL] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchAvailableTables();
    fetchTeamMembers();
    if (!isNewView) fetchViewData();
  }, [viewId]);

  const fetchAvailableTables = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/data/getAllTables?schemaName=public`
      );
      setAvailableTables(await res.json());
    } catch {
      alert("Failed to load tables");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/views/team-members?schemaName=public`
      );
      setAvailableTeamMembers(await res.json());
    } catch {
      setAvailableTeamMembers([]);
    }
  };

  const fetchViewData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/views/${viewId}?schemaName=public`
      );
      const data = await res.json();

      setViewName(data.name);
      setSqlViewName(data.sql_view_name);
      setDescription(data.description || "");
      setSelectedTables(data.selected_tables || []);
      setSelectedColumns(data.selected_columns || []);
      setJoins(data.joins || []);
      setWhereConditions(data.where_conditions || []);
      setSelectedTeamMembers(data.team_members || []);
    } finally {
      setIsLoading(false);
    }
  };

  /* ========================= HANDLERS ========================= */

  const handleTableDrop = (table) => {
    if (!selectedTables.find(t => t.name === table.name)) {
      setSelectedTables([...selectedTables, table]);
    }
  };

  const handleColumnSelect = (table, column) => {
    const key = `${table.name}.${column.name}`;
    const exists = selectedColumns.find(c => c.key === key);

    exists
      ? setSelectedColumns(selectedColumns.filter(c => c.key !== key))
      : setSelectedColumns([
          ...selectedColumns,
          {
            key,
            table: table.name,
            column: column.name,
            alias: column.name,
            type: column.type
          }
        ]);
  };

  const addJoin = () => {
    if (selectedTables.length < 2) return;
    setJoins([
      ...joins,
      {
        id: Date.now(),
        leftTable: selectedTables[0].name,
        leftColumn: "",
        rightTable: selectedTables[1].name,
        rightColumn: "",
        joinType: "INNER"
      }
    ]);
  };

  const updateJoin = (id, field, value) => {
    setJoins(joins.map(j => (j.id === id ? { ...j, [field]: value } : j)));
  };

  const removeJoin = (id) => {
    setJoins(joins.filter(j => j.id !== id));
  };

  const addWhereCondition = () => {
    setWhereConditions([
      ...whereConditions,
      {
        id: Date.now(),
        column: "",
        operator: "=",
        value: "",
        logicalOperator: "AND"
      }
    ]);
  };

  const updateWhereCondition = (id, field, value) => {
    setWhereConditions(
      whereConditions.map(w => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const removeWhereCondition = (id) => {
    setWhereConditions(whereConditions.filter(w => w.id !== id));
  };

  const handleTeamMemberToggle = (id) => {
    setSelectedTeamMembers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  /* ========================= SQL ========================= */

  const generateSQL = () => {
    const select =
      selectedColumns.length > 0
        ? selectedColumns.map(c => `${c.table}.${c.column} AS ${c.alias}`).join(",\n")
        : "*";

    const from = selectedTables[0]?.name || "";

    const joinSQL = joins
      .map(
        j =>
          `${j.joinType} JOIN ${j.rightTable} ON ${j.leftTable}.${j.leftColumn} = ${j.rightTable}.${j.rightColumn}`
      )
      .join("\n");

    const where =
      whereConditions.length > 0
        ? "WHERE " +
          whereConditions
            .map((w, i) =>
              i === 0
                ? `${w.column} ${w.operator} '${w.value}'`
                : `${w.logicalOperator} ${w.column} ${w.operator} '${w.value}'`
            )
            .join("\n")
        : "";

    const sql = `CREATE OR REPLACE VIEW ${sqlViewName} AS
SELECT ${select}
FROM ${from}
${joinSQL}
${where};`;

    setGeneratedSQL(sql);
    return sql;
  };

  const handlePreview = async () => {
    try {
      setIsLoading(true);
      const sql = generateSQL();
      const res = await fetch(`${API_BASE_URL}/views/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql })
      });
      setPreviewData(await res.json());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const sql = generateSQL();
      await fetch(`${API_BASE_URL}/views`, {
        method: isNewView ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: viewName,
          sql_view_name: sqlViewName,
          description,
          folder,
          selected_tables: selectedTables,
          selected_columns: selectedColumns,
          joins,
          where_conditions: whereConditions,
          team_members: selectedTeamMembers,
          sql
        })
      });
      navigate("/view-builder");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookerStudioExport = () => {
    alert("Connect this SQL VIEW directly in Looker Studio (PostgreSQL source).");
  };

  /* ========================= UI ========================= */

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="create-view-container">
        {/* HEADER */}
        <div className="create-view-header">
          <Button variant="ghost" size="icon" onClick={() => navigate("/view-builder")}>
            <ArrowLeft size={20} />
          </Button>
          <h1>{isNewView ? "Create New View" : "Edit View"}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview}><Play size={16}/>Preview</Button>
            <Button onClick={handleSave}><Save size={16}/>Save</Button>
          </div>
        </div>

        {/* BODY */}
        <div className="builder-layout">
          <div className="tables-panel">
            {availableTables.map(t => <DraggableTable key={t.name} table={t} />)}
          </div>

          <div className="canvas-panel">
            <TableDropZone onDrop={handleTableDrop}>
              {selectedTables.map(t => (
                <TableCard
                  key={t.name}
                  table={t}
                  selectedColumns={selectedColumns}
                  onColumnSelect={handleColumnSelect}
                  onRemove={() =>
                    setSelectedTables(selectedTables.filter(x => x.name !== t.name))
                  }
                />
              ))}
            </TableDropZone>
          </div>

          <div className="sql-panel">
            <pre>{generatedSQL}</pre>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

/* ========================= SUB COMPONENTS ========================= */

const DraggableTable = ({ table }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "table",
    item: table,
    collect: monitor => ({ isDragging: monitor.isDragging() })
  }));

  return (
    <div ref={drag} className={`draggable-table ${isDragging ? "dragging" : ""}`}>
      <Table size={16} /> {table.name}
    </div>
  );
};

const TableDropZone = ({ children, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "table",
    drop: onDrop,
    collect: monitor => ({ isOver: monitor.isOver() })
  }));

  return (
    <div ref={drop} className={`table-drop-zone ${isOver ? "drag-over" : ""}`}>
      {children.length ? children : <p>Drag tables here</p>}
    </div>
  );
};

const TableCard = ({ table, selectedColumns, onColumnSelect, onRemove }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{table.name}</CardTitle>
      <Button size="icon" variant="ghost" onClick={onRemove}><Trash2 size={14}/></Button>
    </CardHeader>
    <CardContent>
      {table.columns.map(col => (
        <label key={col.name} className="flex gap-2">
          <input
            type="checkbox"
            checked={selectedColumns.some(c => c.key === `${table.name}.${col.name}`)}
            onChange={() => onColumnSelect(table, col)}
          />
          {col.name}
        </label>
      ))}
    </CardContent>
  </Card>
);

export default CreateView;
