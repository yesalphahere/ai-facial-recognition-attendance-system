// basic chart //

const basicColumOptions = {
    series: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }, {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    }],
    chart: {
        fontFamily: "Rubik, serif",
        type: 'bar',
        height: 350
    },
    colors: ['#0F626A', '#0AB964', '#E14E5A'],
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            },
        },
    },
    fill: {
        opacity: 1
    },
    grid: {
        show: true,
        borderColor: 'rgba(var(--dark),.2)',
        strokeDashArray: 2,
    },
    tooltip: {
        x: {
            show: false,
        },
        style: {
            fontSize: '16px',
        },
        y: {
            formatter: function (val) {
                return "$ " + val + " thousands"
            },
        }
    },
};

const basicColumChart = new ApexCharts(document.querySelector("#basic-colum"), basicColumOptions);
basicColumChart.render();

// dumbell chart //

const dumbbellChartOptions = {
    series: [
        {
            data: [
                {
                    x: '2008',
                    y: [2800, 4500]
                },
                {
                    x: '2009',
                    y: [3200, 4100]
                },
                {
                    x: '2010',
                    y: [2950, 7800]
                },
                {
                    x: '2011',
                    y: [3000, 4600]
                },
                {
                    x: '2012',
                    y: [3500, 4100]
                },
                {
                    x: '2013',
                    y: [4500, 6500]
                },
                {
                    x: '2014',
                    y: [4100, 5600]
                }
            ]
        }
    ],
    chart: {
        height: 350,
        fontFamily: "Rubik, serif",
        type: 'rangeBar',
        zoom: {
            enabled: false
        }
    },
    plotOptions: {
        bar: {
            isDumbbell: true,
            columnWidth: 25,
            dumbbellColors: [['#000000', '#000000']]
        }
    },
    legend: {
        show: true,
        showForSingleSeries: true,
        position: 'top',
        horizontalAlign: 'right',
        customLegendItems: ['Product A', 'Product B'],
    },
    colors: ['#F9C123', '#E14E5A'],
    fill: {
        type: 'gradient',
        gradient: {
            type: 'vertical',
            gradientToColors: ['#E14E5A'],
            inverseColors: true,
            stops: [0, 100]
        }
    },
    grid: {
        show: true,
        borderColor: 'rgba(var(--dark),.2)',
        strokeDashArray: 2,
        xaxis: {
            lines: {
                show: true
            }
        },
        yaxis: {
            lines: {
                show: false
            },
        }
    },
    xaxis: {
        labels: {
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        },
        tickPlacement: 'on'
    },
    yaxis: {
        labels: {
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        },
    },
    tooltip: {
        x: {
            show: false,
        },
        style: {
            fontSize: '16px',
        },
    },
};

const dumbbellChart = new ApexCharts(document.querySelector("#dumbbell-chart"), dumbbellChartOptions);
dumbbellChart.render();

// column chart //
const columnChartOptions = {
    series: [{
        name: 'Servings',
        data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65, 35]
    }],
    chart: {
        fontFamily: "Rubik, serif",
        height: 350,
        type: 'bar',
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            columnWidth: '50%',
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 0
    },
    xaxis: {
        labels: {
            rotate: -45,
            rotateAlways:true,
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        },
        categories: ['Apples', 'Oranges', 'Strawberries', 'Pineapples', 'Mangoes', 'Bananas',
            'Blackberries', 'Pears', 'Watermelons', 'Cherries', 'Pomegranates', 'Tangerines', 'Papayas'
        ],
        tickPlacement: 'on'
    },
    colors: ['#4196FA'],
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'light',
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        },
    },
    grid: {
        show: true,
        borderColor: 'rgba(var(--dark),.2)',
        strokeDashArray: 2,
        row: {
            colors: ["#fff", "#f2f2f2"]
        },
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: true
            },
        }
    },
    tooltip: {
        x: {
            show: false,
        },
        style: {
            fontSize: '16px',
        },
    },
};

const columnChart = new ApexCharts(document.querySelector("#column-chart"), columnChartOptions);
columnChart.render();

// column with marker chart //
const markersChartOptions = {
    series: [
        {
            name: 'Actual',
            data: [
                {
                    x: '2011',
                    y: 1292,
                    goals: [
                        {
                            name: 'Expected',
                            value: 1400,
                            strokeHeight: 5,
                            strokeColor: '#F9C123'
                        }
                    ]
                },
                {
                    x: '2012',
                    y: 4432,
                    goals: [
                        {
                            name: 'Expected',
                            value: 5400,
                            strokeHeight: 5,
                            strokeColor: '#F9C123'
                        }
                    ]
                },
                {
                    x: '2013',
                    y: 5423,
                    goals: [
                        {
                            name: 'Expected',
                            value: 5200,
                            strokeHeight: 5,
                            strokeColor: '#F9C123'
                        }
                    ]
                },
                {
                    x: '2014',
                    y: 6653,
                    goals: [
                        {
                            name: 'Expected',
                            value: 6500,
                            strokeHeight: 5,
                            strokeColor: '#F9C123'
                        }
                    ]
                },
                {
                    x: '2015',
                    y: 8133,
                    goals: [
                        {
                            name: 'Expected',
                            value: 6600,
                            strokeHeight: 13,
                            strokeWidth: 0,
                            strokeLineCap: 'round',
                            strokeColor: '#F9C123'
                        }
                    ]
                },
                {
                    x: '2016',
                    y: 7132,
                    goals: [
                        {
                            name: 'Expected',
                            value: 7500,
                            strokeHeight: 5,
                            strokeColor: '#F9C123'
                        }
                    ]
                },
                {
                    x: '2017',
                    y: 7332,
                    goals: [
                        {
                            name: 'Expected',
                            value: 8700,
                            strokeHeight: 5,
                            strokeColor: '#F9C123'
                        }
                    ]
                },
                {
                    x: '2018',
                    y: 6553,
                    goals: [
                        {
                            name: 'Expected',
                            value: 7300,
                            strokeHeight: 2,
                            strokeDashArray: 2,
                            strokeColor: '#F9C123'
                        }
                    ]
                }
            ]
        }
    ],
    chart: {
        fontFamily: "Rubik, serif",
        height: 350,
        type: 'bar'
    },

    plotOptions: {
        bar: {
            columnWidth: '60%'
        }
    },
    colors: ['#eaea4f'],
    dataLabels: {
        enabled: false
    },
    legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ['Actual', 'Expected'],
        markers: {
            fillColors: ['#F9C123', '#F9C123']
        }
    },
    xaxis: {
        labels: {
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        },
    },
    grid: {
        show: true,
        borderColor: 'rgba(var(--dark),.2)',
        strokeDashArray: 2,
    },

    tooltip: {
        x: {
            show: false,
        },
        style: {
            fontSize: '16px',
        },
    },
};

const markersChart = new ApexCharts(document.querySelector("#markers-chart"), markersChartOptions);
markersChart.render();
