import InterpolationChart from "./InterpolationChart.jsx";

export default function ChartPanel({
                                       polynomialFunction,
                                       chartData,
                                       nodePoints,
                                       resultPoint,
                                       usedInputMode,
                                       xDomain,
                                       yDomain
                                   }) {
    return (
        <section className="panel">
            <h2>График</h2>

            {!polynomialFunction && (
                <p>Формулу не удалось преобразовать в выражение для построения графика.</p>
            )}

            {polynomialFunction && (
                <InterpolationChart
                    chartData={chartData}
                    nodePoints={nodePoints}
                    resultPoint={resultPoint}
                    usedInputMode={usedInputMode}
                    xDomain={xDomain}
                    yDomain={yDomain}
                />
            )}
        </section>
    );
}