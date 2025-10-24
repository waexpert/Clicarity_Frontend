import {
  ClipboardList,
  Users,
  Calendar,
  CreditCard,
  BellRing,
  Search,
  UserX,
  DatabaseZap,
  Network
} from "lucide-react";

const dashboardCards = [
  {
    id: 1,
    title: "Task Management",
    description: "Create, assign and track tasks for efficient workflow management.",
    icon: "tasks", // Used for conditional rendering of the icon component
    iconColor: "#4285B4", // You can use your brand color for all or provide different colors
    route: "/tasks"
  },
  {
    id: 2,
    title: "Lead Management",
    description: "Track and manage potential clients through your sales pipeline.",
    icon: "leads",
    iconColor: "#4285B4",
    route: "/leadstatus"
  },
  {
    id: 3,
    title: "Payment Reminder",
    description: "Stay on top of your finances with timely payment notifications.",
    icon: "payments",
    iconColor: "#4285B4",
    route: "/paymentstatus"
  },
  {
    id: 4,
    title: "Expense Tracker",
    description: "Monitor and categorize business expenses to optimize spending.",
    icon: "expenses",
    iconColor: "#4285B4",
    route: "/expensestatus"
  },
  {
    id: 5,
    title: "Birthday Reminder",
    description: "Never miss important dates for clients and team members.",
    icon: "birthdays",
    iconColor: "#4285B4",
    route: "/birthdaystatus"
  },
  // {
  //   id: 6,
  //   title: "Lookup Match",
  //   description: "Search and find matches across your database with advanced filters.",
  //   icon: "lookup",
  //   iconColor: "#4285B4",
  //   route: "/lookupstatus"
  // },
  // {
  //   id: 7,
  //   title: "Leave Management",
  //   description: "Request and approve time off while maintaining team productivity.",
  //   icon: "leaves",
  //   iconColor: "#4285B4",
  //   route: "/leavestatus"
  // },
  {
    id: 8,
    title: "Database Management",
    description: "Organize, store, and manage data securely with streamlined access.",
    icon: "database",
    iconColor: "#4285B4",
    route: "/database"
  },
  {
    id: 9,
    title: "Job Status Report",
    description: "Organize and manage all your processes efficentily.",
    icon: "network",
    iconColor: "#4285B4",
    route: "/jobstatus"
  },
  {
    id: 10,
    title: "Follow Up Reminders",
    description: "Smart reminders to keep your processes flowing smoothly.",
    icon: "bell-ring",
    iconColor: "#4285B4",
    route: "/reminder"
  }
];

// Function to get the appropriate icon component based on the icon name
export const getIconComponent = (iconName) => {
  switch (iconName) {
    case "tasks":
      return ClipboardList;
    case "leads":
      return Users;
    case "payments":
      return CreditCard;
    case "expenses":
      return CreditCard;
    case "birthdays":
      return Calendar;
    case "lookup":
      return Search;
    case "leaves":
      return UserX;
    case "database":
      return DatabaseZap;
    case "network":
      return Network;
    case "bell-ring":
      return BellRing;
    default:
      return DatabaseZap;
  }
};

export default dashboardCards;