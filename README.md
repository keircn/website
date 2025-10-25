# website

my personal website

<!-- ![screenshot of keircn.com](https://r2.e-z.host/ca19848c-de8c-4cae-9a10-858d6fd864b7/k75pfeqy.png) -->

## Prerequisites

- Bun (recommended) or Node.js + npm/yarn

## Quick start

```bash
# install dependencies
bun i

# copy example environment file and edit as needed
cp .env.example .env

# start development server
bun run dev
```

If you're a cuck:

```bash
npm install
npm run dev
```

## Environment variables

```
# for lastfm viewer
LASTFM_USERNAME=
LASTFM_API_KEY=

# for currently reading section
NEXT_PUBLIC_ANILIST_READING_ID=
```

## Build & Production

Build the optimized production bundle:

```bash
bun run build
bun run start
```

## Contributing

Contributions welcome. Please:

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description

Make sure you lint and format before merging into main

## License

This project is subject to the terms of the [MIT License](./LICENSE)
