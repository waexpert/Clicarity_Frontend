// import { Database,
//      Grid2x2,
//      Table2,
//      FileSpreadsheet,
//      UserStar,
//      UserLock,
//      Key ,
//      BookMarked,
//      Shredder,
//     ClockArrowUp,
//     Table,
// CreditCard,Users} from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { Link } from "react-router-dom";
// import styled, { keyframes } from "styled-components";

// // CREATE TABLE action_button_setup (
// //   id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
// //   us_id        TEXT NOT NULL UNIQUE,
// //   owner_id     UUID,
// //   schema_name  TEXT,
// //   table_name   TEXT,
// //   name         TEXT NOT NULL,
// //   description  TEXT,
// //   icon         TEXT NOT NULL,
// //   route        TEXT NOT NULL,
// //   action_card  BOOLEAN DEFAULT FALSE,

// //   -- Menu configuration
// //   menu_name    TEXT DEFAULT 'Action Buttons',
// //   menu_count   INT DEFAULT 0 CHECK (menu_count <= 5),

// //   -- Stores the items array: [{icon, label, route, divider, sort_order}]
// //   action_schema JSONB DEFAULT '[]'::JSONB,

// //   created_at   TIMESTAMPTZ DEFAULT NOW(),
// //   updated_at   TIMESTAMPTZ DEFAULT NOW()
// // );



// // ── Animations ──────────────────────────────────────────────────────────────
// const fadeDown = keyframes`
//   from { opacity: 0; transform: translateY(-6px); }
//   to   { opacity: 1; transform: translateY(0); }
// `;

// // ── Styled Components ────────────────────────────────────────────────────────
// const Nav = styled.nav`
//   background: #ffffff;
//   border-bottom: 1px solid #e8ecf0;
//   padding: 0 24px;
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   height: 52px;
//   position: sticky;
//   top: 0;
//   box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
// `;

// const NavItem = styled.div`
//   position: relative;
// `;

// const NavButton = styled.button`
//   display: flex;
//   align-items: center;
//   gap: 5px;
//   padding: 6px 12px;
//   border: none;
//   background: none;
//   border-radius: 6px;
//   cursor: pointer;
//   font-size: 13.5px;
//   font-weight: 500;
//   color: ${({ $active }) => ($active ? "var(--color-primary)" : "#374151")};
//   background: ${({ $active }) => ($active ? "#eef2ff" : "transparent")};
//   transition: background 0.15s, color 0.15s;
//   white-space: nowrap;
//   user-select: none;

//   &:hover {
//     background: ${({ $active }) => ($active ? "#e0e9ff" : "#f3f4f6")};
//     color: ${({ $active }) => ($active ? "var(--color-primary)" : "#111827")};
//   }

//   svg.chevron {
//     width: 13px;
//     height: 13px;
//     transition: transform 0.2s;
//     transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0)")};
//     color: #9ca3af;
//   }
// `;

// const DashboardIcon = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 7px;
//   padding: 6px 14px 6px 4px;
//   font-size: 13.5px;
//   font-weight: 600;
//   color: var(--color-primary);
//   cursor: pointer;
//   svg {
//     width: 18px;
//     height: 18px;
//   }
// `;

// const DropMenu = styled.div`
//   position: fixed;
//   top: ${({ $top }) => $top}px;
//   left: ${({ $left }) => $left}px;
//   background: #ffffff;
//   border: 1px solid #e5e7eb;
//   border-radius: 10px;
//   box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
//   min-width: 200px;
//   padding: 6px;
//   animation: ${fadeDown} 0.18s ease;
//   z-index: 99999;
// `;

// const DropItem = styled.a`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   padding: 9px 12px;
//   border-radius: 7px;
//   font-size: 13px;
//   color: #374151;
//   text-decoration: none;
//   cursor: pointer;
//   transition: background 0.12s, color 0.12s;

//   &:hover {
//     background: #f0f4ff;
//     color: var(--color-primary);
//     span.icon { color: var(--color-primary); }
//   }

//   span.icon {
//     font-size: 16px;
//     color: #9ca3af;
//     transition: color 0.12s;
//     width: 20px;
//     text-align: center;
//   }
//   span.label { flex: 1; font-weight: 500; }
//   span.badge {
//     font-size: 10px;
//     font-weight: 600;
//     background: var(--color-primary);
//     color: white;
//     border-radius: 20px;
//     padding: 1px 7px;
//   }
// `;

// const Divider = styled.hr`
//   border: none;
//   border-top: 1px solid #f3f4f6;
//   margin: 4px 6px;
// `;

// // ── Data ─────────────────────────────────────────────────────────────────────
// const NAV_ITEMS = [
//   {
//     label: "Data Base",
//     items: [
//       { icon: <Database/> , label: "Database" ,route:"/database"},
//       { icon: <Table2/> , label: "Tables",route:"/db/da0bf972-df97-4b2d-82fb-edc7f45a0cd1" },
//       { icon: <FileSpreadsheet/> , label: "Create Table",route:"/db/custom/capture" },
//     //   { divider: true }
//     ],
//   },
//     {
//     label: "Tables",
//     items: [
//       { icon: <Table/> , label: "Database" ,route:"/database"},
//     ],
//   },
//   {
//     label: "Roles",
//     items: [
//       { icon: <UserStar/>, label: "Roles Manager",route:"/roles/manager" },
//       { icon: <UserLock/>, label: "Create Roles" ,route:"/roles/create"},
//       { icon: <Key/>, label: "Assign Roles" ,route:"/roles/assign"},
//       { divider: true },
//       { icon: <Users/>, label: "Team Members" ,route:"/roles/team-members"},
//     ],
//   },
//   {
//     label: "Forms",
//     items: [
//       { icon: <BookMarked/>, label: "Form Manager",route:"/forms/manager" },
//       { icon: <Shredder/>, label: "Create Form",route:"/forms/create" },
//     //   { icon: "📈", label: "Analytics" },
//     ],
//   },
//   {
//     label: "Tools",
//     items: [
//       { icon: <ClockArrowUp/>, label: "Custom Update" ,route:"/custom-update"},
//       { icon: <CreditCard/>, label: "Custom View",route:"/custom-view" },
//     //   { icon: "🔔", label: "Triggers" },
//     ],
//   },
// ];

// // const MORE_ITEMS = [
// //   { icon: "⚙️", label: "Settings" },
// //   { icon: "📖", label: "Documentation" },
// //   { icon: "🔒", label: "Billing" },
// //   { divider: true },
// //   { icon: "🚪", label: "Logout" },
// // ];

// // ── Icons ─────────────────────────────────────────────────────────────────────
// const Chevron = () => (
//   <svg className="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor"
//     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="4 6 8 10 12 6" />
//   </svg>
// );


// // ── Dropdown — Portal-based to escape any parent overflow clipping ────────────
// function Dropdown({ label, items }) {
//   const [open, setOpen] = useState(false);
//   const [coords, setCoords] = useState({ top: 0, left: 0 });
//   const btnRef = useRef(null);
//   const menuRef = useRef(null);

//   const openMenu = () => {
//     if (btnRef.current) {
//       const rect = btnRef.current.getBoundingClientRect();
//       setCoords({ top: rect.bottom + 8, left: rect.left });
//     }
//     setOpen((v) => !v);
//   };

//   // Close on outside click
//   useEffect(() => {
//     if (!open) return;
//     const handler = (e) => {
//       if (
//         menuRef.current && !menuRef.current.contains(e.target) &&
//         btnRef.current && !btnRef.current.contains(e.target)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [open]);

//   // Reposition on scroll
//   useEffect(() => {
//     if (!open) return;
//     const onScroll = () => {
//       if (btnRef.current) {
//         const rect = btnRef.current.getBoundingClientRect();
//         setCoords({ top: rect.bottom + 8, left: rect.left });
//       }
//     };
//     window.addEventListener("scroll", onScroll, true);
//     return () => window.removeEventListener("scroll", onScroll, true);
//   }, [open]);

//   return (
//     <NavItem>
//       <NavButton ref={btnRef} $open={open} onClick={openMenu}>
//         {label}
//         <Chevron />
//       </NavButton>

//       {open &&
//         createPortal(
//           <DropMenu ref={menuRef} $top={coords.top} $left={coords.left}>
//             {items.map((item, i) =>
//               item.divider ? (
//                 <Divider key={i} />
//               ) : (
//                 <DropItem key={i} href={item.route}>
//                   <span className="icon">{item.icon}</span>
//                   <span className="label">{item.label}</span>
//                   {item.badge && <span className="badge">{item.badge}</span>}
//                 </DropItem>
//               )
//             )}
//           </DropMenu>,
//           document.body
//         )}
//     </NavItem>
//   );
// }

// // ── Main Export ───────────────────────────────────────────────────────────────
// export default function Menus() {
//   return (
//     <Nav>
//       <DashboardIcon>
//         <Link to={"/"} className="flex items-center gap-2">
//                <Grid2x2/>
//         Home
//         </Link>

//       </DashboardIcon>

//       {NAV_ITEMS.map((item) => (
//         <Dropdown key={item.label} label={item.label} items={item.items} />
//       ))}

//       {/* <NavItem style={{ marginLeft: "auto" }}>
//         <Dropdown label="More" items={MORE_ITEMS} />
//       </NavItem> */}
//     </Nav>
//   );
// }



import {
  Database,
  Grid2x2,
  Table2,
  FileSpreadsheet,
  UserStar,
  UserLock,
  Key,
  BookMarked,
  Shredder,
  ClockArrowUp,
  Table,
  CreditCard,
  Users,
  Eye,
  LayoutGrid,
  ShieldCheck,
  Settings,
  SquarePen,
  MousePointerClick
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes, css as styledCss } from "styled-components";
import { setDynamicData } from "../../../features/dataMethod/tableStructureSlice";
import { useSelector } from "react-redux";
import axios from "axios";

const UI_FONT = `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const MONO_FONT = `'JetBrains Mono', 'SF Mono', Menlo, monospace`;
// ── Animations ───────────────────────────────────────────────────────────────
const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeRight = keyframes`
  from { opacity: 0; transform: translateX(-5px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ── Shared Styled Components (unchanged from your original) ──────────────────
const Nav = styled.nav`
  font-family: ${UI_FONT};
  background: #ffffff;
  // border-bottom: 1px solid #e8ecf0;
  font-weight:bold;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 52px;
  position: sticky;
  top: 0;
  // box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
`;

const NavItem = styled.div`
  position: relative;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "var(--color-primary)" : "#374151")};
  background: ${({ $active }) => ($active ? "#eef2ff" : "transparent")};
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  user-select: none;

  &:hover {
    background: ${({ $active }) => ($active ? "#e0e9ff" : "#f3f4f6")};
    color: ${({ $active }) => ($active ? "var(--color-primary)" : "#111827")};
  }

  svg.chevron {
    width: 13px;
    height: 13px;
    transition: transform 0.2s;
    transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0)")};
    color: #9ca3af;
  }
`;

const DashboardIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px 6px 4px;
  font-size: 13px;
  font-weight: 600;
  // color: var(--color-primary);
  cursor: pointer;
  svg {
    width: 18px;
    height: 18px;
  }
`;

const DropMenu = styled.div`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
  min-width: 200px;
  padding: 6px;
  animation: ${fadeDown} 0.18s ease;
  z-index: 99999;
`;

const DropItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 7px;
  font-family: ${UI_FONT};
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: #f0f4ff;
    color: var(--color-primary);
    span.icon { color: var(--color-primary); }
  }

  span.icon {
   width: 30px; height: 30px;
    border-radius: 7px;
    padding:2px;
    font-weight: 200;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s;
  }
  span.label { flex: 1; font-weight: 500; }
  span.badge {
    font-size: 10px;
    font-weight: 600;
    background: var(--color-primary);
    color: white;
    border-radius: 20px;
    padding: 1px 7px;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f3f4f6;
  margin: 4px 6px;
`;

// ── NEW: Tables flyout styled components ─────────────────────────────────────
const TableDropMenu = styled(DropMenu)`
  width: 230px;
  min-width: 230px;
`;

const SubMenu = styled.div`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
  width: 220px;
  padding: 6px;
  z-index: 100000;
  animation: ${fadeRight} 0.14s ease;
`;

const SearchInput = styled.div`
  padding: 4px 2px 8px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 4px;

  input {
    width: 100%;
    padding: 6px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #374151;
      font-family: ${UI_FONT};
  font-size: 12.5px;
    outline: none;
    background: #f9fafb;
    transition: border 0.15s, background 0.15s;

    &:focus {
      border-color: var(--color-primary, #6366f1);
      background: #fff;
    }
    &::placeholder { color: #b0b7c3; }
  }
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border-radius: 7px;
  font-size: 12.5px;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  user-select: none;

  background: ${({ $hovered }) => ($hovered ? "#f0f4ff" : "transparent")};
  color: ${({ $hovered }) => ($hovered ? "var(--color-primary, #6366f1)" : "#374151")};

.t-name {
  flex: 1;
  font-family: ${UI_FONT};
  font-size: 13px;
  font-weight: 500;
}
.t-rows {
  font-family: ${MONO_FONT};
  font-size: 11px;
}
  .t-arrow {
    font-size: 10px;
    color: ${({ $hovered }) => ($hovered ? "var(--color-primary, #6366f1)" : "#d1d5db")};
    transition: color 0.12s, transform 0.12s;
    transform: ${({ $hovered }) => ($hovered ? "translateX(2px)" : "translateX(0)")};
  }
  .t-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #e5e7eb;
    flex-shrink: 0;
    transition: background 0.12s;
    background: ${({ $hovered }) => ($hovered ? "var(--color-primary, #6366f1)" : "#e5e7eb")};
  }
`;

const SubMenuHeader = styled.div`
  padding: 5px 8px 8px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 7px;
 font-family: ${UI_FONT};
  font-size: 12px;
  font-weight: 600;
  color: #374151;

  .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--color-primary, #6366f1);
    flex-shrink: 0;
  }
`;
const ActionItem = styled.button`
  display: flex;
 align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 7px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.12s;
  color: #374151;
  width:100%;

  &:hover {
    background: #f5f7ff;
    .a-icon { transform: scale(1.08); }
    .a-label { color: var(--color-primary, #6366f1); }
  }

  .a-icon {
    width: 30px; height: 30px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s;
  }
.a-label {
  font-family: ${UI_FONT};
  font-size: 13px;
  font-weight: 500;
}
.a-desc {
  font-family: ${UI_FONT};
  font-size: 11.5px;
}
`;

// ── Data ──────────────────────────────────────────────────────────────────────

// Your existing nav items (Tables removed — handled separately below)
const NAV_ITEMS = [
  {
    label: "Database",
    items: [
      { icon: <Database size={15}/>, label: "Database", route: "/database" , bg: "#eef2ff",},
      { icon: <Table2 size={15}/>, label: "Tables", route: "/db/da0bf972-df97-4b2d-82fb-edc7f45a0cd1" ,  bg: "#e0f2fe", },
      { icon: <FileSpreadsheet size={15}/>, label: "Create Table", route: "/db/custom/capture",bg: "#d1fae5", },
    ],
  },
  {
    label: "Roles",
    items: [
      { icon: <UserStar size={15}/>, label: "Roles Manager", route: "/roles/manager", bg: "#eef2ff", },
      { icon: <UserLock size={15}/>, label: "Create Roles", route: "/roles/create" , bg: "#e0f2fe",  },
      { icon: <Key size={15}/>, label: "Assign Roles", route: "/roles/assign",bg: "#d1fae5", },
      { divider: true },
      { icon: <Users size={15}/>, label: "Team Members", route: "/roles/team-members" , bg: "#eef2ff", },
    ],
  },
  {
    label: "Forms",
    items: [
      { icon: <BookMarked size={15}/>, label: "Form Manager", route: "/forms/manager", bg: "#eef2ff",},
      { icon: <Shredder size={15}/>, label: "Create Form", route: "/forms/create" , bg: "#e0f2fe",},
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: <MousePointerClick size={15}/>, label: "Smart Actions", route: "/tools/actions" , bg: "#eef2ff",},
      // { icon: <CreditCard size={15}/>, label: "Custom View", route: "/custom-view", bg: "#e0f2fe", },
    ],
  },
];

 
// 3 actions per table
const TABLE_ACTIONS = [
  {
    id: "view",
    label: "View Data",
    desc: "Browse & filter rows",
    bg: "#eef2ff",
    // color: "#6366f1",
    icon: <Eye size={15} />,
    route: (id) => `/${id}/record`,
  },
  {
    id: "edit",
    label: "Edit Schema",
    desc: "Columns, types & indexes",
    bg: "#e0f2fe",
    // color: "#0ea5e9",
    icon: <SquarePen size={15} />,
    route: (id) => `/db/custom/capture/${id}`,
  },

  {
    id: "setup",
    label: "Setup",
    desc: "Dropdown Setup",
    bg: "#d1fae5",
    // color: "#10b981",
    icon: <Settings size={15} />,
    route: (id) => `/db/setup/${id}`,
  },
];

// ── Chevron ───────────────────────────────────────────────────────────────────
const Chevron = () => (
  <svg className="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 6 8 10 12 6" />
  </svg>
);

// ── Original Dropdown (unchanged behaviour) ──────────────────────────────────
function Dropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 8, left: rect.left });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        setCoords({ top: rect.bottom + 8, left: rect.left });
      }
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open]);

  return (
    <NavItem>
      <NavButton ref={btnRef} $open={open} onClick={openMenu}>
        {label}
        <Chevron />
      </NavButton>

      {open &&
        createPortal(
          <DropMenu ref={menuRef} $top={coords.top} $left={coords.left}>
            {items.map((item, i) =>
              item.divider ? (
                <Divider key={i} />
              ) : (
                <DropItem key={i} to={item.route}>
                  <span className="icon" style={{background:item.bg}}>{item.icon}</span>
                  <span className="label">{item.label}</span>
                  {item.badge && <span className="badge">{item.badge}</span>}
                </DropItem>
              )
            )}
          </DropMenu>,
          document.body
        )}
    </NavItem>
  );
}

// ── NEW: Single table row with hover → submenu ────────────────────────────────
function TableRowItem({ table, parentLeft, parentWidth, onClose }) {
  const [subCoords, setSubCoords] = useState(null);
  const rowRef = useRef(null);
  const hideTimer = useRef(null);
  const navigate = useNavigate();

  const showSub = useCallback(() => {
    clearTimeout(hideTimer.current);
    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      const rightX = parentLeft + parentWidth + 6;
      const fitsRight = rightX + 224 < window.innerWidth;
      setSubCoords({
        top: rect.top - 6,
        left: fitsRight ? rightX : parentLeft - 230,
      });
    }
  }, [parentLeft, parentWidth]);

  const hideSub = useCallback(() => {
    hideTimer.current = setTimeout(() => setSubCoords(null), 130);
  }, []);

  const keepSub = useCallback(() => clearTimeout(hideTimer.current), []);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  return (
    <>
      <TableRow
        ref={rowRef}
        $hovered={!!subCoords}
        onMouseEnter={showSub}
        onMouseLeave={hideSub}
      >
        <span className="t-dot" />
        <span className="t-name">{table.title}</span>
        {/* <span className="t-rows">{table.field_count}</span> */}
        {/* <span className="t-arrow">▶</span> */}
      </TableRow>

      {subCoords &&
        createPortal(
          <SubMenu
            $top={subCoords.top}
            $left={subCoords.left}
            onMouseEnter={keepSub}
            onMouseLeave={hideSub}
          >
            {/* <SubMenuHeader>
             
              {table.name}
            </SubMenuHeader> */}

            {TABLE_ACTIONS.map((action) => (
              <ActionItem
                key={action.id}
                onMouseDown={(e) => e.stopPropagation()}  // added this other wise the routing was not happening since after mouse down the component was unmounted
                onClick={() => {
                  navigate(action.route(table.title));
                  onClose();
                }}
              >
                <div
                  className="a-icon"
                  style={{ background: action.bg, color: action.color }}
                >
                  {action.icon}
                </div>
                <div>
                  <div className="a-label">{action.label}</div>
                  <div className="a-desc">{action.desc}</div>
                </div>
              </ActionItem>
            ))}
          </SubMenu >,
          document.body
        )
      }
    </>
  );
}

// ── NEW: Tables dropdown with search + flyout rows ────────────────────────────
function TablesDropdown() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const MENU_WIDTH = 230;
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [tables, setTables] = useState([]);
  const userData = useSelector((state) => state.user);
  const schemaName = userData.schema_name;
  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 8, left: rect.left });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    getAllTables();
  }, [schemaName]);

  const getAllTables = async () => {
    const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllTables?schemaName=${schemaName}`
    const { data } = await axios.get(route);
    setTables(data.data);
    console.log(data.data);
  }
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        setCoords({ top: rect.bottom + 8, left: rect.left });
      }
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open]);

  const filtered = tables.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <NavItem>
      <NavButton ref={btnRef} $open={open} onClick={openMenu}>
        Tables
        <Chevron />
      </NavButton>

      {open &&
        createPortal(
          <TableDropMenu
            ref={menuRef}
            $top={coords.top}
            $left={coords.left}
            style={{ width: MENU_WIDTH }}
          >
            {/* Search */}
            <SearchInput>
              <input
                placeholder="Search tables…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </SearchInput>

            {/* Table rows */}
            {filtered.length === 0 ? (
              <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
                No tables found
              </div>
            ) : (
              filtered.map((table) => (
                <TableRowItem
                  key={table.id}
                  table={table}
                  parentLeft={coords.left}
                  parentWidth={MENU_WIDTH}
                  onClose={() => setOpen(false)}
                />
              ))
            )}
          </TableDropMenu>,
          document.body
        )}
    </NavItem>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Menus() {
  return (
    <Nav className="">
      {/* Home — unchanged */}
      <DashboardIcon style={{ color: "var(--color-primary)" }}>
        <Link to={"/"} className="flex items-center gap-2">
          <Grid2x2 />
          Home
        </Link>
      </DashboardIcon>
      
        <TablesDropdown />
      {/* Original dropdowns — Data Base, Roles, Forms, Tools */}
      {NAV_ITEMS.map((item) => (
        <Dropdown key={item.label} label={item.label} items={item.items} />
      ))}

      <DashboardIcon>
        <Link to={"/custom-update"} className="flex items-center gap-2">
          Custom Update
        </Link>
      </DashboardIcon>

      <DashboardIcon>
        <Link to={"/custom-view"} className="flex items-center gap-2">
          Custom View
        </Link>
      </DashboardIcon>

    
    </Nav>
  );
}