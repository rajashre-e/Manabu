# 🌸 ようこそ！Manabu へ

Manabu is a Japanese flashcard learning app built with Node.js, Express, and MongoDB, using EJS for server-side rendering.  
It’s designed as a smarter Anki alternative with CRUD flashcards, AI-generated example sentences, pronunciation practice, and quiz-based vocabulary tests.

## Tech Stack

- Node.js, Express, MongoDB & Mongoose
- EJS templating & Bootstrap 5
- JWT & cookie-parser for authentication
- express-session for quiz score tracking
- dotenv & method-override
- bcrypt for password hashing
- Axios (OpenRouter DeepSeek API) for sentence generation
- Wanakana & browser Speech APIs for text normalization, TTS & speech recognition

## Features

- User signup, login, logout (secure cookies with JWT)
- Flashcard create, update & delete (kanji, vocab, phrase)
- Generate & save AI-created example sentences
- Vocabulary test with scoring
- Pronunciation test with speech recognition
- Text-to-speech playback
- Default flashcards for guests

## Key Routes

- `/` – Home (flashcards)
- `/user/signup` & `/user/login` – Register / Login
- `/flashcard/create` – Add new flashcard
- `/flashcard/generate/:id` – Generate AI example sentence
- `/test/vocab` – Take vocabulary quiz
- `/test/pronunciation` – Pronunciation test

---

✨ 楽しく日本語を学ぼう、**Manabu** と一緒 ！

