import { Database,
     Grid2x2,
     Table2,
     FileSpreadsheet,
     UserStar,
     UserLock,
     Key ,
     BookMarked,
     Shredder,
    ClockArrowUp,
CreditCard,Users} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// CREATE TABLE action_button_setup (
//   id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   us_id        TEXT NOT NULL UNIQUE,
//   owner_id     UUID,
//   schema_name  TEXT,
//   table_name   TEXT,
//   name         TEXT NOT NULL,
//   description  TEXT,
//   icon         TEXT NOT NULL,
//   route        TEXT NOT NULL,
//   action_card  BOOLEAN DEFAULT FALSE,

//   -- Menu configuration
//   menu_name    TEXT DEFAULT 'Action Buttons',
//   menu_count   INT DEFAULT 0 CHECK (menu_count <= 5),

//   -- Stores the items array: [{icon, label, route, divider, sort_order}]
//   action_schema JSONB DEFAULT '[]'::JSONB,

//   created_at   TIMESTAMPTZ DEFAULT NOW(),
//   updated_at   TIMESTAMPTZ DEFAULT NOW()
// );



// ── Animations ──────────────────────────────────────────────────────────────
const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Styled Components ────────────────────────────────────────────────────────
const Nav = styled.nav`
  background: #ffffff;
  border-bottom: 1px solid #e8ecf0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 52px;
  position: sticky;
  top: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
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
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-primary);
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

const DropItem = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 7px;
  font-size: 13px;
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
    font-size: 16px;
    color: #9ca3af;
    transition: color 0.12s;
    width: 20px;
    text-align: center;
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

// ── Data ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "Data Base",
    items: [
      { icon: <Database/> , label: "Database" ,route:"/database"},
      { icon: <Table2/> , label: "Tables",route:"/db/da0bf972-df97-4b2d-82fb-edc7f45a0cd1" },
      { icon: <FileSpreadsheet/> , label: "Create Table",route:"/db/custom/capture" },
    //   { divider: true }
    ],
  },
  {
    label: "Roles",
    items: [
      { icon: <UserStar/>, label: "Roles Manager",route:"/roles/manager" },
      { icon: <UserLock/>, label: "Create Roles" ,route:"/roles/create"},
      { icon: <Key/>, label: "Assign Roles" ,route:"/roles/assign"},
      { divider: true },
      { icon: <Users/>, label: "Team Members" ,route:"/roles/team-members"},
    ],
  },
  {
    label: "Forms",
    items: [
      { icon: <BookMarked/>, label: "Form Manager",route:"/forms/manager" },
      { icon: <Shredder/>, label: "Create Form",route:"/forms/create" },
    //   { icon: "📈", label: "Analytics" },
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: <ClockArrowUp/>, label: "Custom Update" ,route:"/custom-update"},
      { icon: <CreditCard/>, label: "Custom View",route:"/custom-view" },
    //   { icon: "🔔", label: "Triggers" },
    ],
  },
];

// const MORE_ITEMS = [
//   { icon: "⚙️", label: "Settings" },
//   { icon: "📖", label: "Documentation" },
//   { icon: "🔒", label: "Billing" },
//   { divider: true },
//   { icon: "🚪", label: "Logout" },
// ];

// ── Icons ─────────────────────────────────────────────────────────────────────
const Chevron = () => (
  <svg className="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 6 8 10 12 6" />
  </svg>
);


// ── Dropdown — Portal-based to escape any parent overflow clipping ────────────
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

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reposition on scroll
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
                <DropItem key={i} href={item.route}>
                  <span className="icon">{item.icon}</span>
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

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Menus() {
  return (
    <Nav>
      <DashboardIcon>
        <Link to={"/"} className="flex items-center gap-2">
               <Grid2x2/>
        Home
        </Link>

      </DashboardIcon>

      {NAV_ITEMS.map((item) => (
        <Dropdown key={item.label} label={item.label} items={item.items} />
      ))}

      {/* <NavItem style={{ marginLeft: "auto" }}>
        <Dropdown label="More" items={MORE_ITEMS} />
      </NavItem> */}
    </Nav>
  );
}