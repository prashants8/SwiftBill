# SwiftBill Freight - ARC Billing System

This is a Next.js application for managing ARC freight bills, integrated with Genkit for AI-powered features.

## Core Features
- **Structured Entry**: Multi-section form replicating the ARC Freight Bill layout.
- **AI Amount-to-Words**: Automatically converts numeric totals to Indian Rupee words (e.g., "Rupees One Lakh...").
- **Print-Ready Documents**: Precise visual reproduction of physical bills for printing or PDF export.
- **Search & Retrieval**: Quick lookup by Bill Number.

## GitHub Connection & Deployment

To connect this project to GitHub and enable automatic deployments:

### 1. Open your Terminal
- **In VS Code (Recommended)**: Press `Ctrl + \`` (backtick) or go to **Terminal > New Terminal**.
- **On Windows**: Press `Win + R`, type `cmd`, and press Enter.
- **On Mac**: Press `Cmd + Space`, type `Terminal`, and press Enter.

### 2. Navigate to Project Folder
If your terminal isn't already in the project folder:
1. Type `cd ` (with a space).
2. Drag your project folder from your computer into the terminal window.
3. Press **Enter**.

### 3. Initialize and Push Code
Run these commands one by one:

```bash
# Initialize Git
git init

# Commit Your Code
git add .
git commit -m "Initial project setup"

# Connect to GitHub
# (Replace the URL with your actual repo URL)
git remote add origin https://github.com/prashants8/SwiftBill.git
git branch -M main

# Push to GitHub
git push -u origin main
```

### ❌ Troubleshooting: "failed to push some refs"
If you see an error saying "failed to push some refs", it's because GitHub has files (like a README) that you don't have locally. To fix it and overwrite the remote, run:
```bash
git push -u origin main --force
```

### 4. Supabase email confirmation (optional)
If you use Supabase auth and email confirmation, add your app URLs in the Supabase dashboard so confirmation links open correctly (and don’t point to localhost):

- **Authentication → URL Configuration**
- **Site URL**: Your production URL, e.g. `https://swift-bill-ic4p.vercel.app`
- **Redirect URLs**: Add `https://swift-bill-ic4p.vercel.app/auth/callback` (and `http://localhost:3000/auth/callback` for local dev)

New signups will use the current site origin for the confirmation link. If a link has expired, users can go to **Login → Get help with confirmation** (or `/auth/error`) to request a new one.

### 5. Firebase App Hosting
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Select your project.
- Go to **Build > App Hosting**.
- Click **Get Started** and select **Connect to GitHub**.
- Select your repository and follow the setup wizard.
