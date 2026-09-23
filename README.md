# React Turborepo monorepo

Two Vite React and TypeScript apps share components from `packages/ui`. Uses pnpm workspaces and Turborepo.

```bash
pnpm install
pnpm dev
```

The MCP app endpoint is http://localhost:3001/mcp. The apps_sdk UI is available at http://localhost:5174.

```bash
pnpm typecheck
pnpm build
pnpm --filter @workspace/mcp_app dev
```

Structure: `apps/mcp_app`, `apps/apps_sdk`, `packages/ui`. Edit shared components in `packages/ui/src`; both Vite apps pick up changes during development.
