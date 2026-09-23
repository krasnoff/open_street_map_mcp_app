import { FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { App as McpApp } from "@modelcontextprotocol/ext-apps";
import "./style.scss";
import { GNUIMap } from "@workspace/ui";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const app = new McpApp({ name: "Sign in form", version: "1.0.0" });

    app.onhostcontextchanged = (context) => {
      document.documentElement.dataset.theme = context.theme ?? "light";
    };
    app.onteardown = async () => ({});
    app.connect().catch((error: unknown) => {
      console.error(error);
      setStatus("Running in standalone preview mode.");
    });

  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(`Form submitted for ${username}.`);
    setPassword("");
  }

  return (
    // <main className="page-shell">
    //   <section className="login-card" aria-labelledby="login-title">
    //     <header>
    //       <p className="eyebrow">Welcome back</p>
    //       <h1 id="login-title">Sign in</h1>
    //       <p className="intro">Enter your account details to continue.</p>
    //     </header>

    //     <form onSubmit={handleSubmit}>
    //       <label htmlFor="username">Username</label>
    //       <input id="username" name="username" type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />

    //       <label htmlFor="password">Password</label>
    //       <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />

    //       <button type="submit">Sign in 2</button>
    //     </form>

    //     <p className="status" role="status" aria-live="polite">{status}</p>
    //   </section>
    // </main>
    <main className="page-shell">
      <div>Hello, World!</div>
      <GNUIMap />
    </main>
    
  );
}

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing #app root element");
createRoot(root).render(<LoginForm />);
