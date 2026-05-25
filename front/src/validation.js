export function readRequiredNumber(value, fieldName) {
    if (value === "" || value === null || value === undefined) {
        throw new Error(`Поле "${fieldName}" должно быть заполнено.`);
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        throw new Error(`Поле "${fieldName}" должно быть числом.`);
    }

    return number;
}

export function validateFormulaInput(formulaNumber, x, a, b, n) {
    if (n < 1) {
        throw new Error("Количество частей n должно быть положительным.");
    }

    if (a >= b) {
        throw new Error("Левая граница a должна быть меньше правой границы b.");
    }

    if (Number(formulaNumber) !== 5) {
        return;
    }

    if (a <= 0) {
        throw new Error("Для логарифмической функции левая граница a должна быть больше 0.");
    }

    if (b <= 0) {
        throw new Error("Для логарифмической функции правая граница b должна быть больше 0.");
    }

    if (x <= 0) {
        throw new Error("Для логарифмической функции значение аргумента x должно быть больше 0.");
    }
}