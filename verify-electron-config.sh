#!/bin/bash

# Electron Configuration Verification Script
# This script checks if all required files and configurations are in place

echo "🔍 Verifying Electron Packaging Configuration..."
echo ""

ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        ((ERRORS++))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $1/ (missing)"
        ((WARNINGS++))
        return 1
    fi
}

# Function to check optional file
check_optional() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $1 (optional, not found)"
        ((WARNINGS++))
        return 1
    fi
}

echo "📋 Core Configuration Files:"
check_file "package.json"
check_file "electron-builder.json"
check_file "vite.config.ts"
check_file "tsconfig.json"
echo ""

echo "⚡ Electron Files:"
check_file "electron/main.ts"
check_file "electron/preload.ts"
check_file "electron/tsconfig.json"
check_dir "electron/ipc"
check_file "electron/ipc/file.ts"
echo ""

echo "🏗️ Build Resources:"
check_dir "build"
check_file "build/entitlements.mac.plist"
check_file "build/README.md"
echo ""

echo "🎨 Icons (Optional - User Provided):"
check_optional "build/icon.ico"
check_optional "build/icon.icns"
check_dir "build/icons"
if [ -d "build/icons" ]; then
    for size in 16 32 48 64 128 256 512; do
        check_optional "build/icons/${size}x${size}.png"
    done
fi
echo ""

echo "📚 Documentation:"
check_file "README.md"
check_file "BUILDING.md"
check_file "ELECTRON_SETUP.md"
check_file "LICENSE"
check_file ".gitignore"
echo ""

echo "📦 Dependencies Check:"
if [ -f "package.json" ]; then
    # Check for required dependencies
    if grep -q '"electron"' package.json; then
        echo -e "${GREEN}✓${NC} electron dependency found"
    else
        echo -e "${RED}✗${NC} electron dependency missing"
        ((ERRORS++))
    fi

    if grep -q '"electron-builder"' package.json; then
        echo -e "${GREEN}✓${NC} electron-builder dependency found"
    else
        echo -e "${RED}✗${NC} electron-builder dependency missing"
        ((ERRORS++))
    fi

    if grep -q '"cross-env"' package.json; then
        echo -e "${GREEN}✓${NC} cross-env dependency found"
    else
        echo -e "${YELLOW}⚠${NC} cross-env dependency missing (recommended)"
        ((WARNINGS++))
    fi
fi
echo ""

echo "🔧 Scripts Check:"
if [ -f "package.json" ]; then
    if grep -q '"electron:dev"' package.json; then
        echo -e "${GREEN}✓${NC} electron:dev script found"
    else
        echo -e "${RED}✗${NC} electron:dev script missing"
        ((ERRORS++))
    fi

    if grep -q '"electron:build"' package.json; then
        echo -e "${GREEN}✓${NC} electron:build script found"
    else
        echo -e "${RED}✗${NC} electron:build script missing"
        ((ERRORS++))
    fi

    if grep -q '"electron:dist"' package.json; then
        echo -e "${GREEN}✓${NC} electron:dist script found"
    else
        echo -e "${RED}✗${NC} electron:dist script missing"
        ((ERRORS++))
    fi
fi
echo ""

echo "🎯 Configuration Validation:"
if [ -f "electron-builder.json" ]; then
    if grep -q '"appId"' electron-builder.json; then
        echo -e "${GREEN}✓${NC} appId configured"
    else
        echo -e "${RED}✗${NC} appId not configured"
        ((ERRORS++))
    fi

    if grep -q '"win"' electron-builder.json; then
        echo -e "${GREEN}✓${NC} Windows build configuration found"
    else
        echo -e "${YELLOW}⚠${NC} Windows build configuration missing"
        ((WARNINGS++))
    fi

    if grep -q '"mac"' electron-builder.json; then
        echo -e "${GREEN}✓${NC} macOS build configuration found"
    else
        echo -e "${YELLOW}⚠${NC} macOS build configuration missing"
        ((WARNINGS++))
    fi

    if grep -q '"linux"' electron-builder.json; then
        echo -e "${GREEN}✓${NC} Linux build configuration found"
    else
        echo -e "${YELLOW}⚠${NC} Linux build configuration missing"
        ((WARNINGS++))
    fi
fi
echo ""

echo "📊 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "🎉 Your Electron packaging configuration is complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Add icons to build/ directory (see build/README.md)"
    echo "  2. Run: npm install"
    echo "  3. Test: npm run electron:dev"
    echo "  4. Build: npm run electron:build"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Configuration complete with $WARNINGS warning(s)${NC}"
    echo ""
    echo "Warnings are typically for optional files (like icons)."
    echo "You can proceed with development and add them later."
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors before proceeding."
    exit 1
fi
