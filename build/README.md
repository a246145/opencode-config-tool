# Build Resources

This directory contains resources needed for building the application.

## Required Icons

You need to provide the following icon files:

### Windows
- `icon.ico` - Windows icon file (256x256 recommended)

### macOS
- `icon.icns` - macOS icon file (512x512 recommended)

### Linux
- `icons/` directory with PNG files in various sizes:
  - `16x16.png`
  - `32x32.png`
  - `48x48.png`
  - `64x64.png`
  - `128x128.png`
  - `256x256.png`
  - `512x512.png`

## Generating Icons

You can generate all required icon formats from a single 1024x1024 PNG file using:

### Using electron-icon-builder

```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./icon-source.png --output=./build
```

### Using electron-icon-maker

```bash
npm install -g electron-icon-maker
electron-icon-maker --input=./icon-source.png --output=./build
```

### Manual Creation

For best results, create icons manually:

1. **Windows (.ico)**: Use tools like GIMP, Photoshop, or online converters
2. **macOS (.icns)**: Use `iconutil` on macOS or online converters
3. **Linux (.png)**: Export PNG files at required sizes

## Other Resources

- `entitlements.mac.plist` - macOS entitlements for code signing (already included)

## Notes

- Icons should have transparent backgrounds
- Use high-quality source images (1024x1024 or larger)
- Test icons on each platform to ensure they look good
