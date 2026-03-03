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
- **In VS Code (Recommended)**: Press `Ctrl + \`` (backtick) or go to **Terminal > New Terminal**. The terminal usually opens in the correct folder automatically.
- **On Windows**: Press `Win + R`, type `cmd`, and press Enter.
- **On Mac**: Press `Cmd + Space`, type `Terminal`, and press Enter.

### 2. Navigate to Project Folder (If not already there)
If your terminal isn't in the project folder:
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

# Push to GitHub
# (Create a new private repository on GitHub first, then copy the URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 4. Firebase App Hosting
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Select your project.
- Go to **Build > App Hosting**.
- Click **Get Started** and select **Connect to GitHub**.
- Select your repository and follow the setup wizard.

Once connected, every `git push` will automatically update your live site.
