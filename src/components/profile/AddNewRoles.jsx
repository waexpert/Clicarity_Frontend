import React, { useState } from "react";
import "../../css/components/AddNewRoles.css";
import axios from "axios";

const permissions = [
  {
    category: "Basic",
    items: [
      { title: "Reports", permissions: ["Read"] },
      { title: "Profile", permissions: ["Read", "Update"] },
      { title: "Webhook", permissions: ["Read", "Create", "Update", "Delete"] },
    ],
  },
  {
    category: "CRM",
    items: [
      { title: "Reports", permissions: ["Read"] },
      { title: "Profile", permissions: ["Read", "Update"] },
      { title: "Webhook", permissions: ["Read", "Create", "Update", "Delete"] },
    ],
  },
  {
    category: "Task Management",
    items: [
      { title: "Table", permissions: ["Read", "Create", "Update", "Delete"] },
      { title: "Data", permissions: ["Read", "Update", "Create", "Delete"] },
      { title: "Webhook", permissions: ["Read", "Create", "Update", "Delete"] },
    ],
  },
];

export default function AddNewRoles() {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  console.log(selectedPermissions)

  const formatKey = (action, title) => {
    const formattedTitle = title.toUpperCase().replace(/\s+/g, "_");
    return `${action.toUpperCase()}_${formattedTitle}`;
  };

  const handleCheckboxChange = (action, title) => {
    const key = formatKey(action, title);
    setSelectedPermissions((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    );
  };

  const isChecked = (action, title) => {
    const key = formatKey(action, title);
    return selectedPermissions.includes(key);
  };

  const handleSave = async() => {
    console.log("Role Name:", name);
    console.log("Selected Permissions:", selectedPermissions);
    // POST {name, selectedPermissions}

    const data = {
      name,permissions:selectedPermissions,schemaName : "wa_expert"
    }

   const result =  await axios.post(`${process.env.REACT_APP_BASE_URL}/secure/createRoles`,data);
   console.log(result);
  };

  return (
    <div>
      <div className="mainHeader">
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="submit-btn"
          style={{ width: "10rem" }}
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      {permissions.map((section, index) => (
        <div key={index} style={{ marginBottom: "30px" }}>
          <h2>{section.category}</h2>

          {section.items.map((item, idx) => (
            <div key={idx} style={{ marginLeft: "20px", marginBottom: "15px" }}>
              <h4>{item.title}</h4>

              <div style={{ marginLeft: "20px" }}>
                {item.permissions.map((perm, i) => (
                  <label key={i} style={{ marginRight: "15px" }}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={isChecked(perm, item.title)}
                      onChange={() => handleCheckboxChange(perm, item.title)}
                    />
                    {perm}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
