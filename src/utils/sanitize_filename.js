function sanitizeFilenameForRegex(filename) {
  // Escape special regex characters: ^ $ \ . * + ? ( ) [ ] { } | -
  return filename.replace(/[\^$\\.*+?()\[\]{}|\-]/g, '\\$&');
}

module.exports = sanitizeFilenameForRegex;