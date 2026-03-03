# SwiftBill Freight - ARC Billing System

This is a Next.js application for managing ARC freight bills, integrated with Genkit for AI-powered features.

## Core Features
- **Structured Entry**: Multi-section form replicating the ARC Freight Bill layout.
- **AI Amount-to-Words**: Automatically converts numeric totals to Indian Rupee words (e.g., "Rupees One Lakh...").
- **Print-Ready Documents**: Precise visual reproduction of physical bills for printing or PDF export.
- **Search & Retrieval**: Quick lookup by Bill Number.

## GitHub Connection & Deployment
To connect this project to GitHub and enable automatic deployments via **Firebase App Hosting**:

1. **Open your Terminal**: Navigate to the root folder of this project.
2. **Initialize Git**:
   ```bash
   git init
   ```
3. **Commit Your Code**:
   ```bash
   git add .
   git commit -m "Initial project setup"
   ```
4. **Push to GitHub**:
   - Create a new **private** repository on GitHub.
   - Run the commands provided by GitHub to "push an existing repository from the command line":
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
5. **Firebase App Hosting**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Select your project.
   - Go to **Build > App Hosting**.
   - Click **Get Started** and select **Connect to GitHub**.
   - Select your repository and follow the setup wizard.

Once connected, every `git push` will automatically update your live site.