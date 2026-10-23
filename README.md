# 🇺🇸🇷🇺 My Honest President Game

A browser-based, side-scrolling arcade mini-game built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. Choose your favorite president, make promises, shoot money projectiles, dodge enemies, and survive to win!

---

## 🎮 Features

* **Character Selection:** Choose between **Donald Trump** and **Vladimir Putin**, each featuring custom animations, running sprites, win/loss GIFs, and unique audio tracks.
* **Dynamic Audio System:** 
  * Seamless looping background music for the start screen, character selection, gameplay, and win/loss screens.
  * Unique voice lines and sound effects for character hits (`ouch-hit-trump.mp3` / `putin-ouch.mp3`), money shooting, and jumping.
* **Arcade Gameplay:**
  * 60-second survival timer.
  * Life counter tracked with money icons.
  * Collision detection.
* ** Layout:** Centered screens styled with CSS Flexbox and a continuous sliding city background.

---

## 🕹️ Controls

* **Jump:** `Spacebar` (includes sound effects and jump animation)
* **Shoot Money:** `Right Arrow Key` (fires money projectiles every 2 seconds)

---

## Guiding and learning

Implemented timer, sound and other features learning from:

* YouTube channel https://www.youtube.com/@BroCodez (Bro Code).
* https://www.w3schools.com/js/
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
* Ironhack guides, materials, and teachers.
* Other Ironhack fellow students. 

---

AI use: 

* Gemini: for debugging, concepts explanation, guiding through some logics, and background image generation.
* pixellab.ai/ for character sprite generation.
* Parrot AI for character voice generation. 

---

## 📂 Project Structure

```text
my-own-game/
│
├── index.html
├── styles/
│   └── style.css
├── js/
│   ├── main.js
│   ├── players.js
│   └── enemies.js
├── Sound/
│   ├── select-screen.mp3
│   ├── trump-select.mp3
│   ├── putin-select.mp3
│   ├── trump-win.mp3
│   ├── putin-win.mp3
│   ├── trump-loose.mp3
│   ├── putin-loose.mp3
│   ├── ouch-hit-trump.mp3
│   ├── putin-ouch.mp3
│   ├── money-sound.mp3
│   └── jump-sound.mp3
└── images/
    ├── trump/
    ├── putin/
    └── money-projectil/
