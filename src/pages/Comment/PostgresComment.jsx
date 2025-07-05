
import axios from 'axios';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';

/**
 * Comment submission component with form handling
 */
export default function PostgresComment() {
  const [comment, setComment] = useState("");
  const queryData = useQueryObject();
  const [submitted,setSubmitted] = useState(false);

  /**
   * Custom hook to extract query parameters into an object
   */
  function useQueryObject() {
    const searchParams = new URLSearchParams(useLocation().search);
    const queryObj = {};
   
    
    for (const [key, value] of searchParams.entries()) {
      queryObj[key] = value;
    }
    
    return queryObj;
  }
 

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log(queryData)
    try {
      const payload = {
        ...queryData,
        comment,
      };

      await axios.post(
        `https://click.wa.expert/api/data/updateComment`, 
        payload
      );

      setSubmitted(true);
    } catch (err) {
      console.error(err);
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
        Please Enter Comment / Notes
      </h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type here..."
          style={styles.input}
        />
        
        <Button 
          type="submit" 
          style={styles.button}
        >
          Submit
        </Button>
      </form>
      {submitted ? <p style={{color:'green'}}>Submitted successfully. 
      Thank you.</p> :""}
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
  }
};