const codeEditor = document.getElementById("codeEditor");
const lineNumbers = document.getElementById("lineNumbers");
const outputPanel = document.getElementById("outputPanel");
const outputContent = document.getElementById("outputContent");

// Update line numbers
function updateLineNumbers() {
  const lines = codeEditor.value.split("\n").length;
  let lineNumbersText = "";
  for (let i = 1; i <= lines; i++) {
    lineNumbersText += i + "<br/>";
  }
  lineNumbers.innerHTML = lineNumbersText;
}

// Initial line numbers
updateLineNumbers();

// Update line numbers on input
codeEditor.addEventListener("input", updateLineNumbers);
codeEditor.addEventListener("scroll", () => {
  lineNumbers.scrollTop = codeEditor.scrollTop;
});

// Synchronize scroll between line numbers and editor
lineNumbers.addEventListener("scroll", () => {
  codeEditor.scrollTop = lineNumbers.scrollTop;
});

// Handle tab key for indentation
codeEditor.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.value =
      this.value.substring(0, start) + "    " + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 4;
  }
});

// Extract JavaScript code from script tags
function extractJavaScriptCode(content) {
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let jsCode = "";

  while ((match = scriptRegex.exec(content)) !== null) {
    // Skip scripts with src attribute (external scripts)
    if (!match[0].includes("src=")) {
      jsCode += match[1] + "\n";
    }
  }

  // If no script tags found, treat the entire content as JavaScript
  if (jsCode.trim() === "") {
    // Check if content looks like HTML
    if (content.includes("<") && content.includes(">")) {
      return "// No JavaScript found in script tags";
    } else {
      return content;
    }
  }

  return jsCode.trim();
}

// Run code function
function runCode() {
  const fullContent = codeEditor.value;
  const jsCode = extractJavaScriptCode(fullContent);

  outputContent.textContent = "";
  outputPanel.classList.add("visible");

  // Show what code is being executed
  if (jsCode === "// No JavaScript found in script tags") {
    outputContent.textContent = "No JavaScript found in <script> tags";
    outputContent.style.color = "#ffbd2e";
    setTimeout(() => {
      outputContent.style.color = "#d4d4d4";
    }, 2000);
    return;
  }

  // Capture console.log output
  const originalConsoleLog = console.log;
  const logs = [];

  console.log = function (...args) {
    logs.push(
      args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        )
        .join(" ")
    );
    originalConsoleLog.apply(console, arguments);
  };

  try {
    // Create a function to execute the code safely
    const executeCode = new Function(jsCode);
    executeCode();

    if (logs.length > 0) {
      outputContent.textContent = logs.join("\n");
    } else {
      outputContent.textContent =
        "Code executed successfully (no console output)";
    }
  } catch (error) {
    outputContent.textContent = `Error: ${error.message}`;
    outputContent.style.color = "#f48771";
  } finally {
    // Restore original console.log
    console.log = originalConsoleLog;
    setTimeout(() => {
      outputContent.style.color = "#d4d4d4";
    }, 100);
  }
}

// Auto-run code on Ctrl+Enter
codeEditor.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    runCode();
  }
});
