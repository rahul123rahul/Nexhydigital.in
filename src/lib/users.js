/**
 * Role-based user store for Nexhydigital HR System
 *
 * Roles & their dashboard destinations:
 *  - super_admin  → /admin          (full admin dashboard)
 *  - hr_manager   → /admin/hr       (full HR dashboard)
 *  - hr_staff     → /admin/hr       (HR dashboard, limited actions)
 *  - recruiter    → /admin/hr#recruitment  (HR dash, recruitment focus)
 *  - employee     → /admin/ess      (Employee Self-Service portal)
 *  - candidate    → /careers        (Careers page)
 */

import fs from "fs";
import path from "path";

// Mutable USERS array - will be populated from file
export let USERS = [];

/**
 * Load users from the users.json file
 */
export function loadUsers() {
  try {
    const usersPath = path.join(process.cwd(), "src/data/users.json");
    if (fs.existsSync(usersPath)) {
      const fileContent = fs.readFileSync(usersPath, "utf-8");
      const data = JSON.parse(fileContent);
      USERS = Array.isArray(data.users) ? data.users : data;
      return USERS;
    }
  } catch (error) {
    console.error("Error loading users from file:", error);
  }
  return USERS;
}

/**
 * Save users to the users.json file
 */
export function saveUsers() {
  try {
    const usersPath = path.join(process.cwd(), "src/data/users.json");
    fs.writeFileSync(usersPath, JSON.stringify({ users: USERS }, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving users to file:", error);
    return false;
  }
}

// Initialize USERS from file on module load
loadUsers();

// Default users (used as fallback if file is empty)
const DEFAULT_USERS = [
  {
    id: "usr-002",
    employeeId: "EMP-002",
    username: "hrmanager",
    password: "HRManager@2026",
    role: "hr_manager",
    name: "Priya Sharma",
    email: "priya.sharma@hygenx.in",
    phone: "+91 98765 00002",
    department: "Human Resources",
    avatar: "PS",
    redirectTo: "/admin/hr",
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "usr-003",
    employeeId: "EMP-003",
    username: "hrstaff",
    password: "HRStaff@2026",
    role: "hr_staff",
    name: "Ravi Kumar",
    email: "ravi.kumar@hygenx.in",
    phone: "+91 98765 00003",
    department: "Human Resources",
    avatar: "RK",
    redirectTo: "/admin/hr",
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "usr-004",
    employeeId: "EMP-004",
    username: "recruiter",
    password: "Recruit@2026",
    role: "recruiter",
    name: "Anita Patel",
    email: "anita.patel@hygenx.in",
    phone: "+91 98765 00004",
    department: "Talent Acquisition",
    avatar: "AP",
    redirectTo: "/admin/hr",
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "usr-005",
    employeeId: "EMP-005",
    username: "employee",
    password: "Employee@2026",
    role: "employee",
    name: "Rohit Verma",
    email: "rohit.verma@hygenx.in",
    phone: "+91 98765 00005",
    department: "Engineering",
    avatar: "RV",
    redirectTo: "/admin/ess",
    createdAt: "2026-05-01T00:00:00.000Z",
  },
];

/**
 * Role-to-dashboard mapping for middleware routing
 */
export const ROLE_ROUTES = {
  super_admin: "/admin",
  hr_manager: "/admin/hr",
  hr_staff: "/admin/hr",
  recruiter: "/admin/hr",
  employee: "/admin/ess",
  client: "/customer/dashboard",
};

/**
 * Routes that each role is permitted to access
 * (all roles can access their own route and below)
 */
export const ROLE_MODULE_ACCESS = {
  super_admin: ["overview","employees","recruitment","attendance","leave","payroll","performance","docgen","helpdesk","compliance","exit"],
  hr_manager: ["overview","employees","recruitment","attendance","leave","payroll","performance","docgen","helpdesk","compliance","exit"],
  hr_staff: ["overview","employees","recruitment","attendance","leave","docgen","helpdesk","compliance","exit"],
  recruiter: ["overview","recruitment","docgen"],
  employee: ["overview"],
};

export const ROLE_PERMISSIONS = {
  super_admin: ["/admin"],
  hr_manager: ["/admin/hr", "/admin/ess"],
  hr_staff: ["/admin/hr", "/admin/ess"],
  recruiter: ["/admin/hr", "/admin/ess"],
  employee: ["/admin/ess"],
};

/**
 * Get the redirect URL for a given role
 */
export function getRedirectUrlForRole(role) {
  const routeMap = {
    super_admin: "/admin",
    hr_manager: "/admin/hr",
    hr_staff: "/admin/hr",
    recruiter: "/admin/hr",
    employee: "/admin/ess",
    candidate: "/careers",
    client: "/customer/dashboard",
  };
  return routeMap[role] || "/";
}

/**
 * Find user by identifier (employeeId, email, or username)
 */
export function findUserByIdentifier(identifier) {
  if (!identifier) return null;
  
  // Load fresh users from file each time to ensure consistency
  loadUsers();
  
  const lowerIdentifier = identifier.toLowerCase();
  return USERS.find((u) =>
    (u.employeeId && u.employeeId.toLowerCase() === lowerIdentifier) ||
    (u.email && u.email.toLowerCase() === lowerIdentifier) ||
    (u.username && u.username.toLowerCase() === lowerIdentifier)
  );
}

/**
 * Generate next user ID
 */
function generateUserId() {
  const userIds = USERS.filter((u) => u.id.startsWith("usr-"))
    .map((u) => parseInt(u.id.split("-")[1]))
    .filter((n) => !isNaN(n));
  const maxId = userIds.length > 0 ? Math.max(...userIds) : 0;
  return `usr-${String(maxId + 1).padStart(3, "0")}`;
}

/**
 * Generate next employee ID
 */
function generateEmployeeId() {
  const employeeIds = [];

  try {
    const employeesPath = path.join(process.cwd(), "src/data/employees.json");
    if (fs.existsSync(employeesPath)) {
      const fileContent = fs.readFileSync(employeesPath, "utf-8");
      const data = JSON.parse(fileContent);
      const employees = Array.isArray(data.employees) ? data.employees : [];
      employeeIds.push(...employees.map((employee) => employee.id || employee.employeeId));
    }
  } catch (error) {
    console.error("Error reading employees for employee ID generation:", error);
  }

  employeeIds.push(...USERS.map((u) => u.employeeId));

  const empIds = employeeIds
    .filter(Boolean)
    .filter((id) => String(id).match(/^EMP-\d+$/))
    .map((id) => parseInt(String(id).split("-")[1]))
    .filter((n) => !isNaN(n));
  const maxId = empIds.length > 0 ? Math.max(...empIds) : 0;
  return `EMP-${String(maxId + 1).padStart(3, "0")}`;
}

/**
 * Generate username from name
 */
function generateUsername(name) {
  const base = name.toLowerCase().replace(/\s+/g, "");
  let username = base;
  let counter = 1;

  while (findUserByIdentifier(username)) {
    username = base + counter;
    counter++;
  }

  return username;
}

/**
 * Generate avatar initials from name
 */
function generateAvatar(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Add a new user to the system
 */
export function addUser(userData) {
  const {
    name,
    email,
    phone,
    password,
    role = "employee",
    department = "General",
    employeeId: providedEmployeeId,
  } = userData;

  // Load fresh users before checking duplicates
  loadUsers();

  // Check if user already exists
  if (findUserByIdentifier(email)) {
    throw new Error("Email already registered");
  }

  const username = generateUsername(name);
  const employeeId = providedEmployeeId || generateEmployeeId();
  const userId = generateUserId();
  const avatar = generateAvatar(name);
  const redirectTo = getRedirectUrlForRole(role);

  const newUser = {
    id: userId,
    employeeId,
    username,
    password, // In production, this should be hashed
    role,
    name,
    email,
    phone,
    department,
    avatar,
    redirectTo,
    createdAt: new Date().toISOString(),
  };

  USERS.push(newUser);
  
  // Save to file immediately after adding
  saveUsers();
  
  return newUser;
}

export function deleteUser(id) {
  loadUsers();
  const initialLength = USERS.length;
  USERS = USERS.filter((user) => user.id !== id);
  if (USERS.length === initialLength) {
    return false;
  }
  return saveUsers();
}

/**
 * Add a new employee to the employee list
 */
export function addEmployee(employeeData) {
  const {
    employeeId,
    name,
    email,
    phone,
    username,
    role = "Employee",
    department = "General",
  } = employeeData;

  return {
    id: employeeId,
    name,
    email,
    phone,
    address: "",
    username,
    passwordHash: "",
    role,
    specialization: "",
    active: true,
    createdAt: new Date().toISOString(),
  };
}
