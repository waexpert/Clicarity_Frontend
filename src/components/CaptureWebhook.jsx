import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { io } from 'socket.io-client';

const CaptureWebhook = () => {
  // State management
  const [webhookName, setWebhookName] = useState('');
  const [connectionState, setConnectionState] = useState('disconnected'); // disconnected, connecting, connected, error
  const [socket, setSocket] = useState(null);
  const [generatedWebhook, setGeneratedWebhook] = useState(null);
  const [webhookEvents, setWebhookEvents] = useState([]);
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  
  // Your owner ID - replace with actual owner ID
  const ownerId = 'bde74e9b-ee21-4687-8040-9878b88593fb';

  // Cleanup socket on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Generate webhook function
  const handleGenerateWebhook = async () => {
    if (!webhookName.trim()) {
      setError('Please enter a webhook name');
      return;
    }

    try {
      setError('');
      
      // Call your backend API to create webhook
      const response = await fetch('http://localhost:9000/webhooks/genrateWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: ownerId,
          name: webhookName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create webhook');
      }

      const data = await response.json();
      setGeneratedWebhook(data.webhookUrl);
      console.log('Webhook created:', data);
      
    } catch (err) {
      setError('Failed to generate webhook: ' + err.message);
      console.error('Error generating webhook:', err);
    }
  };

  // Start capturing webhooks
  const startCapturing = () => {
    if (!generatedWebhook) {
      setError('Please generate a webhook first');
      return;
    }

    setConnectionState('connecting');
    setError('');

    try {
      // Create socket connection - replace with your actual socket.io implementation
      // For now, I'll simulate the socket connection
      
      // In real implementation, you would do:
    //   const newSocket = io('http://localhost:3000');
      
      // Simulating socket connection
      setTimeout(() => {
        console.log('Connecting to webhook server...');
        
        // Simulate successful connection
        setTimeout(() => {
          setConnectionState('connected');
          console.log(`Registered owner: ${ownerId}`);
          
          // Simulate receiving webhook events
        //   const eventInterval = setInterval(() => {
        //     if (Math.random() > 0.7) { // 30% chance every 3 seconds
        //       const mockEvent = {
        //         id: Date.now(),
        //         timestamp: new Date().toISOString(),
        //         type: ['payment.success', 'user.signup', 'order.completed'][Math.floor(Math.random() * 3)],
        //         data: {
        //           amount: Math.floor(Math.random() * 1000) + 100,
        //           currency: 'USD',
        //           user_id: 'user_' + Math.random().toString(36).substr(2, 6)
        //         },
        //         source: '192.168.1.' + Math.floor(Math.random() * 255)
        //       };
              
        //       setWebhookEvents(prev => [mockEvent, ...prev.slice(0, 19)]); // Keep last 20 events
        //     }
        //   }, 3000);
          
          // Store interval reference for cleanup
          socketRef.current = { disconnect: () => clearInterval(eventInterval) };
        }, 1500);
        
      }, 500);

    //    Real Socket.io implementation would be:
      
      const newSocket = io('http://localhost:9000');
      
      newSocket.on('connection', () => {
        console.log('Connected to webhook server');
        setConnectionState('connected');
        newSocket.emit('register-owner', ownerId);
      });
      
      newSocket.on('webhook-received', (data) => {
        console.log('Webhook received:', data);
        setWebhookEvents(prev => [data, ...prev.slice(0, 19)]);
      });
      
      newSocket.on('connect_error', (err) => {
        console.error('Connection error:', err);
        setConnectionState('error');
        setError('Failed to connect to webhook server');
      });
      
      newSocket.on('disconnect', () => {
        console.log('Disconnected from webhook server');
        setConnectionState('disconnected');
      });
      
      socketRef.current = newSocket;
      setSocket(newSocket);
      
      
      
    } catch (err) {
      setConnectionState('error');
      setError('Failed to start capturing: ' + err.message);
      console.error('Error starting capture:', err);
    }
  };

  // Stop capturing webhooks
  const stopCapturing = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    setSocket(null);
    setConnectionState('disconnected');
    console.log('Stopped capturing webhooks');
  };

  // Toggle capture state
  const handleCaptureToggle = () => {
    if (connectionState === 'disconnected' || connectionState === 'error') {
      startCapturing();
    } else if (connectionState === 'connected') {
      stopCapturing();
    }
  };

  // Get button text and style based on connection state
  const getCaptureButtonProps = () => {
    switch (connectionState) {
      case 'disconnected':
        return {
          text: 'Capture Incoming',
          disabled: false,
          className: 'bg-green-600 hover:bg-green-700 text-white'
        };
      case 'connecting':
        return {
          text: 'Connecting...',
          disabled: true,
          className: 'bg-yellow-500 text-white cursor-not-allowed'
        };
      case 'connected':
        return {
          text: 'Stop Capturing',
          disabled: false,
          className: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'error':
        return {
          text: 'Retry Connection',
          disabled: false,
          className: 'bg-orange-600 hover:bg-orange-700 text-white'
        };
      default:
        return {
          text: 'Capture Incoming',
          disabled: false,
          className: 'bg-green-600 hover:bg-green-700 text-white'
        };
    }
  };

  const buttonProps = getCaptureButtonProps();

  const clearEvents = () => {
    setWebhookEvents([]);
  };

  const copyWebhookUrl = () => {
    if (generatedWebhook?.webhookUrl) {
      navigator.clipboard.writeText(generatedWebhook.webhookUrl);
      alert('Webhook URL copied to clipboard!');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Main Controls */}
      <div className="flex items-center gap-3 mb-6" style={{minHeight: "5rem"}}>
        <input
          type="text"
          placeholder="Enter webhook name..."
          value={webhookName}
          onChange={(e) => setWebhookName(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md flex-1 max-w-xs"
        />
        <Button 
          onClick={handleGenerateWebhook}
        //   className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Generate Webhook
        </Button>
        <Button
          onClick={handleCaptureToggle}
          disabled={buttonProps.disabled}
        //   className={buttonProps.className}
        >
          {buttonProps.text}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Generated Webhook Display */}
      {generatedWebhook && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Generated Webhook</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Webhook ID:</span> {generatedWebhook.webhookId}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">URL:</span>
              <code className="bg-gray-200 px-2 py-1 rounded text-sm flex-1">
                {generatedWebhook.webhookUrl}
              </code>
              <Button onClick={copyWebhookUrl} size="sm" variant="outline">
                Copy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {generatedWebhook && (
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-3 h-3 rounded-full ${
            connectionState === 'connected' 
              ? 'bg-green-500 animate-pulse' 
              : connectionState === 'connecting'
              ? 'bg-yellow-500 animate-pulse'
              : connectionState === 'error'
              ? 'bg-red-500'
              : 'bg-gray-400'
          }`} />
          <span className="font-medium">
            Status: {connectionState.charAt(0).toUpperCase() + connectionState.slice(1)}
          </span>
          {connectionState === 'connected' && (
            <span className="text-sm text-gray-600">
              ({webhookEvents.length} events received)
            </span>
          )}
        </div>
      )}

      {/* Webhook Events Display */}
      {webhookEvents.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Live Webhook Events</h3>
            <Button onClick={clearEvents} variant="outline" size="sm">
              Clear Events
            </Button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {webhookEvents.map((event) => (
              <div key={event.id} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-600">{event.type}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Amount: ${event.data.amount} {event.data.currency}</div>
                  <div>User: {event.data.user_id}</div>
                  <div>Source: {event.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptureWebhook;