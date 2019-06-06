import { Value } from "slate";

export const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: "test"
          }
        ]
      }
    ]
  }
} as any);
