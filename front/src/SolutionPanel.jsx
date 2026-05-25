import { BlockMath } from "react-katex";
import { FUNCTION_NAMES, METHOD_NAMES } from "./constants.js";
import { formatNumber } from "./math.js";

export default function SolutionPanel({
                                          solution,
                                          usedInputMode,
                                          usedFormulaNumber,
                                          usedMethodName,
                                          usedArgument,
                                          katexFormula
                                      }) {
    return (
        <section className="panel">
            <h2>Решение</h2>

            <table className="info-table">
                <tbody>
                <tr>
                    <th>Метод</th>
                    <td>{METHOD_NAMES[usedMethodName]}</td>
                </tr>

                {usedInputMode === "formula" && (
                    <tr>
                        <th>Функция</th>
                        <td>{FUNCTION_NAMES[usedFormulaNumber]}</td>
                    </tr>
                )}

                <tr>
                    <th>Аргумент x</th>
                    <td className="number-cell">{formatNumber(usedArgument)}</td>
                </tr>

                <tr>
                    <th>Значение</th>
                    <td className="number-cell">{formatNumber(solution.result)}</td>
                </tr>
                </tbody>
            </table>

            <h3>Интерполяционный многочлен</h3>

            {katexFormula && (
                <div className="formula-box">
                    <BlockMath math={katexFormula} />
                </div>
            )}

            <XYTable
                xColumn={solution.x_column}
                yColumn={solution.y_column}
            />

            {solution.differences && (
                <DifferencesTable
                    methodName={usedMethodName}
                    differences={solution.differences}
                />
            )}
        </section>
    );
}

function XYTable({ xColumn = [], yColumn = [] }) {
    return (
        <>
            <h3>Таблица x и y</h3>

            <div className="table-scroll">
                <table className="number-table">
                    <thead>
                    <tr>
                        <th>i</th>
                        <th>x</th>
                        <th>y</th>
                    </tr>
                    </thead>
                    <tbody>
                    {xColumn.map((x, index) => (
                        <tr key={index}>
                            <td className="number-cell">{index}</td>
                            <td className="number-cell">{formatNumber(x)}</td>
                            <td className="number-cell">{formatNumber(yColumn[index])}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function DifferencesTable({ methodName, differences }) {
    return (
        <>
            <h3>{differencesTitle(methodName)}</h3>

            <div className="table-scroll">
                <table className="number-table differences-table">
                    <tbody>
                    {differences.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td className="number-cell" key={cellIndex}>
                                    {formatNumber(cell)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function differencesTitle(methodName) {
    if (methodName === "newton") {
        return "Таблица разделённых разностей";
    }

    if (methodName === "gaussian") {
        return "Таблица конечных разностей";
    }

    return "Таблица разностей";
}