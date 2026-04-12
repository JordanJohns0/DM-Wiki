import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const TagList: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const fm = fileData.frontmatter

  if (!fm || Object.keys(fm).length === 0) return null

  return (
    <ul class={classNames(displayClass, "frontmatter")}>
      {Object.entries(fm).map(([key, value]) => (
        <li>
          <strong>{key}:</strong> {String(value)}
        </li>
      ))}
    </ul>
  )
}

TagList.css = `
.frontmatter {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.frontmatter > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
}

.frontmatter strong {
  margin-right: 0.3rem;
}
`

export default (() => TagList) satisfies QuartzComponentConstructor
