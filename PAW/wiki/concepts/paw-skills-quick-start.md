---
title: PAW Skills Quick Start Guide
type: concept
created: 2026-04-14
updated: 2026-04-14
tags: [tools, quickstart, workflow]
---

# PAW Skills Quick Start Guide

Quick reference for using PAW-optimized skills in Claude Code. For detailed documentation, see [[PAW Skills & Tools Reference]].

---

## Accessing Skills

All skills are invoked with the `/` prefix in Claude Code:

```
/skill-name [optional input]
```

Example:
```
/planning Add a favorites feature for users
```

---

## Skill Quick Reference

| Skill | Command | When to Use | Time |
|-------|---------|------------|------|
| **good-practice** | `/gp` | After writing code, before commit | 2-3 min |
| **enhancer** | `/enhance` | Improve UI/CSS appearance | 1-2 min |
| **planning** | `/plan` | Starting a new feature | 5-10 min |
| **implementation** | `/impl` | Execute an approved plan | 10-20 min |
| **testing** | `/test` | Generate tests for a class | 3-5 min |
| **refactor** | `/refactor` | Improve code quality | 5-10 min |
| **debug** | `/debug` | Fix a bug (provide error/description) | 5-10 min |
| **schema-migrate** | `/migrate` | Change database schema | 5-10 min |
| **performance** | `/perf` | Optimize slow code | 10-15 min |

---

## Common Workflows

### Feature Development (Fast Path)

```
1. /plan Add weekly rental pricing
   → Review generated plan
   
2. /impl [paste plan]
   → All files created and tested
   
3. /gp
   → Verify patterns are correct
   
4. Commit and push
```

**Total time: ~15-25 minutes**

---

### Bug Triage

```
1. /debug Getting NullPointerException in ProductService
   → Root cause identified
   
2. Fix the code (or have /impl apply suggested fix)

3. /test ProductService
   → Regression tests created
   
4. /gp
   → Validate fix follows standards
   
5. Commit fix
```

**Total time: ~10-15 minutes**

---

### Code Quality Review

```
1. [Make code changes in editor]

2. /gp
   → Violations highlighted with fixes
   
3. Address critical/warning violations

4. /refactor ProductController
   → Simplify logic, extract methods
   
5. /test ProductController
   → New tests for refactored code
   
6. Commit improvements
```

**Total time: ~15-20 minutes**

---

### Performance Optimization

```
1. /perf Dashboard page is slow
   → Bottleneck identified
   
2. /refactor ProductJdbcDao
   → Fix N+1 queries, add caching suggestion
   
3. /migrate [if schema changes needed]
   → Add indexes, update schema
   
4. /test ProductJdbcDao
   → Tests for new query patterns
   
5. /perf [re-run to validate]
   → Confirm improvement achieved
   
6. Commit optimization
```

**Total time: ~20-30 minutes**

---

## Usage Tips

### Input Format

Most skills accept clear descriptions:

```
✅ GOOD
/plan Add user email notifications when rental is approved

✅ GOOD
/debug Getting HTTP 403 on product edit page when not owner

✅ GOOD
/enhance Product card borders look harsh, use softer shadows

❌ BAD
/plan new stuff

❌ BAD
/debug error

❌ BAD
/enhance make it prettier
```

### Pasting Plans

When using `/impl` after `/plan`:

1. Run `/plan` to get the plan
2. Read and review the plan
3. Copy the entire plan text
4. Run `/impl` and paste the plan when asked

### Error Messages

If a skill doesn't work:

- **Network error** — Retry or check internet
- **Model not available** — Use different skill (Haiku instead of Opus)
- **Timeout** — Large input or complex task; try breaking into smaller pieces

---

## Best Practices

### 1. Always `good-practice` Before Committing

```
[Make changes]
  ↓
/gp
  ↓
Fix violations
  ↓
Commit
```

**Why:** Catches common mistakes early (wrong DI pattern, missing tests, etc.)

---

### 2. Use `planning` → `implementation` Pipeline for Features

Don't skip planning:

```
❌ DON'T
[manually code new feature]
/gp [check for problems]

✅ DO
/plan [get architecture]
[review plan]
/impl [execute correctly]
/gp [double-check]
```

**Why:** Prevents rework, ensures proper architecture from start.

---

### 3. Run Tests After Any Change

```
[Make code changes]
  ↓
/gp [check patterns]
  ↓
/test [generate/run tests]
  ↓
Commit
```

**Why:** Catches regressions and validates behavior.

---

### 4. Use `debug` for Root Cause, Not Guessing

When something breaks:

```
❌ DON'T
[guess what's wrong]
[try random fixes]

✅ DO
/debug [describe symptom]
[understand root cause]
[apply fix from suggestion]
/test [verify fix]
```

**Why:** Saves time, prevents recurring bugs.

---

### 5. Performance Analysis Before Optimization

```
❌ DON'T
[just add caching everywhere]

✅ DO
/perf [identify bottleneck]
[understand cause]
/refactor [apply targeted fix]
/perf [verify improvement]
```

**Why:** Premature optimization wastes time on non-issues.

---

## Examples by Task

### "I wrote code. What's wrong?"

```
/gp

→ Violations listed with fixes
```

### "How do I add a new feature?"

```
/plan [describe feature]
→ Read the plan
/impl [paste plan]
→ All files created
```

### "Tests are failing. Where's the bug?"

```
/debug [paste error or describe problem]
→ Root cause explained
→ Fix strategy provided
→ Regression test suggestion
```

### "This code is slow"

```
/perf [describe component/symptom]
→ Bottleneck identified
→ Optimization proposed
→ Testing strategy provided
```

### "I need to change the database"

```
/migrate [describe change]
→ SQL generated
→ Schema.sql updated
→ Tests created for changed DAOs
```

### "This view looks ugly"

```
/enhance [describe what looks wrong]
→ CSS/JSP improved
→ Responsive design fixed
→ Accessibility improved
```

### "Code needs refactoring"

```
/refactor [component name or concern]
→ Duplicated logic extracted
→ Names improved
→ Complexity reduced
→ No behavior change
```

### "Need comprehensive tests"

```
/test [class name]
→ Tests created for all methods
→ Edge cases covered
→ Error scenarios tested
```

---

## Model Performance Notes

| Model | Strength | Best For |
|-------|----------|----------|
| **Haiku 4.5** | ⚡ Fast, cheap | Quick UI tweaks (`/enhance`) |
| **Sonnet 4.6** | ⚖️ Balanced | Coding tasks (`/impl`, `/test`, `/refactor`, `/debug`) |
| **Opus 4.6** | 🧠 Thorough | Complex architecture (`/plan`, `/gp`, `/perf`, `/debug`) |

For best results:
- Use Haiku for simple aesthetic changes
- Use Sonnet for implementation and testing
- Use Opus for planning and complex analysis

---

## Troubleshooting

### Skill doesn't recognize my input

Skills are trained on specific patterns. Be descriptive:

```
❌ /plan new features

✅ /plan Add wishlist feature: users can save products to view later, 
   access from profile, remove items
```

### Generated code doesn't compile

Run `/gp` — it checks for import errors and syntax issues.

### Tests are failing after changes

Run `/debug` with the test failure message, or `/test [class]` to regenerate.

### Changes don't match my style/standards

Run `/good-practice` — it identifies all violations with fixes.

### Skill seems to have missed something

Provide more context in follow-up. Skills work better with detailed descriptions.

---

## See Also

- [[PAW Skills & Tools Reference]] — Full documentation of all 9 skills
- [[Pre-Delivery Checklist]] — Standards that `/good-practice` enforces
- [[Errores Comunes TP1]] — Actionable anti-patterns to avoid
- [[Maven Module Structure]] — Project structure skills understand
