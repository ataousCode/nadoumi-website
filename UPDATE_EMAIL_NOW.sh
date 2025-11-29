#!/bin/bash

echo "════════════════════════════════════════════════════════════════════"
echo "📧 UPDATING FIREBASE FUNCTIONS EMAIL TO: peugonbaarmand@gmail.com"
echo "════════════════════════════════════════════════════════════════════"
echo ""

echo "Step 1: Removing old email configuration..."
firebase functions:config:unset email

echo ""
echo "Step 2: Setting new email configuration..."
firebase functions:config:set \
  email.user="peugonbaarmand@gmail.com" \
  email.password="gqke fftv bnmg typm" \
  email.admin_emails="peugonbaarmand@gmail.com"

echo ""
echo "Step 3: Verifying new configuration..."
firebase functions:config:get

echo ""
echo "Step 4: Installing dependencies..."
cd functions
npm install
cd ..

echo ""
echo "Step 5: Deploying updated functions..."
firebase deploy --only functions

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "✅ DONE! Email notifications will now go to:"
echo "   📧 peugonbaarmand@gmail.com"
echo "════════════════════════════════════════════════════════════════════"
