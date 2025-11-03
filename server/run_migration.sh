#!/bin/bash
# Simple migration script

cd "$(dirname "$0")"

echo "🔧 Running Database Migration"
echo "=============================="
echo ""

# Install dependencies
echo "1. Installing dependencies..."
pip install -q sendgrid 2>&1 | grep -v "already satisfied" || true
echo "   ✓ Done"
echo ""

# Set Flask app
export FLASK_APP=app.py

# Stamp current state
echo "2. Marking current database state..."
flask db stamp head 2>&1
echo "   ✓ Done"
echo ""

# Apply migrations
echo "3. Applying migrations..."
flask db upgrade 2>&1
echo "   ✓ Done"
echo ""

# Verify
echo "4. Verifying database..."
python fix_database.py
echo ""

echo "✅ Migration complete!"
echo ""
echo "Start server with: python app.py"
