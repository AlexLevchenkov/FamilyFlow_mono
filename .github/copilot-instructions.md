# Workflow

- For each new, independent implementation task, start a new branch from the latest `origin/main` before making changes. Use a descriptive name such as `feat/<slug>`, `fix/<slug>`, or `refactor/<slug>`.
- Keep all task changes on that branch. Do not switch away from or overwrite existing uncommitted user changes; preserve them and ask for guidance if they prevent safely isolating the new task.
- When the task is complete, run the relevant checks, commit the changes, push the branch, and open or update a pull request targeting `main`. Include a concise title and a description of the work and validation.
- Do not merge the pull request; leave it for the user to review.
- Treat follow-up requests that explicitly continue an existing task or PR as work on that task's branch. For questions or requests that do not involve repository changes, do not create a branch or PR.
