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
  Users,
  Eye,
  Settings,
  SquarePen,
  MousePointerClick,
  RefreshCw,
  Layout,
  Home,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import axios from "axios";
import LogoutButton from "../../../components/profile/Logout";

const UI_FONT = `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const MONO_FONT = `'JetBrains Mono', 'SF Mono', Menlo, monospace`;

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeRight = keyframes`
  from { opacity: 0; transform: translateX(-4px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ── Sidebar Nav ──────────────────────────────────────────────────────────────
const Nav = styled.nav`
  font-family: ${UI_FONT};
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1px;
  width: 12.5rem;
  height: 100%;
  padding: 12px 4px;
  overflow-y: auto;
  border-right: 1px solid #f0f0f0;
  
`;

const NavItem = styled.div`
  position: relative;
`;

/* ── Reusable colored icon box ────────────────────────────── */
const IconBox = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $bg }) => $bg || "#f3f4f6"};
  color: ${({ $color }) => $color || "#374151"};
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border: none;
  background: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "var(--color-primary)" : "#374151")};
  background: ${({ $active }) => ($active ? "#eef2ff" : "transparent")};
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  user-select: none;
  width: 100%;

  &:hover {
    background: ${({ $active }) => ($active ? "#e0e9ff" : "#f3f4f6")};
    color: ${({ $active }) => ($active ? "var(--color-primary)" : "#111827")};
  }

  svg.chevron {
    width: 11px;
    height: 11px;
    transition: transform 0.2s;
    transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0)")};
    color: #9ca3af;
    margin-left: auto;
  }
`;

const DashboardIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.15s;

  &:hover { background: #f3f4f6; }

  a {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 8px;
    color: #374151;
    text-decoration: none;
    width: 100%;
  }
`;

// ── Portal Dropdown Menu ─────────────────────────────────────────────────────
const DropMenu = styled.div.attrs(() => ({ 'data-mobile-portal': true }))`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.10), 0 2px 5px rgba(0,0,0,0.05);
  min-width: 170px;
  padding: 4px;
  animation: ${fadeDown} 0.15s ease;
  z-index: 99999;
`;

const DropItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 8px;
  border-radius: 6px;
  font-family: ${UI_FONT};
  font-size: 11.5px;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: #f0f4ff;
    color: var(--color-primary);
  }

  span.icon {
    width: 24px; height: 24px;
    border-radius: 5px;
    padding: 2px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  span.label { flex: 1; font-weight: 500; }
  span.badge {
    font-size: 9px;
    font-weight: 600;
    background: var(--color-primary);
    color: white;
    border-radius: 20px;
    padding: 1px 5px;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f3f4f6;
  margin: 3px 4px;
`;

// ── Tables Flyout ─────────────────────────────────────────────────────────────
const TableDropMenu = styled(DropMenu).attrs(() => ({ 'data-mobile-portal': true }))`
  width: 190px;
  min-width: 190px;
`;

const SubMenu = styled.div.attrs(() => ({ 'data-mobile-portal': true }))`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.10), 0 2px 5px rgba(0,0,0,0.05);
  width: 185px;
  padding: 4px;
  z-index: 100000;
  animation: ${fadeRight} 0.12s ease;
`;

const SearchInput = styled.div`
  padding: 3px 2px 6px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 3px;

  input {
    width: 100%;
    padding: 4px 8px;
    border: 1px solid #e5e7eb;
    border-radius: 5px;
    color: #374151;
    font-family: ${UI_FONT};
    font-size: 11.5px;
    outline: none;
    background: #f9fafb;
    transition: border 0.15s, background 0.15s;

    &:focus { border-color: var(--color-primary, #6366f1); background: #fff; }
    &::placeholder { color: #b0b7c3; }
  }
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  user-select: none;

  background: ${({ $hovered }) => ($hovered ? "#f0f4ff" : "transparent")};
  color: ${({ $hovered }) => ($hovered ? "var(--color-primary, #6366f1)" : "#374151")};

  .t-name {
    flex: 1;
    font-family: ${UI_FONT};
    font-size: 12px;
    font-weight: 500;
  }
  .t-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: background 0.12s;
    background: ${({ $hovered }) => ($hovered ? "var(--color-primary, #6366f1)" : "#e5e7eb")};
  }
`;

const ActionItem = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s;
  color: #374151;
  width: 100%;
  border: none;
  background: none;

  &:hover {
    background: #f5f7ff;
    .a-icon { transform: scale(1.06); }
    .a-label { color: var(--color-primary, #6366f1); }
  }

  .a-icon {
    width: 24px; height: 24px;
    border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s;
  }
  .a-label { font-family: ${UI_FONT}; font-size: 11.5px; font-weight: 500; }
  .a-desc  { font-family: ${UI_FONT}; font-size: 10.5px; color: #9ca3af; }
`;

// ── Data ──────────────────────────────────────────────────────────────────────

// Top-level dashboard links — each has its own icon + color
const DASH_LINKS = [
  //   {
  //   label: "Logout",
  //   icon: <Home size={13} />,
  //   iconBg: "#eef2ff", iconColor: "#6366f1",
  //   route: "/",
  // },
  {
    label: "Home",
    icon: <Home size={13} />,
    iconBg: "#eef2ff", iconColor: "#6366f1",
    route: "/",
  },
  {
    label: "Custom Update",
    icon: <RefreshCw size={13} />,
    iconBg: "#fef3c7", iconColor: "#d97706",
    route: "/custom-update",
  },
  {
    label: "Custom View",
    icon: <Layout size={13} />,
    iconBg: "#fce7f3", iconColor: "#db2777",
    route: "/custom-view",
  },
];

// Dropdown items — each has label, icon, iconBg, iconColor for the NavButton
const NAV_ITEMS = [
  {
    label: "Database",
    icon: <Database size={13} />, iconBg: "#eef2ff", iconColor: "#6366f1",
    items: [
      { icon: <Database size={13}/>,       label: "Database",     route: "/database",                              bg: "#eef2ff" },
      { icon: <Table2 size={13}/>,         label: "Tables",       route: "/db/da0bf972-df97-4b2d-82fb-edc7f45a0cd1", bg: "#e0f2fe" },
      { icon: <FileSpreadsheet size={13}/>,label: "Create Table", route: "/db/custom/capture",                     bg: "#d1fae5" },
    ],
  },
  {
    label: "Roles",
    icon: <UserStar size={13} />, iconBg: "#fef3c7", iconColor: "#d97706",
    items: [
      { icon: <UserStar size={13}/>,  label: "Roles Manager",  route: "/roles/manager",      bg: "#eef2ff" },
      { icon: <UserLock size={13}/>,  label: "Create Roles",   route: "/roles/create",        bg: "#e0f2fe" },
      { icon: <Key size={13}/>,       label: "Assign Roles",   route: "/roles/assign",        bg: "#d1fae5" },
      { divider: true },
      { icon: <Users size={13}/>,     label: "Team Members",   route: "/roles/team-members",  bg: "#eef2ff" },
    ],
  },
  {
    label: "Forms",
    icon: <BookMarked size={13} />, iconBg: "#fce7f3", iconColor: "#db2777",
    items: [
      { icon: <BookMarked size={13}/>, label: "Form Manager", route: "/forms/manager", bg: "#eef2ff" },
      { icon: <Shredder size={13}/>,   label: "Create Form",  route: "/forms/create",  bg: "#e0f2fe" },
    ],
  },
  {
    label: "Tools",
    icon: <MousePointerClick size={13} />, iconBg: "#d1fae5", iconColor: "#059669",
    items: [
      { icon: <MousePointerClick size={13}/>, label: "Smart Actions", route: "/tools/actions", bg: "#eef2ff" },
    ],
  },
];

const TABLE_ACTIONS = [
  { id: "view",  label: "View Data",   desc: "Browse & filter rows",       bg: "#eef2ff", icon: <Eye size={13} />,        route: (id) => `/${id}/record` },
  { id: "edit",  label: "Edit Schema", desc: "Columns, types & indexes",   bg: "#e0f2fe", icon: <SquarePen size={13} />,   route: (id) => `/db/custom/capture/${id}` },
  { id: "setup", label: "Setup",       desc: "Dropdown Setup",             bg: "#d1fae5", icon: <Settings size={13} />,    route: (id) => `/db/setup/${id}` },
];

// ── Chevron ───────────────────────────────────────────────────────────────────
const Chevron = () => (
  <svg className="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 6 8 10 12 6" />
  </svg>
);

// ── Dropdown ──────────────────────────────────────────────────────────────────
function Dropdown({ label, icon, iconBg, iconColor, items }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.left });
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
    document.addEventListener("pointerup", handler);
    return () => document.removeEventListener("pointerup", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        setCoords({ top: rect.bottom + 6, left: rect.left });
      }
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open]);

  return (
    <NavItem>
      <NavButton ref={btnRef} $open={open} onClick={openMenu}>
        <IconBox $bg={iconBg} $color={iconColor}>{icon}</IconBox>
        {label}
        <Chevron />
      </NavButton>

      {open && createPortal(
        <DropMenu ref={menuRef} $top={coords.top} $left={coords.left}>
          {items.map((item, i) =>
            item.divider ? <Divider key={i} /> : (
              <DropItem key={i} to={item.route}>
                <span className="icon" style={{ background: item.bg }}>{item.icon}</span>
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

// ── TableRowItem ──────────────────────────────────────────────────────────────
function TableRowItem({ table, parentLeft, parentWidth, onClose }) {
  const [open, setOpen] = useState(false);
  const rowRef = useRef(null);
  const subRef = useRef(null);
  const navigate = useNavigate();

  // Calculate submenu position
  const getCoords = useCallback(() => {
    if (!rowRef.current) return null;
    const rect = rowRef.current.getBoundingClientRect();
    const rightX = parentLeft + parentWidth + 4;
    const fitsRight = rightX + 190 < window.innerWidth;
    // If doesn't fit right, show above the row instead (mobile friendly)
    return {
      top: rect.top - 4,
      left: fitsRight ? rightX : Math.max(8, rect.left - 192),
    };
  }, [parentLeft, parentWidth]);

  const [coords, setCoords] = useState(null);

  const toggle = (e) => {
    e.stopPropagation();
    if (!open) {
      setCoords(getCoords());
    }
    setOpen((v) => !v);
  };

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        subRef.current && !subRef.current.contains(e.target) &&
        rowRef.current && !rowRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerup", handler);
    return () => document.removeEventListener("pointerup", handler);
  }, [open]);

  return (
    <>
      <TableRow
        ref={rowRef}
        $hovered={open}
        onClick={toggle}
      >
        <span className="t-dot" />
        <span className="t-name">{table.title}</span>
        {/* Arrow indicator */}
        <span style={{
          fontSize: 10,
          color: open ? "var(--color-primary, #6366f1)" : "#d1d5db",
          transition: "transform 0.2s",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          display: "inline-block"
        }}></span>
      </TableRow>

      {open && coords && createPortal(
        <SubMenu
          ref={subRef}
          $top={coords.top}
          $left={coords.left}
        >
          {TABLE_ACTIONS.map((action) => (
            <ActionItem
              key={action.id}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={() => {
                navigate(action.route(table.title));
                setOpen(false);
                onClose();
              }}
            >
              <div className="a-icon" style={{ background: action.bg }}>{action.icon}</div>
              <div>
                <div className="a-label">{action.label}</div>
                <div className="a-desc">{action.desc}</div>
              </div>
            </ActionItem>
          ))}
        </SubMenu>,
        document.body
      )}
    </>
  );
}

// ── TablesDropdown ────────────────────────────────────────────────────────────
function TablesDropdown() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const MENU_WIDTH = 190;
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [tables, setTables] = useState([]);
  const userData = useSelector((state) => state.user);
  const schemaName = userData.schema_name;

  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen((v) => !v);
  };

  useEffect(() => { getAllTables(); }, [schemaName]);

  const getAllTables = async () => {
    const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllTables?schemaName=${schemaName}`;
    const { data } = await axios.get(route);
    setTables(data.data);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false); setSearch("");
      }
    };
    document.addEventListener("pointerup", handler);
    return () => document.removeEventListener("pointerup", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        setCoords({ top: rect.bottom + 6, left: rect.left - 16 });
      }
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open]);

  const filtered = tables.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <NavItem>
      <NavButton ref={btnRef} $open={open} onClick={openMenu}>
        <IconBox $bg="#e0f2fe" $color="#0ea5e9">
          <Table2 size={13} />
        </IconBox>
        Tables
        <Chevron />
      </NavButton>

      {open && createPortal(
        <TableDropMenu ref={menuRef} $top={coords.top} $left={coords.left} style={{ width: MENU_WIDTH }}>
          <SearchInput>
            <input placeholder="Search tables…" value={search}
              onChange={(e) => setSearch(e.target.value)} autoFocus />
          </SearchInput>

          {filtered.length === 0 ? (
            <div style={{ padding: "8px 10px", fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
              No tables found
            </div>
          ) : (
            filtered.map((table) => (
              <TableRowItem key={table.id} table={table}
                parentLeft={coords.left} parentWidth={MENU_WIDTH}
                onClose={() => setOpen(false)} />
            ))
          )}
        </TableDropMenu>,
        document.body
      )}
    </NavItem>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function MobileMenu() {
  return (
    <Nav>
      {/* Dashboard links with colored icons */}
      <LogoutButton/>
      {DASH_LINKS.map((link) => (
        <DashboardIcon key={link.route}>
          <Link to={link.route}>
            <IconBox $bg={link.iconBg} $color={link.iconColor}>
              {link.icon}
            </IconBox>
            {link.label}
          </Link>
        </DashboardIcon>
      ))}

      <Divider style={{ margin: "6px 8px" }} />

      {/* Tables dropdown with icon */}
      <TablesDropdown />

      {/* Nav dropdowns with icons */}
      {NAV_ITEMS.map((item) => (
        <Dropdown
          key={item.label}
          label={item.label}
          icon={item.icon}
          iconBg={item.iconBg}
          iconColor={item.iconColor}
          items={item.items}
        />
      ))}
    </Nav>
  );
}