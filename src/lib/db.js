import { Pool } from "pg";
import fs from "fs";
import path from "path";

// Load default environment variables if not set
const dbConfig = {
  host: process.env.PGHOST || "localhost",
  port: parseInt(process.env.PGPORT || "5432"),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "hygenx",
};

const useSSL = process.env.PGSSL === "true" || 
               (process.env.DATABASE_URL && (process.env.DATABASE_URL.includes("neon") || process.env.DATABASE_URL.includes("supabase") || process.env.DATABASE_URL.includes("aws") || process.env.DATABASE_URL.includes("aiven")));
const sslOption = useSSL ? { rejectUnauthorized: false } : undefined;

let pool = null;
export let isPostgresConnected = false;

// Path to fallback JSON data directory
const DATA_DIR = path.join(process.cwd(), "src/data");

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "EM";
}

function normalizeEmployee(employee = {}) {
  const name = employee.name || "";
  const skills = Array.isArray(employee.skills)
    ? employee.skills
    : employee.skills
    ? String(employee.skills).split(",").map((skill) => skill.trim()).filter(Boolean)
    : employee.specialization
    ? [employee.specialization]
    : [];

  return {
    ...employee,
    id: employee.id || employee.employeeId || "",
    name,
    email: employee.email || "",
    phone: employee.phone || "",
    dept: employee.dept || employee.department || "General",
    desig: employee.desig || employee.designation || employee.role || "Employee",
    mgr: employee.mgr || employee.manager || "Priya Sharma",
    join: employee.join || employee.join_date || employee.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    status: employee.status || (employee.active === false ? "Terminated" : "Active"),
    sal: parseInt(employee.sal || "0"),
    skills,
    av: employee.av || employee.avatar || initials(name),
    avc: employee.avc || "#6366f1",
  };
}

function nextEmployeeIdFrom(ids) {
  const maxId = ids
    .filter(Boolean)
    .map((id) => String(id).match(/^EMP-(\d+)$/i)?.[1])
    .filter(Boolean)
    .map((id) => parseInt(id, 10))
    .filter((id) => !Number.isNaN(id))
    .reduce((max, id) => Math.max(max, id), 0);

  return `EMP-${String(maxId + 1).padStart(3, "0")}`;
}

// Helper to check if database exists and try connecting
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

if (!isBuildPhase) {
  try {
    const poolConfig = process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL, ssl: sslOption }
      : { ...dbConfig, ssl: sslOption };

    pool = new Pool({
      ...poolConfig,
      connectionTimeoutMillis: 3000,
    });
    
    // Test query
    await pool.query("SELECT 1");
    isPostgresConnected = true;
    console.log("⚡ [Database] PostgreSQL connected successfully on port " + dbConfig.port);
  } catch (err) {
    isPostgresConnected = false;
    console.warn("⚠️ [Database] PostgreSQL connection failed: " + err.message);
    console.warn("⚠️ [Database] Falling back to local JSON database inside 'src/data/*.json'");
    if (pool) {
      try {
        await pool.end();
      } catch (e) {}
      pool = null;
    }
  }
} else {
  isPostgresConnected = false;
  console.log("🚧 [Database] Skipping PostgreSQL connection during Next.js build phase.");
}

// ── Fallback Helpers ──────────────────────────────────────────────────
function readJSON(file) {
  const filepath = path.join(DATA_DIR, file);
  try {
    if (!fs.existsSync(filepath)) {
      // Create empty file if not exist
      if (file.includes("employees")) {
        fs.writeFileSync(filepath, JSON.stringify({ nextId: "EMP-013", employees: [] }, null, 2));
      } else {
        fs.writeFileSync(filepath, JSON.stringify([], null, 2));
      }
    }
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
  } catch {
    return file.includes("employees") ? { nextId: "EMP-013", employees: [] } : [];
  }
}

function writeJSON(file, data) {
  const filepath = path.join(DATA_DIR, file);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write to file " + file, err);
  }
}

// ── Database Schema Initializer ─────────────────────────────────────────
if (isPostgresConnected) {
  try {
    // 1. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        department VARCHAR(100),
        avatar VARCHAR(5)
      )
    `);

    // Seed default users if empty
    const { rows: userCount } = await pool.query("SELECT COUNT(*) FROM users");
    if (parseInt(userCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO users (id, username, password, role, name, email, department, avatar) VALUES
        ('usr-008', 'admin', 'Admin@2026', 'admin', 'Admin User', 'admin@hygenx.in', 'Administration', 'AD'),
        ('usr-002', 'hrmanager', 'HRManager@2026', 'hr_manager', 'Priya Sharma', 'priya.sharma@hygenx.in', 'Human Resources', 'PS'),
        ('usr-003', 'hrstaff', 'HRStaff@2026', 'hr_staff', 'Ravi Kumar', 'ravi.kumar@hygenx.in', 'Human Resources', 'RK'),
        ('usr-004', 'recruiter', 'Recruit@2026', 'recruiter', 'Anita Patel', 'anita.patel@hygenx.in', 'Talent Acquisition', 'AP'),
        ('usr-005', 'employee', 'Employee@2026', 'employee', 'Rohit Verma', 'rohit.verma@hygenx.in', 'Engineering', 'RV')
      `);
      console.log("✅ [Database] Seeded default users into PostgreSQL.");
    }

    // 2. Careers (Job Listings)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS careers (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        dept VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        loc VARCHAR(100) NOT NULL,
        open VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        requirements JSONB DEFAULT '[]'::jsonb,
        published BOOLEAN DEFAULT TRUE,
        posted VARCHAR(50)
      )
    `);

    await pool.query(`
      ALTER TABLE careers
      ADD COLUMN IF NOT EXISTS "formSchema" JSONB DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS "applyLink" TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS "applyMode" VARCHAR(20) DEFAULT 'internal',
      ADD COLUMN IF NOT EXISTS "applyButtonText" VARCHAR(100) DEFAULT 'Apply Now',
      ADD COLUMN IF NOT EXISTS "openInNewTab" BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS "applyClicks" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS submissions INTEGER DEFAULT 0
    `);

    // Seed careers if empty
    const { rows: jobCount } = await pool.query("SELECT COUNT(*) FROM careers");
    if (parseInt(jobCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO careers (id, title, dept, type, loc, open, description, requirements, published, posted) VALUES
        ('JOB-001', 'Senior React Developer', 'Engineering', 'Full-time', 'Bangalore', '2', 'We are looking for an experienced Frontend Engineer with specialized React expertise.', '["5+ years of React development","Experience with NextJS & CSS","State management solutions"]'::jsonb, true, '2026-05-01'),
        ('JOB-002', 'HR Business Partner', 'HR', 'Full-time', 'Mumbai', '1', 'Join our core people operations team to align staff with corporate strategies.', '["3+ years HR experience","MBA in HR preferred","Strong grievance handling skills"]'::jsonb, true, '2026-05-03'),
        ('JOB-003', 'DevOps Engineer', 'Engineering', 'Full-time', 'Remote', '1', 'Manage infrastructure automations, deployments and container orchestrations.', '["AWS or Azure Certification","Docker & Kubernetes","CI/CD Pipelines"]'::jsonb, true, '2026-04-28')
      `);
      console.log("✅ [Database] Seeded careers list into PostgreSQL.");
    }

    // 3. Candidates (ATS Pipeline)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        experience VARCHAR(50),
        source VARCHAR(50) NOT NULL,
        stage VARCHAR(50) NOT NULL,
        score INTEGER DEFAULT 0,
        applied VARCHAR(50) NOT NULL,
        reason TEXT,
        job_id VARCHAR(50)
      )
    `);

    await pool.query(`
      ALTER TABLE candidates
      ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}'::jsonb
    `);

    // Seed candidates if empty
    const { rows: candCount } = await pool.query("SELECT COUNT(*) FROM candidates");
    if (parseInt(candCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO candidates (id, name, email, phone, experience, source, stage, score, applied, reason, job_id) VALUES
        ('CAN-001', 'Rahul Das', 'rahul.das@email.com', '+91 91234 56789', '4 years', 'LinkedIn', 'Interview', 88, '2026-05-10', 'Strong experience in state management.', 'JOB-001'),
        ('CAN-002', 'Pooja Mishra', 'pooja.mishra@email.com', '+91 91234 56780', '3 years', 'Naukri', 'Screening', 75, '2026-05-12', 'Good communication skills, HR background.', 'JOB-002'),
        ('CAN-003', 'Amit Jain', 'amit.jain@email.com', '+91 91234 56781', '6 years', 'Indeed', 'Selection', 92, '2026-05-08', 'Excellent AWS knowledge.', 'JOB-003'),
        ('CAN-004', 'Nikhil Sharma', 'nikhil.sharma@email.com', '+91 91234 56782', '2 years', 'Referral', 'Applications', 68, '2026-05-15', 'Entry level designer, creative portfolio.', 'JOB-001')
      `);
      console.log("✅ [Database] Seeded candidates list into PostgreSQL.");
    }

    // 4. Employees Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        dept VARCHAR(100) NOT NULL,
        desig VARCHAR(100) NOT NULL,
        mgr VARCHAR(100) NOT NULL,
        join_date VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        sal INTEGER DEFAULT 0,
        skills VARCHAR(250),
        av VARCHAR(5),
        avc VARCHAR(10)
      )
    `);

    // Seed employees if empty
    const { rows: empCount } = await pool.query("SELECT COUNT(*) FROM employees");
    if (parseInt(empCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO employees (id, name, email, phone, dept, desig, mgr, join_date, status, sal, skills, av, avc) VALUES
        ('EMP-001', 'Arjun Sharma', 'arjun.sharma@hygenx.in', '+91 98765 43210', 'Engineering', 'Software Engineer', 'Priya Sharma', '2023-01-15', 'Active', 85000, 'React,Node.js,AWS', 'AS', '#6366f1'),
        ('EMP-002', 'Priya Sharma', 'priya.sharma@hygenx.in', '+91 98765 43211', 'HR', 'HR Manager', 'Super Admin', '2022-03-01', 'Active', 95000, 'Recruitment,Payroll,HRMS', 'PS', '#10b981'),
        ('EMP-003', 'Rohit Verma', 'rohit.verma@hygenx.in', '+91 98765 43212', 'Engineering', 'Software Engineer', 'Arjun Sharma', '2024-06-01', 'Probation', 65000, 'Python,Django,PostgreSQL', 'RV', '#f59e0b'),
        ('EMP-004', 'Sunita Patel', 'sunita.patel@hygenx.in', '+91 98765 43213', 'Finance', 'Accountant', 'Priya Sharma', '2021-09-10', 'Active', 72000, 'Tally,GST,TDS', 'SP', '#ec4899'),
        ('EMP-006', 'Anita Patel', 'anita.patel@hygenx.in', '+91 98765 43215', 'HR', 'Recruiter', 'Priya Sharma', '2023-07-05', 'Active', 62000, 'ATS,LinkedIn,HR Policies', 'AP', '#8b5cf6'),
        ('EMP-011', 'Ravi Kumar', 'ravi.kumar@hygenx.in', '+91 98765 43220', 'HR', 'HR Executive', 'Priya Sharma', '2023-04-15', 'Active', 55000, 'Onboarding,Training,HRIS', 'RK', '#ec4899'),
        ('EMP-012', 'Sneha Gupta', 'sneha.gupta@hygenx.in', '+91 98765 43221', 'Engineering', 'Product Manager', 'Arjun Sharma', '2023-08-22', 'Active', 105000, 'Product,Agile,Roadmap', 'SG', '#f59e0b')
      `);
      console.log("✅ [Database] Seeded employees list into PostgreSQL.");
    }

    // 5. Attendance Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        emp_id VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        date VARCHAR(50) NOT NULL,
        c_in VARCHAR(20),
        c_out VARCHAR(20),
        hrs VARCHAR(20),
        status VARCHAR(50),
        mode VARCHAR(20)
      )
    `);

    // Seed attendance if empty
    const { rows: attCount } = await pool.query("SELECT COUNT(*) FROM attendance");
    if (parseInt(attCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO attendance (emp_id, name, date, c_in, c_out, hrs, status, mode) VALUES
        ('EMP-001', 'Arjun Sharma', '2026-05-20', '09:02', '18:10', '9h 8m', 'Present', 'Office'),
        ('EMP-002', 'Priya Sharma', '2026-05-20', '08:55', '17:55', '9h 0m', 'Present', 'Office'),
        ('EMP-003', 'Rohit Verma', '2026-05-20', '10:15', '19:00', '8h 45m', 'Late', 'WFH'),
        ('EMP-004', 'Sunita Patel', '2026-05-20', '09:00', '18:00', '9h 0m', 'Present', 'Office'),
        ('EMP-006', 'Anita Patel', '2026-05-20', '09:10', '18:10', '9h 0m', 'Present', 'Office')
      `);
      console.log("✅ [Database] Seeded attendance logs into PostgreSQL.");
    }

    // 6. Leaves Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaves (
        id VARCHAR(50) PRIMARY KEY,
        emp_id VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        from_date VARCHAR(50) NOT NULL,
        to_date VARCHAR(50) NOT NULL,
        days INTEGER NOT NULL,
        reason TEXT,
        status VARCHAR(50) NOT NULL,
        on_date VARCHAR(50) NOT NULL
      )
    `);

    // Seed leaves if empty
    const { rows: leaveCount } = await pool.query("SELECT COUNT(*) FROM leaves");
    if (parseInt(leaveCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO leaves (id, emp_id, name, type, from_date, to_date, days, reason, status, on_date) VALUES
        ('LV-001', 'EMP-001', 'Arjun Sharma', 'Earned Leave', '2026-05-18', '2026-05-22', 5, 'Family vacation', 'Approved', '2026-05-12'),
        ('LV-002', 'EMP-003', 'Rohit Verma', 'Sick Leave', '2026-05-25', '2026-05-25', 1, 'Fever', 'Pending', '2026-05-20'),
        ('LV-003', 'EMP-006', 'Anita Patel', 'Casual Leave', '2026-05-20', '2026-05-20', 1, 'Personal work', 'Pending', '2026-05-19')
      `);
      console.log("✅ [Database] Seeded leaves into PostgreSQL.");
    }

    // 7. Tickets Table (Helpdesk)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id VARCHAR(50) PRIMARY KEY,
        sub VARCHAR(150) NOT NULL,
        cat VARCHAR(50) NOT NULL,
        pri VARCHAR(50) NOT NULL,
        desc_text TEXT,
        status VARCHAR(50) NOT NULL,
        by_user VARCHAR(100) NOT NULL,
        date VARCHAR(50) NOT NULL
      )
    `);

    await pool.query(`
      ALTER TABLE tickets
      ADD COLUMN IF NOT EXISTS assignee VARCHAR(100) DEFAULT 'HR Ops',
      ADD COLUMN IF NOT EXISTS channel VARCHAR(50) DEFAULT 'Portal',
      ADD COLUMN IF NOT EXISTS due_date VARCHAR(50),
      ADD COLUMN IF NOT EXISTS sla_hours INTEGER DEFAULT 24,
      ADD COLUMN IF NOT EXISTS resolution TEXT DEFAULT ''
    `);

    // Seed tickets if empty
    const { rows: ticketCount } = await pool.query("SELECT COUNT(*) FROM tickets");
    if (parseInt(ticketCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO tickets (id, sub, cat, pri, desc_text, status, by_user, date) VALUES
        ('TKT-001', 'Unable to access payslip portal', 'HR Query', 'High', 'Error occurs when trying to fetch payslip for April 2026.', 'Open', 'Rohit Verma', '2026-05-19'),
        ('TKT-002', 'Leave policy clarification for Comp-Off', 'Policy Clarification', 'Medium', 'How do comp offs credit to leaf account?', 'In Progress', 'Karan Mehta', '2026-05-18')
      `);
      console.log("✅ [Database] Seeded tickets into PostgreSQL.");
    }

    // 8. Exits Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exits (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        emp_id VARCHAR(50) NOT NULL,
        dept VARCHAR(100) NOT NULL,
        res_date VARCHAR(50) NOT NULL,
        lwd VARCHAR(50) NOT NULL,
        stage INTEGER DEFAULT 0,
        ff INTEGER DEFAULT 0
      )
    `);

    // Seed exits if empty
    const { rows: exitCount } = await pool.query("SELECT COUNT(*) FROM exits");
    if (parseInt(exitCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO exits (id, name, emp_id, dept, res_date, lwd, stage, ff) VALUES
        ('EXIT-001', 'Deepak Joshi', 'EMP-009', 'Operations', '2026-05-01', '2026-05-31', 1, 78000)
      `);
      console.log("✅ [Database] Seeded exits into PostgreSQL.");
    }

    // 9. Contact Requests Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(50),
        service VARCHAR(100),
        message TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Alter contact_requests table to add CRM specific columns if not exist
    await pool.query(`
      ALTER TABLE contact_requests
      ADD COLUMN IF NOT EXISTS budget VARCHAR(50) DEFAULT '',
      ADD COLUMN IF NOT EXISTS stage VARCHAR(50) DEFAULT 'New',
      ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'Website Form'
    `);

    // 10. Quote Requests Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quote_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        budget VARCHAR(50),
        pages VARCHAR(50),
        timeline VARCHAR(50),
        description TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 11. Pricing Plans Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pricing_plans (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price VARCHAR(100) NOT NULL,
        billing_cycle VARCHAR(50) DEFAULT 'one-time',
        free_trial_days INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        features JSONB NOT NULL
      )
    `);

    // Seed pricing plans if empty
    const { rows: planCount } = await pool.query("SELECT COUNT(*) FROM pricing_plans");
    if (parseInt(planCount[0].count) === 0) {
      const defaultPlans = [
        {
          id: "basic",
          name: "Basic Website",
          price: "₹10,000–₹20,000",
          billing_cycle: "one-time",
          free_trial_days: 0,
          active: true,
          features: {
            pages: "Up to 5",
            responsive: "✓",
            contactForm: "✓",
            seoSetup: "Basic",
            blogModule: "✗",
            cmsPanel: "✗",
            customDesign: "✗",
            paymentGateway: "✗",
            productMgmt: "✗",
            userLogin: "✗",
            analytics: "✓",
            support: "1 Month"
          }
        },
        {
          id: "business",
          name: "Business Website",
          price: "₹25,000–₹50,000",
          billing_cycle: "one-time",
          free_trial_days: 0,
          active: true,
          features: {
            pages: "Up to 15",
            responsive: "✓",
            contactForm: "✓",
            seoSetup: "Advanced",
            blogModule: "✓",
            cmsPanel: "✓",
            customDesign: "✓",
            paymentGateway: "✗",
            productMgmt: "✗",
            userLogin: "Optional",
            analytics: "✓",
            support: "3 Months"
          }
        },
        {
          id: "premium",
          name: "Premium Website",
          price: "₹60,000–₹1,00,000+",
          billing_cycle: "one-time",
          free_trial_days: 0,
          active: true,
          features: {
            pages: "Unlimited",
            responsive: "✓",
            contactForm: "✓",
            seoSetup: "Advanced",
            blogModule: "✓",
            cmsPanel: "✓",
            customDesign: "✓",
            paymentGateway: "Optional",
            productMgmt: "Optional",
            userLogin: "✓",
            analytics: "✓",
            support: "6 Months"
          }
        },
        {
          id: "ecommerce",
          name: "E-Commerce Website",
          price: "₹50,000–₹2,00,000+",
          billing_cycle: "one-time",
          free_trial_days: 0,
          active: true,
          features: {
            pages: "Unlimited",
            responsive: "✓",
            contactForm: "✓",
            seoSetup: "Advanced",
            blogModule: "✓",
            cmsPanel: "✓",
            customDesign: "✓",
            paymentGateway: "✓",
            productMgmt: "✓",
            userLogin: "✓",
            analytics: "✓",
            support: "12 Months"
          }
        }
      ];

      for (const p of defaultPlans) {
        await pool.query(
          "INSERT INTO pricing_plans (id, name, price, billing_cycle, free_trial_days, active, features) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)",
          [p.id, p.name, p.price, p.billing_cycle, p.free_trial_days, p.active, JSON.stringify(p.features)]
        );
      }
      console.log("✅ [Database] Seeded default pricing plans into PostgreSQL.");
    }

    // 12. Promo Codes Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id VARCHAR(50) PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) NOT NULL,
        discount_value NUMERIC NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        expiry_date VARCHAR(50)
      )
    `);

    // Seed default promo codes if empty
    const { rows: promoCount } = await pool.query("SELECT COUNT(*) FROM promo_codes");
    if (parseInt(promoCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO promo_codes (id, code, discount_type, discount_value, active, expiry_date) VALUES
        ('promo-001', 'HYDNEW', 'percentage', 15, true, '2026-12-31'),
        ('promo-002', 'FESTIVE5000', 'fixed', 5000, true, '2026-10-31')
      `);
      console.log("✅ [Database] Seeded promo codes into PostgreSQL.");
    }

    // 13. Subscriptions Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(100) NOT NULL,
        plan_id VARCHAR(50) NOT NULL,
        billing_cycle VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        start_date VARCHAR(50) NOT NULL,
        trial_end_date VARCHAR(50),
        promo_code VARCHAR(50)
      )
    `);

    // Seed default subscriptions if empty
    const { rows: subCount } = await pool.query("SELECT COUNT(*) FROM subscriptions");
    if (parseInt(subCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO subscriptions (id, customer_name, customer_email, plan_id, billing_cycle, status, start_date, trial_end_date, promo_code) VALUES
        ('sub-001', 'Vision Academy', 'contact@visionacademy.in', 'business', 'one-time', 'active', '2026-05-01', NULL, NULL),
        ('sub-002', 'NovaMed Diagnostics', 'billing@novamed.com', 'premium', 'one-time', 'active', '2026-05-15', NULL, 'HYDNEW'),
        ('sub-003', 'Prime Traders', 'info@primetraders.in', 'ecommerce', 'one-time', 'trial', '2026-06-10', '2026-06-24', NULL)
      `);
      console.log("✅ [Database] Seeded default customer subscriptions into PostgreSQL.");
    }

    // 14. Payments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(50) PRIMARY KEY,
        subscription_id VARCHAR(50) NOT NULL,
        amount NUMERIC NOT NULL,
        payment_date VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50) NOT NULL
      )
    `);

    // Seed default payments if empty
    const { rows: payCount } = await pool.query("SELECT COUNT(*) FROM payments");
    if (parseInt(payCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO payments (id, subscription_id, amount, payment_date, status, payment_method) VALUES
        ('pay-001', 'sub-001', 35000, '2026-05-01', 'paid', 'Bank Transfer'),
        ('pay-002', 'sub-002', 68000, '2026-05-16', 'paid', 'UPI'),
        ('pay-003', 'sub-003', 0, '2026-06-10', 'paid', 'Free Trial')
      `);
      console.log("✅ [Database] Seeded default payments into PostgreSQL.");
    }

    // 15. Announcements Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id VARCHAR(50) PRIMARY KEY,
        message TEXT NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default announcements if empty
    const { rows: annCount } = await pool.query("SELECT COUNT(*) FROM announcements");
    if (parseInt(annCount[0].count) === 0) {
      await pool.query(`
        INSERT INTO announcements (id, message, active) VALUES
        ('ann-001', '📢 Special Launch Offer: Get a professional Business website with custom admin panel at 15% Off! Code: HYDNEW', true)
      `);
      console.log("✅ [Database] Seeded default announcements into PostgreSQL.");
    }

    // 16. Invoices Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(50) PRIMARY KEY,
        subscription_id VARCHAR(50) NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        cost NUMERIC NOT NULL,
        add_ons JSONB DEFAULT '[]'::jsonb,
        issue_date VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL
      )
    `);

    // 17. Proposals Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proposals (
        id VARCHAR(50) PRIMARY KEY,
        customer_email VARCHAR(100) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        company_name VARCHAR(100) NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        cost NUMERIC NOT NULL,
        content TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 18. Agreements Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agreements (
        id VARCHAR(50) PRIMARY KEY,
        customer_email VARCHAR(100) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        signed_name VARCHAR(100),
        signed_at VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 19. Projects Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(100) NOT NULL,
        company_name VARCHAR(100) NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        progress INTEGER DEFAULT 0,
        assigned_to VARCHAR(100) DEFAULT 'Unassigned',
        requirements TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 20. CRM Notifications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crm_notifications (
        id VARCHAR(50) PRIMARY KEY,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 21. Clients Table (enriched CRM client profiles)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        company_name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        gst_number VARCHAR(50),
        tax_details TEXT,
        notes TEXT,
        status VARCHAR(80) DEFAULT 'Lead',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 22. Client Communications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_communications (
        id VARCHAR(50) PRIMARY KEY,
        client_email VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL,
        subject VARCHAR(200),
        message TEXT NOT NULL,
        sent_by VARCHAR(100),
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Auto-seed clients from existing subscriptions if clients table is empty
    const { rows: clientCount } = await pool.query("SELECT COUNT(*) FROM clients");
    if (parseInt(clientCount[0].count) === 0) {
      const { rows: subs } = await pool.query("SELECT DISTINCT ON (customer_email) customer_name, customer_email FROM subscriptions ORDER BY customer_email, customer_name");
      for (const s of subs) {
        const cid = "CLT-" + Date.now() + Math.floor(Math.random() * 1000);
        await pool.query(
          "INSERT INTO clients (id, name, email, status) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING",
          [cid, s.customer_name, s.customer_email, "Payment Received"]
        );
      }
      console.log("✅ [Database] Auto-seeded clients from subscriptions.");
    }

    console.log("🚀 [Database] Tables verified and initialized in PostgreSQL.");

  } catch (err) {
    console.error("❌ [Database] Failed to initialize database schema:", err);
  }
}

// ── Uniform Database Queries Interface ──────────────────────────────────
export async function getCareers() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM careers ORDER BY posted DESC");
    return rows.map(job => ({
      ...job,
      location: job.location || job.loc,
      formSchema: job.formSchema || null,
      applyLink: job.applyLink || "",
      applyMode: job.applyMode || (job.applyLink ? "external" : "internal"),
      applyButtonText: job.applyButtonText || "Apply Now",
      openInNewTab: job.openInNewTab ?? true,
      applyClicks: job.applyClicks || 0,
      submissions: job.submissions || 0,
    }));
  } else {
    return readJSON("careers.json");
  }
}

export async function addCareer(job) {
  if (isPostgresConnected) {
    await pool.query(
      `INSERT INTO careers (
        id, title, dept, type, loc, open, description, requirements, published, posted,
        "formSchema", "applyLink", "applyMode", "applyButtonText", "openInNewTab"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11::jsonb, $12, $13, $14, $15)`,
      [
        job.id,
        job.title,
        job.dept,
        job.type,
        job.loc || job.location,
        job.open,
        job.description,
        JSON.stringify(job.requirements || []),
        job.published ?? true,
        job.posted || new Date().toISOString().slice(0, 10),
        job.formSchema ? JSON.stringify(job.formSchema) : null,
        job.applyLink || "",
        job.applyMode || "internal",
        job.applyButtonText || "Apply Now",
        job.openInNewTab ?? true,
      ]
    );
    return { ok: true };
  } else {
    const jobs = readJSON("careers.json");
    const existingIndex = jobs.findIndex(j => j.id === job.id);
    if (existingIndex === -1) {
      jobs.unshift(job);
    } else {
      jobs[existingIndex] = { ...jobs[existingIndex], ...job };
    }
    writeJSON("careers.json", jobs);
    return { ok: true };
  }
}

export async function updateCareer(id, fields) {
  if (isPostgresConnected) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return { ok: true };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      sets.push(`"${k}" = $${idx++}`);
      let val = fields[k];
      if (k === 'requirements' || k === 'formSchema') {
        val = val ? JSON.stringify(val) : null;
      }
      values.push(val);
    }
    values.push(id);
    await pool.query(`UPDATE careers SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const jobs = readJSON("careers.json");
    const idx = jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
      Object.assign(jobs[idx], fields);
      writeJSON("careers.json", jobs);
    }
    return { ok: true };
  }
}

export async function deleteCareer(id) {
  if (isPostgresConnected) {
    await pool.query("DELETE FROM careers WHERE id = $1", [id]);
    return { ok: true };
  } else {
    const jobs = readJSON("careers.json");
    const filtered = jobs.filter(j => j.id !== id);
    writeJSON("careers.json", filtered);
    return { ok: true };
  }
}

export async function query(text, params) {
  if (isPostgresConnected && pool) {
    return pool.query(text, params);
  }
  throw new Error("Database not connected.");
}

export async function getUserByUsername(username) {
  if (isPostgresConnected && pool) {
    const lower = username.toLowerCase();
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE LOWER(username) = $1 OR LOWER(email) = $1",
      [lower]
    );
    return rows[0] || null;
  }
  return null;
}

export async function getUserById(id) {
  if (isPostgresConnected && pool) {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  } else {
    const db = readJSON("users.json");
    const list = Array.isArray(db) ? db : (db.users || []);
    return list.find(u => u.id === id) || null;
  }
}

export async function updateUserPassword(id, newPassword) {
  if (isPostgresConnected && pool) {
    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [newPassword, id]
    );
    return { ok: true };
  } else {
    const db = readJSON("users.json");
    if (Array.isArray(db)) {
      const idx = db.findIndex(u => u.id === id);
      if (idx !== -1) {
        db[idx].password = newPassword;
        writeJSON("users.json", db);
      }
    } else {
      const list = db.users || [];
      const idx = list.findIndex(u => u.id === id);
      if (idx !== -1) {
        list[idx].password = newPassword;
        db.users = list;
        writeJSON("users.json", db);
      }
    }
    return { ok: true };
  }
}


export async function getEmployees() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM employees ORDER BY id ASC");
    return rows.map(normalizeEmployee);
  } else {
    const db = readJSON("employees.json");
    return (db.employees || []).map(normalizeEmployee);
  }
}

export async function getNextEmployeeId(extraIds = []) {
  const employees = await getEmployees();
  return nextEmployeeIdFrom([
    ...employees.map((employee) => employee.id),
    ...extraIds,
  ]);
}

export async function addEmployee(emp) {
  const cleanEmp = normalizeEmployee(emp);
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO employees (id, name, email, phone, dept, desig, mgr, join_date, status, sal, skills, av, avc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      [cleanEmp.id, cleanEmp.name, cleanEmp.email, cleanEmp.phone, cleanEmp.dept, cleanEmp.desig, cleanEmp.mgr, cleanEmp.join, cleanEmp.status, cleanEmp.sal, cleanEmp.skills.join(","), cleanEmp.av, cleanEmp.avc]
    );
    return { ok: true };
  } else {
    const db = readJSON("employees.json");
    db.employees = db.employees || [];
    db.employees.push(cleanEmp);
    db.nextId = nextEmployeeIdFrom(db.employees.map((employee) => employee.id));
    writeJSON("employees.json", db);
    return { ok: true };
  }
}

export async function updateEmployee(id, fields) {
  if (isPostgresConnected) {
    // Generate SET clause dynamically
    const keys = Object.keys(fields);
    const sqlMap = {
      join: "join_date",
      skills: "skills",
    };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      const colName = sqlMap[k] || k;
      sets.push(`${colName} = $${idx++}`);
      let val = fields[k];
      if (k === "skills" && Array.isArray(val)) {
        val = val.join(",");
      }
      values.push(val);
    }
    values.push(id);
    await pool.query(`UPDATE employees SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const db = readJSON("employees.json");
    const idx = db.employees.findIndex(e => e.id === id);
    if (idx !== -1) {
      Object.assign(db.employees[idx], fields);
      writeJSON("employees.json", db);
    }
    return { ok: true };
  }
}

export async function deleteEmployee(id) {
  if (isPostgresConnected) {
    await pool.query("DELETE FROM employees WHERE id = $1", [id]);
    return { ok: true };
  } else {
    const db = readJSON("employees.json");
    db.employees = db.employees.filter(e => e.id !== id);
    writeJSON("employees.json", db);
    return { ok: true };
  }
}

export async function getCandidates() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM candidates ORDER BY applied DESC");
    return rows.map(r => ({
      ...r,
      attachments: r.attachments || [],
      formData: r.form_data || {},
    }));
  } else {
    return readJSON("candidates.json");
  }
}

export async function addCandidate(cand) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO candidates (id, name, email, phone, experience, source, stage, score, applied, reason, job_id, attachments, form_data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb)",
      [cand.id, cand.name, cand.email, cand.phone, cand.experience || "", cand.source, cand.stage, cand.score || 0, cand.applied, cand.reason || "", cand.job_id || "", JSON.stringify(cand.attachments || []), JSON.stringify(cand.formData || cand.form_data || {})]
    );
    return { ok: true };
  } else {
    const cands = readJSON("candidates.json");
    cands.unshift(cand);
    writeJSON("candidates.json", cands);
    return { ok: true };
  }
}

export async function updateCandidateStage(id, stage) {
  if (isPostgresConnected) {
    await pool.query("UPDATE candidates SET stage = $1 WHERE id = $2", [stage, id]);
    return { ok: true };
  } else {
    const cands = readJSON("candidates.json");
    const idx = cands.findIndex(c => c.id === id);
    if (idx !== -1) {
      cands[idx].stage = stage;
      writeJSON("candidates.json", cands);
    }
    return { ok: true };
  }
}

export async function getAttendance() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM attendance ORDER BY date DESC, id ASC");
    return rows.map(r => ({
      id: r.id.toString(),
      empId: r.emp_id,
      name: r.name,
      date: r.date,
      cIn: r.c_in,
      cOut: r.c_out,
      hrs: r.hrs,
      status: r.status,
      mode: r.mode,
    }));
  } else {
    return readJSON("attendance.json");
  }
}

export async function addAttendance(rec) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO attendance (emp_id, name, date, c_in, c_out, hrs, status, mode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [rec.empId, rec.name, rec.date, rec.cIn, rec.cOut, rec.hrs, rec.status, rec.mode]
    );
    return { ok: true };
  } else {
    const list = readJSON("attendance.json");
    list.unshift(rec);
    writeJSON("attendance.json", list);
    return { ok: true };
  }
}

export async function getLeaves() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM leaves ORDER BY on_date DESC");
    return rows.map(r => ({
      id: r.id,
      empId: r.emp_id,
      name: r.name,
      type: r.type,
      from: r.from_date,
      to: r.to_date,
      days: r.days,
      reason: r.reason,
      status: r.status,
      on: r.on_date,
    }));
  } else {
    return readJSON("leaves.json");
  }
}

export async function addLeave(lv) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO leaves (id, emp_id, name, type, from_date, to_date, days, reason, status, on_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [lv.id, lv.empId, lv.name, lv.type, lv.from, lv.to, lv.days, lv.reason, lv.status, lv.on]
    );
    return { ok: true };
  } else {
    const list = readJSON("leaves.json");
    list.unshift(lv);
    writeJSON("leaves.json", list);
    return { ok: true };
  }
}

export async function updateLeaveStatus(id, status) {
  if (isPostgresConnected) {
    await pool.query("UPDATE leaves SET status = $1 WHERE id = $2", [status, id]);
    return { ok: true };
  } else {
    const list = readJSON("leaves.json");
    const idx = list.findIndex(l => l.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      writeJSON("leaves.json", list);
    }
    return { ok: true };
  }
}

export async function getTickets() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM tickets ORDER BY date DESC");
    return rows.map(r => ({
      id: r.id,
      sub: r.sub,
      cat: r.cat,
      pri: r.pri,
      desc: r.desc_text,
      status: r.status,
      by: r.by_user,
      date: r.date,
      assignee: r.assignee || "HR Ops",
      channel: r.channel || "Portal",
      due: r.due_date || r.date,
      slaHours: r.sla_hours || 24,
      resolution: r.resolution || "",
    }));
  } else {
    return readJSON("tickets.json");
  }
}

export async function addTicket(t) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO tickets (id, sub, cat, pri, desc_text, status, by_user, date, assignee, channel, due_date, sla_hours, resolution) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      [t.id, t.sub, t.cat, t.pri, t.desc || t.desc_text, t.status, t.by, t.date, t.assignee || "HR Ops", t.channel || "Portal", t.due || t.date, t.slaHours || 24, t.resolution || ""]
    );
    return { ok: true };
  } else {
    const list = readJSON("tickets.json");
    list.unshift(t);
    writeJSON("tickets.json", list);
    return { ok: true };
  }
}

export async function resolveTicket(id) {
  if (isPostgresConnected) {
    await pool.query("UPDATE tickets SET status = 'Resolved' WHERE id = $1", [id]);
    return { ok: true };
  } else {
    const list = readJSON("tickets.json");
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx].status = "Resolved";
      writeJSON("tickets.json", list);
    }
    return { ok: true };
  }
}

export async function updateTicket(id, fields) {
  if (isPostgresConnected) {
    const columnMap = { desc: "desc_text", by: "by_user", due: "due_date", slaHours: "sla_hours", priority: "pri" };
    const keys = Object.keys(fields).filter(k => fields[k] !== undefined);
    if (keys.length === 0) return { ok: true };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      sets.push(`${columnMap[k] || k} = $${idx++}`);
      values.push(fields[k]);
    }
    values.push(id);
    await pool.query(`UPDATE tickets SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const list = readJSON("tickets.json");
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...fields };
      writeJSON("tickets.json", list);
    }
    return { ok: true };
  }
}

export async function deleteTicket(id) {
  if (isPostgresConnected) {
    await pool.query("DELETE FROM tickets WHERE id = $1", [id]);
    return { ok: true };
  } else {
    const list = readJSON("tickets.json");
    const filtered = list.filter(t => t.id !== id);
    writeJSON("tickets.json", filtered);
    return { ok: true };
  }
}

// ── Clients CRM Functions ──────────────────────────────────────────────
export async function getClients() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM clients ORDER BY created_at DESC");
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      company_name: r.company_name || "",
      email: r.email,
      phone: r.phone || "",
      address: r.address || "",
      gst_number: r.gst_number || "",
      tax_details: r.tax_details || "",
      notes: r.notes || "",
      status: r.status || "Lead",
      created_at: r.created_at
    }));
  } else {
    const data = readJSON("clients.json");
    return Array.isArray(data) ? data : [];
  }
}

export async function addClient(client) {
  if (isPostgresConnected) {
    await pool.query(
      `INSERT INTO clients (id, name, company_name, email, phone, address, gst_number, tax_details, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (email) DO NOTHING`,
      [client.id, client.name, client.company_name || "", client.email, client.phone || "",
       client.address || "", client.gst_number || "", client.tax_details || "", client.notes || "", client.status || "Lead"]
    );
    return { ok: true };
  } else {
    const list = readJSON("clients.json");
    if (!Array.isArray(list)) {
      writeJSON("clients.json", [client]);
    } else {
      list.unshift(client);
      writeJSON("clients.json", list);
    }
    return { ok: true };
  }
}

export async function updateClient(id, fields) {
  if (isPostgresConnected) {
    const colMap = { company_name: "company_name", gst_number: "gst_number", tax_details: "tax_details" };
    const keys = Object.keys(fields).filter(k => fields[k] !== undefined);
    if (keys.length === 0) return { ok: true };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      sets.push(`${colMap[k] || k} = $${idx++}`);
      values.push(fields[k]);
    }
    sets.push(`updated_at = NOW()`);
    values.push(id);
    await pool.query(`UPDATE clients SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const list = readJSON("clients.json");
    const i = list.findIndex(c => c.id === id);
    if (i !== -1) { list[i] = { ...list[i], ...fields }; writeJSON("clients.json", list); }
    return { ok: true };
  }
}

export async function deleteClient(id) {
  if (isPostgresConnected) {
    await pool.query("DELETE FROM clients WHERE id = $1", [id]);
    return { ok: true };
  } else {
    const list = readJSON("clients.json");
    writeJSON("clients.json", list.filter(c => c.id !== id));
    return { ok: true };
  }
}

export async function getClientCommunications(email) {
  if (isPostgresConnected) {
    const { rows } = await pool.query(
      "SELECT * FROM client_communications WHERE client_email = $1 ORDER BY sent_at DESC",
      [email.toLowerCase()]
    );
    return rows.map(r => ({
      id: r.id,
      client_email: r.client_email,
      type: r.type,
      subject: r.subject || "",
      message: r.message,
      sent_by: r.sent_by || "Admin",
      sent_at: r.sent_at
    }));
  } else {
    const list = readJSON("client_communications.json");
    return Array.isArray(list) ? list.filter(c => c.client_email?.toLowerCase() === email.toLowerCase()) : [];
  }
}

export async function addCommunication(comm) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO client_communications (id, client_email, type, subject, message, sent_by) VALUES ($1, $2, $3, $4, $5, $6)",
      [comm.id, comm.client_email.toLowerCase(), comm.type, comm.subject || "", comm.message, comm.sent_by || "Admin"]
    );
    return { ok: true };
  } else {
    const list = readJSON("client_communications.json");
    const arr = Array.isArray(list) ? list : [];
    arr.unshift(comm);
    writeJSON("client_communications.json", arr);
    return { ok: true };
  }
}

export async function getExits() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM exits ORDER BY lwd DESC");
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      empId: r.emp_id,
      dept: r.dept,
      res: r.res_date,
      lwd: r.lwd,
      stage: r.stage,
      ff: r.ff,
    }));
  } else {
    return readJSON("exits.json");
  }
}

export async function addExit(ex) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO exits (id, name, emp_id, dept, res_date, lwd, stage, ff) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [ex.id, ex.name, ex.empId, ex.dept, ex.res, ex.lwd, ex.stage || 0, ex.ff || 0]
    );
    return { ok: true };
  } else {
    const list = readJSON("exits.json");
    list.unshift(ex);
    writeJSON("exits.json", list);
    return { ok: true };
  }
}

export async function updateExitStage(id, stage) {
  if (isPostgresConnected) {
    await pool.query("UPDATE exits SET stage = $1 WHERE id = $2", [stage, id]);
    return { ok: true };
  } else {
    const list = readJSON("exits.json");
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list[idx].stage = stage;
      writeJSON("exits.json", list);
    }
    return { ok: true };
  }
}

export async function addContactRequest(req) {
  const stage = req.stage || "New";
  const source = req.source || "Website Form";
  const budget = req.budget || "";
  const notes = req.notes || "";
  const status = req.status || "Pending";
  if (isPostgresConnected) {
    await pool.query(
      `INSERT INTO contact_requests (name, email, phone, service, message, budget, stage, notes, source, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [req.name, req.email, req.phone || "", req.service || "", req.message || "", budget, stage, notes, source, status]
    );
    return { ok: true };
  } else {
    const list = readJSON("contact-requests.json");
    list.unshift({ 
      id: Date.now(), 
      name: req.name, 
      email: req.email, 
      phone: req.phone || "", 
      service: req.service || "", 
      message: req.message || "", 
      budget, 
      stage, 
      notes, 
      source, 
      status, 
      created_at: new Date().toISOString() 
    });
    writeJSON("contact-requests.json", list);
    return { ok: true };
  }
}

export async function updateContactRequest(id, fields) {
  if (isPostgresConnected) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return { ok: true };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      sets.push(`"${k}" = $${idx++}`);
      values.push(fields[k]);
    }
    values.push(parseInt(id));
    await pool.query(`UPDATE contact_requests SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const list = readJSON("contact-requests.json");
    const idx = list.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...fields };
      writeJSON("contact-requests.json", list);
    }
    return { ok: true };
  }
}

export async function deleteContactRequest(id) {
  if (isPostgresConnected) {
    await pool.query("DELETE FROM contact_requests WHERE id = $1", [parseInt(id)]);
    return { ok: true };
  } else {
    const list = readJSON("contact-requests.json");
    const filtered = list.filter(c => String(c.id) !== String(id));
    writeJSON("contact-requests.json", filtered);
    return { ok: true };
  }
}

export async function addQuoteRequest(req) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO quote_requests (name, email, budget, pages, timeline, description) VALUES ($1, $2, $3, $4, $5, $6)",
      [req.name, req.email, req.budget || "", req.pages || "", req.timeline || "", req.description || ""]
    );
    return { ok: true };
  } else {
    const list = readJSON("quote-requests.json");
    list.unshift({ ...req, id: Date.now(), created_at: new Date().toISOString() });
    writeJSON("quote-requests.json", list);
    return { ok: true };
  }
}

export async function getContactRequests() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM contact_requests ORDER BY created_at DESC");
    return rows;
  } else {
    return readJSON("contact-requests.json");
  }
}

export async function getQuoteRequests() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM quote_requests ORDER BY created_at DESC");
    return rows;
  } else {
    return readJSON("quote-requests.json");
  }
}

// ─── Plans Helpers ──────────────────────────────────────────────────
export async function getPlans() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM pricing_plans ORDER BY id ASC");
    return rows.map(r => ({
      ...r,
      features: r.features || {},
    }));
  } else {
    const plans = readJSON("plans.json");
    if (plans.length === 0) {
      const defaultPlans = [
        {
          id: "basic",
          name: "Basic Website",
          price: "₹10,000–₹20,000",
          billing_cycle: "one-time",
          free_trial_days: 0,
          active: true,
          features: {
            pages: "Up to 5",
            responsive: "✓",
            contactForm: "✓",
            seoSetup: "Basic",
            blogModule: "✗",
            cmsPanel: "✗",
            customDesign: "✗",
            paymentGateway: "✗",
            productMgmt: "✗",
            userLogin: "✗",
            analytics: "✓",
            support: "1 Month"
          }
        },
        {
          id: "business",
          name: "Business Website",
          price: "₹25,000–₹50,000",
          billing_cycle: "one-time",
          free_trial_days: 0,
          active: true,
          features: {
            pages: "Up to 15",
            responsive: "✓",
            contactForm: "✓",
            seoSetup: "Advanced",
            blogModule: "✓",
            cmsPanel: "✓",
            customDesign: "✓",
            paymentGateway: "✗",
            productMgmt: "✗",
            userLogin: "Optional",
            analytics: "✓",
            support: "3 Months"
          }
        },
        {
          id: "premium",
          name: "Premium Website",
          price: "₹60,000–₹1,00,000+",
          billing_cycle: "one-time",
          free_trial_days: 0,
          active: true,
          features: {
            pages: "Unlimited",
            responsive: "✓",
            contactForm: "✓",
            seoSetup: "Advanced",
            blogModule: "✓",
            cmsPanel: "✓",
            customDesign: "✓",
            paymentGateway: "Optional",
            productMgmt: "Optional",
            userLogin: "✓",
            analytics: "✓",
            support: "6 Months"
          }
        },
        {
          id: "ecommerce",
          name: "E-Commerce Website",
          price: "₹50,000–₹2,00,000+",
          billing_cycle: "one-time",
          free_trial_days: 0,
          active: true,
          features: {
            pages: "Unlimited",
            responsive: "✓",
            contactForm: "✓",
            seoSetup: "Advanced",
            blogModule: "✓",
            cmsPanel: "✓",
            customDesign: "✓",
            paymentGateway: "✓",
            productMgmt: "✓",
            userLogin: "✓",
            analytics: "✓",
            support: "12 Months"
          }
        }
      ];
      writeJSON("plans.json", defaultPlans);
      return defaultPlans;
    }
    return plans;
  }
}

export async function addPlan(plan) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO pricing_plans (id, name, price, billing_cycle, free_trial_days, active, features) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)",
      [plan.id, plan.name, plan.price, plan.billing_cycle || 'one-time', plan.free_trial_days || 0, plan.active ?? true, JSON.stringify(plan.features || {})]
    );
    return { ok: true };
  } else {
    const plans = readJSON("plans.json");
    plans.push(plan);
    writeJSON("plans.json", plans);
    return { ok: true };
  }
}

export async function updatePlan(id, fields) {
  if (isPostgresConnected) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return { ok: true };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      sets.push(`"${k}" = $${idx++}`);
      let val = fields[k];
      if (k === 'features') {
        val = val ? JSON.stringify(val) : null;
      }
      values.push(val);
    }
    values.push(id);
    await pool.query(`UPDATE pricing_plans SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const plans = readJSON("plans.json");
    const idx = plans.findIndex(p => p.id === id);
    if (idx !== -1) {
      Object.assign(plans[idx], fields);
      writeJSON("plans.json", plans);
    }
    return { ok: true };
  }
}

export async function deletePlan(id) {
  if (isPostgresConnected) {
    await pool.query("DELETE FROM pricing_plans WHERE id = $1", [id]);
    return { ok: true };
  } else {
    const plans = readJSON("plans.json");
    const filtered = plans.filter(p => p.id !== id);
    writeJSON("plans.json", filtered);
    return { ok: true };
  }
}

// ─── Promo Codes Helpers ─────────────────────────────────────────────
export async function getPromoCodes() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM promo_codes ORDER BY id ASC");
    return rows.map(r => ({
      ...r,
      discount_value: parseFloat(r.discount_value),
    }));
  } else {
    const codes = readJSON("promo_codes.json");
    if (codes.length === 0) {
      const defaultCodes = [
        { id: "promo-001", code: "HYDNEW", discount_type: "percentage", discount_value: 15, active: true, expiry_date: "2026-12-31" },
        { id: "promo-002", code: "FESTIVE5000", discount_type: "fixed", discount_value: 5000, active: true, expiry_date: "2026-10-31" }
      ];
      writeJSON("promo_codes.json", defaultCodes);
      return defaultCodes;
    }
    return codes;
  }
}

export async function addPromoCode(promo) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO promo_codes (id, code, discount_type, discount_value, active, expiry_date) VALUES ($1, $2, $3, $4, $5, $6)",
      [promo.id, promo.code, promo.discount_type, promo.discount_value, promo.active ?? true, promo.expiry_date]
    );
    return { ok: true };
  } else {
    const codes = readJSON("promo_codes.json");
    codes.push(promo);
    writeJSON("promo_codes.json", codes);
    return { ok: true };
  }
}

export async function updatePromoCode(id, fields) {
  if (isPostgresConnected) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return { ok: true };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      sets.push(`"${k}" = $${idx++}`);
      values.push(fields[k]);
    }
    values.push(id);
    await pool.query(`UPDATE promo_codes SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const codes = readJSON("promo_codes.json");
    const idx = codes.findIndex(c => c.id === id);
    if (idx !== -1) {
      Object.assign(codes[idx], fields);
      writeJSON("promo_codes.json", codes);
    }
    return { ok: true };
  }
}

export async function deletePromoCode(id) {
  if (isPostgresConnected) {
    await pool.query("DELETE FROM promo_codes WHERE id = $1", [id]);
    return { ok: true };
  } else {
    const codes = readJSON("promo_codes.json");
    const filtered = codes.filter(c => c.id !== id);
    writeJSON("promo_codes.json", filtered);
    return { ok: true };
  }
}

// ─── Subscriptions Helpers ───────────────────────────────────────────
export async function getSubscriptions() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM subscriptions ORDER BY start_date DESC");
    return rows;
  } else {
    const subs = readJSON("subscriptions.json");
    if (subs.length === 0) {
      const defaultSubs = [
        { id: "sub-001", customer_name: "Vision Academy", customer_email: "contact@visionacademy.in", plan_id: "business", billing_cycle: "one-time", status: "active", start_date: "2026-05-01", trial_end_date: null, promo_code: null },
        { id: "sub-002", customer_name: "NovaMed Diagnostics", customer_email: "billing@novamed.com", plan_id: "premium", billing_cycle: "one-time", status: "active", start_date: "2026-05-15", trial_end_date: null, promo_code: "HYDNEW" },
        { id: "sub-003", customer_name: "Prime Traders", customer_email: "info@primetraders.in", plan_id: "ecommerce", billing_cycle: "one-time", status: "trial", start_date: "2026-06-10", trial_end_date: "2026-06-24", promo_code: null }
      ];
      writeJSON("subscriptions.json", defaultSubs);
      return defaultSubs;
    }
    return subs;
  }
}

export async function addSubscription(sub) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO subscriptions (id, customer_name, customer_email, plan_id, billing_cycle, status, start_date, trial_end_date, promo_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [sub.id, sub.customer_name, sub.customer_email, sub.plan_id, sub.billing_cycle, sub.status, sub.start_date, sub.trial_end_date, sub.promo_code]
    );
    return { ok: true };
  } else {
    const subs = readJSON("subscriptions.json");
    subs.unshift(sub);
    writeJSON("subscriptions.json", subs);
    return { ok: true };
  }
}

export async function updateSubscription(id, fields) {
  if (isPostgresConnected) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return { ok: true };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      sets.push(`"${k}" = $${idx++}`);
      values.push(fields[k]);
    }
    values.push(id);
    await pool.query(`UPDATE subscriptions SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const subs = readJSON("subscriptions.json");
    const idx = subs.findIndex(s => s.id === id);
    if (idx !== -1) {
      Object.assign(subs[idx], fields);
      writeJSON("subscriptions.json", subs);
    }
    return { ok: true };
  }
}

export async function deleteSubscription(id) {
  if (isPostgresConnected) {
    await pool.query("DELETE FROM subscriptions WHERE id = $1", [id]);
    return { ok: true };
  } else {
    const subs = readJSON("subscriptions.json");
    const filtered = subs.filter(s => s.id !== id);
    writeJSON("subscriptions.json", filtered);
    return { ok: true };
  }
}

// ─── Payments Helpers ───────────────────────────────────────────────
export async function getPayments() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM payments ORDER BY payment_date DESC");
    return rows.map(r => ({
      ...r,
      amount: parseFloat(r.amount),
    }));
  } else {
    const pays = readJSON("payments.json");
    if (pays.length === 0) {
      const defaultPays = [
        { id: "pay-001", subscription_id: "sub-001", amount: 35000, payment_date: "2026-05-01", status: "paid", payment_method: "Bank Transfer" },
        { id: "pay-002", subscription_id: "sub-002", amount: 68000, payment_date: "2026-05-16", status: "paid", payment_method: "UPI" },
        { id: "pay-003", subscription_id: "sub-003", amount: 0, payment_date: "2026-06-10", status: "paid", payment_method: "Free Trial" }
      ];
      writeJSON("payments.json", defaultPays);
      return defaultPays;
    }
    return pays;
  }
}

export async function addPayment(pay) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO payments (id, subscription_id, amount, payment_date, status, payment_method) VALUES ($1, $2, $3, $4, $5, $6)",
      [pay.id, pay.subscription_id, pay.amount, pay.payment_date, pay.status, pay.payment_method]
    );
    return { ok: true };
  } else {
    const pays = readJSON("payments.json");
    pays.unshift(pay);
    writeJSON("payments.json", pays);
    return { ok: true };
  }
}

// ─── Announcements Helpers ───────────────────────────────────────────
export async function getAnnouncements() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM announcements ORDER BY created_at DESC");
    return rows;
  } else {
    const anns = readJSON("announcements.json");
    if (anns.length === 0) {
      const defaultAnns = [
        { id: "ann-001", message: "📢 Special Launch Offer: Get a professional Business website with custom admin panel at 15% Off! Code: HYDNEW", active: true, created_at: new Date().toISOString() }
      ];
      writeJSON("announcements.json", defaultAnns);
      return defaultAnns;
    }
    return anns;
  }
}

export async function addAnnouncement(ann) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO announcements (id, message, active) VALUES ($1, $2, $3)",
      [ann.id, ann.message, ann.active ?? true]
    );
    return { ok: true };
  } else {
    const anns = readJSON("announcements.json");
    anns.unshift(ann);
    writeJSON("announcements.json", anns);
    return { ok: true };
  }
}

export async function updateAnnouncement(id, fields) {
  if (isPostgresConnected) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return { ok: true };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      sets.push(`"${k}" = $${idx++}`);
      values.push(fields[k]);
    }
    values.push(id);
    await pool.query(`UPDATE announcements SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const anns = readJSON("announcements.json");
    const idx = anns.findIndex(a => a.id === id);
    if (idx !== -1) {
      Object.assign(anns[idx], fields);
      writeJSON("announcements.json", anns);
    }
    return { ok: true };
  }
}

export async function deleteAnnouncement(id) {
  if (isPostgresConnected) {
    await pool.query("DELETE FROM announcements WHERE id = $1", [id]);
    return { ok: true };
  } else {
    const anns = readJSON("announcements.json");
    const filtered = anns.filter(a => a.id !== id);
    writeJSON("announcements.json", filtered);
    return { ok: true };
  }
}

// ─── Invoices Helpers ────────────────────────────────────────────────
export async function getInvoices() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM invoices ORDER BY issue_date DESC");
    return rows.map(r => ({ ...r, cost: parseFloat(r.cost), add_ons: r.add_ons || [] }));
  } else {
    return readJSON("invoices.json");
  }
}

export async function addInvoice(invoice) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO invoices (id, subscription_id, plan_name, cost, add_ons, issue_date, status) VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)",
      [invoice.id, invoice.subscription_id, invoice.plan_name, invoice.cost, JSON.stringify(invoice.add_ons || []), invoice.issue_date, invoice.status]
    );
    return { ok: true };
  } else {
    const invoices = readJSON("invoices.json");
    invoices.unshift(invoice);
    writeJSON("invoices.json", invoices);
    return { ok: true };
  }
}

// ─── Proposals Helpers ────────────────────────────────────────────────
export async function getProposals() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM proposals ORDER BY created_at DESC");
    return rows.map(r => ({ ...r, cost: parseFloat(r.cost) }));
  } else {
    return readJSON("proposals.json");
  }
}

export async function addProposal(prop) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO proposals (id, customer_email, customer_name, company_name, plan_name, cost, content, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [prop.id, prop.customer_email, prop.customer_name, prop.company_name, prop.plan_name, prop.cost, prop.content, prop.status]
    );
    return { ok: true };
  } else {
    const proposals = readJSON("proposals.json");
    proposals.unshift(prop);
    writeJSON("proposals.json", proposals);
    return { ok: true };
  }
}

export async function updateProposalStatus(id, status) {
  if (isPostgresConnected) {
    await pool.query("UPDATE proposals SET status = $1 WHERE id = $2", [status, id]);
    return { ok: true };
  } else {
    const proposals = readJSON("proposals.json");
    const idx = proposals.findIndex(p => p.id === id);
    if (idx !== -1) {
      proposals[idx].status = status;
      writeJSON("proposals.json", proposals);
    }
    return { ok: true };
  }
}

// ─── Agreements Helpers ───────────────────────────────────────────────
export async function getAgreements() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM agreements ORDER BY created_at DESC");
    return rows;
  } else {
    return readJSON("agreements.json");
  }
}

export async function addAgreement(agr) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO agreements (id, customer_email, customer_name, plan_name, content, status) VALUES ($1, $2, $3, $4, $5, $6)",
      [agr.id, agr.customer_email, agr.customer_name, agr.plan_name, agr.content, agr.status]
    );
    return { ok: true };
  } else {
    const agreements = readJSON("agreements.json");
    agreements.unshift(agr);
    writeJSON("agreements.json", agreements);
    return { ok: true };
  }
}

export async function updateAgreement(id, fields) {
  if (isPostgresConnected) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return { ok: true };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      sets.push(`"${k}" = $${idx++}`);
      values.push(fields[k]);
    }
    values.push(id);
    await pool.query(`UPDATE agreements SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const agreements = readJSON("agreements.json");
    const idx = agreements.findIndex(a => a.id === id);
    if (idx !== -1) {
      Object.assign(agreements[idx], fields);
      writeJSON("agreements.json", agreements);
    }
    return { ok: true };
  }
}

// ─── Projects Helpers ────────────────────────────────────────────────
export async function getProjects() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
    return rows;
  } else {
    return readJSON("projects.json");
  }
}

export async function addProject(proj) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO projects (id, customer_name, customer_email, company_name, plan_name, status, progress, assigned_to, requirements) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [proj.id, proj.customer_name, proj.customer_email, proj.company_name, proj.plan_name, proj.status, proj.progress || 0, proj.assigned_to || 'Unassigned', proj.requirements || '']
    );
    return { ok: true };
  } else {
    const projects = readJSON("projects.json");
    projects.unshift(proj);
    writeJSON("projects.json", projects);
    return { ok: true };
  }
}

export async function updateProject(id, fields) {
  if (isPostgresConnected) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return { ok: true };
    const sets = [];
    const values = [];
    let idx = 1;
    for (const k of keys) {
      sets.push(`"${k}" = $${idx++}`);
      values.push(fields[k]);
    }
    values.push(id);
    await pool.query(`UPDATE projects SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return { ok: true };
  } else {
    const projects = readJSON("projects.json");
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      Object.assign(projects[idx], fields);
      writeJSON("projects.json", projects);
    }
    return { ok: true };
  }
}

// ─── CRM Notifications Helpers ───────────────────────────────────────
export async function getCRMNotifications() {
  if (isPostgresConnected) {
    const { rows } = await pool.query("SELECT * FROM crm_notifications ORDER BY created_at DESC");
    return rows;
  } else {
    return readJSON("notifications.json");
  }
}

export async function addCRMNotification(notif) {
  if (isPostgresConnected) {
    await pool.query(
      "INSERT INTO crm_notifications (id, message, type, is_read) VALUES ($1, $2, $3, $4)",
      [notif.id, notif.message, notif.type, notif.is_read ?? false]
    );
    return { ok: true };
  } else {
    const notifications = readJSON("notifications.json");
    notifications.unshift(notif);
    writeJSON("notifications.json", notifications);
    return { ok: true };
  }
}

export async function markCRMNotificationsRead() {
  if (isPostgresConnected) {
    await pool.query("UPDATE crm_notifications SET is_read = TRUE");
    return { ok: true };
  } else {
    const notifications = readJSON("notifications.json");
    notifications.forEach(n => { n.is_read = true; });
    writeJSON("notifications.json", notifications);
    return { ok: true };
  }
}


