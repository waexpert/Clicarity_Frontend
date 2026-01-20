// To Use
// http://localhost:5173/reminder?sender_name=WaExpert&schemaName=lakshy_76190723&weid=12345

import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { MessageSquare, Send } from 'lucide-react';
import { Label } from '../../components/ui/label';
import { Calendar } from "@/components/ui/calendar"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { messages, categories } from "./data.js"
import { TimePicker } from './Component/TimePicker.jsx';
import "./css/reminder.css"




// Custom hook for query parameters
function useQueryObject() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryObj = {};

    for (const [key, value] of searchParams.entries()) {
        queryObj[key] = value;
    }

    return queryObj;
}

function TeamMemberDropdown({ selectedMember, setSelectedMember, teamMembers }) {

    console.log("SchemaName:", teamMembers);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg w-full justify-between">
                <div>
                    <p>{selectedMember ? selectedMember.name : "Select Team Member"}</p>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="start">
                <DropdownMenuLabel>Team Members</DropdownMenuLabel>
                {teamMembers.map((member) => (
                    <DropdownMenuItem
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span>{member.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {member.email}
                                </span>
                                {(member.phone || member.phone_number || member.mobile) && (
                                    <span className="text-xs text-muted-foreground">
                                        {member.phone || member.phone_number || member.mobile}
                                    </span>
                                )}
                            </div>
                        </div>
                        {selectedMember?.id === member.id && (
                            <Check className="ml-auto" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function CategoryDropdown({ selectedCategory, setSelectedCategory, setSelectedMessage }) {
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedMessage(null); // Reset message when category changes
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg w-full justify-between">
                <div>
                    <p>{selectedCategory ? selectedCategory.name : "Select Category"}</p>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="start">
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                {categories.map((category) => (
                    <DropdownMenuItem
                        key={category.id}
                        onClick={() => handleCategoryChange(category)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span>{category.name}</span>
                            </div>
                        </div>
                        {selectedCategory?.id === category.id && (
                            <Check className="ml-auto" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function MessageDropdown({ selectedCategory, selectedMessage, setSelectedMessage }) {
    const availableMessages = selectedCategory ? messages[selectedCategory.name] || [] : [];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg w-full justify-between"
                disabled={!selectedCategory}
            >
                <div>
                    <p>{selectedMessage ? selectedMessage.text : selectedCategory ? "Select Message" : "Select Category First"}</p>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start">
                <DropdownMenuLabel>Messages</DropdownMenuLabel>
                {availableMessages.map((message) => (
                    <DropdownMenuItem
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm">{message.text}</span>
                            </div>
                        </div>
                        {selectedMessage?.id === message.id && (
                            <Check className="ml-auto" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Reminder() {
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false); // Fixed: was array, should be boolean
    const [option, setOption] = useState("custom");
    const [comment, setComment] = useState(""); // Added missing comment state
    const [date, setDate] = useState(undefined);
    const [time, setTime] = useState("10:30:00");
    const today = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const queryData = useQueryObject();
    const userData = useSelector((state) => state.user);
    const [selectedTime, setSelectedTime] = useState("12:00 AM");

    // Added missing handleInputChange function
    const handleInputChange = (e) => {
        setComment(e.target.value);
    };

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            setError('');

            if (!userData || !userData.schema_name) {
                throw new Error('User schema not found. Please log in again.');
            }

            const schemaName = userData.schema_name;
            console.log('Fetching data for schema:', schemaName);

            const apiUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`;
            console.log('API URL:', apiUrl);

            const response = await axios.post(apiUrl, {
                schemaName: schemaName,
                tableName: 'team_member'
            });
            const data = response.data;
            console.log('Fetched team members:', data);
            setTeamMembers(data);
        } catch (err) {
            let errorMessage = 'Failed to load team members. ';
            if (err.response) {
                // Server responded with error status
                errorMessage += `Server error (${err.response.status}): ${err.response.data?.error || err.response.statusText}`;
            } else if (err.request) {
                errorMessage += 'Please check if the server is running.';
            } else {
                // Something else happened
                errorMessage += err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, [userData]);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Both options require team member selection
    //     if (!selectedMember) {
    //         setError("Please select a team member.");
    //         return;
    //     }

    //     // Different validation for custom vs template
    //     if (option === "custom") {
    //         if (!comment.trim()) {
    //             setError("Please enter a comment before submitting.");
    //             return;
    //         }
    //     } else {
    //         if (!selectedCategory || !selectedMessage) {
    //             setError("Please select category and message before submitting.");
    //             return;
    //         }
    //     }

    //     try {
    //         setIsSubmitting(true);
    //         setError("");

    //         let payload;

    //         if (option === "custom") {
    //             payload = {
    //                 ...queryData,
    //                 teamMember: {
    //                     id: selectedMember.id,
    //                     name: selectedMember.name,
    //                     email: selectedMember.email,
    //                     phone: selectedMember.number || selectedMember.phone_number || selectedMember.mobile || ""
    //                 },
    //                 comment: comment.trim(),
    //                 type: "custom"
    //             };
    //         } else {
    //             payload = {
    //                 ...queryData,
    //                 teamMember: {
    //                     id: selectedMember.id,
    //                     name: selectedMember.name,
    //                     email: selectedMember.email,
    //                     phone: selectedMember.number || selectedMember.phone_number || selectedMember.mobile || ""
    //                 },
    //                 category: {
    //                     id: selectedCategory.id,
    //                     name: selectedCategory.name
    //                 },
    //                 message: {
    //                     id: selectedMessage.id,
    //                     text: selectedMessage.text
    //                 },
    //                 type: "template"
    //             };
    //         }

    //         await axios.post(
    //             `https://webhooks.wa.expert/webhook/${queryData.weid}`,
    //             payload
    //         );

    //         setSubmitted(true);
    //         // Reset all form data after successful submission
    //         setSelectedMember(null);
    //         setSelectedCategory(null);
    //         setSelectedMessage(null);
    //         setDate(undefined);
    //         setTime("10:30:00");
    //         setComment("");
    //     } catch (err) {
    //         console.error(err);
    //         setError("Failed to submit. Please try again.");
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation logic stays the same...
        if (!selectedMember) {
            setError("Please select a team member.");
            return;
        }

        if (!selectedDate) {
            setError("Please select a date.");
            return;
        }

        if (!selectedTime) {
            setError("Please select a time.");
            return;
        }

        // Different validation for custom vs template
        if (option === "custom" || option === "task") {
            if (!comment.trim()) {
                setError("Please enter a comment before submitting.");
                return;
            }
        } else if (option === "template") {
            if (!selectedCategory || !selectedMessage) {
                setError("Please select category and message before submitting.");
                return;
            }
        }

        try {
            setIsSubmitting(true);
            setError("");

            let payload;

            if (option === "custom") {
                payload = {
                    title: "Custom Message",
                    message: comment.trim(),
                    reminder_time: selectedTime, // 24-hour format like "14:30"
                    reminder_date: selectedDate, // YYYY-MM-DD format
                    recipient_name: selectedMember.name,
                    recipient_phone: selectedMember.phone || selectedMember.number || selectedMember.phone_number || selectedMember.mobile || "",
                    sender_name: queryData.sender_name || selectedMember.name,
                    reminder_type: queryData.reminder_type || "Custom Message",
                    schemaName: queryData.schemaName || userData?.schema_name || "",
                    // Include any additional query parameters
                    ...queryData
                };
            } else if (option === "template") {
                payload = {
                    title: "Template Reminder",
                    message: selectedMessage.text,
                    reminder_time: selectedTime,
                    reminder_date: selectedDate,
                    recipient_name: selectedMember.name,
                    recipient_phone: selectedMember.phone || selectedMember.number || selectedMember.phone_number || selectedMember.mobile || "",
                    sender_name: queryData.sender_name || selectedMember.name,
                    reminder_type: queryData.reminder_type || "Template Message",
                    schemaName: queryData.schemaName || userData?.schema_name || "",
                    category: selectedCategory.name,
                    // Include any additional query parameters
                    ...queryData
                };
            } else { // task
                payload = {
                    title: "Task Reminder",
                    message: comment.trim(),
                    reminder_time: selectedTime,
                    reminder_date: selectedDate,
                    recipient_name: selectedMember.name,
                    recipient_phone: selectedMember.phone || selectedMember.number || selectedMember.phone_number || selectedMember.mobile || "",
                    sender_name: queryData.sender_name || "WaExpert",
                    reminder_type: queryData.reminder_type || "Task Message",
                    schemaName: queryData.schemaName || userData?.schema_name || "",
                    // Include any additional query parameters
                    ...queryData
                };
            }

            // Override with user-selected values (these take priority over query params)
            payload.reminder_time = selectedTime;
            payload.reminder_date = selectedDate;
            payload.recipient_name = selectedMember.name;
            payload.recipient_phone = selectedMember.phone || selectedMember.number || selectedMember.phone_number || selectedMember.mobile || "";

            console.log("Sending payload:", payload);

            // Make POST request to the new endpoint
            const response = await axios.post(
                '${import.meta.env.VITE_APP_BASE_URL}/reminder/add',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log("Response:", response.data);

            setSubmitted(true);
            // Reset all form data after successful submission
            setSelectedMember(null);
            setSelectedCategory(null);
            setSelectedMessage(null);
            setSelectedDate(today);
            setSelectedTime("12:00");
            setComment("");
        } catch (err) {
            console.error("Error submitting reminder:", err);
            let errorMessage = "Failed to submit reminder. ";

            if (err.response) {
                errorMessage += `Server error (${err.response.status}): ${err.response.data?.message || err.response.statusText}`;
            } else if (err.request) {
                errorMessage += "Please check your internet connection.";
            } else {
                errorMessage += err.message;
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
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
                        Your {option === "custom" ? "comment" : "reminder"} has been sent successfully.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setSelectedMember(null);
                            setSelectedCategory(null);
                            setSelectedMessage(null);
                            setComment("");
                            setError("");
                            setDate(undefined);
                            setTime("10:30:00");
                        }}
                        style={{ ...styles.newCommentButton, ...styles.newCommentButtonHover }}
                        className="new-comment-button"
                    >
                        Send Another {option === "custom" ? "Comment" : "Reminder"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <img
                src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
                alt="logo"
                style={styles.logo}
            />

            <div style={styles.headerSection}>
                <p style={styles.subheading}>
                    Select your preferred option and fill the details
                </p>
            </div>

            <RadioGroup
                defaultValue="custom"
                onValueChange={(value) => {
                    setOption(value);
                    setError(""); // Clear error when switching options
                }}
                className="flex items-center space-x-6 mb-6"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom Reminder Message</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="template" id="template" />
                    <Label htmlFor="template">Template Reminder Message</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="task" id="task" />
                    <Label htmlFor="task">Custom Task Message</Label>
                </div>
            </RadioGroup>

            {option === "custom" ? (
                // Custom Form
                <form onSubmit={handleSubmit} style={styles.form}>

                    <div className="flex justify-between">
                        <input type="date"
                            name="date"
                            id="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <TimePicker onTimeChange={setSelectedTime} />
                    </div>


                    {/* {console.log("Selected time:", selectedTime)} */}
                    <div style={styles.inputGroup}>
                        <Label style={styles.inputLabel}>Team Member</Label>
                        <TeamMemberDropdown
                            selectedMember={selectedMember}
                            setSelectedMember={setSelectedMember}
                            teamMembers={teamMembers}
                        />
                    </div>

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
                                    ...(error ? styles.textareaError : {}),
                                }}
                                rows={4}
                                disabled={isSubmitting}
                            />
                            <div style={styles.characterCount}>{comment.length} characters</div>
                        </div>

                        {error && <div style={styles.errorMessage}>{error}</div>}
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(isSubmitting ? styles.buttonDisabled : {}),
                            ...(selectedMember && comment.trim() ? styles.buttonActive : {}),
                        }}
                        disabled={isSubmitting || !selectedMember || !comment.trim()}
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
            ) : option === "template" ? (
                // Template Form
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div className="flex justify-between">
                        <input type="date"
                            name="date"
                            id="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <TimePicker onTimeChange={setSelectedTime} />
                    </div>


                    <div style={styles.inputGroup}>
                        <Label style={styles.inputLabel}>Team Member</Label>
                        <TeamMemberDropdown
                            selectedMember={selectedMember}
                            setSelectedMember={setSelectedMember}
                            teamMembers={teamMembers}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <Label style={styles.inputLabel}>Category</Label>
                        <CategoryDropdown
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            setSelectedMessage={setSelectedMessage}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <Label style={styles.inputLabel}>Message</Label>
                        <MessageDropdown
                            selectedCategory={selectedCategory}
                            selectedMessage={selectedMessage}
                            setSelectedMessage={setSelectedMessage}
                        />
                    </div>

                    {error && <div style={styles.errorMessage}>{error}</div>}

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(isSubmitting ? styles.buttonDisabled : {}),
                            ...(selectedMember && selectedCategory && selectedMessage
                                ? styles.buttonActive
                                : {}),
                        }}
                        disabled={
                            isSubmitting || !selectedMember || !selectedCategory || !selectedMessage
                        }
                    >
                        <div style={styles.buttonContent}>
                            {isSubmitting ? (
                                <>
                                    <div style={styles.spinner}></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Send Reminder
                                </>
                            )}
                        </div>
                    </button>
                </form>
            ) : (
                // Default fallback
                <form onSubmit={handleSubmit} style={styles.form}>

                    <div className="flex justify-between">
                        <input type="date"
                            name="date"
                            id="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <TimePicker onTimeChange={setSelectedTime} />
                    </div>

                    <div style={styles.inputGroup}>
                        <Label style={styles.inputLabel}>Team Member</Label>
                        <TeamMemberDropdown
                            selectedMember={selectedMember}
                            setSelectedMember={setSelectedMember}
                            teamMembers={teamMembers}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <Label htmlFor="comment" style={styles.inputLabel}>
                            Add Task In Detail
                        </Label>
                        <div style={styles.textareaContainer}>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={handleInputChange}
                                placeholder="Type your comment or notes here..."
                                style={{
                                    ...styles.textarea,
                                    ...(error ? styles.textareaError : {}),
                                }}
                                rows={4}
                                disabled={isSubmitting}
                            />
                            <div style={styles.characterCount}>{comment.length} characters</div>
                        </div>

                        {error && <div style={styles.errorMessage}>{error}</div>}
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(isSubmitting ? styles.buttonDisabled : {}),
                            ...(selectedMember && comment.trim() ? styles.buttonActive : {}),
                        }}
                        disabled={isSubmitting || !selectedMember || !comment.trim()}
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
            )}

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
        '@media (max-width: 768px)': {
            margin: '20px auto',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '95vw',
        },
        '@media (max-width: 480px)': {
            margin: '10px auto',
            padding: '16px',
            borderRadius: '8px',
            maxWidth: '98vw',
            minHeight: '350px',
        },
    },
    logo: {
        width: '20rem',
        height: 'auto',
        marginBottom: '1.5rem',
        '@media (max-width: 768px)': {
            width: '16rem',
            marginBottom: '1.25rem',
        },
        '@media (max-width: 480px)': {
            width: '12rem',
            marginBottom: '1rem',
        },
    },
    headerSection: {
        textAlign: 'center',
        marginBottom: '32px',
        width: '100%',
        '@media (max-width: 768px)': {
            marginBottom: '24px',
        },
        '@media (max-width: 480px)': {
            marginBottom: '20px',
        },
    },
    heading: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2d3748',
        margin: '0 0 8px 0',
        lineHeight: '1.3',
        '@media (max-width: 768px)': {
            fontSize: '22px',
        },
        '@media (max-width: 480px)': {
            fontSize: '20px',
            lineHeight: '1.2',
        },
    },
    subheading: {
        fontSize: '16px',
        color: '#718096',
        margin: 0,
        lineHeight: '1.5',
        '@media (max-width: 768px)': {
            fontSize: '15px',
        },
        '@media (max-width: 480px)': {
            fontSize: '14px',
        },
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '24px',
        '@media (max-width: 768px)': {
            gap: '20px',
        },
        '@media (max-width: 480px)': {
            gap: '16px',
        },
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
        '@media (max-width: 480px)': {
            gap: '6px',
        },
    },
    inputLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '4px',
        '@media (max-width: 480px)': {
            fontSize: '13px',
            marginBottom: '2px',
        },
    },
    textareaContainer: {
        position: 'relative',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        color: '#2d3748',
        outline: 'none',
        transition: 'border-color 0.3s ease',
        fontFamily: 'inherit',
        resize: 'vertical',
        minHeight: '100px',
        '@media (max-width: 768px)': {
            padding: '10px',
            fontSize: '16px', // Keep 16px to prevent zoom on iOS
            minHeight: '90px',
        },
        '@media (max-width: 480px)': {
            padding: '8px',
            fontSize: '16px', // Keep 16px to prevent zoom on iOS
            minHeight: '80px',
            borderRadius: '6px',
        },
    },
    textareaError: {
        borderColor: '#e53e3e',
    },
    characterCount: {
        position: 'absolute',
        bottom: '8px',
        right: '12px',
        fontSize: '12px',
        color: '#a0aec0',
        backgroundColor: '#ffffff',
        padding: '2px 4px',
        '@media (max-width: 768px)': {
            right: '10px',
            bottom: '6px',
            fontSize: '11px',
        },
        '@media (max-width: 480px)': {
            right: '8px',
            bottom: '4px',
            fontSize: '10px',
        },
    },
    errorMessage: {
        fontSize: '14px',
        color: '#e53e3e',
        backgroundColor: '#fed7d7',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #feb2b2',
        '@media (max-width: 768px)': {
            fontSize: '13px',
            padding: '6px 10px',
        },
        '@media (max-width: 480px)': {
            fontSize: '12px',
            padding: '6px 8px',
            borderRadius: '4px',
        },
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
        '@media (max-width: 768px)': {
            padding: '14px 20px',
            fontSize: '15px',
            minHeight: '50px',
            borderRadius: '10px',
        },
        '@media (max-width: 480px)': {
            padding: '12px 16px',
            fontSize: '14px',
            minHeight: '44px',
            borderRadius: '8px',
        },
    },
    buttonActive: {
        backgroundColor: '#4388c1',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(67, 136, 193, 0.3)',
        '@media (max-width: 480px)': {
            boxShadow: '0 2px 8px rgba(67, 136, 193, 0.3)',
        },
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
        '@media (max-width: 480px)': {
            gap: '6px',
        },
    },
    spinner: {
        width: '16px',
        height: '16px',
        border: '2px solid transparent',
        borderTop: '2px solid #ffffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        '@media (max-width: 480px)': {
            width: '14px',
            height: '14px',
        },
    },
    successContainer: {
        textAlign: 'center',
        padding: '40px 20px',
        width: '100%',
        '@media (max-width: 768px)': {
            padding: '32px 16px',
        },
        '@media (max-width: 480px)': {
            padding: '24px 12px',
        },
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
        '@media (max-width: 768px)': {
            width: '56px',
            height: '56px',
            fontSize: '28px',
            marginBottom: '20px',
        },
        '@media (max-width: 480px)': {
            width: '48px',
            height: '48px',
            fontSize: '24px',
            marginBottom: '16px',
        },
    },
    successHeading: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2d3748',
        margin: '0 0 12px 0',
        '@media (max-width: 768px)': {
            fontSize: '22px',
            marginBottom: '10px',
        },
        '@media (max-width: 480px)': {
            fontSize: '20px',
            marginBottom: '8px',
        },
    },
    successMessage: {
        fontSize: '16px',
        color: '#718096',
        margin: '0 0 32px 0',
        lineHeight: '1.5',
        '@media (max-width: 768px)': {
            fontSize: '15px',
            marginBottom: '24px',
        },
        '@media (max-width: 480px)': {
            fontSize: '14px',
            marginBottom: '20px',
        },
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
        '@media (max-width: 768px)': {
            padding: '10px 20px',
            fontSize: '13px',
        },
        '@media (max-width: 480px)': {
            padding: '8px 16px',
            fontSize: '12px',
            borderRadius: '6px',
        },
    },
    newCommentButtonHover: {
        ':hover': {
            backgroundColor: '#4388c1',
            color: 'white',
        }
    }
};




// Add CSS animations
if (typeof document !== 'undefined') {
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
      
      button:not(:disabled):hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(67, 136, 193, 0.4) !important;
      }
      
      .new-comment-button:hover {
        background-color: #4388c1 !important;
        color: white !important;
      }
      
      textarea:focus {
        border-color: #4388c1 !important;
      }
    `;
    document.head.appendChild(styleSheet);
}


