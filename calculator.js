document.addEventListener("DOMContentLoaded", () => {
    const calculationBox = document.querySelector(".calculation");
    const resultBox = document.querySelector(".result");
    const buttons = document.querySelectorAll(".symbolButton");
    const equalsButton = document.querySelector(".equals");

    let expression = "";
    let lastResult = "";
    let isScientific = false;
    const MAX_LENGTH = 16;

    calculationBox.textContent = "0";
    equalsButton.disabled = true;
    
    function showError() {
        calculationBox.textContent = "Error";
        resultBox.textContent = "";
        setTimeout(() => {
            expression = "";
            calculationBox.textContent = "0";
            calculationBox.style.display = "block";
        }, 1000);
    }

    function formatResult(result) {
        let roundedResult = result.toFixed(5).replace(/\.?0+$/, "");
        if (Math.abs(result) >= 1e9) {
            roundedResult = Number.parseFloat(roundedResult).toExponential(4);
            isScientific = true;
        }
        return roundedResult;
    }

    function isLastCharOperator() {
        return /[+\-*/^%]$/.test(expression);
    }

    function toggleEqualsButton() {
        if (isLastCharOperator()) {
            equalsButton.disabled = true;
        } else {
            equalsButton.disabled = false;
        }
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.textContent;
            if (button.classList.contains("clear")) {
                expression = "";
                resultBox.textContent = "";
                calculationBox.textContent = "0";
                calculationBox.style.display = "block";
                isScientific = false;
            } else if (button.classList.contains("erase")) {
                if (resultBox.textContent !== "") {
                    expression = "";
                    resultBox.textContent = "";
                    calculationBox.textContent = "0";
                    calculationBox.style.display = "block";
                } else {
                    expression = expression.slice(0, -1);
                    calculationBox.textContent = expression || "0";
                    toggleEqualsButton();
                }
            } else if (button.classList.contains("equals")) {
                if (isLastCharOperator()) {
                    return;
                }
                try {
                    let result = math.evaluate(expression.replace(/x/g, '*'));
                    resultBox.textContent = formatResult(result);
                    calculationBox.style.display = "none";
                    lastResult = resultBox.textContent;
                    expression = "";
                } catch (error) {
                    showError();
                }
            } else if (value === "X" && expression.slice(-1) === "X") {
                return;
            } else if (value === ".") {
                if (resultBox.textContent !== "") {
                    expression = lastResult;
                    resultBox.textContent = "";
                }

                const lastNumber = expression.split(/[\+\-\*\/\^%]/).pop();

                if (!lastNumber.includes(".")) {
                    expression += value;
                }
            } else {
                if (expression.length < MAX_LENGTH) {
                    if (resultBox.textContent !== "" && !isNaN(lastResult)) {
                        expression = lastResult + value;
                        resultBox.textContent = "";
                        isScientific = false;
                    } else {
                        expression += value;
                    }
                    calculationBox.style.display = "block";
                }
            }

            calculationBox.textContent = expression || "0";
            toggleEqualsButton();
        });
    });
});
