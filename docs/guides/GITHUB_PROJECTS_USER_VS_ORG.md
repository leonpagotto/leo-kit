# GitHub Projects: User vs Organization Projects

## Overview

GitHub Projects v2 can be **user-scoped** or **organization-scoped**, and this affects how auto-assignment works in LEO Workflow Kit.

## The Difference

### Organization Projects ✅
- **Scope:** Organization-wide
- **URL Format:** `https://github.com/orgs/YOUR_ORG/projects/NUMBER`
- **Token:** Built-in `GITHUB_TOKEN` works automatically
- **Setup:** Run `leo project setup` → Works immediately

### User Projects ⚠️
- **Scope:** Personal user account
- **URL Format:** `https://github.com/users/YOUR_USERNAME/projects/NUMBER`
- **Token:** Requires **Personal Access Token (PAT)** with `project` scope
- **Setup:** Run `leo project setup` → Follow PAT creation steps

## Why Does This Matter?

GitHub's built-in `GITHUB_TOKEN` (available in GitHub Actions) has permissions to:
- ✅ Read/write issues and pull requests
- ✅ Access organization projects
- ❌ **Cannot** access user-scoped projects

This is a security limitation - the automatic token doesn't have permission to modify your personal projects.

## Solution for User Projects

### Automated Setup (Recommended)

Run the project setup command:

```bash
leo project setup
```

The command will:
1. Detect that you're using a user project
2. Prompt you to create a Personal Access Token
3. Open GitHub's token creation page automatically
4. Guide you through the token setup
5. Configure the `GH_PROJECT_TOKEN` secret

### Manual Setup

If you prefer to set it up manually:

#### Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. Token name: `LEO Kit - Project Access`
3. Expiration: 90 days (recommended) or custom
4. Select scopes:
   - ☑ **project** (read & write)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)

#### Step 2: Add Token to Repository

```bash
# Set the GH_PROJECT_TOKEN secret in your repository
gh secret set GH_PROJECT_TOKEN --body "YOUR_TOKEN_HERE"
```

#### Step 3: Verify Setup

```bash
# Test the integration
leo project test

# Or check secrets directly
gh secret list
```

You should see both:
- `PROJECT_URL` ✓
- `GH_PROJECT_TOKEN` ✓

## Workflow Configuration

The `auto-add-to-project.yml` workflow automatically uses the correct token based on project type:

**For Organization Projects:**
```yaml
github-token: ${{ github.token }}  # Built-in token
```

**For User Projects:**
```yaml
github-token: ${{ secrets.GH_PROJECT_TOKEN }}  # Your PAT
```

The `leo project setup` command detects your project type and configures this automatically.

## Security Considerations

### Token Permissions

The PAT only needs the **project** scope:
- ✅ Minimal permissions (principle of least privilege)
- ✅ Can only modify projects, not code or settings
- ✅ Expires automatically (if you set expiration)

### Token Rotation

For security best practices:
1. Set token expiration (90 days recommended)
2. When it expires, create a new token
3. Update the secret: `gh secret set GH_PROJECT_TOKEN --body "NEW_TOKEN"`

### Revoking Access

If the token is compromised:
1. Go to: https://github.com/settings/tokens
2. Find "LEO Kit - Project Access"
3. Click **Revoke**
4. Create a new token and update the secret

## Troubleshooting

### "Could not resolve to a ProjectV2"

**Cause:** Using `GITHUB_TOKEN` for a user project

**Solution:** 
```bash
leo project setup  # Follow PAT setup steps
```

### "Input required and not supplied: github-token"

**Cause:** `GH_PROJECT_TOKEN` secret not set

**Solution:**
```bash
gh secret set GH_PROJECT_TOKEN --body "YOUR_TOKEN_HERE"
```

### Workflow Still Failing

1. Verify secrets are set:
   ```bash
   gh secret list
   ```

2. Check workflow file uses correct token:
   ```bash
   cat .github/workflows/auto-add-to-project.yml | grep github-token
   ```

3. Verify token has `project` scope:
   - Go to: https://github.com/settings/tokens
   - Check "LEO Kit - Project Access" has ☑ project

4. Re-run setup to reconfigure:
   ```bash
   leo project setup
   ```

## Quick Reference

| Project Type | Token Needed | Setup Command | Works Immediately? |
|--------------|--------------|---------------|-------------------|
| Organization | `GITHUB_TOKEN` (built-in) | `leo project setup` | ✅ Yes |
| User | `GH_PROJECT_TOKEN` (PAT) | `leo project setup` + PAT creation | ⚠️ After PAT setup |

## Related Documentation

- [GitHub Projects Setup Guide](./GITHUB_PROJECTS_SETUP.md)
- [Personal Access Tokens Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## Support

If you continue to experience issues:
1. Check [Issue #39](https://github.com/leonpagotto/leo-kit/issues/39) for updates
2. Run `leo project test` for diagnostic information
3. Review GitHub Actions logs: `gh run list --workflow="Auto Assign to Project"`
