# Supabase PostgreSQL Database Setup Guide

This guide will walk you through setting up a secure, enterprise-grade **PostgreSQL Database** in the cloud using **Supabase** (completely free forever under their standard tier) and connecting it to your admissions inquiry form.

---

## 🛠️ Step-by-Step Database Setup

### 1. Create a Free Supabase Project
1. Go to **[Supabase](https://supabase.com/)** and sign up or sign in (using GitHub or email).
2. Click **New Project** and select your organization.
3. Configure your project:
   * **Name**: `THE YASHAS V ACADEMY`
   * **Database Password**: *Click "Generate a password" and save it securely.*
   * **Region**: Select the region closest to your viewers (e.g., *South Asia (Mumbai)* or similar).
   * **Plan**: Select the **Free Tier**.
4. Click **Create new project**. *Wait 1–2 minutes for Supabase to spin up your secure database in the cloud.*

---

### 2. Create the Table and Security Policies (SQL Editor)
Supabase databases run on PostgreSQL. We can initialize your table and set up production-grade security boundaries with a single SQL query:

1. In the left-hand navigation bar of the Supabase dashboard, click on the ⚡ **SQL Editor** tab.
2. Click **New query** (or **New Blank Query**).
3. **Copy and Paste** the exact SQL command block below into the editor:

```sql
-- 1. Create the inquiries database table
create table inquiries (
  id bigint primary key generated always as identity,
  student_name text not null,
  parent_name text not null,
  phone text not null,
  program text not null,
  message text,
  status text default 'New',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) to secure the data
alter table inquiries enable row level security;

-- 3. Create a Security Policy allowing ANY website visitor to submit an inquiry
create policy "Allow public inserts"
on inquiries
for insert
to anon
with check (true);

-- 4. Create a Security Policy allowing ONLY logged-in admin accounts to view the entries
create policy "Allow admin select"
on inquiries
for select
to authenticated
using (true);
```

4. Click the green **Run** button at the bottom right. You should see a confirmation saying `Success!`.

---

### 3. Copy Your API Credentials
1. In the left navigation bar, click on the ⚙️ **Project Settings** (gear icon) ➔ **API** tab.
2. Locate the **Project API keys** and copy your credentials:
   * **Project URL**: Found under *Project URL* (e.g., `https://akfycby...supabase.co`).
   * **Anon Public Key**: Found under *Project API keys* labeled `anon` `public` (this is the safe key designed to be public on the web).

---

### 4. Connect Your Website Code
1. Open your project's [app.js](file:///C:/Users/Admin/.gemini/antigravity/scratch/edu-blueprint/app.js) file on your computer.
2. Go to **line 80** where the credentials are defined:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace the placeholder values with your actual copied credentials:
   ```javascript
   const SUPABASE_URL = 'https://your-project-ref.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```
4. Save the [app.js](file:///C:/Users/Admin/.gemini/antigravity/scratch/edu-blueprint/app.js) file.

---

## 📊 How to Access and Manage Your Data
* **Where to access**: Log in to your project on **[Supabase](https://supabase.com/)** at any time.
* **The Table Editor**: Click on the 📊 **Table Editor** (grid icon) in the left sidebar ➔ Select `inquiries`.
* **Managing Submissions**:
  * You will see all submissions in a beautiful, Excel-like spreadsheet grid in real-time.
  * You can sort, filter, or edit any value (e.g. double-click on `status` to change it from `New` to `Contacted` or `Enrolled`!).
  * **Export data**: Click the **Export** button at the top right of the table editor to download all inquiries as a CSV spreadsheet file for use in Excel!
