# 🗺️ LEO Workflow Kit Roadmap

> **Our vision for the future of AI-powered workflow automation**

## 🎯 Mission

To create the most intelligent, automated, and developer-friendly project management toolkit that eliminates manual overhead and lets developers focus on building great software.

---

## 📊 Release History

### ✅ v3.0.1 - Enhanced Workflow & Status Management (October 19, 2025)

**Status:** ✅ Released

**Improvements:**

- Enhanced automatic status update enforcement
- Critical requirement for immediate status updates when starting work
- Updated installation banner to highlight multi-AI support
- Comprehensive wiki documentation updates
- Better AI assistant guidance on project management

### ✅ v3.0.0 - Multi-AI Assistant Support (October 19, 2025)

**Status:** ✅ Released

**Major Features:**

- Support for 4 AI assistants (Copilot, Cursor, Cline, Codeium)
- New `leo ai` command (list, add, remove, sync)
- AI selection during initialization
- AI-specific optimized instructions (~40KB each)
- Backward compatible with v2.x Copilot setups
- Universal template system with adapter architecture

**Impact:**

- Support 80%+ of AI coding assistant users
- Enable enterprise adoption (AWS/Google users in roadmap)
- Broader market reach beyond Copilot-only
- Each AI gets tailored workflow guidance

### ✅ v2.4.0 - Intelligent Spec-First Decision Making (October 19, 2025)

**Status:** ✅ Released

**Major Features:**

- Intelligent work complexity analysis
- Automatic spec creation for complex features in `docs/specs/`
- User review workflow before implementation
- Smart breakdown of specs into multiple focused issues
- Decision tree logic (simple vs complex work)
- Enhanced workflow diagram with ANALYZE node
- Comprehensive examples (OAuth2 vs button fix)

**Impact:**

- Right process for right complexity
- No overhead for simple tasks
- Proper planning for complex features
- Better team collaboration through spec review
- Clearer scope and acceptance criteria

**Decision Logic:**

- **Complex** (architecture, multi-component, >1 week) → Spec first
- **Simple** (bugs, quick fixes, <1 day) → Direct issue

### ✅ v2.3.0 - GitHub Projects Integration (October 19, 2025)

**Status:** ✅ Released

**Major Features:**

- Automatic GitHub Projects integration
- Intelligent status management (Todo → In Progress → Done)
- GraphQL API integration for reliable updates
- Work detection via commits, branches, PRs
- Comprehensive documentation and guides

**Impact:**

- Zero manual project management
- Real-time project visibility
- Automatic status tracking
- Better team collaboration

### ✅ v2.2.0 - Automatic Issue Creation (October 19, 2025)

**Status:** ✅ Released

**Major Features:**

- AI-powered issue creation via Copilot
- Natural language work detection
- Smart priority and type inference
- GitHub authentication flow
- Documentation organization

**Impact:**

- No more manual issue forms
- Faster issue creation
- Consistent issue formatting

### ✅ v2.1.1 - Package Optimization (October 18, 2025)

**Status:** ✅ Released

**Major Features:**

- Package size optimization (94KB → 47KB)
- Improved npm distribution
- Better .npmignore configuration
- Installation fixes

### ✅ v2.0.0 - Initial Release

**Status:** ✅ Released

**Major Features:**

- Core CLI framework
- Issue templates (8 types)
- Label management (22+ labels)
- VS Code integration
- Copilot instructions

---

## 🚧 In Progress

### v3.0.2 - AI Instruction Merging (October 2025)

**Status:** 🟡 In Progress

**Goal:** Smart merge of existing AI instructions instead of skipping

**Features:**

- Detect existing AI instruction files
- Parse and preserve user's custom content
- Merge LEO standards with existing instructions
- Add clear section markers (LEO vs Project-specific)
- Create backup before merging
- Prompt for user confirmation

**Impact:**

- Better onboarding for projects with existing instructions
- Preserve project-specific conventions
- Enable LEO adoption in mature projects

See issue #15 for details

### v3.1.0 - Polish & Enhancements (November 2025)

**Status:** � Planned

**Goals:**

- Bug fixes from v3.0.x feedback
- Multi-AI workflow improvements
- Documentation enhancements
- Performance optimizations

**Planned Improvements:**

- [ ] AI instruction diff command
- [ ] Better AI detection and auto-selection
- [ ] More AI-specific optimization examples
- [ ] Video tutorials for multi-AI workflow

---

## 📅 Upcoming Releases

### v2.5.0 - Enhanced Automation (Q4 2025)

**Status:** 🔵 Planned

**Theme:** Making automation even smarter

**Planned Features:**

#### 1. Auto-Create Projects

- Automatically create GitHub Project during `leo init` if none exists
- Pre-configure with standard fields (Status, Priority, Assignees, Labels)
- Setup Board, Table, and Timeline views

#### 2. Multiple Project Support

- Add issues to multiple project boards
- Configure default project per repository
- Cross-project issue tracking

#### 3. Custom Status Fields

- Support for custom status field names (not just "Status")
- Configurable status transitions
- Custom workflow states (e.g., "In Review", "Testing", "Blocked")

#### 4. Milestone Integration

- Auto-assign issues to milestones
- Milestone progress tracking
- Burndown charts in terminal

#### 5. Sprint Planning

- Sprint creation and management
- Automated sprint boards
- Velocity tracking
- Sprint retrospective templates

**Estimated Effort:** 3-4 weeks
**Target Release:** January 2026

---

### v2.6.0 - Team Collaboration (Q1 2026)

**Status:** 🔵 Planned

**Theme:** Better team workflows

**Planned Features:**

#### 1. Assignee Intelligence

- Suggest assignees based on file history
- Auto-assign based on component ownership
- Team workload balancing

#### 2. PR Templates

- Smart PR template selection based on changes
- Auto-fill PR descriptions from commits
- Link PRs to related issues automatically

#### 3. Code Review Automation

- Auto-request reviewers based on CODEOWNERS
- Review checklist generation
- Review reminder notifications

#### 4. Team Dashboard

- Terminal-based team activity dashboard
- `leo team` command for team insights
- Real-time collaboration status

**Estimated Effort:** 4-5 weeks
**Target Release:** February 2026

---

### v3.0.0 - Advanced Features (Q2 2026)

**Status:** 🔮 Vision

**Theme:** Next-generation workflow automation

**Big Ideas:**

#### 1. Web Dashboard

- Visual project dashboard
- Real-time analytics
- Customizable widgets
- Export reports (PDF, CSV)

#### 2. Advanced Analytics

- Velocity trends over time
- Cycle time analysis
- Bottleneck detection
- Predictive insights

#### 3. Plugin System

- Extensible architecture
- Community plugins
- Plugin marketplace
- Custom commands and workflows

#### 4. Integration Ecosystem

- Jira integration
- Linear integration
- Asana integration
- Slack notifications
- Discord webhooks

#### 5. AI Enhancements

- More intelligent work detection
- Automated code review suggestions
- Smart test generation
- Documentation auto-generation

**Estimated Effort:** 8-10 weeks
**Target Release:** Q2 2026

---

## 🎨 Feature Requests

### Community Requested Features

#### High Priority

- [ ] Support for GitHub Enterprise
- [ ] Private repository support
- [ ] Custom issue templates per project
- [ ] Bulk operations (close multiple issues, etc.)
- [ ] Export/import configuration

#### Medium Priority

- [ ] Integration with CI/CD platforms (Jenkins, CircleCI)
- [ ] Automated dependency updates
- [ ] Security vulnerability tracking
- [ ] Performance monitoring integration
- [ ] Custom labels per project

#### Low Priority

- [ ] Dark mode for CLI output
- [ ] Emoji in terminal output
- [ ] Audio notifications
- [ ] Desktop notifications
- [ ] Mobile companion app

**Want to vote or suggest features?** [Open an issue!](https://github.com/leonpagotto/leo-kit/issues/new?template=feature-request.md)

---

## 🔬 Research & Exploration

### Areas of Investigation

#### AI/ML Enhancements

- GPT-4 integration for better work detection
- Predictive issue estimation
- Automated test case generation
- Code smell detection

#### Performance

- Faster CLI startup time
- Caching strategies
- Parallel operations
- Background sync

#### Developer Experience

- Interactive tutorials
- Better error recovery
- Guided setup wizard
- In-app documentation

---

## 📈 Success Metrics

### How We Measure Success

**Adoption:**

- npm downloads per month
- GitHub stars
- Active users
- Community engagement

**Quality:**

- Issue resolution time
- Bug rate per release
- User satisfaction (surveys)
- Documentation completeness

**Performance:**

- CLI startup time < 500ms
- Command execution time < 2s
- Package size < 50KB
- Zero critical security issues

---

## 🤝 How to Contribute

### Help Shape the Roadmap!

**1. Vote on Features**

- 👍 React to issues with 👍 for features you want
- 💬 Comment with your use cases
- 📊 Participate in feature polls

**2. Propose New Features**

- Open a [feature request](https://github.com/leonpagotto/leo-kit/issues/new?template=feature-request.md)
- Discuss in GitHub Discussions
- Share your workflow challenges

**3. Contribute Code**

- Pick an issue labeled `good first issue`
- Submit PRs for planned features
- Help with documentation

**4. Share Feedback**

- Report bugs and issues
- Suggest improvements
- Share your success stories

---

## 🎯 Principles

### Guiding Principles for Future Development

1. **Zero Configuration**: Work out-of-the-box with sensible defaults
2. **AI-First**: Leverage AI to reduce manual work
3. **Developer Experience**: Prioritize speed and ease of use
4. **Open Source**: Transparent development, MIT license
5. **Community Driven**: Listen to users, iterate quickly
6. **Backward Compatible**: Don't break existing workflows
7. **Performance**: Fast CLI, small package size
8. **Documentation**: Comprehensive guides and examples

---

## 📞 Stay Updated

- **GitHub:** Watch the repository for releases
- **Issues:** Follow roadmap-related issues
- **Changelog:** Review `CHANGELOG.md` for updates
- **Wiki:** Check this page for roadmap changes

---

**Roadmap Last Updated:** October 19, 2025
**Next Review:** November 15, 2025
**Maintainer:** [@leonpagotto](https://github.com/leonpagotto)

---

<div align="center">

**Have questions about the roadmap?** [Ask in Discussions](https://github.com/leonpagotto/leo-kit/discussions)

**Want to contribute?** [See Development Guide](./Development-Guide)

</div>
