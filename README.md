# PulseForge

AI-Powered Academic Operations & Attendance Intelligence Platform

## Overview

PulseForge is a modern mentor-student academic operations platform designed to streamline attendance management, session scheduling, cohort tracking, and academic intervention workflows.

The platform combines operational academic tooling with AI-assisted intelligence to help mentors identify attendance risks, manage student cohorts, and automate institutional workflows.

---

## Core Features

### Mentor Platform

* Secure mentor authentication
* Session scheduling and management
* Attendance tracking and analytics
* Student cohort management
* Bulk CSV/XLSX uploads
* AI-assisted attendance intelligence
* Smart academic intervention insights

### Student Platform

* Attendance visibility
* Session tracking
* Assignment workflows
* Notifications and updates
* Personalized attendance insights

### AI Capabilities

* AI-assisted CSV schema inference
* Attendance pattern analysis
* Risk student detection
* Academic intervention recommendations
* Automated mentor summaries

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend & Infrastructure

* Supabase
* PostgreSQL
* Row Level Security (RLS)
* Vercel Serverless Functions

### AI Layer

* Gemini API

---

## Architecture

PulseForge follows a modular frontend/backend architecture:

frontend/

* React + Vite application

api/

* Secure serverless AI endpoints

backend/

* Database workflows and operational logic

The application uses secure server-side AI routing to prevent API key exposure.

---

## Key Engineering Decisions

* Modular architecture with frontend/backend separation
* Secure environment variable isolation
* Role-based access workflows
* RLS-protected database operations
* AI-assisted institutional data ingestion
* Graceful empty-state handling instead of mock analytics

---

## AI-Assisted Data Ingestion

PulseForge supports intelligent CSV/XLSX uploads for:

* Student whitelist onboarding
* Attendance imports

The ingestion pipeline is designed to adapt to varying institutional spreadsheet schemas using AI-assisted column inference.

---

## Deployment

Frontend deployed using:

* Vercel

Backend services:

* Supabase
* Serverless API architecture

---

## Future Scope

* Advanced attendance intelligence
* Predictive intervention systems
* Real-time academic analytics
* Automated mentor recommendations
* Institutional reporting dashboards

---

## Team

Built as part of an academic innovation and attendance intelligence initiative.

---

## Status

Current build focuses on:

* operational mentor workflows
* secure backend architecture
* AI-assisted ingestion
* scalable academic operations foundation
