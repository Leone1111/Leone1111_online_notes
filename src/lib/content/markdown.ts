const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const inlineMarkdown = (value: string) =>
  escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

export function markdownToHtml(markdown = "") {
  const lines = markdown.split(/\r?\n/);
  const html: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let codeLines: string[] = [];
  let inCodeBlock = false;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      html.push(`<ul>${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushParagraph();
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length + 1;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = trimmed.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      listItems.push(listItem[1]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  if (inCodeBlock && codeLines.length > 0) {
    html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  return html.join("\n");
}
