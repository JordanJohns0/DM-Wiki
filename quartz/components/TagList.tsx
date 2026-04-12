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

  const stripMarkdownLink = (value: string) => {
    // [text](url) → text
    return value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
  }

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
        // TAGS (unchanged behavior)
        if (key === "tags" && Array.isArray(value)) {
          return value.map((tag) => {
            const linkDest = resolveRelative(fileData.slug!, `tags/${tag}`)
            return (
              <li>
                <a href={linkDest} class="internal tag-link">
                  {tag}
                </a>
              </li>
            )
          })
        }

        let displayValue: any = value

        if (typeof value === "string") {
          // remove markdown-style external links
          displayValue = stripMarkdownLink(value)
        } else if (Array.isArray(value)) {
          displayValue = value.map((v) =>
            typeof v === "string" ? stripMarkdownLink(v) : String(v)
          ).join(", ")
        } else if (typeof value === "object") {
          displayValue = JSON.stringify(value)
        }

        // Obsidian wiki link [[Page]]
        if (typeof value === "string" && value.startsWith("[[") && value.endsWith("]]")) {
          const slug = value.slice(2, -2)
          const linkDest = resolveRelative(fileData.slug!, slug as any)

          return [
            <li>
              <strong>{formatKey(key)}:</strong>{" "}
              <a href={linkDest} class="internal">
                {slug}
              </a>
            </li>
          ]
        }

        // external markdown link case → still render but stripped
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

        return [
          <li>
            <strong>{formatKey(key)}:</strong> {String(displayValue)}
          </li>
        ]
      })}
    </ul>
  )
}

TagList.css = `
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
}

a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`

export default (() => TagList) satisfies QuartzComponentConstructor
