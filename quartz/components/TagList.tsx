import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { resolveRelative } from "../util/path"

const TagList: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const fm = fileData.frontmatter
  if (!fm) return null

  const excludedKeys = new Set([
    "publish",
    "created",
    "modified",
    "published",
    "aliases",
    "title"
  ])

  const formatKey = (key: string) =>
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())

  const stripMarkdownLink = (value: string) =>
    value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")

  const isExternalMarkdownLink = (value: string) =>
    /^\[.*\]\(https?:\/\/.*\)$/.test(value)

  const entries = Object.entries(fm).filter(([key, value]) => {
    if (excludedKeys.has(key)) return false
    if (value === null || value === undefined) return false
    if (Array.isArray(value) && value.length === 0) return false
    return true
  })

  if (entries.length === 0) return null

  return (
    <ul class={classNames(displayClass, "infobox")}>
      {entries.flatMap(([key, value]) => {
        /* ---------------- TAGS ---------------- */
        if (key === "tags" && Array.isArray(value)) {
          return [
            <li>
              <strong>Tags:</strong>{" "}
              <span class="tag-container">
                {value.map((tag) => {
                  const linkDest = resolveRelative(fileData.slug!, `tags/${tag}`)
                  return (
                    <a href={linkDest} class="internal tag-link">
                      {tag}
                    </a>
                  )
                })}
              </span>
            </li>
          ]
        }

        /* ---------------- OBISIDIAN WIKI LINKS [[Page]] ---------------- */
        if (typeof value === "string" && value.startsWith("[[") && value.endsWith("]]")) {
          const target = value.slice(2, -2)

          const linkDest = resolveRelative(
            fileData.slug!,
            target as any
          )

          return [
            <li>
              <strong>{formatKey(key)}:</strong>{" "}
              <a href={linkDest} class="internal">
                {target}
              </a>
            </li>
          ]
        }

        /* ---------------- EXTERNAL MARKDOWN LINKS [text](url) ---------------- */
        if (typeof value === "string" && isExternalMarkdownLink(value)) {
          const text = stripMarkdownLink(value)
          const url = value.match(/\((https?:\/\/[^)]+)\)/)?.[1]

          return [
            <li>
              <strong>{formatKey(key)}:</strong>{" "}
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {text}
                </a>
              ) : (
                text
              )}
            </li>
          ]
        }

        /* ---------------- ARRAYS ---------------- */
        if (Array.isArray(value)) {
          return [
            <li>
              <strong>{formatKey(key)}:</strong>{" "}
              {value.map((v, i) => (
                <span>
                  {String(v)}
                  {i < value.length - 1 ? ", " : ""}
                </span>
              ))}
            </li>
          ]
        }

        /* ---------------- DEFAULT ---------------- */
        return [
          <li>
            <strong>{formatKey(key)}:</strong> {String(value)}
          </li>
        ]
      })}
    </ul>
  )
}

/* ---------------- CSS ---------------- */
TagList.css = `
.infobox {
  list-style: none;
  margin: 1rem 0;
  padding: 0.75rem 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  max-width: 320px;

  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 10px;

  font-size: 0.9rem;
}

.infobox > li {
  margin: 0;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;

  word-break: break-word;
}

.infobox strong {
  flex: 0 0 40%;
  font-weight: 600;
  color: var(--dark);
}

.infobox a {
  color: var(--secondary);
  text-decoration: none;
}

.infobox a:hover {
  text-decoration: underline;
}

/* TAGS */
.tag-container {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: flex-end;
}

.tag-container a {
  flex: none;
}

a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`

export default (() => TagList) satisfies QuartzComponentConstructor
