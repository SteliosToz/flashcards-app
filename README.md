# Flashcards — Spaced Repetition Study App

A web application for studying with flashcards, using a spaced repetition algorithm inspired by Anki's SM-2 system. Built from scratch with Python/Flask backend and vanilla JavaScript frontend.

**Live demo:** _(coming soon)_

## What is spaced repetition?

Spaced repetition is a learning technique where flashcards you know well are shown less frequently, while cards you find difficult are shown more often. This makes studying more efficient — you spend more time on what you actually need to practice.

## Features

- **Spaced repetition algorithm** — each card tracks its own `ease_factor` and `interval`, adjusting review timing based on how well you remember it
- **Full CRUD** — create, view, and delete flashcards directly from the UI
- **Category-based color coding** — cards are visually grouped by topic
- **3D flip animation** — cards flip to reveal the answer, like physical study cards
- **Progress tracking** — daily progress bar and stats dashboard (total cards, mastered cards, average ease factor)
- **Responsive, soft-paper design** — clean, distraction-free interface built for focused studying

## Built with

- **Backend:** Python, Flask, Flask-SQLAlchemy, SQLite
- **Frontend:** HTML5, CSS3, vanilla JavaScript (no frameworks)

## The algorithm

Each card has an `ease_factor` (starting at 2.5) and an `interval` (days until next review). When reviewing a card:

- **Hard** → ease factor decreases, interval resets to 1 day
- **Medium** → interval multiplies by the current ease factor
- **Easy** → ease factor increases, interval multiplies by the new ease factor

This means well-known cards are reviewed less often over time, while difficult cards stay in frequent rotation.

## Run locally

1. Clone the repository
2. Create and activate a virtual environment:
python -m venv venv
source venv/Scripts/activate

3. Install dependencies:
pip install flask flask-sqlalchemy

4. (Optional) Seed the database with sample cards:
python seed.py

5. Run the app:
python app.py

6. Open `http://127.0.0.1:5000` in your browser

## About

Built by Stelios Tozios as part of my junior developer portfolio. [More about me](https://steliostozios.com)