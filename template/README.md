# Sentari Interview Template

Welcome candidate! This repository is a **self-contained sandbox**. It does _not_ connect to any Supabase instance or external API; everything you need is already here.

---

## 1 Project Setup
```bash
pnpm install     # install locked dev-dependencies
pnpm lint        # ESLint + Prettier (zero warnings allowed)
pnpm test        # Vitest unit tests – must be green
cp env.example .env  # (optional) add your OpenAI key to run live calls
```

## 2 Domain Types & Mock Data
* `src/lib/types.ts` – exact TypeScript interfaces used in production.
* `Expanded_Diary_Entries.csv` – 200-row fixture at repo root (all DB columns).
* `src/lib/mockData.ts` – loads the CSV at runtime and exports it as `mockVoiceEntries`.
* `src/lib/openai.ts` – optional helper: if `OPENAI_API_KEY` is present it calls the real API, otherwise returns deterministic stubs so tests still pass offline.

> **Note:** the CSV mirrors our current production schema, but you're welcome to add extra columns in your local copy if your solution needs them (e.g. a temporary `score` field). Keep the original columns untouched so our automated checker can still parse the file.

## 3 Your Only Job
Open `src/lib/sampleFunction.ts` and complete the body of `processEntries()`.  
Requirements:
1. Pure & synchronous (no network or file-system side-effects unless you use the provided OpenAI helper).  
2. Must return a `ProcessedResult` object (defined in `types.ts`).  
3. Update / add tests in `tests/sampleFunction.test.ts` so coverage is > 90 %.  

## 4 Rules
✅ Do
* Keep TypeScript `strict` errors at **0**.
* Run `pnpm lint --fix` before commit.
* Document non-trivial logic with JSDoc.

🚫 Don't
* Touch files outside `src/` or modify config files.
* Add runtime dependencies (dev-deps are allowed if justified).
* Commit any secrets – keep your `.env` file local.

## 5 Submit
1. Push your fork / repo to GitHub (public or private link).  
2. Share the repo URL or a `patch.diff` file per the job portal instructions.

That's it — good luck and happy coding!

---

## Candicate Note

### 1. Project Setup Mofify

When running ```pnpm lint```, terminal repoted error:

```bash
> sentari-interview-template@0.1.0 lint /Users/shawncai/Github/interview-test/template
> eslint "src/**/*.{ts,tsx}" --max-warnings 0

=============

WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.

You may find that it works just fine, or you may not.

SUPPORTED TYPESCRIPT VERSIONS: >=4.3.5 <5.4.0

YOUR TYPESCRIPT VERSION: 5.8.3

Please only submit bug reports when using the officially supported version.

=============

/Users/shawncai/Github/interview-test/template/src/lib/mockData.ts
  4:28  error  Unable to resolve path to module './types.js'  import/no-unresolved

/Users/shawncai/Github/interview-test/template/src/lib/openai.ts
  13:13  error  Unexpected any. Specify a different type                                                                             @typescript-eslint/no-explicit-any
  16:26  error  Unable to resolve path to module 'openai'                                                                            import/no-unresolved
  39:5   error  Use "@ts-expect-error" instead of "@ts-ignore", as "@ts-ignore" will do nothing if the following line is error-free  @typescript-eslint/ban-ts-comment

/Users/shawncai/Github/interview-test/template/src/lib/sampleFunction.ts
  1:45  error  Unable to resolve path to module './types.js'  import/no-unresolved

✖ 5 problems (5 errors, 0 warnings)

 ELIFECYCLE  Command failed with exit code 1.
```

Thus, use a supported TypeScript version (e.g., 5.3.x).

```bash
pnpm add -D typescript@5.3.3
pnpm add -D openai
```

And also, modify `mockData.ts`, `openai.ts`, `sampleFunction.ts` to make `pnpm lint` no warnings nor errors.

Some TypeScript files report errors in the comments since using `@` after `\\`, which is not proper.
