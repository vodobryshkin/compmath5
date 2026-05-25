import { FUNCTION_OPTIONS, METHOD_OPTIONS } from "./constants.js";

export default function InputForm({
                                      inputMode,
                                      setInputMode,
                                      form,
                                      loading,
                                      isLogFunction,
                                      changeField,
                                      handleFile,
                                      submit
                                  }) {
    return (
        <form onSubmit={submit}>
            <fieldset className="panel">
                <legend>Исходные данные</legend>

                <div className="form-block">
                    <h3>1. Источник данных</h3>

                    <div className="form-grid">
                        <label>
                            Способ задания данных
                            <select value={inputMode} onChange={event => setInputMode(event.target.value)}>
                                <option value="formula">Выбранная функция</option>
                                <option value="table">Таблица вручную</option>
                                <option value="file">JSON-файл</option>
                            </select>
                        </label>

                        {inputMode === "formula" && (
                            <label>
                                Функция
                                <select name="formulaNumber" value={form.formulaNumber} onChange={changeField}>
                                    {FUNCTION_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                    </div>

                    {inputMode === "formula" && (
                        <FormulaInputFields
                            form={form}
                            isLogFunction={isLogFunction}
                            changeField={changeField}
                        />
                    )}

                    {inputMode === "table" && (
                        <TableInputField
                            tableData={form.tableData}
                            changeField={changeField}
                        />
                    )}

                    {inputMode === "file" && (
                        <FileInputFields
                            tableData={form.tableData}
                            changeField={changeField}
                            handleFile={handleFile}
                        />
                    )}
                </div>

                <div className="form-block">
                    <h3>2. Метод и точка расчёта</h3>

                    <div className="form-grid">
                        <label>
                            Метод интерполяции
                            <select name="methodName" value={form.methodName} onChange={changeField}>
                                {METHOD_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {inputMode !== "file" && (
                            <label>
                                Значение аргумента x
                                <input
                                    name="x"
                                    type="number"
                                    step="any"
                                    min={isLogFunction ? "0.000001" : undefined}
                                    value={form.x}
                                    onChange={changeField}
                                />
                            </label>
                        )}

                        {inputMode === "file" && (
                            <label>
                                Значение аргумента x берётся из JSON-файла
                                <input
                                    type="number"
                                    step="any"
                                    value={form.x}
                                    disabled
                                />
                            </label>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Считаю..." : "Рассчитать"}
                </button>
            </fieldset>
        </form>
    );
}

function FormulaInputFields({ form, isLogFunction, changeField }) {
    return (
        <div className="form-grid">
            <label>
                Левая граница a
                <input
                    name="a"
                    type="number"
                    step="any"
                    min={isLogFunction ? "0.000001" : undefined}
                    value={form.a}
                    onChange={changeField}
                />
            </label>

            <label>
                Правая граница b
                <input
                    name="b"
                    type="number"
                    step="any"
                    min={isLogFunction ? "0.000001" : undefined}
                    value={form.b}
                    onChange={changeField}
                />
            </label>

            <label>
                Количество узлов интегрирования
                <input
                    name="n"
                    type="number"
                    step="1"
                    min="1"
                    value={form.n}
                    onChange={changeField}
                />
            </label>
        </div>
    );
}

function TableInputField({ tableData, changeField }) {
    return (
        <label>
            Таблица значений
            <textarea
                name="tableData"
                rows="8"
                value={tableData}
                onChange={changeField}
            />
        </label>
    );
}

function FileInputFields({ tableData, changeField, handleFile }) {
    return (
        <>
            <p>
                JSON должен содержать поля <code>x</code>, <code>x_column</code> и <code>y_column</code>.
            </p>

            <label>
                JSON-файл
                <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFile}
                />
            </label>

            <label>
                Содержимое файла
                <textarea
                    name="tableData"
                    rows="8"
                    value={tableData}
                    onChange={changeField}
                />
            </label>
        </>
    );
}