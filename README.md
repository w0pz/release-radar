# Release Radar

Upcoming theatrical and digital movie releases in the US, UK and Ireland, week by
week, showing where each movie comes out. Data from [TMDB](https://www.themoviedb.org).

The site is fully static. A GitHub Actions workflow rebuilds it once a day with fresh
TMDB data and publishes it to GitHub Pages, so the TMDB token only lives in a GitHub secret.

## Run locally

1. Copy `.env.example` to `.env.local` and paste your TMDB "API Read Access Token".
2. `npm install`
3. `npm run dev` for development, or `npm run build && npm run preview` to test the static site on port 3001.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Add a repository secret named `TMDB_READ_TOKEN` (Settings → Secrets and variables → Actions).
3. Set Settings → Pages → Source to **GitHub Actions**.
4. Run the **Build and deploy** workflow once (Actions tab), or push to `main`.

GitHub pauses scheduled workflows after 60 days without repository activity; re-enable it
from the Actions tab if updates stop.
