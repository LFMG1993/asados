import SliderBar from "../../components/dashboard/slider"




export function Home() {
    // console.log("Componente Home renderizado");
    // const chartRef = useRef<HTMLCanvasElement>(null); // Referencia para el canvas
    // const chartData = useMemo<ChartData<'line'>>(() => ({ // Especifica el tipo para useMemo
    //     labels: [
    //         'الأحد',
    //         'الإثنين',
    //         'الثلاثاء',
    //         'الأربعاء',
    //         'الخميس',
    //         'الجمعة',
    //         'السبت'
    //     ],
    //     datasets: [{
    //         label: 'Ventas Semanales',
    //         data: [
    //             15339,
    //             21345,
    //             18483,
    //             24003,
    //             23489,
    //             24092,
    //             12034
    //         ],
    //         lineTension: 0,
    //         backgroundColor: 'rgba(0, 123, 255, 0.5)',
    //         borderColor: '#007bff',
    //         borderWidth: 4,
    //         pointBackgroundColor: '#007bff',
    //         fill: true,
    //     }]
    // }), []);

    // // Opciones del gráfico
    // const chartOptions = useMemo<ChartOptions<'line'>>(() => ({ // Especifica el tipo
    //     scales: {
    //         y: {
    //             type: 'linear',
    //             beginAtZero: false
    //         },
    //     },
    //     plugins: {
    //         legend: {
    //             display: false
    //         }
    //     },
    //     responsive: true,
    //     maintainAspectRatio: false,
    // }), []);

    // // Llama a tu hook useChart
    // useChart({
    //     canvasRef: chartRef as React.RefObject<HTMLCanvasElement>,
    //     type: 'line', // Tipo de gráfico
    //     data: chartData, // Datos para el gráfico
    //     options: chartOptions, // Opciones para el gráfico
    // });
    return (
        <SliderBar>
            {/* Este contenido se renderizará dentro de la columna principal de SliderBar */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Dashboard</h1>
                {/* Botones */}
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group me-2">
                            <button type="button" className="btn btn-sm btn-outline-secondary">Compartir</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary">Exportar</button>
                        </div>
                        <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                            <span data-feather="calendar"></span>
                            Esta semana
                        </button>
                    </div>
            </div>
            {/* Comentario del gráfico */}
                {/* <canvas className="my-4 w-100" id="myChart" width="900" height="380" ref={chartRef}></canvas> */}

                <h2>Título de la sección</h2>
                <div className="table-responsive small">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Título</th>
                                <th scope="col">Título</th>
                                <th scope="col">Título</th>
                                <th scope="col">Título</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1,001</td>
                                <td>Datos</td>
                                <td>Aleatorios</td>
                                <td>Para</td>
                                <td>Tabla</td>
                            </tr>
                            <tr>
                                <td>1,002</td>
                                <td>Para</td>
                                <td>Ejemplo</td>
                                <td>Diseño</td>
                                <td>Formato</td>
                            </tr>
                            <tr>
                                <td>1,003</td>
                                <td>Aleatorios</td>
                                <td>Ricos</td>
                                <td>Valor</td>
                                <td>Útil</td>
                            </tr>
                            <tr>
                                <td>1,003</td>
                                <td>Información</td>
                                <td>Para</td>
                                <td>Explicativa</td>
                                <td>Aleatorios</td>
                            </tr>
                            <tr>
                                <td>1,004</td>
                                <td>Datos</td>
                                <td>Formato</td>
                                <td>Valor</td>
                            </tr>
                            <tr>
                                <td>1,005</td>
                                <td>Valor</td>
                                <td>Claro</td>
                                <td>Tabla</td>
                                <td>Para</td>
                            </tr>
                            <tr>
                                <td>1,006</td>
                                <td>Valor</td>
                                <td>Explicativa</td>
                                <td>Rica</td>
                                <td>Aleatoria</td>
                            </tr>
                            <tr>
                                <td>1,007</td>
                                <td>Para</td>
                                <td>Útil</td>
                                <td>Información</td>
                                <td>Clara</td>
                            </tr>
                            <tr>
                                <td>1,008</td>
                                <td>Datos</td>
                                <td>Aleatorios</td>
                                <td>Para</td>
                                <td>Tabla</td>
                            </tr>
                            <tr>
                                <td>1,009</td>
                                <td>Para</td>
                                <td>Clara</td>
                                <td>Diseño</td>
                                <td>Formato</td>
                            </tr>
                            <tr>
                                <td>1,010</td>
                                <td>Aleatoria</td>
                                <td>Rica</td>
                                <td>Valor</td>
                                <td>Útil</td>
                            </tr>
                            <tr>
                                <td>1,011</td>
                                <td>Información</td>
                                <td>Para</td>
                                <td>Explicativa</td>
                                <td>Aleatoria</td>
                            </tr>
                            <tr>
                                <td>1,012</td>
                                <td>Tabla</td>
                                <td>Para</td>
                                <td>Formato</td>
                                <td>Valor</td>
                            </tr>
                            <tr>
                                <td>1,013</td>
                                <td>قيمة</td>
                                <td>مبهة</td>
                                <td>الجدول</td>
                                <td>تصميم</td>
                            </tr>
                            <tr>
                                <td>1,014</td>
                                <td>Valor</td>
                                <td>Explicativa</td>
                                <td>Rica</td>
                                <td>Aleatoria</td>
                            </tr>
                            <tr>
                                <td>1,015</td>
                                <td>Datos</td>
                                <td>Útil</td>
                                <td>معلومات</td>
                                <td>الجدول</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            {/* Fin del contenido que se pasa como children */}
        </SliderBar>
    );
}

export default Home;
