import InputForm from "./InputForm.jsx";
import SolutionPanel from "./SolutionPanel.jsx";
import ChartPanel from "./ChartPanel.jsx";
import { useInterpolationCalculator } from "./useInterpolationCalculator.js";
import { useInterpolationChartData } from "./useInterpolationChartData.js";

export default function App() {
  const calculator = useInterpolationCalculator();

  const chart = useInterpolationChartData({
    solution: calculator.solution,
    usedInputMode: calculator.usedInputMode,
    usedFormulaNumber: calculator.usedFormulaNumber,
    usedArgument: calculator.usedArgument
  });

  return (
      <main>
        <h1>Интерполяция функций</h1>

        <InputForm
            inputMode={calculator.inputMode}
            setInputMode={calculator.setInputMode}
            form={calculator.form}
            loading={calculator.loading}
            isLogFunction={calculator.isLogFunction}
            changeField={calculator.changeField}
            handleFile={calculator.handleFile}
            submit={calculator.submit}
        />

        {calculator.error && (
            <section className="panel">
              <h2>Ошибка</h2>
              <pre>{calculator.error}</pre>
            </section>
        )}

        {calculator.solution && (
            <>
              <SolutionPanel
                  solution={calculator.solution}
                  usedInputMode={calculator.usedInputMode}
                  usedFormulaNumber={calculator.usedFormulaNumber}
                  usedMethodName={calculator.usedMethodName}
                  usedArgument={calculator.usedArgument}
                  katexFormula={chart.katexFormula}
              />

              <ChartPanel
                  polynomialFunction={chart.polynomialFunction}
                  chartData={chart.chartData}
                  nodePoints={chart.nodePoints}
                  resultPoint={chart.resultPoint}
                  usedInputMode={calculator.usedInputMode}
                  xDomain={chart.xDomain}
                  yDomain={chart.yDomain}
              />
            </>
        )}
      </main>
  );
}