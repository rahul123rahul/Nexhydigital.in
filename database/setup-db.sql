-- ═══════════════════════════════════════════════════════════════════════
--  Nexhydigital HR Suite — PostgreSQL Database Setup Script
--  Run this in pgAdmin Query Tool or psql as superuser
--  psql -U postgres -f setup-db.sql
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Create the database (skip if already exists)
SELECT 'CREATE DATABASE hygenx'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hygenx')\gexec

-- 2. Connect to hygenx database
\connect hygenx

-- ── Users Table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          VARCHAR(50)  PRIMARY KEY,
  username    VARCHAR(50)  UNIQUE NOT NULL,
  password    VARCHAR(100) NOT NULL,
  role        VARCHAR(50)  NOT NULL,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL,
  department  VARCHAR(100),
  avatar      VARCHAR(5)
);

INSERT INTO users (id, username, password, role, name, email, department, avatar)
VALUES
  ('usr-001', 'admin',      'Nexhydigital@123',     'super_admin', 'Super Admin',   'admin@hygenx.in',       'Administration',     'SA'),
  ('usr-002', 'hrmanager',  'HRManager@2026', 'hr_manager',  'Priya Sharma',  'priya.sharma@hygenx.in','Human Resources',    'PS'),
  ('usr-003', 'hrstaff',    'HRStaff@2026',   'hr_staff',    'Ravi Kumar',    'ravi.kumar@hygenx.in',  'Human Resources',    'RK'),
  ('usr-004', 'recruiter',  'Recruit@2026',   'recruiter',   'Anita Patel',   'anita.patel@hygenx.in', 'Talent Acquisition', 'AP'),
  ('usr-005', 'employee',   'Employee@2026',  'employee',    'Rohit Verma',   'rohit.verma@hygenx.in', 'Engineering',        'RV')
ON CONFLICT (id) DO NOTHING;

-- ── Careers (Job Listings) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS careers (
  id           VARCHAR(50)  PRIMARY KEY,
  title        VARCHAR(150) NOT NULL,
  dept         VARCHAR(100) NOT NULL,
  type         VARCHAR(50)  NOT NULL,
  loc          VARCHAR(100) NOT NULL,
  open         VARCHAR(50)  NOT NULL,
  description  TEXT         NOT NULL,
  requirements JSONB        DEFAULT '[]'::jsonb,
  published    BOOLEAN      DEFAULT TRUE,
  posted       VARCHAR(50)
);

INSERT INTO careers (id, title, dept, type, loc, open, description, requirements, published, posted)
VALUES
  ('JOB-001', 'Senior React Developer',  'Engineering', 'Full-time', 'Bangalore', '2',
   'Experienced Frontend Engineer with React expertise.',
   '["5+ years React","NextJS & CSS","State management"]'::jsonb, true, '2026-05-01'),
  ('JOB-002', 'HR Business Partner',     'HR',          'Full-time', 'Mumbai',    '1',
   'Join our people operations team.',
   '["3+ years HR","MBA in HR preferred","Grievance handling"]'::jsonb, true, '2026-05-03'),
  ('JOB-003', 'DevOps Engineer',         'Engineering', 'Full-time', 'Remote',    '1',
   'Manage infrastructure automations and container orchestration.',
   '["AWS or Azure Cert","Docker & Kubernetes","CI/CD Pipelines"]'::jsonb, true, '2026-04-28')
ON CONFLICT (id) DO NOTHING;

-- ── Candidates (ATS Pipeline) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS candidates (
  id         VARCHAR(50)  PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  phone      VARCHAR(50)  NOT NULL,
  experience VARCHAR(50),
  source     VARCHAR(50)  NOT NULL,
  stage      VARCHAR(50)  NOT NULL,
  score      INTEGER      DEFAULT 0,
  applied    VARCHAR(50)  NOT NULL,
  reason     TEXT,
  job_id     VARCHAR(50)
);

INSERT INTO candidates (id, name, email, phone, experience, source, stage, score, applied, reason, job_id)
VALUES
  ('CAN-001', 'Rahul Das',     'rahul.das@email.com',   '+91 91234 56789', '4 years', 'LinkedIn', 'Interview',    88, '2026-05-10', 'Strong state management experience.', 'JOB-001'),
  ('CAN-002', 'Pooja Mishra',  'pooja.mishra@email.com','+91 91234 56780', '3 years', 'Naukri',   'Screening',    75, '2026-05-12', 'Good HR communication skills.',        'JOB-002'),
  ('CAN-003', 'Amit Jain',     'amit.jain@email.com',   '+91 91234 56781', '6 years', 'Indeed',   'Selection',    92, '2026-05-08', 'Excellent AWS knowledge.',             'JOB-003'),
  ('CAN-004', 'Nikhil Sharma', 'nikhil.sharma@email.com','+91 91234 56782','2 years', 'Referral', 'Applications', 68, '2026-05-15', 'Creative portfolio, entry level.',     'JOB-001')
ON CONFLICT (id) DO NOTHING;

-- ── Employees ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id        VARCHAR(50)  PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(100) NOT NULL,
  phone     VARCHAR(50)  NOT NULL,
  dept      VARCHAR(100) NOT NULL,
  desig     VARCHAR(100) NOT NULL,
  mgr       VARCHAR(100) NOT NULL,
  join_date VARCHAR(50)  NOT NULL,
  status    VARCHAR(50)  NOT NULL,
  sal       INTEGER      DEFAULT 0,
  skills    VARCHAR(250),
  av        VARCHAR(5),
  avc       VARCHAR(10)
);

INSERT INTO employees (id, name, email, phone, dept, desig, mgr, join_date, status, sal, skills, av, avc)
VALUES
  ('EMP-001', 'Arjun Sharma',  'arjun.sharma@hygenx.in',  '+91 98765 43210', 'Engineering', 'Software Engineer', 'Priya Sharma', '2023-01-15', 'Active',    85000, 'React,Node.js,AWS',            'AS', '#6366f1'),
  ('EMP-002', 'Priya Sharma',  'priya.sharma@hygenx.in',  '+91 98765 43211', 'HR',          'HR Manager',        'Super Admin',  '2022-03-01', 'Active',    95000, 'Recruitment,Payroll,HRMS',      'PS', '#10b981'),
  ('EMP-003', 'Rohit Verma',   'rohit.verma@hygenx.in',   '+91 98765 43212', 'Engineering', 'Software Engineer', 'Arjun Sharma', '2024-06-01', 'Probation', 65000, 'Python,Django,PostgreSQL',       'RV', '#f59e0b'),
  ('EMP-004', 'Sunita Patel',  'sunita.patel@hygenx.in',  '+91 98765 43213', 'Finance',     'Accountant',        'Priya Sharma', '2021-09-10', 'Active',    72000, 'Tally,GST,TDS',                 'SP', '#ec4899'),
  ('EMP-006', 'Anita Patel',   'anita.patel@hygenx.in',   '+91 98765 43215', 'HR',          'Recruiter',         'Priya Sharma', '2023-07-05', 'Active',    62000, 'ATS,LinkedIn,HR Policies',      'AP', '#8b5cf6'),
  ('EMP-011', 'Ravi Kumar',    'ravi.kumar@hygenx.in',    '+91 98765 43220', 'HR',          'HR Executive',      'Priya Sharma', '2023-04-15', 'Active',    55000, 'Onboarding,Training,HRIS',      'RK', '#ec4899'),
  ('EMP-012', 'Sneha Gupta',   'sneha.gupta@hygenx.in',   '+91 98765 43221', 'Engineering', 'Product Manager',   'Arjun Sharma', '2023-08-22', 'Active',   105000, 'Product,Agile,Roadmap',         'SG', '#f59e0b')
ON CONFLICT (id) DO NOTHING;

-- ── Attendance ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id     SERIAL       PRIMARY KEY,
  emp_id VARCHAR(50)  NOT NULL,
  name   VARCHAR(100) NOT NULL,
  date   VARCHAR(50)  NOT NULL,
  c_in   VARCHAR(20),
  c_out  VARCHAR(20),
  hrs    VARCHAR(20),
  status VARCHAR(50),
  mode   VARCHAR(20)
);

INSERT INTO attendance (emp_id, name, date, c_in, c_out, hrs, status, mode)
VALUES
  ('EMP-001', 'Arjun Sharma', '2026-05-20', '09:02', '18:10', '9h 8m',  'Present', 'Office'),
  ('EMP-002', 'Priya Sharma', '2026-05-20', '08:55', '17:55', '9h 0m',  'Present', 'Office'),
  ('EMP-003', 'Rohit Verma',  '2026-05-20', '10:15', '19:00', '8h 45m', 'Late',    'WFH'),
  ('EMP-004', 'Sunita Patel', '2026-05-20', '09:00', '18:00', '9h 0m',  'Present', 'Office'),
  ('EMP-006', 'Anita Patel',  '2026-05-20', '09:10', '18:10', '9h 0m',  'Present', 'Office');

-- ── Leaves ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leaves (
  id        VARCHAR(50)  PRIMARY KEY,
  emp_id    VARCHAR(50)  NOT NULL,
  name      VARCHAR(100) NOT NULL,
  type      VARCHAR(50)  NOT NULL,
  from_date VARCHAR(50)  NOT NULL,
  to_date   VARCHAR(50)  NOT NULL,
  days      INTEGER      NOT NULL,
  reason    TEXT,
  status    VARCHAR(50)  NOT NULL,
  on_date   VARCHAR(50)  NOT NULL
);

INSERT INTO leaves (id, emp_id, name, type, from_date, to_date, days, reason, status, on_date)
VALUES
  ('LV-001', 'EMP-001', 'Arjun Sharma', 'Earned Leave',  '2026-05-18', '2026-05-22', 5, 'Family vacation', 'Approved', '2026-05-12'),
  ('LV-002', 'EMP-003', 'Rohit Verma',  'Sick Leave',    '2026-05-25', '2026-05-25', 1, 'Fever',           'Pending',  '2026-05-20'),
  ('LV-003', 'EMP-006', 'Anita Patel',  'Casual Leave',  '2026-05-20', '2026-05-20', 1, 'Personal work',   'Pending',  '2026-05-19')
ON CONFLICT (id) DO NOTHING;

-- ── Helpdesk Tickets ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
  id        VARCHAR(50)  PRIMARY KEY,
  sub       VARCHAR(150) NOT NULL,
  cat       VARCHAR(50)  NOT NULL,
  pri       VARCHAR(50)  NOT NULL,
  desc_text TEXT,
  status    VARCHAR(50)  NOT NULL,
  by_user   VARCHAR(100) NOT NULL,
  date      VARCHAR(50)  NOT NULL
);

INSERT INTO tickets (id, sub, cat, pri, desc_text, status, by_user, date)
VALUES
  ('TKT-001', 'Unable to access payslip portal',         'HR Query',           'High',   'Error when fetching payslip for April 2026.', 'Open',        'Rohit Verma',  '2026-05-19'),
  ('TKT-002', 'Leave policy clarification for Comp-Off', 'Policy Clarification','Medium', 'How do comp offs credit to leaf account?',   'In Progress', 'Karan Mehta',  '2026-05-18')
ON CONFLICT (id) DO NOTHING;

-- ── Exit Management ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exits (
  id       VARCHAR(50)  PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  emp_id   VARCHAR(50)  NOT NULL,
  dept     VARCHAR(100) NOT NULL,
  res_date VARCHAR(50)  NOT NULL,
  lwd      VARCHAR(50)  NOT NULL,
  stage    INTEGER      DEFAULT 0,
  ff       INTEGER      DEFAULT 0
);

INSERT INTO exits (id, name, emp_id, dept, res_date, lwd, stage, ff)
VALUES ('EXIT-001', 'Deepak Joshi', 'EMP-009', 'Operations', '2026-05-01', '2026-05-31', 1, 78000)
ON CONFLICT (id) DO NOTHING;

-- ── Contact & Quote Requests ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_requests (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  phone      VARCHAR(50),
  service    VARCHAR(100),
  message    TEXT,
  status     VARCHAR(50)  DEFAULT 'Pending',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id          SERIAL       PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL,
  budget      VARCHAR(50),
  pages       VARCHAR(50),
  timeline    VARCHAR(50),
  description TEXT,
  status      VARCHAR(50)  DEFAULT 'Pending',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ── Document Templates ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS document_templates (
  id       VARCHAR(50)  PRIMARY KEY,
  title    VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  content  TEXT         NOT NULL
);

INSERT INTO document_templates (id, title, category, content)
VALUES
  ('offer-letter', 'Offer Letter', 'Onboarding',
   'Dear {{employee.name}},

We are pleased to offer you the position of **{{employee.designation}}** in the **{{employee.department}}** department.

**Joining Date:** {{employee.joiningDate}}
**Compensation:** {{employee.salary}} per month

This offer is subject to successful completion of background verification and document submission.

Please sign and return a copy of this letter to confirm your acceptance within 3 working days.

Regards,
HR Team
Nexhydigital Technologies Pvt Ltd'),

  ('nda', 'Non-Disclosure Agreement', 'Legal',
   '## Non-Disclosure Agreement

This Agreement is entered into between **Nexhydigital Technologies Pvt Ltd** and **{{employee.name}}** (Employee ID: {{employee.id}}).

**Effective Date:** {{document.effectiveDate}}

### 1. Confidential Information
Employee agrees to keep all proprietary business information, source code, client data, and trade secrets strictly confidential during and after employment.

### 2. Duration
This agreement shall remain in effect for a period of **2 years** after the termination of employment.

### 3. Jurisdiction
This agreement is governed by the laws of **{{company.jurisdiction}}**.'),

  ('experience-letter', 'Experience Letter', 'Offboarding',
   'To Whom It May Concern,

This is to certify that **{{employee.name}}** (Employee ID: {{employee.id}}) was employed with **{{company.name}}** as **{{employee.designation}}** in the **{{employee.department}}** department.

**Period of Employment:** {{employee.joiningDate}} to {{document.effectiveDate}}

During the tenure, the employee demonstrated professionalism and dedication. We wish them success in all future endeavours.

Issued on: {{document.effectiveDate}}'),

  ('noc', 'No Objection Certificate', 'General',
   '## No Objection Certificate

This is to certify that **{{employee.name}}** (Employee ID: {{employee.id}}), working as **{{employee.designation}}** in **{{company.name}}**, has no pending dues or obligations with the company as of **{{document.effectiveDate}}**.

The company has **no objection** to this employee seeking employment elsewhere or for any other purpose for which this certificate is required.'),

  ('relieving-letter', 'Relieving Letter', 'Offboarding',
   '## Relieving Letter

Dear {{employee.name}},

This is to inform you that your resignation has been accepted and you are hereby relieved from your duties as **{{employee.designation}}** in the **{{employee.department}}** department, effective **{{document.effectiveDate}}**.

We thank you for your contributions to **{{company.name}}** and wish you the best in your future endeavours.

Regards,
HR Department
{{company.name}}')
ON CONFLICT (id) DO NOTHING;

SELECT 'Database setup complete!' AS status;
