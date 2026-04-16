# QuizlyWeb Local

A lightweight, browser-based quiz app that turns your study notes into multiple-choice practice tests.

No backend, no paid APIs, and no sign-up service required. Everything runs locally in your browser.

## Features

- Landing page with login or signup flow
- Local profile system:
  - Name
  - Unique email
  - 4-digit PIN
  - Recovery question and answer
- TXT file upload support (up to 5 MB)
- Paste text manually or directly from clipboard
- Automatic MCQ generation from your notes
- Select question count (10, 12, or 15)
- Quiz flow with:
  - Question progress tracking
  - Skip question option
  - Submit anytime
  - Final score view
- Score history panel for recent quiz attempts
- Persistent data using browser localStorage
- Responsive UI for desktop and mobile

## How It Works

1. Create an account or log in.
2. Upload a TXT file or paste study text.
3. Generate quiz questions.
4. Start quiz and answer questions.
5. View your final score and score history.


## Project Structure

- index.html: App layout and UI sections
- style.css: Theme, animations, and responsive styling
- script.js: App logic, auth, question generation, and quiz runtime

## Run Locally
1. Clone/download this repository.
2. Open index.html in a browser.
3. Create profile, upload resource, generate MCQs, and start quiz.

Live Deployment: https://quizlyweb.pages.dev/

## Deployment

This project is static and can be hosted for free on platforms like:

- GitHub Pages
- Cloudflare Pages

No build step is required.

## Data & Privacy Notice

All data is stored only in the current browser on the current device.

If browser data is cleared, private/incognito mode is used, or you switch browser/device, saved data may be lost.

## Limitations

- Works best with clear, well-structured study text
- Generated questions depend on quality of input notes
- Data is local only unless you add external backup features

## License

This project is licensed under the MIT License.
See the LICENSE file for details.