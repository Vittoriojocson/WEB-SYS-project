#!/bin/bash

# ============================================================================
# QUICK DEPLOYMENT SCRIPT
# ============================================================================
# This script helps you quickly deploy your website
# Run this from your project root directory

echo "🚀 JiggerOnTheMix Deployment Helper"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "❌ .gitignore not found! Please create it first."
    exit 1
fi

echo ""
echo "📝 Before proceeding, make sure you have:"
echo "   1. Created a GitHub repository"
echo "   2. Created a Render account (render.com)"
echo "   3. Updated config.js with your backend URL"
echo "   4. Updated backend/.env with your settings"
echo ""
read -p "Have you completed the above steps? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete the setup steps first!"
    echo "   See DEPLOYMENT.md for detailed instructions."
    exit 1
fi

echo ""
echo "📋 Please provide the following information:"
echo ""
read -p "Your GitHub username: " github_username
read -p "Your GitHub repository name: " repo_name

echo ""
echo "🔄 Staging all files..."
git add .

echo ""
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Prepare for deployment"
fi

echo "💾 Committing changes..."
git commit -m "$commit_msg"

echo ""
echo "🔗 Setting up remote repository..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$github_username/$repo_name.git"

echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Code pushed to GitHub"
    echo ""
    echo "📍 Next Steps:"
    echo ""
    echo "1. Deploy Backend (Render):"
    echo "   → Go to: https://dashboard.render.com/create?type=web"
    echo "   → Select your GitHub repository"
    echo "   → Configure as described in DEPLOYMENT.md"
    echo "   → Get your backend URL (e.g., https://your-app.onrender.com)"
    echo ""
    echo "2. Update config.js:"
    echo "   → Open config.js"
    echo "   → Set PRODUCTION_API_URL to your Render URL"
    echo "   → Commit and push: git add config.js && git commit -m 'Update API URL' && git push"
    echo ""
    echo "3. Enable GitHub Pages:"
    echo "   → Go to: https://github.com/$github_username/$repo_name/settings/pages"
    echo "   → Source: Branch 'main', folder '/ (root)'"
    echo "   → Your site will be at: https://$github_username.github.io/$repo_name/"
    echo ""
    echo "4. Update CORS in Render:"
    echo "   → Add your GitHub Pages URL to CORS_ORIGINS"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
    echo ""
else
    echo ""
    echo "❌ ERROR: Failed to push to GitHub"
    echo "   Please check your GitHub credentials and repository access"
    echo "   You may need to authenticate with GitHub CLI or set up SSH keys"
fi
