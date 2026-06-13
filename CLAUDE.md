@AGENTS.md

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Bugs/errors → invoke /investigate
- QA/testing → invoke /qa or /qa-only
- Code review → invoke /review
- Ship/deploy → invoke /ship or /land-and-deploy
- Save/restore context → invoke /context-save or /context-restore
