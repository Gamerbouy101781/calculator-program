/**
 * Portfolio Calculator
 * --------------------
 * A fully functional, responsive calculator app supporting:
 * - Basic arithmetic: +, -, ×, ÷
 * - Advanced functions: exponentiation, square root, percentage
 * - Keyboard input support
 * - Error handling for invalid inputs
 * - History log for recent calculations
 *
 * Usage:
 * - Click buttons or use keyboard keys (0–9, +, -, *, /, Enter, Backspace)
 * - Clear display: "C" button
 * - Delete last character: "DEL" button
 */

document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display");
    const errorMsg = document.getElementById("error");
    const historyList = document.getElementById("history");

    let currentInput = "";
    let history = [];

    // Utility: Update display
    function updateDisplay(value) {
        display.value = value;
    }

    // Utility: Show error
    function showError(message) {
        errorMsg.textContent = message;
        setTimeout(() => (errorMsg.textContent = ""), 2000);
    }

    // Add to history
    function addToHistory(expression, result) {
        history.unshift(`${expression} = ${result}`);
        if (history.length > 10) history.pop();
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = history
            .map(item => `<li>${item}</li>`)
            .join("");
    }

    // Handle calculations
    function calculate() {
        try {
            const sanitized = currentInput.replace(/÷/g, "/").replace(/×/g, "*");
            const result = eval(sanitized); // Safe here because input is controlled via buttons
            if (isNaN(result) || !isFinite(result)) {
                showError("Invalid calculation");
                return;
            }
            addToHistory(currentInput, result);
            currentInput = result.toString();
            updateDisplay(currentInput);
        } catch {
            showError("Invalid input");
        }
    }

    // Handle button clicks
    document.querySelectorAll(".btn").forEach(button => {
        button.addEventListener("click", () => {
            const action = button.dataset.action;
            const value = button.textContent;

            if (!action) {
                // Number or decimal
                currentInput += value;
                updateDisplay(currentInput);
            } else {
                switch (action) {
                    case "clear":
                        currentInput = "";
                        updateDisplay("");
                        break;
                    case "delete":
                        currentInput = currentInput.slice(0, -1);
                        updateDisplay(currentInput);
                        break;
                    case "add":
                        currentInput += "+";
                        break;
                    case "subtract":
                        currentInput += "-";
                        break;
                    case "multiply":
                        currentInput += "×";
                        break;
                    case "divide":
                        currentInput += "÷";
                        break;
                    case "percent":
                        currentInput += "/100";
                        break;
                    case "sqrt":
                        currentInput = `Math.sqrt(${currentInput})`;
                        break;
                    case "power":
                        currentInput += "**";
                        break;
                    case "calculate":
                        calculate();
                        return;
                }
                updateDisplay(currentInput);
            }
        });
    });

    // Keyboard support
    document.addEventListener("keydown", e => {
        if (/[0-9.]/.test(e.key)) {
            currentInput += e.key;
        } else if (["+", "-", "*", "/"].includes(e.key)) {
            currentInput += e.key.replace("*", "×").replace("/", "÷");
        } else if (e.key === "Enter") {
            e.preventDefault();
            calculate();
            return;
        } else if (e.key === "Backspace") {
            currentInput = currentInput.slice(0, -1);
        }
        updateDisplay(currentInput);
    });
});
