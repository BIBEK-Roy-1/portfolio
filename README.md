# Bibek Roy — Portfolio

A React + Vite portfolio extracted from the supplied `final.tsx` file. Tailwind CSS is configured locally, and the custom animation/scrollbar styles are in `src/index.css`.

## Run locally

1. Install [Node.js](https://nodejs.org/) (LTS recommended).
2. Open this project folder in a terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production-ready site is generated in the `dist/` folder.

## Upload to GitHub

Upload the contents of this folder to a GitHub repository. Do not upload `node_modules/` or `dist/` unless you specifically want to.

## Important customization

- Update the placeholder email, GitHub, LinkedIn, project, and demo URLs in `src/Portfolio.jsx`.
- The contact form currently displays a simulated success message; it is not connected to an email service or backend.
- The CV button currently shows a notification. Add your actual CV file and change the button handler to link to it if you want downloads.
