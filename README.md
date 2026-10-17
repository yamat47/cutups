# cutups

Football play cutups: game film clips from Instagram and X, organized by formation, motion, scheme and coverage.

## Layout

```
/
├── application/   # the Astro site: package.json, src/, content/, scripts/
├── Dockerfile     # the development container
├── compose.yaml
├── Makefile       # every command, run inside the container
├── .github/       # CI
└── docs/          # the working log
```

## Development

Everything runs in Docker through `make`; Node is not needed on the host. `make install` once, `make dev` for the site on http://localhost:4321, and `make help` for the rest.

