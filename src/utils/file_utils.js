const path = require('path');

// Utility function to check if a file should be excluded based on patterns
function shouldExcludeFile(filePath, exclusionPatterns = []) {
  // Always exclude node_modules and .git directories
  if (filePath.includes('node_modules') || filePath.includes('.git')) {
    return true;
  }
  
  // Check against provided exclusion patterns
  for (const pattern of exclusionPatterns) {
    if (filePath.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

// Utility function to filter files based on exclusion settings
function filterFiles(files, exclusionPatterns = []) {
  return files.filter(file => !shouldExcludeFile(file.path || file, exclusionPatterns));
}

// Utility function to check if directory should be excluded
function shouldExcludeDirectory(dirPath, exclusionPatterns = []) {
  // Always exclude system directories
  const systemDirs = ['node_modules', '.git', '.obsidian'];
  
  for (const sysDir of systemDirs) {
    if (dirPath.includes(sysDir)) {
      return true;
    }
  }
  
  // Check custom exclusion patterns
  for (const pattern of exclusionPatterns) {
    if (dirPath.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

module.exports = {
  shouldExcludeFile,
  filterFiles,
  shouldExcludeDirectory
};