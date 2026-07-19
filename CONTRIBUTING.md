# Contributing to Lumisync

First off, thank you for taking the time to contribute to Lumisync! We welcome contributions to help make campus life simpler, smarter, and more connected.

## 🛠 How to Run the Project Locally

### Prerequisites
- Node.js (v20+ recommended)
- npm or another package manager of your choice

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ompatil0305/lumisync.git
   cd lumisync
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy the `.env.example` file to `.env` (or `.env.local`).
   - Add your local configuration values (like local routing variables if applicable).
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Access the application:**
   - Open your browser to [http://localhost:5173](http://localhost:5173).

---

## 🌿 Branch Naming Convention

We follow a simple branching structure to keep the commit history clean:

- **`feature/`** — For new features or visual UI additions (e.g., `feature/accurate-campus-map`)
- **`bugfix/`** or **`fix/`** — For resolving bugs or compile issues (e.g., `fix/shuttle-active-highlight`)
- **`chore/`** or **`docs/`** — For README updates, dependency hygiene, and build tweaks (e.g., `docs/add-license`)

Always create your branch from the latest `main` or `dev` branch.

---

## 📥 Pull Request Expectations

Before submitting a Pull Request:
1. **Validate Compilation:** Run `npm run build` locally to ensure there are no TypeScript compile errors. Unused variables or invalid imports will fail the build process.
2. **Describe Changes:** Explain the context of your change, what bugs it solves, or what modules it implements.
3. **Commit Cleanly:** Use clear, descriptive commit messages (e.g., `fix: resolve syntax error in BuildingsScreen`).
4. **No Secrets:** Ensure that you do not commit any secret API keys or credentials.
