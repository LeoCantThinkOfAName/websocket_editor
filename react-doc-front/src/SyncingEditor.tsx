import React, { useState, useRef, useEffect } from "react";
import { Editor } from "slate-react";
import { Operation, Value, ValueJSON } from "slate";
import io from "socket.io-client";

import { initialValue } from "./slateInitialValue";

const socket = io("http://localhost:4000");

export default function SyncingEditor({ groupId }: { groupId: string }) {
  const [value, setValue] = useState(initialValue);
  const id = useRef(`${Date.now()}`);
  const editor = useRef<Editor | null>(null);
  const remote = useRef(false);

  useEffect(() => {
    fetch(`http://localhost:4000/group/${groupId}`).then(x =>
      x.json().then(data => {
        console.log(data);
        setValue(Value.fromJSON(data));
      })
    );

    const eventName = `new-remote-operations-${groupId}`;

    socket.on(
      eventName,
      ({ editorId, ops }: { editorId: string; ops: Operation[] }) => {
        if (id.current !== editorId) {
          remote.current = true;
          ops.forEach((op: any) => editor.current!.applyOperation(op));
          remote.current = false;
        }
      }
    );
    return () => {
      socket.off(eventName);
    };
  }, []);

  return (
    <>
      <button
        onMouseDown={e => {
          e.preventDefault();
          // bold selected text
          editor.current!.toggleMark("bold");
        }}
      >
        bold
      </button>
      <Editor
        style={{
          backgroundColor: "#fafafa",
          maxWidth: 800,
          minHeight: 150
        }}
        ref={editor}
        renderMark={(props, _editor, next) => {
          if (props.mark.type === "bold") {
            return <strong>{props.children}</strong>;
          }
        }}
        value={value}
        onChange={opts => {
          setValue(opts.value);

          const ops = opts.operations
            .filter(o => {
              if (o) {
                return (
                  o.type !== "set_selection" &&
                  o.type !== "set_value" &&
                  (!o.data || !o.data.has("source"))
                );
              }
              return false;
            })
            .toJS()
            .map((o: any) => ({ ...o, data: { source: "one" } }));

          if (ops.length && !remote.current) {
            socket.emit("new-operations", {
              editorId: id.current,
              value: opts.value.toJSON(),
              ops,
              groupId
            });
          }
        }}
      />
    </>
  );
}
