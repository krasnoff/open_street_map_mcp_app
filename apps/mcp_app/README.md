# MCP App Template

A small, ready-to-customize template for building an interactive [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) app with React and TypeScript.

The project includes:

- An MCP server built with the TypeScript SDK
- An interactive React UI registered as an MCP App resource
- A sample `open-sign-in` tool that displays the UI in a compatible MCP host
- Streamable HTTP and stdio transport support
- A Vite build that packages the UI into a single HTML file
- Development, build, serve, and type-check scripts

The included sign-in form is only a UI example. It does not authenticate users or send credentials to a server. Replace it with your own interface and application logic.

## Requirements

- Node.js 20 or newer
- pnpm
- An MCP client or host with MCP Apps support to display the interactive UI

## Create a project from the template

On GitHub, click **Use this template**, choose **Create a new repository**, and then clone the repository you created:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Alternatively, clone this repository directly.

## Install

Install the project dependencies:

```bash
pnpm install
```

## Development

Start the UI and MCP server in watch mode:

```bash
pnpm dev
```

The MCP endpoint is available at:

```text
http://localhost:3001/mcp
```

The development command rebuilds the UI when files change and restarts the server when its TypeScript files change.

## Build and run

Create a production build and start the server:

```bash
pnpm build
pnpm serve
```

To use another port, set the `PORT` environment variable:

```bash
PORT=4000 pnpm serve
```

Your endpoint will then be `http://localhost:4000/mcp`.

## Connect an MCP client

### Streamable HTTP

Configure your MCP client to connect to:

```text
http://localhost:3001/mcp
```

After connecting, call the `open-sign-in` tool. A compatible MCP Apps host will render the interactive form returned by the server.

### stdio

Clients that launch local MCP servers can run this project over stdio. For example, use a configuration equivalent to:

```json
{
  "mcpServers": {
    "my-mcp-app": {
      "command": "pnpm",
      "args": ["--filter", "@workspace/mcp_app", "start"],
      "cwd": "/absolute/path/to/YOUR_REPOSITORY",
      "env": {
        "TRANSPORT": "stdio"
      }
    }
  }
}
```

The exact configuration format depends on your MCP client. Use an absolute path for `cwd`.

You can also test the stdio server from a terminal:

```bash
TRANSPORT=stdio pnpm start
```

## Customize the template

The main files are:

- `src/main.tsx` — React interface and client-side behavior
- `src/style.scss` — UI styling
- `server.ts` — MCP tool and UI resource registration
- `main.ts` — HTTP and stdio transports
- `vite.config.ts` — browser UI build configuration

When adapting the template:

1. Replace the sample form in `src/main.tsx` with your UI.
2. Update the tool name, description, schemas, and handler in `server.ts`.
3. Change the server and app names from `sign-in-form` to your project name.
4. If the UI needs to call MCP tools, add those tools to `server.ts` and invoke them through the MCP Apps client API.
5. Run `pnpm typecheck` and `pnpm build` before publishing.

## Public hosting

For remote use, deploy the built Node.js server behind HTTPS and expose its `/mcp` route. Set `PUBLIC_HOST` to the public hostname without a protocol:

```bash
PUBLIC_HOST=mcp.example.com pnpm serve
```

`PUBLIC_HOST` is used by the server's host and origin protection. Update the defaults and security policy in `main.ts` for your deployment, especially if the UI loads assets or communicates with additional domains.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the UI build and MCP server in watch mode |
| `pnpm build` | Build the single-file UI and compile the server |
| `pnpm serve` | Run the compiled production server |
| `pnpm start` | Run the TypeScript server directly |
| `pnpm typecheck` | Type-check the UI and server |

## License

MIT
