import { useState } from "react";
import { Button, Card } from "@workspace/ui";

export function App() {
  const [count, setCount] = useState(0);
  return <main style={{ maxWidth: 720, margin: "5rem auto", padding: "0 1rem" }}>
    <Card>
      <h1>app-one</h1>
      <p>This app imports Button and Card from the shared UI package.</p>
      <Button onClick={() => setCount(count + 1)}>Clicked {count} times</Button>
    </Card>
  </main>;
}
