# VOID CROWNS: A browser strategy game

Access at 

## Void Crowns is 

## Features

**Advanced State Management:** Uses a database-like structure in Zustand state to achieve lookup of specific entities  in O(1), allowing representation of thousands of game entities.

**Procedural Galaxy Generation:** Developed a custom algorithm to generate unique, functional, and coherant star maps (graphs).

**Personnel Management System:** Created system to handle creation and destruction of 'character' entities automatically.

## Getting Started

To run this project locally, follow these steps:

1.  **Prerequisites:** Ensure you have Node.js (v18 or later) and `npm` installed.
2.  **Clone the repository:**
    ```bash
    git clone https://github.com/TroutBrashear/void-crowns.git
    cd void-crowns
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    The project uses the Vercel CLI for local development to emulate the serverless environment.
    ```bash
    npm install -g vercel
    vercel link
    vercel dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technology Stack

*   **Frontend:** React, Vite, CSS Modules
*   **State Management:** Zustand
*   **Deployment:** Vercel (with CI/CD)
