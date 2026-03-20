# prefer-custom-instructions-under-code-review-limit

Prefer repository and path-specific Copilot instruction files to stay within the 4,000-character code-review instruction budget.

> **Rule catalog ID:** R036

## Targeted pattern scope

- `.github/copilot-instructions.md`
- `.github/instructions/**/*.instructions.md`

## What this rule reports

- repository or path-specific instruction files whose raw character length exceeds 4,000 characters

## Why this rule exists

GitHub documents that code review only considers roughly the first 4,000 characters of custom instructions. Keeping instruction files within that budget reduces the chance that important guidance is silently ignored during review flows.

## ❌ Incorrect

```md
<!-- imagine thousands of characters of guidance here -->
# Review policy

...very long instructions document...
```

## ✅ Correct

```md
# Review policy

Keep review instructions focused, high-signal, and short enough that the whole file fits within the code-review instruction budget.
```

## Further reading

- [GitHub Docs: Add repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
