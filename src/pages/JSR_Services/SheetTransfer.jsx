import axios from 'axios';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export default function SheetTransfer() {
  const { us_id } = useParams(); // Get job_id from URL params
  const [jobId, setJobId] = useState(us_id || "");
  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [sheetsSent, setSheetsSent] = useState("");
  const [sheetsWasted, setSheetsWasted] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const queryData = useQueryObject();

  // Mock data - replace with your actual data
  const processOptions = ["P1", "P2", "P3", "P4"];
  const vendorOptions = ["Vendor A", "Vendor B", "Vendor C", "Vendor D"];

  function useQueryObject() {
    const searchParams = new URLSearchParams(useLocation().search);
    const queryObj = {};
    for (const [key, value] of searchParams.entries()) {
      queryObj[key] = value;
    }
    return queryObj;
  }

  const validateForm = () => {
    if (!jobId.trim()) {
      setError("Job ID is required.");
      return false;
    }
    if (!selectedProcess) {
      setError("Please select a process.");
      return false;
    }
    if (!selectedVendor) {
      setError("Please select a vendor.");
      return false;
    }
    if (!sheetsSent.trim()) {
      setError("Please enter number of sheets sent.");
      return false;
    }
    if (!sheetsWasted.trim()) {
      setError("Please enter number of sheets wasted.");
      return false;
    }
    if (isNaN(sheetsSent) || parseInt(sheetsSent) < 0) {
      setError("Please enter a valid number for sheets sent.");
      return false;
    }
    if (isNaN(sheetsWasted) || parseInt(sheetsWasted) < 0) {
      setError("Please enter a valid number for sheets wasted.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const payload = {
        ...queryData,
        job_id: jobId.trim(),
        process: selectedProcess,
        vendor: selectedVendor,
        sheets_sent: parseInt(sheetsSent),
        sheets_wasted: parseInt(sheetsWasted),
      };

      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/data/updateSheetTransfer`, // Updated endpoint
        payload
      );

      setSubmitted(true);
      // Reset form
      setJobId(us_id || "");
      setSelectedProcess("");
      setSelectedVendor("");
      setSheetsSent("");
      setSheetsWasted("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  const handleSelectChange = (setter) => (value) => {
    setter(value);
    if (error) setError("");
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <img
          src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
          alt="logo"
          style={styles.logo}
        />

        <div style={styles.successContainer}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successHeading}>Thank You!</h2>
          <p style={styles.successMessage}>
            Your sheet transfer data has been submitted successfully.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setJobId(us_id || "");
              setSelectedProcess("");
              setSelectedVendor("");
              setSheetsSent("");
              setSheetsWasted("");
            }}
            style={styles.newCommentButton}
          >
            Submit Another Entry
          </button>
        </div>
      </div>
    );
  }

  const isFormValid = jobId.trim() && selectedProcess && selectedVendor &&
    sheetsSent.trim() && sheetsWasted.trim();

  return (
    <div style={styles.container}>
      <img
        src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
        alt="logo"
        style={styles.logo}
      />

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Job ID Input */}
        <div className="w-full mb-4">
          <Label htmlFor="jobId" style={styles.inputLabel}>
            Job ID
          </Label>
          <Input
            id="jobId"
            value={jobId}
            onChange={handleInputChange(setJobId)}
            placeholder="Enter job ID"
            disabled={isSubmitting}
          />
        </div>

        {/* Process Dropdown */}
        <div className="w-full mb-4">
          <Label>Choose the Process</Label>
          <Select 
            value={selectedProcess} 
            onValueChange={handleSelectChange(setSelectedProcess)} 
            className="w-full"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select process" />
            </SelectTrigger>
            <SelectContent>
              {processOptions.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
{/* 
        <label for="cars">Choose a car:</label>

        <select name="cars" id="cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select> */}

        {/* Vendor Dropdown */}
        <div className="w-full mb-4">
          <Label>Choose the Vendor</Label>
          <Select
            value={selectedVendor}
            onValueChange={handleSelectChange(setSelectedVendor)}
            className="w-full"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendorOptions.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sheets Sent Input */}
        <div className="w-full mb-4">
          <Label htmlFor="sheetsSent" style={styles.inputLabel}>
            Number of Sheets Sent
          </Label>
          <Input
            id="sheetsSent"
            type="number"
            min="0"
            value={sheetsSent}
            onChange={handleInputChange(setSheetsSent)}
            placeholder="Enter number of sheets sent"
            disabled={isSubmitting}
          />
        </div>

        {/* Sheets Wasted Input */}
        <div className="w-full mb-4">
          <Label htmlFor="sheetsWasted" style={styles.inputLabel}>
            Number of Sheets Wasted
          </Label>
          <Input
            id="sheetsWasted"
            type="number"
            min="0"
            value={sheetsWasted}
            onChange={handleInputChange(setSheetsWasted)}
            placeholder="Enter number of sheets wasted"
            disabled={isSubmitting}
          />
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(isSubmitting ? styles.buttonDisabled : {}),
            ...(isFormValid ? styles.buttonActive : {}),
          }}
          disabled={isSubmitting || !isFormValid}
        >
          <div style={styles.buttonContent}>
            {isSubmitting ? (
              <>
                <div style={styles.spinner}></div>
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Sheet Transfer
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
}

// You'll need to add these styles or modify existing ones
// const styles = {
//   container: {
//     maxWidth: '600px',
//     margin: '0 auto',
//     padding: '20px',
//     fontFamily: 'Arial, sans-serif'
//   },
//   logo: {
//     height: '60px',
//     marginBottom: '30px',
//     display: 'block',
//     marginLeft: 'auto',
//     marginRight: 'auto'
//   },
//   form: {
//     width: '100%'
//   },
//   inputLabel: {
//     display: 'block',
//     marginBottom: '8px',
//     fontSize: '14px',
//     fontWeight: '500',
//     color: '#374151'
//   },
//   errorMessage: {
//     color: '#ef4444',
//     fontSize: '14px',
//     marginTop: '5px',
//     marginBottom: '15px'
//   },
//   button: {
//     width: '100%',
//     padding: '12px 24px',
//     backgroundColor: '#3b82f6',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '16px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//     marginTop: '20px'
//   },
//   buttonActive: {
//     backgroundColor: '#2563eb'
//   },
//   buttonDisabled: {
//     backgroundColor: '#9ca3af',
//     cursor: 'not-allowed'
//   },
//   buttonContent: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '8px'
//   },
//   spinner: {
//     width: '16px',
//     height: '16px',
//     border: '2px solid #ffffff',
//     borderTop: '2px solid transparent',
//     borderRadius: '50%',
//     animation: 'spin 1s linear infinite'
//   },
//   successContainer: {
//     textAlign: 'center',
//     padding: '40px 20px'
//   },
//   successIcon: {
//     fontSize: '48px',
//     color: '#10b981',
//     marginBottom: '16px'
//   },
//   successHeading: {
//     fontSize: '24px',
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: '8px'
//   },
//   successMessage: {
//     fontSize: '16px',
//     color: '#6b7280',
//     marginBottom: '24px'
//   },
//   newCommentButton: {
//     padding: '10px 20px',
//     backgroundColor: '#3b82f6',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontSize: '14px'
//   }
// };


// Enhanced styles - exactly matching SheetComment
const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '32px',
    border: '1px solid #e1e5e9',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '400px',
  },
  logo: {
    width: '20rem',
    height: 'auto',
    marginBottom: '1.5rem',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '32px',
    width: '100%',
  },
  headerIcon: {
    color: '#4388c1',
    marginBottom: '12px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 8px 0',
    lineHeight: '1.3',
  },
  subheading: {
    fontSize: '16px',
    color: '#718096',
    margin: 0,
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  inputLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '4px',
  },
  textareaContainer: {
    position: 'relative',
    width: '100%',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    transition: 'all 0.3s ease',
    outline: 'none',
    resize: 'vertical',
    minHeight: '120px',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    backgroundColor: '#fafafa',
    boxSizing: 'border-box',
  },
  textareaError: {
    borderColor: '#e53e3e',
    backgroundColor: '#fed7d7',
  },
  characterCount: {
    position: 'absolute',
    bottom: '8px',
    right: '12px',
    fontSize: '12px',
    color: '#a0aec0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  errorMessage: {
    fontSize: '14px',
    color: '#e53e3e',
    backgroundColor: '#fed7d7',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #feb2b2',
  },
  button: {
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#a0aec0',
    color: '#ffffff',
    cursor: 'not-allowed',
    transition: 'all 0.3s ease',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '56px',
    transform: 'translateY(0)',
  },
  buttonActive: {
    backgroundColor: '#4388c1',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(67, 136, 193, 0.3)',
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  successContainer: {
    textAlign: 'center',
    padding: '40px 20px',
    width: '100%',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: '#48bb78',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 auto 24px',
    animation: 'bounceIn 0.6s ease-out',
  },
  successHeading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 12px 0',
  },
  successMessage: {
    fontSize: '16px',
    color: '#718096',
    margin: '0 0 32px 0',
    lineHeight: '1.5',
  },
  newCommentButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid #4388c1',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#4388c1',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes bounceIn {
    0% { 
      transform: scale(0.3);
      opacity: 0;
    }
    50% { 
      transform: scale(1.05);
    }
    70% { 
      transform: scale(0.9);
    }
    100% { 
      transform: scale(1);
      opacity: 1;
    }
  }
  
  textarea:focus {
    border-color: #4388c1 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(67, 136, 193, 0.1) !important;
  }
  
  button:not(:disabled):hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(67, 136, 193, 0.4) !important;
  }
  
  .new-comment-button:hover {
    background-color: #4388c1 !important;
    color: white !important;
  }
`;
document.head.appendChild(styleSheet);