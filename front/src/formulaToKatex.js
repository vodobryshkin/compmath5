export function formulaToKatex(formula) {
    if (!formula || typeof formula !== "string") {
        return "";
    }

    const expression = normalizeFormula(formula);
    const terms = splitTopLevelTerms(expression);

    if (terms.length === 0) {
        return "";
    }

    const renderedTerms = terms.map(termToKatex);

    let result = renderedTerms[0];

    for (let i = 1; i < renderedTerms.length; i++) {
        const term = renderedTerms[i];

        if (term.startsWith("-")) {
            result += ` - ${term.slice(1).trim()}`;
        } else if (term.startsWith("+")) {
            result += ` + ${term.slice(1).trim()}`;
        } else {
            result += ` + ${term}`;
        }
    }

    return `P(x) = ${result}`;
}

function normalizeFormula(formula) {
    return formula
        .trim()
        .replace(/,/g, ".")
        .replace(/−/g, "-")
        .replace(/\+\s*$/g, "")
        .replace(/\s+/g, " ")
        .replace(/\bMath\.sin\b/g, "sin")
        .replace(/\bMath\.cos\b/g, "cos")
        .replace(/\bMath\.tan\b/g, "tan")
        .replace(/\bMath\.exp\b/g, "exp")
        .replace(/\bMath\.log\b/g, "ln")
        .replace(/\bMath\.sqrt\b/g, "sqrt");
}

function splitTopLevelTerms(expression) {
    const terms = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (char === "(") {
            depth++;
            current += char;
            continue;
        }

        if (char === ")") {
            depth--;
            current += char;
            continue;
        }

        if ((char === "+" || char === "-") && depth === 0 && current.trim().length > 0 && !isExponentSign(expression, i)) {
            terms.push(current.trim());
            current = char;
            continue;
        }

        current += char;
    }

    if (current.trim().length > 0) {
        terms.push(current.trim());
    }

    return terms;
}

function termToKatex(term) {
    const trimmedTerm = term.trim();
    const sign = trimmedTerm.startsWith("-") ? "-" : trimmedTerm.startsWith("+") ? "+" : "";
    const unsignedTerm = sign ? trimmedTerm.slice(1).trim() : trimmedTerm;

    const factors = splitMultiplicationAndDivision(unsignedTerm);
    const renderedFactors = [];

    for (const factor of factors) {
        const rendered = factorToKatex(factor.value);

        if (factor.operator === "*") {
            renderedFactors.push(rendered);
            continue;
        }

        if (factor.operator === "/") {
            if (renderedFactors.length === 0) {
                renderedFactors.push(`\\frac{1}{${rendered}}`);
                continue;
            }

            const numerator = renderedFactors.pop();
            renderedFactors.push(`\\frac{${numerator}}{${rendered}}`);
        }
    }

    return sign + renderedFactors.join(" \\cdot ");
}

function splitMultiplicationAndDivision(term) {
    const factors = [];
    let current = "";
    let depth = 0;
    let operator = "*";

    for (let i = 0; i < term.length; i++) {
        const char = term[i];

        if (char === "(") {
            depth++;
            current += char;
            continue;
        }

        if (char === ")") {
            depth--;
            current += char;
            continue;
        }

        if ((char === "*" || char === "/") && depth === 0) {
            if (current.trim().length > 0) {
                factors.push({
                    operator: operator,
                    value: current.trim()
                });
            }

            operator = char;
            current = "";
            continue;
        }

        current += char;
    }

    if (current.trim().length > 0) {
        factors.push({
            operator: operator,
            value: current.trim()
        });
    }

    return factors;
}

function factorToKatex(factor) {
    const trimmed = stripOuterParentheses(factor.trim());

    if (isSimpleNumber(trimmed)) {
        return formatNumber(trimmed);
    }

    if (trimmed === "x") {
        return "x";
    }

    if (isFunctionCall(trimmed)) {
        return functionToKatex(trimmed);
    }

    if (hasTopLevelAdditive(trimmed)) {
        return `\\left(${additiveExpressionToKatex(trimmed)}\\right)`;
    }

    if (hasTopLevelMultiplicative(trimmed)) {
        return termToKatex(trimmed);
    }

    return trimmed
        .replace(/\^(\d+)/g, "^{$1}")
        .replace(/\*/g, "\\cdot ");
}

function additiveExpressionToKatex(expression) {
    const terms = splitTopLevelTerms(expression);

    return terms.map((term, index) => {
        const rendered = termToKatex(term);

        if (index === 0) {
            return rendered;
        }

        if (rendered.startsWith("-")) {
            return ` - ${rendered.slice(1).trim()}`;
        }

        if (rendered.startsWith("+")) {
            return ` + ${rendered.slice(1).trim()}`;
        }

        return ` + ${rendered}`;
    }).join("");
}

function functionToKatex(expression) {
    const nameEnd = expression.indexOf("(");
    const name = expression.slice(0, nameEnd);
    const argument = expression.slice(nameEnd + 1, -1);
    const renderedArgument = additiveExpressionToKatex(argument);

    if (name === "sin") {
        return `\\sin\\left(${renderedArgument}\\right)`;
    }

    if (name === "cos") {
        return `\\cos\\left(${renderedArgument}\\right)`;
    }

    if (name === "tan") {
        return `\\tan\\left(${renderedArgument}\\right)`;
    }

    if (name === "exp") {
        return `\\exp\\left(${renderedArgument}\\right)`;
    }

    if (name === "ln" || name === "log") {
        return `\\ln\\left(${renderedArgument}\\right)`;
    }

    if (name === "sqrt") {
        return `\\sqrt{${renderedArgument}}`;
    }

    return `\\operatorname{${name}}\\left(${renderedArgument}\\right)`;
}

function stripOuterParentheses(value) {
    let result = value;

    while (result.startsWith("(") && result.endsWith(")") && wrapsWholeExpression(result)) {
        result = result.slice(1, -1).trim();
    }

    return result;
}

function wrapsWholeExpression(value) {
    let depth = 0;

    for (let i = 0; i < value.length; i++) {
        if (value[i] === "(") {
            depth++;
        }

        if (value[i] === ")") {
            depth--;
        }

        if (depth === 0 && i < value.length - 1) {
            return false;
        }
    }

    return depth === 0;
}

function hasTopLevelAdditive(expression) {
    let depth = 0;

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (char === "(") {
            depth++;
            continue;
        }

        if (char === ")") {
            depth--;
            continue;
        }

        if ((char === "+" || char === "-") && depth === 0 && i > 0 && !isExponentSign(expression, i)) {
            return true;
        }
    }

    return false;
}

function hasTopLevelMultiplicative(expression) {
    let depth = 0;

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (char === "(") {
            depth++;
            continue;
        }

        if (char === ")") {
            depth--;
            continue;
        }

        if ((char === "*" || char === "/") && depth === 0) {
            return true;
        }
    }

    return false;
}

function isFunctionCall(expression) {
    return /^[a-zA-Z_][a-zA-Z_0-9]*\s*\(.*\)$/.test(expression);
}

function isSimpleNumber(value) {
    return /^[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?$/.test(value);
}

function isExponentSign(expression, index) {
    const previous = expression[index - 1];
    const next = expression[index + 1];

    return (previous === "e" || previous === "E") && /\d/.test(next);
}

function formatNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return value;
    }

    if (number === 0) {
        return "0";
    }

    return String(Number(number.toFixed(6)));
}