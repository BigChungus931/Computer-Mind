const codeEditor = document.getElementById("codeEditor");
const lineNumbers = document.getElementById("lineNumbers");
const outputPanel = document.getElementById("outputPanel");
const outputContent = document.getElementById("outputContent");

// Update line numbers
function updateLineNumbers() {
  const lines = codeEditor.value.split("\n").length;
  let lineNumbersText = "";
  for (let i = 1; i <= lines; i++) {
    lineNumbersText += i + "<br>";
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

// Run code function
function runCode() {
  const code = codeEditor.value;
  outputContent.textContent = "";
  outputPanel.classList.add("visible");

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
    const executeCode = new Function(code);
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
