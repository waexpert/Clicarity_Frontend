import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, AlertCircle, Loader2 } from "lucide-react";
import { Label } from "../../components/ui/label";
import { useSelector } from 'react-redux';

export default function AssignTeamMember() {
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [teamMember, setTeamMember] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const queryData = useQueryObject();
    const user = useSelector((state) => state.user);

    function useQueryObject() {
        const searchParams = new URLSearchParams(useLocation().search);
        const queryObj = {};
        for (const [key, value] of searchParams.entries()) {
            queryObj[key] = value;
        }
        return queryObj;
    }

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                setLoading(true);
                setError('');

                // Check if user and schema_name exist
                if (!user || !user.schema_name) {
                    throw new Error('User schema not found. Please log in again.');
                }

                const schemaName = user.schema_name;
                console.log('Fetching data for schema:', schemaName);

                const apiUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`;
                console.log('API URL:', apiUrl);

                const response = await axios.post(apiUrl, {
                    schemaName: schemaName,
                    tableName: 'team_member'
                });

                console.log('Response:', response);

                const data = response.data.data;
                console.log('Fetched team members:', data);

                if (Array.isArray(data)) {
                    setTeamMembers(data);
                } else {
                    throw new Error('Invalid data format received');
                }
            } catch (err) {
                let errorMessage = 'Failed to load team members. ';
                if (err.response) {
                    errorMessage += `Server error (${err.response.status}): ${err.response.data?.error || err.response.statusText}`;
                } else if (err.request) {
                    errorMessage += 'Please check if the server is running.';
                } else {
                    errorMessage += err.message;
                }

                console.error('Error fetching team members:', err);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMembers();
    }, [user]);

    const columnName = queryData.columnName || "assigned_to";
    const commentColumnName = queryData.commentColumn || "assigned_to_comment";

    const handleTeamMemberChange = (e) => {
        setTeamMember(e.target.value);
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teamMember) {
            setError("Please select a team member");
            return;
        }

        try {
            setIsSubmitting(true);


            const params = new URLSearchParams({
                ...queryData,
                schemaName: user.schema_name,
                tableName: queryData.tableName,
                recordId: queryData.recordId,
                ownerId: queryData.ownerId,
                col1: columnName,
                val1: teamMember,
                col2: commentColumnName,
                val2: comment
            });

            const url = `${import.meta.env.VITE_APP_BASE_URL}/data/updateMultiple?${params.toString()}`;
            console.log('Submitting to:', url);

            await axios.get(url);

            setSubmitted(true);

            // Reset form after 2 seconds
            setTimeout(() => {
                setTeamMember("");
                setComment("");
                setSubmitted(false);
            }, 2000);

        } catch (err) {
            console.error("Submission error:", err);
            let errorMessage = "Failed to submit. ";
            if (err.response) {
                errorMessage += `Server error: ${err.response.data?.error || err.response.statusText}`;
            } else {
                errorMessage += "Please try again.";
            }
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <img
                src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
                alt="logo"
                style={styles.logo}
            />

            <h2 style={styles.heading}>
                Assign Team Member
            </h2>

            {error && !isSubmitting && (
                <div style={styles.errorBanner}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <Label htmlFor="team-member" style={styles.inputLabel}>
                        Select Team Member <span style={styles.required}>*</span>
                    </Label>
                    {loading ? (
                        <div style={styles.loadingContainer}>
                            <Loader2 size={20} style={styles.loadingIcon} />
                            <span style={styles.loadingText}>Loading team members...</span>
                        </div>
                    ) : (
                        <select
                            id="team-member"
                            value={teamMember}
                            onChange={handleTeamMemberChange}
                            style={{
                                ...styles.select,
                                ...(error && !teamMember && !isSubmitting ? styles.inputError : {})
                            }}
                            disabled={isSubmitting || loading}
                        >
                            <option value="">-- Select Team Member --</option>
                            {teamMembers.map((member, index) => (
                                <option key={member.id || index} value={member.name || member.id}>
                                    {member.name ?
                                        (member.name.charAt(0).toUpperCase() + member.name.slice(1)) :
                                        `Member ${index + 1}`
                                    }
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div style={styles.inputGroup}>
                    <Label htmlFor="comment" style={styles.inputLabel}>
                        Comment / Notes (Optional)
                    </Label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add any additional notes..."
                        style={styles.textarea}
                        rows={4}
                        disabled={isSubmitting}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        ...(isSubmitting || !teamMember || loading ? styles.buttonDisabled : {})
                    }}
                    disabled={isSubmitting || !teamMember || loading}
                    onMouseEnter={(e) => {
                        if (!isSubmitting && teamMember && !loading) {
                            e.currentTarget.style.backgroundColor = '#3182ce';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(67, 136, 193, 0.4)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isSubmitting && teamMember && !loading) {
                            e.currentTarget.style.backgroundColor = '#4388c1';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }}
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
                                Assign Team Member
                            </>
                        )}
                    </div>
                </button>
            </form>

            {submitted && (
                <div style={styles.successMessage}>
                    <p style={styles.successText}>Team member assigned successfully!</p>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '540px',
        margin: '40px auto',
        padding: '40px',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    logo: {
        width: '20rem',
        height: 'auto',
        marginBottom: '2rem',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '24px',
        color: '#2d3748',
        fontWeight: '700',
        fontSize: '24px',
        lineHeight: '1.3',
    },
    errorBanner: {
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#fed7d7',
        border: '1px solid #fc8181',
        borderRadius: '8px',
        color: '#742a2a',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px',
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
    },
    inputLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '4px',
    },
    required: {
        color: '#e53e3e',
        marginLeft: '4px',
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #cbd5e0',
        backgroundColor: '#f7fafc',
    },
    loadingIcon: {
        color: '#4388c1',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        fontSize: '14px',
        color: '#718096',
    },
    select: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #cbd5e0',
        fontSize: '15px',
        transition: 'all 0.2s ease',
        outline: 'none',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        color: '#2d3748',
    },
    textarea: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #cbd5e0',
        fontSize: '14px',
        transition: 'border-color 0.2s ease',
        outline: 'none',
        fontFamily: 'inherit',
        resize: 'vertical',
        lineHeight: '1.5',
    },
    inputError: {
        borderColor: '#fc8181',
        backgroundColor: '#fff5f5',
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
        minHeight: '52px',
        marginTop: '8px',
    },
    buttonDisabled: {
        backgroundColor: '#cbd5e0',
        cursor: 'not-allowed',
        opacity: 0.6,
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
        marginTop: '24px',
        padding: '16px 24px',
        backgroundColor: '#c6f6d5',
        border: '1px solid #9ae6b4',
        borderRadius: '8px',
        width: '100%',
    },
    successText: {
        color: '#22543d',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center',
        margin: 0,
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