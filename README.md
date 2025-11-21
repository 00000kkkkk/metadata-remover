# Metadata Remover

Strip EXIF metadata from images directly in your browser. No uploads, no tracking, just privacy.

## Features

- **Client-Side Processing** - Everything happens in your browser
- **Zero Data Collection** - Photos never leave your device
- **Batch Support** - Process multiple images simultaneously
- **Drag & Drop** - Quick and simple interface
- **Monochrome Dark Theme** - Minimal, distraction-free design
- **File Size Comparison** - See original vs cleaned file sizes

## Why?

Photos contain hidden metadata (EXIF) that can expose:
- GPS location
- Camera details
- Timestamps
- Software info

This tool removes it all before you share images online.

## Tech

- Next.js 16
- React 19
- TypeScript
- Tailwind v4

## Usage

```bash
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
pnpm build
pnpm start
```

## How It Works

Images load into Canvas API and export as fresh files. Canvas naturally strips metadata while keeping 100% quality.

---

**Enjoying this? Drop a ⭐ on GitHub**

Built by [00000kkkkk](https://github.com/00000kkkkk)
