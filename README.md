VifTutor — Next.js (app router) Prototype with Lessons Editor

This scaffold was created using the resources you provided:
- Maxicours primaire page: https://www.maxicours.com/se/primaire/ (used for lesson topics & structure)
- Educational activity fiches: (source attempted) https://toutpourlejeu.com/fr/content/10-fiches-d-activites-educatives-gratuites
- Guide pédagogique PDF (A.Ü.F): https://apprendre.auf.org/wp-content/uploads/2021/08/Guide_peda_lect_ecriture_3prim_Part2_fiches.pdf (used for reading/writing activity ideas)

What's added:
- App router structure (app/)
- Lessons listing and dynamic lesson pages (server components)
- Client-side lessons editor at /lessons/editor using react-quill (rich text) + builder for MCQ questions
- API route pages/api/lessons/save to persist lessons to data/lessons.json (prototype)
- xAPI proxy and NextAuth (copied from previous scaffold) — editor save could be extended to send xAPI statements

Run locally:
1. Install dependencies:
   npm install
2. Copy .env.local from .env.example and fill credentials (NextAuth, LRS, Stripe if used)
3. npm run dev

Notes:
- This is a developer prototype: secure auth, validation, and production config are not included.
- The lessons content is short sample content inspired by the provided URLs; for production, ensure you have rights to reproduce any copyrighted materials.
