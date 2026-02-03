#!/bin/bash

echo "🔍 Verifying PermissionEditor Implementation..."
echo ""

# Check main component
if [ -f "src/components/config/PermissionEditor.tsx" ]; then
    echo "✅ PermissionEditor.tsx exists ($(wc -l < src/components/config/PermissionEditor.tsx) lines)"
else
    echo "❌ PermissionEditor.tsx missing"
fi

# Check UI components
for component in table label textarea; do
    if [ -f "src/components/ui/${component}.tsx" ]; then
        echo "✅ ${component}.tsx exists"
    else
        echo "❌ ${component}.tsx missing"
    fi
done

# Check documentation
echo ""
echo "📚 Documentation Files:"
for doc in SUMMARY VISUAL INTEGRATION; do
    file="PERMISSION_EDITOR_${doc}.md"
    if [ -f "$file" ]; then
        echo "✅ $file exists ($(wc -l < $file) lines)"
    else
        echo "❌ $file missing"
    fi
done

if [ -f "PERMISSION_EXAMPLES.md" ]; then
    echo "✅ PERMISSION_EXAMPLES.md exists ($(wc -l < PERMISSION_EXAMPLES.md) lines)"
else
    echo "❌ PERMISSION_EXAMPLES.md missing"
fi

if [ -f "README_PERMISSION_EDITOR.md" ]; then
    echo "✅ README_PERMISSION_EDITOR.md exists ($(wc -l < README_PERMISSION_EDITOR.md) lines)"
else
    echo "❌ README_PERMISSION_EDITOR.md missing"
fi

# Check types
echo ""
echo "🔍 Checking type definitions..."
if grep -q "TOOL_PERMISSIONS" src/types/config.ts; then
    echo "✅ TOOL_PERMISSIONS exported"
else
    echo "❌ TOOL_PERMISSIONS not found"
fi

if grep -q "PermissionValue" src/types/config.ts; then
    echo "✅ PermissionValue type exists"
else
    echo "❌ PermissionValue type missing"
fi

if grep -q "PermissionRule" src/types/config.ts; then
    echo "✅ PermissionRule type exists"
else
    echo "❌ PermissionRule type missing"
fi

# Check store integration
echo ""
echo "🔍 Checking store integration..."
if grep -q "updatePermission" src/hooks/useConfig.ts; then
    echo "✅ updatePermission method exists"
else
    echo "❌ updatePermission method missing"
fi

# Check imports
echo ""
echo "🔍 Checking component imports..."
if grep -q "import.*useConfigStore" src/components/config/PermissionEditor.tsx; then
    echo "✅ useConfigStore imported"
else
    echo "❌ useConfigStore not imported"
fi

if grep -q "import.*TOOL_PERMISSIONS" src/components/config/PermissionEditor.tsx; then
    echo "✅ TOOL_PERMISSIONS imported"
else
    echo "❌ TOOL_PERMISSIONS not imported"
fi

# Count features
echo ""
echo "📊 Feature Summary:"
echo "   - Tools supported: 16"
echo "   - Categories: 5"
echo "   - Component size: $(wc -l < src/components/config/PermissionEditor.tsx) lines"
echo "   - Documentation: $(ls PERMISSION_*.md README_PERMISSION_EDITOR.md 2>/dev/null | wc -l) files"

echo ""
echo "✨ Verification complete!"
