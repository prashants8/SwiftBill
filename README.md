# SwiftBill Freight - ARC Billing System

This is a Next.js application for managing ARC freight bills, integrated with Genkit for AI-powered features.

## Core Features
- **Structured Entry**: Multi-section form replicating the ARC Freight Bill layout.
- **AI Amount-to-Words**: Automatically converts numeric totals to Indian Rupee words (e.g., "Rupees One Lakh...").
- **Print-Ready Documents**: Precise visual reproduction of physical bills for printing or PDF export.
- **Search & Retrieval**: Quick lookup by Bill Number.

## GitHub Connection & Deployment
To connect this project to GitHub and enable automatic deployments via **Firebase App Hosting**:

1. **Initialize Git**: Run `git init` in your project root.
2. **Commit Changes**: Run `git add .` and `git commit -m "Initial project setup"`.
3. **Push to GitHub**: Create a new repository on GitHub and push your local code there.
4. **Firebase Setup**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Select your project.
   - Go to **Build > App Hosting**.
   - Click **Get Started** and select **Connect to GitHub**.
   - Authorize Firebase and select your repository.
   - Follow the prompts to finish the setup.

Once connected, any changes pushed to your primary branch will automatically trigger a new build and deployment.
