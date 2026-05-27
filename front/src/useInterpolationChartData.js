function sourceFunction(formulaNumber) {
    if (formulaNumber === 1) {
        return x => 4 * x + 5;
    }

    if (formulaNumber === 2) {
        return x => Math.sin(x);
    }

    if (formulaNumber === 3) {
        return x => 10 * Math.exp(5 * x);
    }

    if (formulaNumber === 4) {
        return x => 5 * x * x - 10 * x + 22;
    }

    if (formulaNumber === 5) {
        return x => x > 0 ? 3 * Math.log(x) + 17.5 : NaN;
    }

    return () => NaN;
}

function lagrangeValue(xColumn, yColumn, x) {
    let result = 0;

    for (let i = 0; i < xColumn.length; i++) {
        let basis = 1;

        for (let j = 0; j < xColumn.length; j++) {
            if (i !== j) {
                basis *= (x - xColumn[j]) / (xColumn[i] - xColumn[j]);
            }
        }

        result += yColumn[i] * basis;
    }

    return result;
}

function axisDomainWithSmallPadding(values) {
    const finiteValues = values.filter(Number.isFinite);

    if (finiteValues.length === 0) {
        return [-1, 1];
    }

    const min = Math.min(...finiteValues);
    const max = Math.max(...finiteValues);

    if (Math.abs(max - min) < 1e-12) {
        return [min - 1, max + 1];
    }

    const padding = (max - min) * 0.08;

    return [min - padding, max + padding];
}

function formulaToKatex(formula) {
    if (!formula) {
        return "";
    }

    return formula
        .replaceAll("*", "\\cdot ")
        .replaceAll("Math.sin", "\\sin")
        .replaceAll("Math.cos", "\\cos")
        .replaceAll("Math.log", "\\ln")
        .replaceAll("Math.exp", "e^")
        .replaceAll("phi", "\\varphi");
}

export function useInterpolationChartData({
                                              solution,
                                              usedInputMode,
                                              usedFormulaNumber,
                                              usedArgument
                                          }) {
    if (!solution?.x_column || !solution?.y_column) {
        return {
            polynomialFunction: null,
            chartData: [],
            nodePoints: [],
            resultPoint: [],
            xDomain: [-1, 1],
            yDomain: [-1, 1],
            katexFormula: ""
        };
    }

    const xColumn = solution.x_column.map(Number);
    const yColumn = solution.y_column.map(Number);

    const polynomialFunction = x => lagrangeValue(xColumn, yColumn, x);

    const minNodeX = Math.min(...xColumn);
    const maxNodeX = Math.max(...xColumn);

    const span = maxNodeX - minNodeX;
    const extension = span * 0.08;

    const plotMinX = minNodeX - extension;
    const plotMaxX = maxNodeX + extension;

    const source = sourceFunction(Number(usedFormulaNumber));

    const chartData = [];
    const steps = 700;

    for (let i = 0; i <= steps; i++) {
        const x = plotMinX + (plotMaxX - plotMinX) * i / steps;

        const polynomialY = polynomialFunction(x);
        const sourceY = usedInputMode === "formula" ? source(x) : NaN;

        chartData.push({
            x,
            polynomialY: Number.isFinite(polynomialY) ? polynomialY : NaN,
            sourceY: Number.isFinite(sourceY) ? sourceY : NaN
        });
    }

    const nodePoints = xColumn.map((x, index) => ({
        x,
        y: yColumn[index]
    }));

    const resultY = Number.isFinite(solution.result)
        ? solution.result
        : polynomialFunction(usedArgument);

    const resultPoint = Number.isFinite(usedArgument) && Number.isFinite(resultY)
        ? [{ x: usedArgument, y: resultY }]
        : [];

    const xDomain = axisDomainWithSmallPadding([
        minNodeX,
        maxNodeX,
        usedArgument
    ]);

    const yDomain = axisDomainWithSmallPadding([
        ...yColumn,
        resultY,
        ...chartData.map(point => point.polynomialY),
        ...chartData.map(point => point.sourceY)
    ]);

    return {
        polynomialFunction,
        chartData,
        nodePoints,
        resultPoint,
        xDomain,
        yDomain,
        katexFormula: formulaToKatex(solution.formula)
    };
}