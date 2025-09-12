import { MdRender } from "@/components/widgets/md-render";

export default function Page() {
  return (
    <div>
      <MdRender
        md={`
          # Hello World \n $$a+b=c$$  $$a+b=c$$  $$ f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-mu}{\\sigma}\\right)^2} $$ \n 

Interactive diagram rendering with manual control. Click the copy icon next to any Mermaid diagram to copy the code to your clipboard.

Simple Flowchart\n
graph TD \n
    A[Start] --> B{Decision} \n
    B -->|Yes| C[Success] \n
    B -->|No| D[Try Again] \n
    D --> B \n
    C --> E[End] \n
Process Flow
flowchart LR
    A[User Input] --> B[Validate]
    B --> C{Valid?}
    C -->|Yes| D[Process]
    C -->|No| E[Show Error]
    D --> F[Save Result]
    E --> A
    F --> G[Complete]
API Sequence
sequenceDiagram
    participant U as User
    participant A as App
    participant S as Server
    
    U->>A: Click render
    A->>S: API Request
    S-->>A: Response
    A-->>U: Show diagram
          
          `}
      />
    </div>
  );
}
