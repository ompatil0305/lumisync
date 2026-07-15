<div align="center">

# 🌟 Lumisync

### AI-Powered Campus Operating System

#### One intelligent platform for everything students need on campus.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

**🚀 Currently built for Texas Tech University as the first supported campus.**

*Designed to expand to universities worldwide.*

🌐 **Live Demo:** https://lumisync.vercel.app

</div>

---

# 📖 Overview

University students constantly switch between multiple websites and apps just to complete simple daily tasks.

Finding classrooms, locating professors, checking dining hours, searching for parking, discovering campus jobs, viewing events, and navigating campus often requires several different university systems.

**Lumisync solves this problem by bringing everything together into one modern, AI-powered platform.**

Think of it as:

> **Google Maps + Apple Maps + ChatGPT + your University's Portal — all in one application.**

---

# ✨ Features

## 🗺 Interactive Campus Map

- Interactive campus map
- Accurate campus navigation
- Building information cards
- Parking lots
- Dining locations
- Academic buildings
- Residence halls
- Libraries
- Student Union
- Recreation Center
- Search buildings instantly
- Building photos
- Nearby parking & dining

---

## 👨‍🏫 Faculty Directory

Search professors and faculty members.

Features include:

- Department
- Office Location
- Office Phone
- University Email
- Research Interests
- Office on Map
- Faculty Profile

---

## 🍔 Dining

Discover campus dining.

- Dining Locations
- Operating Hours
- Menus
- Favorite Locations
- Walking Directions
- Dining Categories

---

## 🚗 Parking

Find parking faster.

- Parking Lots
- Visitor Parking
- Permit Information
- Nearby Buildings
- Walking Distance

Future:

- Live Occupancy
- AI Parking Prediction

---

## 🔍 Universal Search

Search everything from one place.

Search:

- Buildings
- Faculty
- Departments
- Dining
- Parking
- Jobs
- Events
- Organizations

---

## 📅 Student Dashboard

Daily personalized dashboard.

Includes:

- Today's Schedule *(Demo)*
- Campus Alerts
- Quick Search
- Weather Summary
- Dining Recommendations
- Parking
- Events
- Campus Jobs

---

## 🌤 Live Weather

Current weather powered by public weather APIs.

Includes:

- Current Conditions
- Hourly Forecast
- 7-Day Forecast
- UV Index
- Humidity
- Wind
- Rain Probability

---

## 💼 Campus Jobs

Discover on-campus opportunities.

- Student Jobs
- Departments
- Filters
- Application Links

---

## 🤖 AI Assistant (Coming Soon)

Future AI assistant capable of answering campus-related questions using trusted university data.

Examples:

> Where is Holden Hall?

> Where should I park for Rawls College?

> Which dining hall is open now?

> What events are happening tonight?

---

# 🏗 Architecture

Lumisync is designed using a scalable provider architecture.

```
                    UI Layer
                        │
               Business Logic
                        │
                 Service Layer
                        │
             University Provider
                        │
          Official Public Data Sources
```

The application is designed so that supporting another university only requires implementing a new provider.

Example:

```
TexasTechUniversityProvider

↓

TexasAMUniversityProvider

↓

UTAustinUniversityProvider

↓

UniversityOfHoustonProvider

↓

ArizonaStateUniversityProvider
```

No UI changes are required.

---

# 🛠 Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Maps

- Leaflet
- OpenStreetMap

Future:

- Mapbox

## Backend (Planned)

- FastAPI
- PostgreSQL
- Redis

## AI (Planned)

- OpenAI API
- Retrieval-Augmented Generation (RAG)

## Authentication (Planned)

- Google OAuth
- University SSO
- Canvas Integration

---

# 🚀 Roadmap

## Version 1

- ✅ Interactive Campus Map
- ✅ Search
- ✅ Home Dashboard
- ✅ Weather
- ✅ Parking
- ✅ Dining

---

## Version 2

- Faculty Directory
- Student Organizations
- Campus Events
- Campus Jobs
- Building Images
- Favorite Locations

---

## Version 3

- Canvas Integration
- AI Assistant
- Notifications
- Favorites
- Student Profile

---

## Version 4

- Live Shuttle Tracking
- Live Parking Occupancy
- Dining Wait Times
- Indoor Navigation

---

## Version 5

- Multi-University Support
- University Marketplace
- AI Campus Planner

---

# 📂 Project Structure

```
src
│
├── assets
├── components
├── features
├── hooks
├── layouts
├── pages
├── providers
├── services
├── styles
├── types
├── utils
└── App.tsx
```

---

# 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/ompatil0305/lumisync.git
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build production version

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# 🌍 Live Demo

** https://lumisync.vercel.app**

---


# 🎯 Vision

The long-term vision of Lumisync is to become the operating system for universities.

Students should never need to search through multiple websites just to answer everyday questions.

Instead, one application should intelligently provide:

- Navigation
- Faculty Information
- Parking
- Dining
- Jobs
- Events
- Student Resources
- AI Assistance

All in one beautiful experience.

---

# 🤝 Contributing

Contributions are welcome.

Feel free to:

- Open Issues
- Submit Pull Requests
- Suggest Features
- Report Bugs

---

# 📄 License

This project is licensed under the MIT License.

---

# 🙏 Acknowledgements

This project uses publicly available information where appropriate and relies on open-source technologies, including:

- React
- TypeScript
- Vite
- Tailwind CSS
- Leaflet
- OpenStreetMap

Future integrations may use official university APIs and other public data sources where available.

---

<div align="center">

### ⭐ If you like this project.

Built by **Om Patil**

**Making campus life simpler, smarter, and more connected.**

</div>
