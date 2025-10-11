# Deepline - MLOps Control Plane Website

## Overview
This is a single-page startup website for Deepline, an agentic MLOps control plane. The site is designed in the YC/a16z style with a dark theme, focused on converting ML engineers and technical founders into Early Access signups.

## Purpose
Turn qualified traffic (ML engineers, technical founders, Heads of ML) into **Early Access** signups while signaling credibility and momentum.

## Project Structure
```
/
├── index.html          # Main landing page with all sections
├── styles.css          # Dark theme styling with specified color palette
├── main.js             # Interactive features and form handling
├── attached_assets/    # Images and logos
└── replit.md          # This file
```

## Design System
- **Background**: #0B0B0C (near-black)
- **Surface**: #15161A (graphite)
- **Text Primary**: #ECEFF4 (silver-white)
- **Text Secondary**: #A9B0BA
- **Accent**: #00B5D8 (cyan)
- **Accent Alt**: #2E7CF6 (ultramarine)

## Typography
- H1: 56px, semi-bold
- H2: 36px, medium
- Body: 16px, regular

## Sections
1. **Hero** - Value prop and CTAs
2. **Problem** - Pain points with infinity icons
3. **Capabilities** - What Deepline offers
4. **How it Works** - 3-step process
5. **Playbooks** - Agent playbook cards (Drift Guard, Data Contract Sentry, Incident Autopilot)
6. **Why Now** - Market context
7. **Security** - Compliance and data residency
8. **Early Access Form** - Lead capture with minimal fields
9. **Footer** - Contact and links

## Recent Changes
- 2025-10-11: Initial website creation with all sections
- 2025-10-11: Set up Python HTTP server workflow on port 5000
- 2025-10-11: Added favicon.svg for browser tab icon
- 2025-10-11: Completed and tested all website functionality

## Tech Stack
- Plain HTML/CSS/JavaScript (no frameworks)
- Python HTTP server for local development
- Responsive design with mobile-first approach

## Key Features
- Smooth scroll navigation
- Form validation and submission handling
- Scroll animations for sections
- Auto-hiding navigation on scroll
- Analytics event tracking (ready for GA4/PostHog integration)

## User Preferences
- None specified yet

## Next Steps
- Integrate with actual form backend (Formspree, Google Forms, or custom API)
- Add analytics tracking (GA4/PostHog/Umami)
- Consider adding Calendly integration for discovery calls
- Optimize images for faster loading
