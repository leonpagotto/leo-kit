# LionPack CLI Usage Guide

## Quick Start

### Initialize a Project

```bash
leo team init
```

**Interactive prompts:**

```
🦁 Initializing LionPack Team Setup

? Project name: My Awesome Project
? GitHub organization: my-org
? GitHub repository: my-repo
? Team size:
  👤 Solo (1 person)
  👥 Duo (2 people)
  👥 Trio (3 people)
  🦁 Pack (4 people)

Selected: Duo (2 people)

? Member 1 username: alice
? Role: requirements
? Member 2 username: bob
? Role: implementation

✅ Project initialized!
✅ Configuration saved to .lionpack.json
✅ GitHub board files created
  - board.json
  - setup-board.sh
  - LIONPACK_BOARD.md
```

### Add Team Member

```bash
leo team add
```

**Interactive prompts:**

```
? Team member username: carol
? Team member role:
  🔍 requirements
  📋 spec
  🎯 implementation
  ✅ testing

Selected: testing

✅ Member added!
? Update workflow? (Y/n) y
✅ Workflow updated to accommodate 3 members
```

### List Team

```bash
leo team list
```

**Output:**

```
🦁 Project: My Awesome Project
   Organization: my-org / Repository: my-repo

👥 Team Composition:
   1. alice (🔍 Requirements Hunter)
   2. bob (🎯 Implementation Hunter)
   3. carol (✅ QA & Testing Specialist)

📊 Workflow: Trio Mode (3 people)
   Columns: 🔍 Requirements → 📋 Spec → 🎯 Implementation → ✅ Testing

💾 Configuration: .lionpack.json
```

### Setup GitHub Board

```bash
leo team setupBoard
```

**Output:**

```
📊 GitHub Board Configuration

Generated files:
  ✅ board.json - GitHub board configuration
  ✅ setup-board.sh - Automated setup script
  ✅ LIONPACK_BOARD.md - Setup instructions

To setup your GitHub board, run:
  chmod +x setup-board.sh
  ./setup-board.sh
```

---

## Hunt Management

### Start a Hunt (New Feature)

```bash
leo hunt start
```

**Interactive prompts:**

```
🦁 Starting New Hunt

? Feature name: Add OAuth2 Authentication
? Feature description: Implement Google and GitHub OAuth2 login
? Create GitHub issues? (Y/n) y

✅ Hunt started successfully!

📊 Hunt Details:
   ID: hunt-ccf82a1b
   Feature: Add OAuth2 Authentication
   Status: active
   Phase: 🔍 Requirements

📋 Next Steps:
   1. Assign to: @alice
   2. Add to column: Requirements
   3. Track progress with: leo hunt status hunt-ccf82a1b
```

### Check Hunt Status

```bash
leo hunt status hunt-ccf82a1b
```

**Output:**

```
═══════════════════════════════════════════════════════════
  🦁 Add OAuth2 Authentication
═══════════════════════════════════════════════════════════

Hunt Details:
   ID: hunt-ccf82a1b
   Status: active
   Current Phase: spec
   Progress: 50% (2/4 phases)
   Duration: 2 hours 15 minutes

Phase Timeline:
   ✓ 🔍 Requirements (Completed by @alice)
   ▶ 📋 Specification (In Progress by @bob)
   ○ 🎯 Implementation
   ○ ✅ Testing

═══════════════════════════════════════════════════════════
```

### List All Hunts

```bash
leo hunt list
```

**Output:**

```
📊 All Hunts

🔄 Active:
   Add OAuth2 Authentication (hunt-ccf82a1b) - Phase: spec
   Fix Login Page Layout (hunt-a3f291c) - Phase: requirements
   Improve Performance (hunt-f8e2d4b) - Phase: implementation

✅ Completed:
   Add Dark Mode (hunt-x2k9e1a)
   Update Dependencies (hunt-m3n5p8q)
```

### Transition Hunt to Next Phase

```bash
leo hunt nextPhase hunt-ccf82a1b
```

**Output:**

```
✅ Hunt transitioned!

   Moving to: 🎯 Implementation
   Assigned to: @carol

Updated status:
   Phase: 🎯 Implementation (3/4)
   Progress: 75%
   Duration: 3 hours 42 minutes
```

### Complete Hunt

```bash
leo hunt complete hunt-ccf82a1b
```

**Output:**

```
✅ Hunt completed!

   Add OAuth2 Authentication finished
   Total duration: 5 hours 30 minutes
   Quality score: 0.95 ⭐

Metrics recorded for team analytics.
```

### View Team Analytics

```bash
leo hunt analytics
```

**Output:**

```
📊 Team Analytics

═══════════════════════════════════════════════════════════
Team Performance Report
═══════════════════════════════════════════════════════════

📈 Overview:
   Total Hunts: 5
   Completed: 5 (100%)
   Average Quality: 0.93 ⭐⭐⭐⭐⭐

⚡ Velocity:
   Average Hunt Duration: 4h 15m
   Hunts per Week: 3.2
   Code Quality Trend: ↑ Improving

👥 Team Utilization:
   alice (Requirements): 6h - Highly utilized
   bob (Implementation): 18h - Core contributor
   carol (Testing): 8h - On track

🔍 Bottleneck Analysis:
   Longest Phase: Implementation (avg 4h 20m)
   Recommendation: Consider adding 2nd implementation member

📅 Phase Breakdown:
   Requirements: avg 50 min
   Specification: avg 1h 15m
   Implementation: avg 4h 20m
   Testing: avg 1h 30m

═══════════════════════════════════════════════════════════
```

---

## Workflow Examples

### Solo Developer (1 Person)

```bash
# Initialize solo project
leo team init
# Select: Solo (1 person)
# Member: you (with role: requirements)

# Start hunt
leo hunt start
# Feature: "Build User Dashboard"

# Auto-merged design & implementation phase
# Fast cycle: Design → Code → Test & Merge

# Complete hunt
leo hunt complete hunt-xyz
```

**Timeline:** Design (1h) → Implementation (4h) → Test (1h) = ~6 hours

---

### Duo Team (2 People)

```bash
# Initialize duo project
leo team init
# Select: Duo (2 people)
# alice: requirements, bob: implementation

# Start hunt
leo hunt start
# Feature: "Add Payment Processing"

# Parallel workflow
leo hunt status hunt-xyz
# alice works on requirements while bob starts design

leo hunt nextPhase hunt-xyz  # Move to implementation
# bob starts coding while alice reviews requirements

leo hunt nextPhase hunt-xyz  # Move to testing
# alice tests while bob fixes issues
```

**Timeline:** Requirements (1h) || Design+Implement (6h) || Test+Merge (1.5h) = ~7.5 hours

---

### Trio Team (3 People)

```bash
# Initialize trio project
leo team init
# Select: Trio (3 people)
# alice: requirements, bob: implementation, carol: testing

# Start hunt
leo hunt start
# Feature: "Implement Two-Factor Authentication"

# Full workflow with specialization
leo hunt status hunt-xyz
# alice on requirements → bob on design → carol on testing
# Each phase has dedicated owner

# Clear handoffs
leo hunt nextPhase hunt-xyz  # alice → bob
leo hunt nextPhase hunt-xyz  # bob → carol
leo hunt nextPhase hunt-xyz  # carol complete
```

**Timeline:** Requirements (1h) → Design (1.5h) → Implementation (5h) → Testing (1.5h) = ~9 hours

---

### Pack Team (4 People)

```bash
# Initialize full pack
leo team init
# Select: Pack (4 people)
# alice: requirements, bob: spec, carol: implementation, dave: testing

# Enterprise workflow
leo hunt start
# Feature: "Enterprise SSO Integration"

# Deployment phase included
leo hunt status hunt-xyz
# Shows 5 phases including deploy

# Full specialization
leo hunt nextPhase hunt-xyz  # alice → bob (spec)
leo hunt nextPhase hunt-xyz  # bob → carol (implementation)
leo hunt nextPhase hunt-xyz  # carol → dave (testing)
leo hunt nextPhase hunt-xyz  # dave → deploy (automated or manual)

leo hunt complete hunt-xyz
# Hunt metrics recorded with 4-person team data
```

**Timeline:** Requirements (1h) → Spec (1.5h) → Implementation (6h) → Testing (1.5h) → Deploy (30min) = ~10.5 hours

---

## Advanced Usage

### Manual Hunt Tracking

```bash
# If you prefer GitHub issues, create them manually
# LionPack will still track the hunt lifecycle

leo hunt start
# Feature: "Manual GitHub Issue #123"

# Update phase as work progresses
leo hunt nextPhase hunt-xyz
leo hunt nextPhase hunt-xyz
leo hunt nextPhase hunt-xyz

leo hunt complete hunt-xyz
# Metrics collected and added to team analytics
```

### Bulk Operations (Future)

```bash
# Coming in Phase 3
leo hunt bulk-import issues-2024-q4.csv
leo team metrics export october-report.pdf
leo board sync  # Sync hunt status to GitHub board
```

### Configuration Management

```bash
# View current configuration
cat .lionpack.json

# Backup configuration
cp .lionpack.json .lionpack.backup.json

# Export team data
leo team export team-setup.json

# Create team from template
leo team init --template startup
```

---

## File Structure After Setup

```
project-root/
├── .lionpack.json              # Team configuration
├── .lionpack/
│   ├── hunts.json             # Hunt history
│   └── analytics.json         # Team metrics
├── board.json                 # GitHub board config
├── setup-board.sh             # Board setup script
└── LIONPACK_BOARD.md          # Setup instructions
```

---

## Tips & Tricks

### Track Multiple Projects

```bash
# Create separate directories
mkdir project-a project-b

cd project-a
leo team init  # Separate .lionpack.json

cd ../project-b
leo team init  # Independent setup
```

### Team Handoff Notifications

```bash
# For Slack (future integration):
# Automatically notify @bob when alice completes requirements

leo hunt nextPhase hunt-xyz
# 🔔 Slack: @bob your spec review is ready!
```

### Performance Analysis

```bash
# Export metrics for analysis
leo hunt analytics > team-report.md

# View bottleneck analysis
leo hunt analytics
# Shows slowest phases and recommendations
```

### Backup & Restore

```bash
# Backup all hunts
cp -r .lionpack .lionpack.backup

# Export for archive
leo hunt export archive-q4-2025.json

# Import previous hunts
leo hunt import archive-q4-2025.json
```

---

## Keyboard Shortcuts (Interactive Mode)

- `↑/↓` - Navigate options
- `Enter` - Select option
- `Esc` - Cancel operation
- `Ctrl+C` - Exit command
- `Tab` - Auto-complete member names

---

## Common Issues & Solutions

### "Configuration not found"

```bash
cd project-root
leo team init  # Create initial configuration
```

### "Hunt not found"

```bash
leo hunt list  # See all hunt IDs
leo hunt status hunt-correct-id
```

### "Role not available"

```bash
leo team add  # Add member with that role
leo team list  # Verify team setup
```

### "Workflow mismatch"

```bash
leo team list  # Check current workflow
# Workflow auto-adapts when members added/removed
```

---

## Next Steps

1. **Start your first hunt**

   ```bash
   leo hunt start
   ```

2. **Setup GitHub board** (Phase 3)

   ```bash
   ./setup-board.sh
   ```

3. **Track team velocity** (Phase 3)

   ```bash
   leo hunt analytics
   ```

4. **Enable Slack notifications** (Phase 3)
   ```bash
   leo config slack-webhook YOUR_WEBHOOK_URL
   ```

---

**Version**: LionPack v5.0.0
**Last Updated**: October 24, 2025
**Status**: Production Ready ✅
