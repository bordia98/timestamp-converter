# ⏱️ Unix Timestamp Converter

[![GitHub Pages](https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-blue?style=flat-square&logo=github)](https://bordia98.github.io/timestamp-converter/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-orange?style=flat-square)](#)
[![Client-Side Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald?style=flat-square)](#)
[![Theme Support](https://img.shields.io/badge/Theme-Light%20%7C%20Dark-purple?style=flat-square)](#)

A modern, precision-engineered, and 100% client-side **Unix Timestamp and Epoch Converter**. Easily translate timestamps between raw Epoch counters and human-readable dates across multiple global time zones, batch process logs, and calculate dates in real time without sending any data over the network.

🌐 **Live Demo:** [https://bordia98.github.io/timestamp-converter/](https://bordia98.github.io/timestamp-converter/)

---

## ✨ Features

- 🕒 **Live Epoch Clock:** Real-time ticking Unix seconds and milliseconds counters with pause, resume, and instant copy.
- 🌍 **Multi-Timezone Translation:** Simultaneously inspect UTC (ISO 8601), Local time, New York (EST/EDT), Los Angeles (PST/PDT), London (GMT/BST), Berlin (CET/CEST), Tokyo (JST), Singapore (SGT), Mumbai (IST), and Sydney (AEST/AEDT).
- 🔬 **Automatic Unit Detection:**
  - Seconds (10 digits)
  - Milliseconds (13 digits)
  - Microseconds (16 digits)
  - Nanoseconds (19 digits)
- 📅 **Date-to-Epoch Generator:** Interactive date & time picker with timezone selector providing instant outputs for seconds, milliseconds, microseconds, and nanoseconds.
- 📋 **Batch Processing & CSV Export:** Paste a list of timestamps from server logs and convert them into an interactive table with one-click CSV export.
- 📊 **Calendar Metadata:** Displays relative time ("3 hours ago", "in 5 days"), day of year, ISO week number, and leap year status.
- ⚡ **Common Epoch Cheat Sheet:** Quick reference for start of day, start of month, start of year, and the Year 2038 Bug boundary.
- 🌓 **Light & Dark Theme:** Minimalist developer UI, defaulting to light mode with persistent local preference.
- 🔒 **100% Privacy Guarantee:** Runs entirely locally via the native browser `Intl.DateTimeFormat` API. No server logs, no cookies, no tracking.

---

## 🚀 Quick Start / Local Development

Zero external dependencies or build steps required.

### Option 1: Open Directly
Open `index.html` in any modern web browser.

### Option 2: Run with Python 3
```bash
cd timestamp-converter
python3 -m http.server 8001
```
Then navigate to `http://localhost:8001`.

---

## 🛠️ Deploying to GitHub Pages

1. Create a GitHub repository named `timestamp-converter` under your account (`bordia98/timestamp-converter`).
2. Push this directory to the repository `main` branch.
3. In GitHub, open **Settings** > **Pages**.
4. Set **Source** to `Deploy from a branch` with branch `main` and folder `/ (root)`.
5. Your application will be live at:
   ```
   https://bordia98.github.io/timestamp-converter/
   ```

---

## 📁 Project Structure

```
timestamp-converter/
├── index.html       # Semantic HTML5 markup, meta tags & Schema.org JSON-LD
├── style.css        # Responsive styling with light/dark theme variables
├── script.js        # High-performance client-side timestamp calculations
├── robots.txt       # Search engine crawler directives
├── sitemap.xml      # XML sitemap for SEO discovery
├── LICENSE          # MIT Open Source License
└── README.md        # Comprehensive documentation
```

---

## 🔒 Security & Privacy

- **No Remote Calls:** All time calculations and string formats are processed within the user's browser runtime.
- **Zero Third-Party Telemetry:** No analytics, trackers, or cookies are incorporated.

---

## 📜 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

Authored with precision by [bordia98](https://github.com/bordia98).
