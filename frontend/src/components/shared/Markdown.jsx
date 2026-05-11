import React from "react";

export default function Markdown({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  const out = [];
  let tableRows = [];
  let inTable = false;
  let k = 0;

  const flushTable = () => {
    if (!tableRows.length) return;
    const headers = tableRows[0];
    const body = tableRows.slice(2); // skip separator row (---|---|---)

    out.push(
      <div key={k++} className="table-wrap">
        <table>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h.trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, i) => (
              <tr key={i}>
                {headers.map((_, j) => (
                  <td key={j}>{row[j] ? row[j].trim() : "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      inTable = true;
      const cells = trimmed
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      tableRows.push(cells);
      return;
    }

    if (inTable) flushTable();

    if (trimmed.startsWith("## "))
      out.push(<h2 key={k++}>{trimmed.slice(3)}</h2>);
    else if (trimmed.startsWith("# "))
      out.push(<h1 key={k++}>{trimmed.slice(2)}</h1>);
    else if (trimmed.startsWith("**") && trimmed.endsWith("**"))
      out.push(
        <p key={k++}>
          <strong>{trimmed.slice(2, -2)}</strong>
        </p>
      );
    else if (trimmed === "") out.push(<br key={k++} />);
    else {
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      out.push(
        <p key={k++}>
          {parts.map((p, i) =>
            p.startsWith("**") && p.endsWith("**") ? (
              <strong key={i}>{p.slice(2, -2)}</strong>
            ) : (
              p
            )
          )}
        </p>
      );
    }
  });

  if (inTable) flushTable();
  return <div className="markdown">{out}</div>;
}
