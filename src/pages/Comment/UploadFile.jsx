import axios from 'axios';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { CloudUpload } from "lucide-react";
import { Label } from "../../components/ui/label";

export default function UploadFile() {
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const queryData = useQueryObject();

  function useQueryObject() {
    const searchParams = new URLSearchParams(useLocation().search);
    const queryObj = {};
    for (const [key, value] of searchParams.entries()) {
      queryObj[key] = value;
    }
    return queryObj;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      let fileUrl = "";

      // Step 1: Upload the file to your backend
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/service/uploadFile`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        fileUrl = uploadRes.data?.fileUrl; // depends on your backend response shape

        if (!fileUrl) {
          throw new Error("File URL not returned from upload API");
        }
      }

      // Step 2: Send data to the webhook
      const payload = {
        ...queryData,
        comment,
        fileUrl, // Include uploaded file URL
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

  return (
    <div style={styles.container}>
      <img
        src="/Images/logo.png"
        alt="logo"
        style={styles.logo}
      />

      <h2 style={styles.heading}>
        Please Enter Comment / Notes & File
      </h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* <Label htmlFor="fileUpload"><CloudUpload /></Label> */}
        <Input
          type="file"
          id="fileUpload"
          onChange={(e) => setFile(e.target.files[0])}
          className="my-2"
        />

        <Input
          type="text"
          placeholder="Enter comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="my-2"
        />

        <button
          type="submit"
          style={styles.button}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </form>

      {submitted && <p style={{ color: 'green' }}>Submitted successfully. Thank you.</p>}
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '22rem',
    height: 'auto',
    marginBottom: '1rem',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    transition: 'border 0.3s ease',
    outline: 'none',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4388c1',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: '500',
  },
};
