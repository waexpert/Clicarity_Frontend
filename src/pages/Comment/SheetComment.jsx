// import axios from 'axios';
// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Input } from '../../components/ui/input';

// /**
//  * Comment submission component with form handling
//  */
// export default function SheetComment() {
//   const [comment, setComment] = useState("");
//   const queryData = useQueryObject();
//   const [submitted,setSubmitted] = useState(false);

//   /**
//    * Custom hook to extract query parameters into an object
//    */
//   function useQueryObject() {
//     const searchParams = new URLSearchParams(useLocation().search);
//     const queryObj = {};
   
    
//     for (const [key, value] of searchParams.entries()) {
//       queryObj[key] = value;
//     }
    
//     return queryObj;
//   }
 

//   /**
//    * Handle form submission
//    */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//       console.log(queryData)
//     try {
//       const payload = {
//         ...queryData,
//         comment,
//       };
//     //   console.log(`https://webhooks.wa.expert/webhook/${queryData.weid}`)

//       await axios.post(
//         `https://webhooks.wa.expert/webhook/${queryData.weid}`, 
//         payload
//       );

//       setSubmitted(true);
//     } catch (err) {
//       console.error(err);
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
//         Please Enter Comment / Notes
//       </h2>
      
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <Input
//           type="text"
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           placeholder="Type here..."
//           style={styles.input}
//         />
        
//         <button 
//           type="submit" 
//           style={styles.button}
//         >
//           Submit
//         </button>
//       </form>
//       {submitted ? <p style={{color:'green'}}>Submitted successfully. 
//       Thank you.</p> :""}
//     </div>
//   );
// }

// // Styles
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
//   input: {
//     padding: '12px',
//     fontSize: '16px',
//     marginBottom: '15px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//     transition: 'border 0.3s ease',
//     outline: 'none',
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
//   }
// };


import axios from 'axios';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { MessageSquare, Send } from 'lucide-react';
import { Label } from '../../components/ui/label';

/**
 * Comment submission component with enhanced UI
 */
export default function SheetComment() {
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const queryData = useQueryObject();

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
   * Handle form submission with improved error handling
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError("Please enter a comment before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      const payload = {
        ...queryData,
        comment: comment.trim(),
      };

      await axios.post(
        `https://webhooks.wa.expert/webhook/${queryData.weid}`, 
        payload
      );

      setSubmitted(true);
      setComment(""); // Clear the form after successful submission
    } catch (err) {
      console.error(err);
      setError("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setComment(e.target.value);
    if (error) setError(""); // Clear error when user starts typing
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <img 
          src="/Images/logo.png" 
          alt="logo" 
          style={styles.logo}
        />
        
        <div style={styles.successContainer}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successHeading}>Thank You!</h2>
          <p style={styles.successMessage}>
            Your comment has been submitted successfully.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setComment("");
            }}
            style={styles.newCommentButton}
          >
            Submit Another Comment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <img 
        src="/Images/logo.png" 
        alt="logo" 
        style={styles.logo}
      />
      
      <div style={styles.headerSection}>
        {/* <MessageSquare size={32} style={styles.headerIcon} /> */}
        {/* <h2 style={styles.heading}>
          Share Your Thoughts
        </h2> */}
        <p style={styles.subheading}>
          Please enter your comment or notes below
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <Label htmlFor="comment" style={styles.inputLabel}>
            Your Comment
          </Label>
          <div style={styles.textareaContainer}>
            <textarea
              id="comment"
              value={comment}
              onChange={handleInputChange}
              placeholder="Type your comment or notes here..."
              style={{
                ...styles.textarea,
                ...(error ? styles.textareaError : {})
              }}
              rows={4}
              disabled={isSubmitting}
            />
            <div style={styles.characterCount}>
              {comment.length} characters
            </div>
          </div>
          
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          style={{
            ...styles.button,
            ...(isSubmitting ? styles.buttonDisabled : {}),
            ...(comment.trim() ? styles.buttonActive : {})
          }}
          disabled={isSubmitting || !comment.trim()}
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
                Submit Comment
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
}

// Enhanced styles
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