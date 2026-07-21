# Micro Job Pro

A production-ready, highly secure, fully responsive Micro Job Web Application built with HTML5, Tailwind CSS, Vanilla ES6+ JavaScript, and Firebase. Inspired by leading platforms like SproutGigs and Picoworkers.

## Features
- **Modern Fintech UI/UX**: Glassmorphism, Smooth Dark/Light Mode, Mobile-First.
- **Robust Authentication**: Email/Password, Google Auth, Email Verification, Persistent Sessions.
- **Task Marketplace**: Diverse micro-job categories with slot management, auto-expire mechanisms, and multimedia proof uploads.
- **Financial System**: Multi-wallet balances, local mobile financial services (bKash, Nagad, Rocket), and secure deposit/withdrawal processing.
- **Engagement Modules**: Referral commissions, daily streaks, lucky spin, scratch cards, and leaderboards.
- **Comprehensive Admin Panel**: Real-time stats, user moderation, task oversight, financial audits, and platform settings.
- **PWA & Offline Ready**: Service Worker caching, installable manifest, background push notifications.

## Quick Setup & Deployment
1. Clone the repository.
2. Initialize Firebase in your console and copy your configuration.
3. Update `firebase/firebase-config.js` with your project credentials.
4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,storage
