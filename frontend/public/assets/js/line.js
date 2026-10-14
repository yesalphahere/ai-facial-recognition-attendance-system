// basic line chart //
const lineChartOption = {
    series: [{
        name: "Desktops",
        data: [10, 51, 35, 51, 59, 62, 79, 91, 148]
    }],
    chart: {
        fontFamily: "Rubik, serif",
        height: 350,
        type: 'line',
        zoom: {
            enabled: false
        }
    },
    colors: ['rgba(var(--primary),1)'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        labels:{
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        }

    },
    yaxis: {
        labels:{
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        }

    },
    grid: {
        show: true,
        borderColor: 'rgba(var(--dark),.2)',
        strokeDashArray: 2,
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: true
            }
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

const lineChart = new ApexCharts(document.querySelector("#line-chart"), lineChartOption);
lineChart.render();

// gradient line chart //
const gradientLineOptions = {
    series: [{
        name: 'Sales',
        data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
    }],
    chart: {
        fontFamily: "Rubik, serif",
        height: 350,
        type: 'line',
    },
    forecastDataPoints: {
        count: 7
    },
    stroke: {
        width: 5,
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001','4/11/2001' ,'5/11/2001' ,'6/11/2001'],
        tickAmount: 10,
        labels: {
            formatter: function(value, timestamp, opts) {
                return opts.dateFormatter(new Date(timestamp), 'dd MMM')
            },
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },

        }
    },
    yaxis: {
        labels:{
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        }

    },

    fill: {
        type: 'gradient',
        gradient: {
            shade: '#26C450',
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            colorStops: [
                {
                    offset: 0,
                    color: "rgba(var(--primary),1)",
                    opacity: 1,
                },
                {
                    offset: 50,
                    color: "rgba(var(--success),1)",
                    opacity: 1,
                },
                {
                    offset: 100,
                    color: "rgba(var(--warning),1)",
                    opacity: .1,
                },
            ],
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
    grid: {
        show: true,
        borderColor: 'rgba(var(--dark),.2)',
        strokeDashArray: 2,
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        },
    },
};

const gradientLineChart = new ApexCharts(document.querySelector("#gradient-chart"), gradientLineOptions);
gradientLineChart.render();


// dashed line chart //

const mixedLineOptions = {
    series: [{
        name: "Session Duration",
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
    },
        {
            name: "Page Views",
            data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
        },
        {
            name: 'Total Visits',
            data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
        }
    ],
    chart: {
        fontFamily: "Rubik, serif",
        height: 350,
        type: 'line',
        zoom: {
            enabled: false
        },
    },
    colors: ['rgba(var(--success),1)', 'rgba(var(--info),1)' , 'rgba(var(--danger),1)'  ],
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
    },

    legend: {
        tooltipHoverFormatter: function(val, opts) {
            return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>'
        }
    },
    markers: {
        size: 0,
        hover: {
            sizeOffset: 6
        }
    },
    xaxis: {
        categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
            '10 Jan', '11 Jan', '12 Jan'
        ],
        labels:{
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        }
    },

    yaxis: {
        labels:{
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        }
    },
    tooltip: {
        style: {
            fontSize: '14px',
        },
        y: [
            {
                title: {
                    formatter: function (val) {
                        return val + " (mins)"
                    }
                }
            },
            {
                title: {
                    formatter: function (val) {
                        return val + " per session"
                    }
                }
            },
            {
                title: {
                    formatter: function (val) {
                        return val;
                    }
                }
            }
        ]
    },
    grid: {
        show: true,
        borderColor: 'rgba(var(--dark),.2)',
        strokeDashArray: 2,
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        },
    },
};

const mixedLineChart = new ApexCharts(document.querySelector("#mixed-chart"), mixedLineOptions);
mixedLineChart.render();


// stepline chart //

const stepLineOptions = {
    series: [{
        data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58]
    }],
    chart: {
        fontFamily: "Rubik, serif",
        type: 'line',
        height: 350
    },
    colors: ['rgba(var(--success),1)'],
    stroke: {
        curve: 'stepline',
    },
    dataLabels: {
        enabled: false
    },

    markers: {
        hover: {
            sizeOffset: 4
        }
    },
    xaxis: {
        labels:{
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        }
    },
    yaxis: {
        labels:{
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        }
    },

    grid: {
        show: true,
        borderColor: 'rgba(var(--dark),.2)',
        strokeDashArray: 2,
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        },
    },
};

const stepLineChart = new ApexCharts(document.querySelector("#step-line-chart"), stepLineOptions);
stepLineChart.render();
