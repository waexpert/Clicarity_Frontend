import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { toast } from "sonner"
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setDynamicData, addDynamicField, setLoading, setError,clearDynamicData } from '../../features/productMethod/jobStatusSlice';

const CustomCaptureWebhook = ({setColumnFields,columnName}) => {
  // State for webhook generation
  const [webhookName, setWebhookName] = useState('');
  const [generatedWebhook, setGeneratedWebhook] = useState(null);
  const [generateError, setGenerateError] = useState('');

  // State for webhook capture
  const [webhookData, setWebhookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captureError, setCaptureError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [webhookCounter,setWebhookCounter] = useState(0);
  const intervalRef = useRef(null);

  const user = useSelector((state) => state.user);
  const ownerId = user.id;
  const schema_name = user.schema_name;
  const dispatch = useDispatch();
  const jsrWebhook = useSelector(state => state.jobstatus.data.in_webhookUrl);
  console.log("Webhook from state:", jsrWebhook);

  // Initialize webhook from state if it exists
  useEffect(() => {
    if (jsrWebhook && !generatedWebhook) {
      // Extract webhook ID from URL (assuming it's the last part of the URL)
      const webhookId = jsrWebhook.split('/').pop();
      
      setGeneratedWebhook({
        url: jsrWebhook,
        webhookId: webhookId
      });
      
      console.log("Initialized webhook from state:", { url: jsrWebhook, webhookId });
    }
  }, [jsrWebhook, generatedWebhook]);

  const handleGenerateWebhook = async () => {
    if (!webhookName.trim()) {
      setGenerateError('Please enter a webhook name');
      return;
    }

    // If webhook already exists, show confirmation
    if (generatedWebhook || jsrWebhook) {
      toast.error("Generating new webhook will overwrite previous one!", {
        action: {
          label: "Confirm",
          onClick: () => generateNewWebhook() 
        },
        duration: 5000
      });
      return;
    }

    // First time generation
    generateNewWebhook();
  };

  // Separate function for actual generation
  const generateNewWebhook = async () => {
    try {
      setGenerateError('');
      
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/webhooks/genrateWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId, name: webhookName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create webhook');
      }

      const data = await response.json();
      setGeneratedWebhook(data);

      // Update database with webhook URL
      if (columnName && ownerId) {
        await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/data/updateRecord?schemaName=public&tableName=users&recordId=${ownerId}&columnName=${columnName}&value=${data.url}&ownerId=${ownerId}`);
      }
      
      // Update Redux state
      dispatch(setDynamicData({in_webhookUrl: data.url}));
      
      toast.success('Webhook generated successfully!');

    } catch (err) {
      console.error('Webhook generation error:', err);
      setGenerateError('Failed to generate webhook: ' + err.message);
      toast.error('Failed to generate webhook: ' + err.message);
    }
  };

  const fetchWebhookData = async () => {
    if (!generatedWebhook?.webhookId) {
      setCaptureError('No webhook generated yet');
      return;
    }

    try {
      setLoading(true);
      setCaptureError(null);

      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/webhooks/get/${ownerId}/${generatedWebhook.webhookId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setWebhookData(data.data);
        
        // Update column fields if query data exists
        if (data.data.query && typeof data.data.query === 'object') {
          const fields = Object.keys(data.data.query);
          if (fields.length > 0 && setColumnFields) {
            setColumnFields(fields);
          }
        }

        setCaptureError(null);
        
        // Check if data is recent (within 5 seconds)
        const now = Date.now();
        const dataTime = new Date(data.data.timestamp).getTime();
        const timeDiff = Math.abs(now - dataTime);

        if (timeDiff <= 5000) {
          stopCapturing();
          toast.success("New webhook data received!");
        }

      } else {
        setCaptureError(data.message || 'No data received');
      }
    } catch (err) {
      console.error('Fetch webhook data error:', err);
      setCaptureError('Failed to fetch webhook data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startCapturing = () => {
    if (!generatedWebhook) {
      setCaptureError('Please generate a webhook first');
      toast.error('Please generate a webhook first');
      return;
    }

    setIsCapturing(true);
    setCaptureError(null);

    // Initial fetch
    fetchWebhookData();

    // Start polling every 5 seconds
    intervalRef.current = setInterval(fetchWebhookData, 5000);

    toast.info('Started capturing webhook data...');
  };

  const stopCapturing = () => {
    setIsCapturing(false);

    // Clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    toast.info('Stopped capturing webhook data');
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const copyWebhookUrl = () => {
    const urlToCopy = generatedWebhook?.url || jsrWebhook;
    if (urlToCopy) {
      navigator.clipboard.writeText(urlToCopy)
        .then(() => {
          toast.success('Webhook URL copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy:', err);
          toast.error('Failed to copy webhook URL');
        });
    } else {
      toast.error('No webhook URL available to copy');
    }
  };

  const clearWebhookData = () => {
    setWebhookData(null);
    setCaptureError(null);
    toast.info('Webhook data cleared');
  };

  const regenerateWebhook = () => {
    if (!webhookName.trim()) {
      setWebhookName('webhook_' + Date.now()); // Set a default name
    }
    generateNewWebhook();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Webhook Generator & Capture</h2>

      {/* Webhook Generation Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Generate Webhook</h3>
        
        {/* Show input only if no webhook exists in state */}
        {!jsrWebhook && !generatedWebhook ? (
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter webhook name..."
              value={webhookName}
              onChange={(e) => setWebhookName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md flex-1 max-w-xs"
              disabled={loading}
            />
            <Button 
              onClick={handleGenerateWebhook}
              disabled={loading || !webhookName.trim()}
            >
              {loading ? 'Generating...' : 'Generate Webhook'}
            </Button>
          </div>
        ) : (
          /* Show regenerate option if webhook exists */
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600">Webhook already exists.</span>
            <Button 
              onClick={regenerateWebhook}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading ? 'Regenerating...' : 'Regenerate Webhook'}
            </Button>
          </div>
        )}

        {/* Generate Error Display */}
        {/* {generateError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {generateError}
          </div>
        )} */}

        {/* Generated Webhook Display - Show if webhook exists in state or component state */}
        {(generatedWebhook || jsrWebhook) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Webhook Details</h4>
            <div className="space-y-2">
              {generatedWebhook?.webhookId && (
                <div>
                  <span className="font-medium">Webhook ID:</span> {generatedWebhook.webhookId}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-medium">URL:</span>
                <code className="bg-gray-200 px-2 py-1 rounded text-sm flex-1 break-all">
                  {generatedWebhook?.url || jsrWebhook}
                </code>
                <Button onClick={copyWebhookUrl} size="sm" variant="outline">
                  Copy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Webhook Capture Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Capture Webhook Data</h3>

        <div className="flex items-center gap-3 mb-4">
          {!isCapturing ? (
            <Button 
              onClick={startCapturing} 
              className="hover:bg-blue-400 text-white"
              disabled={!generatedWebhook && !jsrWebhook}
            >
              Start Capturing Data
            </Button>
          ) : (
            <Button onClick={stopCapturing} className="bg-red-600 hover:bg-red-700 text-white">
              Stop Capturing
            </Button>
          )}
          
          {webhookData && (
            <Button onClick={clearWebhookData} variant="outline" size="sm">
              Clear Data
            </Button>
          )}
        </div>

        {/* Capture Status */}
        {isCapturing && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-600 font-medium">
              Capturing webhook data... (polling every 5 seconds)
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        )}

        {/* Capture Error Display */}
        {captureError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {captureError}
          </div>
        )}

        {/* Webhook Data Display */}
        {webhookData && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Latest Webhook Data:</h4>
            <div className="bg-gray-700 text-green-400 p-4 rounded-md overflow-auto max-h-64">
              <pre className="text-sm">{JSON.stringify(webhookData.query, null, 2)}</pre>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Received at:</strong> {new Date(webhookData.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        {!generatedWebhook && !jsrWebhook && !isCapturing && (
          <p className="text-gray-500 text-sm">
            Generate a webhook first to start capturing data.
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomCaptureWebhook;