import { QuartzComponent } from "./types"

export default ((props) => {
  const { fileData } = props

  const fm = fileData.frontmatter ?? {}

  const show = ["species", "gender", "age", "occupation", "status", "first_appearance"]

  return (
    <div class="frontmatter-box">
      {show.map((key) => {
        if (!fm[key]) return null
        return (
          <div class="frontmatter-row">
            <strong>{key.replaceAll("_", " ")}:</strong> {String(fm[key])}
          </div>
        )
      })}
    </div>
  )
}) satisfies QuartzComponent
