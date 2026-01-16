import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { RefreshCw, Save } from 'lucide-react';

const WorkflowCounter = ({ tableName = 'jobstatus', onCounterUpdate }) => {
  const [counter, setCounter] = useState(0);
  const [prefix, setPrefix] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const userData = useSelector((state) => state.user);
  const owner_id = userData.owner_id === null ? userData.id : userData.owner_id;

  const fetchCounter = async () => {
    try {
      setIsRefreshing(true);
      const counterRoute = `${import.meta.env.VITE_APP_BASE_URL}/data/getRecordById`;
      const usId = `${owner_id}_${tableName}`;
      const body = {
        id: usId,
        schemaName: "public",
        tableName: "counter_setup",
      };

      console.log('Fetching counter with:', body);
      const { data } = await axios.post(counterRoute, body);
      
      console.log('Fetched counter data:', data);
      
      if (data) {
        // IMPORTANT: Convert counter to integer
        const counterValue = parseInt(data.counter, 10) || 0;
        setCounter(counterValue);
        setPrefix(data.prefix || "");
        setIsActive(data.is_active || false);
        setRecordId(data.id);
        
        // Notify parent component
        if (onCounterUpdate) {
          onCounterUpdate({
            counter: counterValue,
            prefix: data.prefix || "",
            isActive: data.is_active || false,
            recordId: data.id
          });
        }
      }
    } catch (error) {
      console.error('Error fetching counter:', error);
      console.error('Error response:', error.response?.data);
      
      // If record doesn't exist, initialize with defaults
      setCounter(1);
      setPrefix("");
      setIsActive(false);
      setRecordId(null);
      
      // Create initial counter record
      await createInitialCounter();
    } finally {
      setIsRefreshing(false);
    }
  };

  const createInitialCounter = async () => {
    try {
      const createRoute = `${import.meta.env.VITE_APP_BASE_URL}/data/createRecord`;
      const usId = `${owner_id}_${tableName}`;
      const body = {
        schemaName: "public",
        tableName: "counter_setup",
        record: {
          us_id: usId,
          owner_id: owner_id,
          table_name: tableName,
          prefix: "",
          counter: 1, // This is already a number
          is_active: false
        }
      };

      console.log('Creating initial counter with:', body);
      const { data } = await axios.post(createRoute, body);
      console.log('Initial counter created:', data);
      
      // Fetch again to get the actual record ID
      await fetchCounter();
    } catch (error) {
      console.error('Error creating initial counter:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  const saveCounter = async () => {
    try {
      setIsSaving(true);
      
      // IMPORTANT: Ensure counter is an integer
      const counterValue = parseInt(counter, 10);
      
      const createRoute = `${import.meta.env.VITE_APP_BASE_URL}/data/createRecord`;
      const usId = `${owner_id}_${tableName}`;
      const body = {
        schemaName: "public",
        tableName: "counter_setup",
        record: {
          us_id: usId,
          owner_id: owner_id,
          table_name: tableName,
          prefix: prefix,
          counter: counterValue, // Send as integer, not string
          is_active: isActive,
          updated_at: new Date().toISOString()
        }
      };

      console.log('Saving counter with:', body);
      console.log('Counter value type:', typeof counterValue, 'Value:', counterValue);
      
      await axios.post(createRoute, body);
      toast.success("Counter settings saved successfully");
      
      // Notify parent component
      if (onCounterUpdate) {
        onCounterUpdate({
          counter: counterValue,
          prefix,
          isActive,
          recordId: recordId || usId
        });
      }
      
      // Refresh to get latest data
      await fetchCounter();
    } catch (error) {
      console.error('Error saving counter:', error);
      console.error('Error response:', error.response?.data);
      toast.error("Failed to save counter settings");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchCounter();
  }, [tableName]);

  return (
    <div className="w-full">
      <div className="">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Enable Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <Switch
              id="counter-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="counter-active" className="text-sm font-medium whitespace-nowrap">
              Auto Counter
            </Label>
          </div>

          {/* Prefix Input */}
          <div className="flex items-center gap-2 flex-1 min-w-[120px]">
            <Label htmlFor="prefix" className="text-sm whitespace-nowrap">Prefix:</Label>
            <Input
              id="prefix"
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="INV"
              className="h-9"
            />
          </div>

          {/* Counter Display */}
          {/* <div className="flex items-center gap-2 w-[100px]">
            <Label htmlFor="counter" className="text-sm whitespace-nowrap">Count:</Label>
            <Input
              id="counter"
              type="number"
              value={counter}
              onChange={(e) => setCounter(parseInt(e.target.value, 10) || 0)}
              className="h-9"
            />
          </div> */}

          {/* Preview */}
          {isActive && (
            <div className="text-sm bg-blue-50 px-2 py-1.5 rounded border border-blue-200 flex w-[10rem] items-center">
              <span className="text-gray-600">Next : </span>
              <span className="font-mono font-semibold text-blue-700">
                {prefix}{counter}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 shrink-0">
            <Button
              onClick={saveCounter}
              disabled={isSaving}
              size="sm"
              variant="default"
            >
              <Save className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={fetchCounter}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCounter;