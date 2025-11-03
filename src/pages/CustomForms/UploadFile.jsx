// import axios from 'axios';
// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Input } from '../../components/ui/input';
// import { CloudUpload } from "lucide-react";
// import { Label } from "../../components/ui/label";

// export default function UploadFile() {
//   const [comment, setComment] = useState("");
//   const [file, setFile] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const queryData = useQueryObject();

//   function useQueryObject() {
//     const searchParams = new URLSearchParams(useLocation().search);
//     const queryObj = {};
//     for (const [key, value] of searchParams.entries()) {
//       queryObj[key] = value;
//     }
//     return queryObj;
//   }

//   const getPresignedUrl = async () => {
//     const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/service/uploadFile`);
//     const data = await response.json();
//     if (!data.message) throw new Error("Presigned URL not returned");
//     return data.message; 
//   };

//   const uploadToS3 = async (file, presignedUrl) => {
//     const res = await fetch(presignedUrl, {
//       method: "PUT",
//       body: file,
//       headers: {
//         "Content-Type": file.type,
//       },
//     });
//     if (!res.ok) throw new Error("Upload to S3 failed");
//     return presignedUrl.split('?')[0]; // Strip query string to get public URL
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setUploading(true);
//       let fileUrl = "";

//       if (file) {
//         const presignedUrl = await getPresignedUrl();
//         fileUrl = await uploadToS3(file, presignedUrl);
//       }

//       const payload = {
//         ...queryData,
//         fileUrlComment:comment,
//         fileUrl,
//       };

//       await axios.post(
//         `https://webhooks.wa.expert/webhook/${queryData.weid}`,
//         payload
//       );

//       setSubmitted(true);
//     } catch (err) {
//       console.error("Upload or webhook error:", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <img
//         src="/Images/logo.png"
//         alt="logo"
//         style={styles.logo}
//       />

//       <h2 style={styles.heading}>
//         Please Enter Comment / Notes & File
//       </h2>

//       <form onSubmit={handleSubmit} style={styles.form}>
//         <Label htmlFor="fileUpload"><CloudUpload /></Label>
//         <Input
//           type="file"
//           id="fileUpload"
//           onChange={(e) => setFile(e.target.files[0])}
//           className="my-2 text-gray-100"
//         />

//         <Input
//           type="text"
//           placeholder="Enter comment"
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="my-2"
//         />

//         <button
//           type="submit"
//           style={styles.button}
//           disabled={uploading}
//         >
//           {uploading ? "Uploading..." : "Submit"}
//         </button>
//       </form>

//       {submitted && <p style={{ color: 'green' }}>Submitted successfully. Thank you.</p>}
//     </div>
//   );
// }

// // Styles remain unchanged
// const styles = {
//   container: {
//     maxWidth: '400px',
//     margin: '50px auto',
//     padding: '20px',
//     border: '1px solid #ddd',
//     borderRadius: '10px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   logo: {
//     width: '22rem',
//     height: 'auto',
//     marginBottom: '1rem',
//   },
//   heading: {
//     textAlign: 'center',
//     marginBottom: '20px',
//     color: '#333',
//     fontWeight: '500',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '100%',
//   },
//   button: {
//     padding: '12px',
//     fontSize: '16px',
//     border: 'none',
//     borderRadius: '5px',
//     backgroundColor: '#4388c1',
//     color: '#fff',
//     cursor: 'pointer',
//     transition: 'background-color 0.3s ease',
//     fontWeight: '500',
//   },
// };



import axios from 'axios';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { CloudUpload, File, X } from "lucide-react";
import { Label } from "../../components/ui/label";

export default function UploadFile() {
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const queryData = useQueryObject();

  function useQueryObject() {
    const searchParams = new URLSearchParams(useLocation().search);
    const queryObj = {};
    for (const [key, value] of searchParams.entries()) {
      queryObj[key] = value;
    }
    return queryObj;
  }

  const getPresignedUrl = async () => {
    const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/service/uploadFile`);
    const data = await response.json();
    if (!data.message) throw new Error("Presigned URL not returned");
    return data.message; 
  };

  const uploadToS3 = async (file, presignedUrl) => {
    const res = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    if (!res.ok) throw new Error("Upload to S3 failed");
    return presignedUrl.split('?')[0];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      let fileUrl = "";

      if (file) {
        const presignedUrl = await getPresignedUrl();
        fileUrl = await uploadToS3(file, presignedUrl);
      }

      const payload = {
        ...queryData,
        fileUrlComment: comment,
        fileUrl,
      };

      await axios.post(
        `https://webhooks.wa.expert/webhook/${queryData.weid}`,
        payload
      );

      setSubmitted(true);
    } catch (err) {
      console.error("Upload or webhook error:", err);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={styles.container}>
      <img
        src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
        alt="logo"
        style={styles.logo}
      />

      <h2 style={styles.heading}>
        Please Enter Comment / Notes & File
      </h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Enhanced File Upload Area */}
        <div
          style={{
            ...styles.uploadArea,
            ...(dragActive ? styles.uploadAreaActive : {}),
            ...(file ? styles.uploadAreaWithFile : {})
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
            style={styles.hiddenInput}
          />
          
          {!file ? (
            <Label htmlFor="fileUpload" style={styles.uploadLabel}>
              <CloudUpload size={48} style={styles.uploadIcon} />
              <div style={styles.uploadText}>
                <p style={styles.uploadMainText}>
                  Click to upload or drag and drop
                </p>
                <p style={styles.uploadSubText}>
                  Any file type supported
                </p>
              </div>
            </Label>
          ) : (
            <div style={styles.filePreview}>
              <File size={32} style={styles.fileIcon} />
              <div style={styles.fileInfo}>
                <p style={styles.fileName}>{file.name}</p>
                <p style={styles.fileSize}>{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                style={styles.removeButton}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div style={styles.inputGroup}>
          <Label htmlFor="comment" style={styles.inputLabel}>
            Comment / Notes
          </Label>
          <Input
            type="text"
            id="comment"
            placeholder="Enter your comment or notes here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={styles.commentInput}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(uploading ? styles.buttonDisabled : {})
          }}
          disabled={uploading}
        >
          {uploading ? (
            <div style={styles.buttonContent}>
              <div style={styles.spinner}></div>
              Uploading...
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {submitted && (
        <div style={styles.successMessage}>
          <p>✅ Submitted successfully. Thank you!</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #e1e5e9',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  logo: {
    width: '22rem',
    height: 'auto',
    marginBottom: '1.5rem',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#2d3748',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '1.4',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '20px',
  },
  uploadArea: {
    border: '2px dashed #cbd5e0',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#f7fafc',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadAreaActive: {
    borderColor: '#4388c1',
    backgroundColor: '#ebf8ff',
    transform: 'scale(1.02)',
  },
  uploadAreaWithFile: {
    borderColor: '#48bb78',
    backgroundColor: '#f0fff4',
    borderStyle: 'solid',
  },
  hiddenInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    width: '100%',
  },
  uploadIcon: {
    color: '#4388c1',
    marginBottom: '8px',
  },
  uploadText: {
    textAlign: 'center',
  },
  uploadMainText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
    margin: 0,
    marginBottom: '4px',
  },
  uploadSubText: {
    fontSize: '14px',
    color: '#718096',
    margin: 0,
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '8px',
  },
  fileIcon: {
    color: '#48bb78',
    flexShrink: 0,
  },
  fileInfo: {
    flex: 1,
    textAlign: 'left',
  },
  fileName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    margin: 0,
    marginBottom: '2px',
    wordBreak: 'break-word',
  },
  fileSize: {
    fontSize: '12px',
    color: '#718096',
    margin: 0,
  },
  removeButton: {
    background: '#fed7d7',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#e53e3e',
    flexShrink: 0,
    transition: 'background-color 0.2s ease',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  inputLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
  },
  commentInput: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e0',
    fontSize: '14px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
  },
  button: {
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#4388c1',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '48px',
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed',
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
  successMessage: {
    marginTop: '20px',
    padding: '12px 20px',
    backgroundColor: '#c6f6d5',
    border: '1px solid #9ae6b4',
    borderRadius: '8px',
    color: '#22543d',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
  },
};

// Add CSS animation for spinner
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);