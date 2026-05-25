export function parseTableData(text) {
    const xColumn = [];
    const yColumn = [];

    text.split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .forEach(line => {
            const parts = line.split(/[;\s]+/);

            if (parts.length !== 2) {
                throw new Error("Каждая строка таблицы должна иметь вид: x y");
            }

            const x = Number(parts[0].replace(",", "."));
            const y = Number(parts[1].replace(",", "."));

            if (!Number.isFinite(x) || !Number.isFinite(y)) {
                throw new Error("Таблица должна содержать только числа.");
            }

            xColumn.push(x);
            yColumn.push(y);
        });

    validateColumns(xColumn, yColumn);

    return { xColumn, yColumn };
}

export function parseJsonTableData(text) {
    let data;

    try {
        data = JSON.parse(text);
    } catch {
        throw new Error("Файл должен быть корректным JSON.");
    }

    const x = Number(data.x);
    const xColumn = data.x_column ?? data.xColumn;
    const yColumn = data.y_column ?? data.yColumn;

    if (!Number.isFinite(x)) {
        throw new Error("JSON должен содержать числовое поле x.");
    }

    if (!Array.isArray(xColumn) || !Array.isArray(yColumn)) {
        throw new Error("JSON должен содержать массивы x_column и y_column.");
    }

    const parsedXColumn = xColumn.map(Number);
    const parsedYColumn = yColumn.map(Number);

    validateColumns(parsedXColumn, parsedYColumn);

    return {
        x: x,
        xColumn: parsedXColumn,
        yColumn: parsedYColumn
    };
}

function validateColumns(xColumn, yColumn) {
    if (xColumn.length !== yColumn.length) {
        throw new Error("Массивы x_column и y_column должны иметь одинаковую длину.");
    }

    if (xColumn.length < 2) {
        throw new Error("Нужно минимум две точки.");
    }

    for (let i = 0; i < xColumn.length; i++) {
        if (!Number.isFinite(xColumn[i]) || !Number.isFinite(yColumn[i])) {
            throw new Error("x_column и y_column должны содержать только числа.");
        }
    }

    for (let i = 1; i < xColumn.length; i++) {
        if (xColumn[i] <= xColumn[i - 1]) {
            throw new Error("Значения x_column должны идти строго по возрастанию.");
        }
    }
}

export function makeTableText(xColumn, yColumn) {
    return xColumn.map((x, index) => `${x} ${yColumn[index]}`).join("\n");
}

export function functionValue(formulaNumber, x) {
    switch (Number(formulaNumber)) {
        case 1:
            return 4 * x + 5;
        case 2:
            return Math.sin(x);
        case 3:
            return 10 * Math.exp(5 * x);
        case 4:
            return 5 * x * x - 10 * x + 22;
        case 5:
            return 3 * Math.log(x) + 17.5;
        default:
            return Math.sin(x);
    }
}

export function buildFormulaFunction(formula) {
    if (!formula || typeof formula !== "string") {
        return null;
    }

    const expression = normalizeFormula(formula);

    try {
        const fn = new Function(
            "x",
            `
            "use strict";

            const sin = Math.sin;
            const cos = Math.cos;
            const tan = Math.tan;
            const exp = Math.exp;
            const ln = Math.log;
            const log = Math.log;
            const sqrt = Math.sqrt;
            const abs = Math.abs;
            const pow = Math.pow;
            const PI = Math.PI;
            const E = Math.E;

            return (${expression});
            `
        );

        return function (x) {
            const value = fn(x);

            if (!Number.isFinite(value)) {
                return null;
            }

            return value;
        };
    } catch {
        return null;
    }
}

function normalizeFormula(formula) {
    return formula
        .trim()
        .replace(/\+\s*$/g, "")
        .replace(/,/g, ".")
        .replace(/\^/g, "**")
        .replace(/\bMath\.sin\s*\(/g, "sin(")
        .replace(/\bMath\.cos\s*\(/g, "cos(")
        .replace(/\bMath\.tan\s*\(/g, "tan(")
        .replace(/\bMath\.exp\s*\(/g, "exp(")
        .replace(/\bMath\.log\s*\(/g, "ln(")
        .replace(/\bln\s*\(/g, "ln(")
        .replace(/\bexp\s*\(/g, "exp(")
        .replace(/(\d+(?:\.\d+)?)\s*x\b/g, "$1*x")
        .replace(/\)\s*\(/g, ")*(");
}

export function formulaToLatex(formula) {
    if (!formula || typeof formula !== "string") {
        return "";
    }

    return formula
        .trim()
        .replace(/\+\s*$/g, "")
        .replace(/,/g, ".")
        .replace(/\*/g, "\\cdot ")
        .replace(/\bMath\.sin/g, "\\sin")
        .replace(/\bMath\.cos/g, "\\cos")
        .replace(/\bMath\.tan/g, "\\tan")
        .replace(/\bMath\.exp/g, "\\exp")
        .replace(/\bMath\.log/g, "\\ln")
        .replace(/\bsin/g, "\\sin")
        .replace(/\bcos/g, "\\cos")
        .replace(/\btan/g, "\\tan")
        .replace(/\bexp/g, "\\exp")
        .replace(/\bln/g, "\\ln");
}

export function formatNumber(value, digits = 6) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "";
    }

    if (number === 0) {
        return "0";
    }

    const fixed = number.toFixed(digits);
    const trimmed = fixed.replace(/\.?0+$/g, "");

    if (trimmed === "-0") {
        return "0";
    }

    return trimmed;
}

export function paddedDomain(values) {
    const finiteValues = values.filter(Number.isFinite);

    if (finiteValues.length === 0) {
        return [0, 1];
    }

    let min = Math.min(...finiteValues);
    let max = Math.max(...finiteValues);

    if (min === max) {
        const shift = Math.abs(min) > 1 ? Math.abs(min) * 0.1 : 1;

        return [min - shift, max + shift];
    }

    const padding = (max - min) * 0.08;

    return [min - padding, max + padding];
}