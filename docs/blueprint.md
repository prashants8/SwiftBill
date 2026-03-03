# **App Name**: SwiftBill Freight

## Core Features:

- Structured Bill Data Entry: Comprehensive, multi-section form replicating the exact physical layout of the ARC Freight Bill for manual data input. Includes fields for Header, Customer, Freight Details (tabular), Charges, and Footer information, along with 'Save', 'Update', 'Reset' buttons.
- PostgreSQL Data Persistence: Storage of all entered freight bill records and associated freight details in a structured PostgreSQL database, following the specified table schemas for 'bills', 'freight_details', and 'additional_charges'.
- Bill Search and Display: Functionality to search for stored freight bills by 'Bill Number' and retrieve them, displaying the data in an exact visual replica of the ARC freight bill format.
- Print-Ready & PDF Output: Generation of a highly accurate print-optimized output that visually mirrors the ARC physical freight bill, maintaining layout alignment, section structure, and logo placement. Includes options for direct printing via browser and exporting the bill as a PDF.
- Automated Totals and Amount-in-Words: Automatically calculate the 'Grand Total' from individual charges and generate a linguistic representation of this total in Indian Rupees, using a generative AI tool to convert the numeric amount to words (e.g., 'Rupees One Lakh Seventeen Thousand Two Hundred Seventy One Only').
- Data Validation & Uniqueness: Implement front-end and back-end validation to ensure all mandatory fields are completed, numeric fields contain valid values, and 'Bill No.' entries are unique upon submission.

## Style Guidelines:

- Primary color: A robust, authoritative red (#CC1414), drawing inspiration from the ARC logo, signifying clarity and efficiency for primary actions and branding.
- Background color: A subtle, near-white shade with a hint of red (#FCF7F7), ensuring a clean and professional appearance for forms and document-like content.
- Accent color: A soft yet contrasting magenta-pink (#F2B2CF), used sparingly to highlight interactive elements and provide a subtle modern touch without detracting from the functional layout.
- Headline and body text font: 'Inter' (sans-serif), chosen for its excellent readability, clean, and modern aesthetic, aligning with a professional, desktop-first accounting-style interface. This single versatile font ensures consistency across forms and display views.
- Use a set of clear, minimalist line icons to represent navigation items and actions within the application, maintaining a professional and intuitive user experience.
- Implement a desktop-first, accounting-style interface featuring a persistent sidebar navigation for primary modules ('New Bill', 'Search Bill', 'All Bills'). The main content area will focus on structured form layouts and precise bill reproductions.
- Subtle, functional animations for UI feedback, such as transitions during form submission or bill retrieval, designed to enhance user experience without being distracting or delaying interactions.