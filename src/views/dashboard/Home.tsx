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
        <>
            <SliderBar />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">لوحة القيادة</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group me-2">
                            <button type="button" className="btn btn-sm btn-outline-secondary">مشاركة</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary">تصدير</button>
                        </div>
                        <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                            <span data-feather="calendar"></span>
                            هذا الأسبوع
                        </button>
                    </div>
                </div>

                {/* <canvas className="my-4 w-100" id="myChart" width="900" height="380" ref={chartRef}></canvas> */}

                <h2>عنوان القسم</h2>
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">عنوان</th>
                                <th scope="col">عنوان</th>
                                <th scope="col">عنوان</th>
                                <th scope="col">عنوان</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1,001</td>
                                <td>بيانات</td>
                                <td>عشوائية</td>
                                <td>تثري</td>
                                <td>الجدول</td>
                            </tr>
                            <tr>
                                <td>1,002</td>
                                <td>تثري</td>
                                <td>مبهة</td>
                                <td>تصميم</td>
                                <td>تنسيق</td>
                            </tr>
                            <tr>
                                <td>1,003</td>
                                <td>عشوائية</td>
                                <td>غنية</td>
                                <td>قيمة</td>
                                <td>مفيدة</td>
                            </tr>
                            <tr>
                                <td>1,003</td>
                                <td>معلومات</td>
                                <td>تثري</td>
                                <td>توضيحية</td>
                                <td>عشوائية</td>
                            </tr>
                            <tr>
                                <td>1,004</td>
                                <td>الجدول</td>
                                <td>بيانات</td>
                                <td>تنسيق</td>
                                <td>قيمة</td>
                            </tr>
                            <tr>
                                <td>1,005</td>
                                <td>قيمة</td>
                                <td>مبهة</td>
                                <td>الجدول</td>
                                <td>تثري</td>
                            </tr>
                            <tr>
                                <td>1,006</td>
                                <td>قيمة</td>
                                <td>توضيحية</td>
                                <td>غنية</td>
                                <td>عشوائية</td>
                            </tr>
                            <tr>
                                <td>1,007</td>
                                <td>تثري</td>
                                <td>مفيدة</td>
                                <td>معلومات</td>
                                <td>مبهة</td>
                            </tr>
                            <tr>
                                <td>1,008</td>
                                <td>بيانات</td>
                                <td>عشوائية</td>
                                <td>تثري</td>
                                <td>الجدول</td>
                            </tr>
                            <tr>
                                <td>1,009</td>
                                <td>تثري</td>
                                <td>مبهة</td>
                                <td>تصميم</td>
                                <td>تنسيق</td>
                            </tr>
                            <tr>
                                <td>1,010</td>
                                <td>عشوائية</td>
                                <td>غنية</td>
                                <td>قيمة</td>
                                <td>مفيدة</td>
                            </tr>
                            <tr>
                                <td>1,011</td>
                                <td>معلومات</td>
                                <td>تثري</td>
                                <td>توضيحية</td>
                                <td>عشوائية</td>
                            </tr>
                            <tr>
                                <td>1,012</td>
                                <td>الجدول</td>
                                <td>تثري</td>
                                <td>تنسيق</td>
                                <td>قيمة</td>
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
                                <td>قيمة</td>
                                <td>توضيحية</td>
                                <td>غنية</td>
                                <td>عشوائية</td>
                            </tr>
                            <tr>
                                <td>1,015</td>
                                <td>بيانات</td>
                                <td>مفيدة</td>
                                <td>معلومات</td>
                                <td>الجدول</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}

export default Home;
