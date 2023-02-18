const validateComment = async (req, res, next) => {
  const { comment_text } = req.body
  try {
    const checkComment = async (comment_text) => {
      if (!comment_text) return
      if (!/^[a-zA-Z0-9.,!?"'():;@#$%^&*+=\-/[\]\\_{}|<>\s]+$/.test(comment_text)) {
        throw new Error("Comment contains invalid characters")
      }
      if (comment_text.length > 250) throw new Error("Comment must be less than or equal to 250 characters")
    }
    await Promise.all([checkComment(comment_text)])
    next()
  } catch (err) {
    return res.json({ message: err.message })
  }
}

module.exports = { validateComment }
