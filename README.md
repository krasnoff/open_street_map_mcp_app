# React Turborepo monorepo

Two Vite React and TypeScript apps share components from `packages/ui`. Uses pnpm workspaces and Turborepo.

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173 (mcp_app) and http://localhost:5174 (apps_sdk).

```bash
pnpm typecheck
pnpm build
pnpm --filter @workspace/mcp_app dev
```

Structure: `apps/mcp_app`, `apps/apps_sdk`, `packages/ui`. Edit shared components in `packages/ui/src`; both Vite apps pick up changes during development.
