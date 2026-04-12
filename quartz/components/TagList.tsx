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

  const entries = Object.entries(fm).filter(([key, value]) => {
    if (excludedKeys.has(key)) return false
    if (value === null || value === undefined) return false
    if (Array.isArray(value) && value.length === 0) return false
    return true
  })

  if (entries.length === 0) return null

  return (
    <ul class={classNames(displayClass, "infobox")}>
      {entries.map(([key, value]) => {
        // TAG BEHAVIOR (original functionality preserved)
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

        // LINK HANDLING (Obsidian-style [[links]] + markdown links)
        let displayValue = value

        if (typeof value === "string") {
          displayValue = value
        } else if (Array.isArray(value)) {
          displayValue = value.join(", ")
        } else if (typeof value === "object" && value !== null) {
          displayValue = JSON.stringify(value)
        }

        // detect internal wiki links like [[Page]]
        const isWikiLink =
          typeof value === "string" && value.startsWith("[[") && value.endsWith("]]")

        if (isWikiLink) {
          const slug = value.slice(2, -2)
          const linkDest = resolveRelative(fileData.slug!, slug as any)

          return (
            <li>
              <strong>{key}:</strong>{" "}
              <a href={linkDest} class="internal">
                {slug}
              </a>
            </li>
          )
        }

        return (
          <li>
            <strong>{key}:</strong> {String(displayValue)}
          </li>
        )
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
