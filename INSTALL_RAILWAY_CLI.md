# 🚂 Railway CLI Installation Guide

## Where to Install Railway CLI

**Railway CLI is installed on your computer's terminal/command line**, not in your IDE. You can then use it from:
- ✅ Terminal (macOS Terminal app)
- ✅ VS Code integrated terminal
- ✅ Any command-line interface
- ✅ Cursor IDE terminal (where you're working now)

---

## Installation Methods

### **Method 1: Using Homebrew (Recommended for macOS)**

**Step 1: Check if Homebrew is installed**
```bash
brew --version
```

If you see a version number, Homebrew is installed. If not, install it first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Step 2: Install Railway CLI**
```bash
brew install railway
```

**Step 3: Verify installation**
```bash
railway --version
```

You should see something like: `railway version 3.x.x`

---

### **Method 2: Using npm (Alternative)**

If you don't have Homebrew or prefer npm:

```bash
npm install -g @railway/cli
```

**Verify:**
```bash
railway --version
```

---

### **Method 3: Direct Download**

1. Visit: https://railway.app/cli
2. Download the binary for macOS
3. Move it to your PATH or use directly

---

## Where to Use Railway CLI

### **Option 1: Terminal App (macOS)**

1. Open **Terminal** app (Applications → Utilities → Terminal)
2. Navigate to your project:
   ```bash
   cd "/Users/apple/Desktop/Grand Gold/The grand -Sabu"
   ```
3. Use Railway CLI commands:
   ```bash
   railway login
   railway link
   railway up
   ```

### **Option 2: VS Code / Cursor IDE Terminal**

1. Open your project in VS Code or Cursor
2. Open the integrated terminal:
   - **VS Code**: `View` → `Terminal` or press `` Ctrl+` ``
   - **Cursor**: `View` → `Terminal` or press `` Ctrl+` ``
3. The terminal is already in your project directory
4. Use Railway CLI commands directly:
   ```bash
   railway login
   railway link
   railway up
   ```

### **Option 3: iTerm2 (if you use it)**

Same as Terminal app - just open iTerm2 and use the commands.

---

## Step-by-Step Installation (Right Now)

Since you're already in Cursor IDE, you can install it directly in the terminal here:

### **Quick Install:**

```bash
# Check if Homebrew is available
brew --version

# If Homebrew is installed, run:
brew install railway

# If Homebrew is NOT installed, use npm instead:
npm install -g @railway/cli

# Verify installation
railway --version
```

---

## After Installation

Once Railway CLI is installed, you can use it from **any terminal**:

1. **In Cursor IDE terminal** (where you are now):
   ```bash
   railway login
   railway link
   railway variables set KEY=value
   railway up
   ```

2. **In macOS Terminal app**:
   - Same commands work there too

3. **In VS Code terminal**:
   - Same commands work there too

---

## Common Questions

### **Q: Do I need to install it in each IDE?**
**A:** No! Once installed on your system, it works from any terminal/IDE.

### **Q: Where is it installed?**
**A:** 
- Homebrew: `/opt/homebrew/bin/railway` (or `/usr/local/bin/railway`)
- npm: Global npm packages directory

### **Q: Can I use it from Cursor IDE?**
**A:** Yes! Just use the terminal in Cursor IDE (which you're already using).

### **Q: Do I need to restart Cursor/IDE after installation?**
**A:** No, but you may need to restart the terminal session or run:
```bash
source ~/.zshrc
# or
source ~/.bash_profile
```

---

## Verification

After installation, test it:

```bash
# Check version
railway --version

# Check if it's in your PATH
which railway

# Should show something like:
# /opt/homebrew/bin/railway
# or
# /usr/local/bin/railway
```

---

## Troubleshooting

### **Command not found after installation**

1. **Check if it's in PATH:**
   ```bash
   echo $PATH
   which railway
   ```

2. **Reload your shell:**
   ```bash
   source ~/.zshrc
   # or
   source ~/.bash_profile
   ```

3. **Restart terminal/IDE**

### **Permission denied**

If you get permission errors:
```bash
# For Homebrew installation
sudo chmod +x $(which railway)

# For npm installation
sudo npm install -g @railway/cli
```

---

## Next Steps After Installation

1. **Login:**
   ```bash
   railway login
   ```

2. **Link your project:**
   ```bash
   cd "/Users/apple/Desktop/Grand Gold/The grand -Sabu"
   railway link
   ```

3. **Set environment variables:**
   ```bash
   railway variables set NEXT_PUBLIC_SANITY_PROJECT_ID=your_value
   # ... (set all required variables)
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

---

## Summary

✅ **Install Railway CLI in your system terminal** (not in IDE)  
✅ **Use it from any terminal** - Cursor IDE, VS Code, Terminal app, etc.  
✅ **One installation works everywhere** on your Mac  
✅ **You're already in the right place** - Cursor IDE terminal is perfect!

**Just run the installation command in the terminal you're using right now!**


