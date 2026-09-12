# Pazamayi Sheriyayi 🍌🏛️

Welcome to **Pazamayi Sheriyayi** (formerly the National Banana Registry). This is a comprehensive, government-style portal designed for the official registration, biological analysis, and culinary matchmaking of bananas.

Built with **Next.js (App Router)**, **React**, **Prisma ORM**, and **SQLite**, the platform playfully emulates an enterprise-grade bureaucratic system with dynamic document generation, computer vision heuristics, and a full dating engine for food pairing.

---

## 🌟 Key Features

### 1. The Registry & Documentation Vault 📁
- **Banana Registration**: Users can register a new banana by providing metadata (origin, estimated birth, variety) and uploading an official portrait (stored dynamically as a Base64 string for seamless cross-environment rendering).
- **Document Generation**: The system automatically mints high-fidelity, printable certificates that emulate government documents. This includes:
  - **Banadhaar Card (Identity Card)**: Complete with BananaPrint ID and a scannable pseudo-QR code.
  - **Certificate of Banana Birth**
  - **Variety Assessment Reports**
  - **Certificates of Compatibility**
- Custom seals and authorized signatures are integrated across all official reports.

### 2. Biological Analysis & Curvature Engine 📐
- **Real-Time Camera Integration**: Capture photos of a specimen directly via webcam.
- **Curvature Assessment**: An interactive SVG-based Bezier curve tool lets users overlay control points over their banana image. The engine calculates the **Curvature Angle (%)** and **Straightness Index (%)** in real-time.
- **Report Generation**: After analysis, the system archives the physical measurements into a formal Analysis Report.

### 3. Dating Portal & Compatibility Engine 💘
- **Matchmaking Dashboard**: Registered bananas can "opt-in" to the dating pool and browse a database of certified culinary partners (e.g., Peanut Butter, Ice Cream, Oatmeal).
- **Compatibility Matrix**: A deterministic algorithmic hash calculates a unique compatibility score (0-100%) based on the banana's physical traits (curvature, variety) paired against the partner's intrinsic qualities (red flags, green flags, personality type).
- **Love Files**: View deep-dive compatibility metrics for each partner before officially entering into a relationship.

### 4. Admin Portal 🔒
- **Bureaucratic Management**: A protected dashboard (Password: `password2444`) restricted to authorized officials.
- **Manual Data Overrides**: Admins can edit profile pictures, dating histories, and flag attributes of registered specimens.
- **Audit Logs**: Trace all systemic actions, updates, and registrations.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: SQLite
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: Modular CSS (`globals.css`) with standard Vanilla CSS conventions (no Tailwind).
- **Media**: Base64 data strings for dynamic portability without relying on external CDNs or filesystem writes.

---

## 🛠️ Getting Started

First, ensure dependencies are installed:

```bash
npm install
```

Next, set up the SQLite database and generate the Prisma client:

```bash
npx prisma db push
npx prisma generate
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the Registry.

---

## 📝 Design Philosophy

The aesthetic of the platform is intentionally designed to evoke feelings of an **official, austere government agency**. It heavily utilizes muted gold, navy blues (`var(--gov-blue)`), ivory backgrounds, and serif typography (Times New Roman / Garamond) to establish an atmosphere of rigid formality—all applied to the whimsical subject matter of bananas.
