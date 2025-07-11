# Manabu

A Japanese flashcard learning app built with the MERN stack principles (MongoDB, Express, Node.js) and EJS for templating.
Designed as a smarter Anki alternative with CRUD features and user authentication.

## Tech Stack

* Node.js and Express for backend
* MongoDB with Mongoose for database and models
* EJS as the templating engine
* Method-override for PUT/DELETE via forms
* bcrypt for password hashing
* dotenv for environment config
* cookie-parser for session handling
* OpenRouter / DeepSeek API for sentence generation

## Features

* User signup, login, and logout
* Auth-protected flashcard creation, update, and deletion
* Flashcards categorized by type: kanji, vocab, or phrase
* Default flashcards for unauthenticated users
* Generate N5-level Japanese example sentences from flashcards
* Save generated sentences to user’s profile
* View and delete saved sentences
* Structured error handling with redirection and messages
* Clean EJS views with partials for layout reuse

## Routes Overview

* GET `/` - Home with flashcards
* GET/POST `/user/signup` and `/user/signin`
* GET/POST `/flashcard/create`
* GET/PUT `/flashcard/:id/update`
* DELETE `/flashcard/delete/:id`
* GET `/flashcard/generate/:id` – Generate a sample sentence for a flashcard
* POST `/flashcard/:id/save-sentence` – Save generated sentence
* GET `/flashcard/view-sentences` – View all saved sentences
* DELETE `/flashcard/sentence/delete/:id` – Delete a saved sentence


