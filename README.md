# Mongolian Passport Travel Map

Interactive map showing countries Mongolian citizens can visit by passport type:

- Blue: Diplomat/Official passport
- Green: Ordinary passport (visa-free)
- Yellow: Special arrangements (e.g., visa on arrival, multi-entry visa facilitation)
- Grey: Not covered

Click a colored country (blue/green/yellow) to smoothly center and open details in a left sidebar. Use the search box (top-left) for quick autocomplete.

## Tech

- Next.js App Router, React 18
- Tailwind CSS
- react-simple-maps + TopoJSON dataset (local)

## Data sources

JSON files in `src/data/`:

- `passport.json`: visa-free for ordinary passports (green)
- `diplomat.json`: visa-free for diplomatic/official passports (blue)
- `special.json`: special arrangements (yellow)
- `features.json`: world TopoJSON features

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Notes

- Countries that appear in multiple lists are colored by priority: Diplomat > Ordinary > Special.
- Only colored countries are clickable and searchable.
- Map pan/zoom transitions and sidebar open/close include smooth animations.
