# MediLog 2024

**Your personal health records, digitized and organized.**

---

> 🚧 **Work in Progress** 🚧
>
> This project is currently under active development. The primary goal is to build a functional MVP (Minimum Viable Product) and many features are still being implemented. The code and features are subject to change.

## About The Project

MediLog is a responsive web application designed to help users securely digitize, manage, and understand their medical records. In a world of paper prescriptions and scattered lab reports, MediLog aims to create a centralized, intelligent, and easily accessible health dashboard for every user.

This project started as a portfolio piece to demonstrate skills in full-stack development, but is being built with the vision of a genuinely useful tool for managing personal and family health information.

## ✅ Current Features (What's Working Now)

The foundational system is in place, allowing users to:

*   **User Authentication:** Secure sign-up and login using Google, powered by Supabase Auth.
*   **Protected Dashboard:** A dedicated dashboard page accessible only to logged-in users.
*   **Folder Creation System:** Users can create folders (e.g., "Annual Checkup 2024", "Dad's Heart Condition") to organize their future records.
*   **Folder Viewing:** The dashboard displays a list of all folders created by the user.

  ![Alt text](https://github.com/nspushkar/HA_medilog/blob/main/1.jpg?raw=true)
  


## 🛠️ Technology Stack

This project is built with a modern, scalable, and developer-friendly tech stack.

| Component          | Technology                               |
| ------------------ | ---------------------------------------- |
| **Framework**      | [Next.js](https://nextjs.org/) 14 (App Router) |
| **Styling**        | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Components**  | [Shadcn/UI](https://ui.shadcn.com/)      |
| **Database**       | [Supabase (Postgres)](https://supabase.com/) |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) |
| **Image Storage**  | [Supabase Storage](https://supabase.com/storage) |
| **Language**       | [TypeScript](https://www.typescriptlang.org/) |
| **Deployment**     | [Vercel](https://vercel.com/)            |

## 🚀 Roadmap & Future Plans

This is where the project gets exciting. The current foundation is just the beginning. Here is the vision for what MediLog will become:

### Phase 1: Core OCR & Record Management (In Progress)
-   [ ] **Image Upload:** Allow users to upload an image of a prescription or lab report into a folder.
-   [ ] **OCR Integration:** Use Tesseract.js (or a similar service) to extract text from the uploaded image.
-   [ ] **Structured Data Form:** Present the extracted text in a user-friendly form to parse it into structured data (Medicine, Dosage, Frequency, etc.).
-   [ ] **Save Record:** Store the image, the raw text, and the structured data in the database, linked to the correct folder.

### Phase 2: The Reminder Engine
-   [ ] **Set Reminders:** Allow users to set email-based reminders for their medications directly from a saved record.
-   [ ] **Scheduled Notifications:** Implement a daily cron job (using Vercel Cron Jobs) to check for due reminders and send notification emails via Resend.

### Phase 3: Data Intelligence & Usability
-   [ ] **Health Summaries:** Generate structured health summaries (e.g., current medications, recent conditions) that can be easily shared with doctors.
-   [ ] **PDF Export:** Allow users to export their summaries or records as a clean, formatted PDF.
-   [ ] **Search & Filter:** Implement a powerful search functionality to find records by doctor, condition, or medication.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn
*   A Supabase account (free tier)

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/medilog.git
    cd medilog
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up your environment variables**
    Create a file named `.env.local` in the root of the project and add your Supabase credentials. You can find these in your Supabase project dashboard under `Project Settings > API`.
    ```env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_PUBLIC_KEY"
    ```
4.  **Run the development server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
