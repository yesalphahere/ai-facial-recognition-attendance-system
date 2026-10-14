// basic chart //

const areaChartOptions = {
    series: [{
        name: "Desktops",
        data: [10, 51, 35, 51, 59, 62, 79, 91, 148]
    }],
    chart: {
        fontFamily: "Rubik, serif",
        height: 350,
        type: 'area',
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
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            colorStops: [
                {
                    offset: 0,
                    color: "rgba(var(--primary),1)",
                    opacity: 1,
                },
                {
                    offset: 50,
                    color: "rgba(var(--primary),1)",
                    opacity: 1,
                },
                {
                    offset: 100,
                    color: "rgba(var(--primary),.1)",
                    opacity: .1,
                },
            ],
        }
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

const areaChart = new ApexCharts(document.querySelector("#area-basic-chart"), areaChartOptions);
areaChart.render();

// spline chart //
const spLineChartOptions = {
    series: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
    }, {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41]
    }],
    chart: {
        fontFamily: "Rubik, serif",
        height: 350,
        type: 'area'
    },
    colors: ['#eaea4f', '#147534'],  // Different colors for each series
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 1,
            opacityTo: 0,
            stops: [0, 100],  // Stops for the gradient
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
        labels: {
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: [],
                fontSize: '14px',
                fontWeight: 500,
            },
        }
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
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

const spLineChart = new ApexCharts(document.querySelector("#sp-line-chart"), spLineChartOptions);
spLineChart.render();

// timeseries chart //
const timeSeriesOptions = {
    series: [{
        name: 'PRODUCT A',
        data: [
            [new Date("01/01/2014").getTime(), 4500000],
            [new Date("01/03/2014").getTime(), 4800000],
            [new Date("01/07/2014").getTime(), 4700000],
            [new Date("01/11/2014").getTime(), 4600000],
            [new Date("01/15/2014").getTime(), 4500000]
        ]

    },
        {
            name: 'PRODUCT B',
            data: [
                [new Date("01/02/2014").getTime(), 3500000],
                [new Date("01/06/2014").getTime(), 3600000],
                [new Date("01/10/2014").getTime(), 3400000],
                [new Date("01/14/2014").getTime(), 3500000],
                [new Date("01/18/2014").getTime(), 3700000]
            ]
        }, {
            name: 'PRODUCT C',
            data: [
                [new Date("01/03/2014").getTime(), 2500000],
                [new Date("01/05/2014").getTime(), 2700000],
                [new Date("01/09/2014").getTime(), 2600000],
                [new Date("01/13/2014").getTime(), 2800000],
                [new Date("01/17/2014").getTime(), 3000000]
            ]
        }
    ],
    chart: {
        fontFamily: "Rubik, serif",
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
            enabled: false
        },
    },
    dataLabels: {
        enabled: false
    },
    markers: {
        size: 0,
    },
    colors: ['#0AB964', '#E14E5A', '#F9C123'],
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100]
        },
    },
    yaxis: {
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            },
            offsetX: 0,
            formatter: function(val) {
                return (val / 1000000).toFixed(2); // Format as millions
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
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
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetX: -10
    }
};

const timeSeriesChart = new ApexCharts(document.querySelector("#time-series-chart"), timeSeriesOptions);
timeSeriesChart.render();

// null area chart //

const nullChartOptions = {
    series: [{
        name: 'Network',
        data: [{
            x: 'Dec 23 2017',
            y: null
        },
            {
                x: 'Dec 24 2017',
                y: 44
            },
            {
                x: 'Dec 25 2017',
                y: 31
            },
            {
                x: 'Dec 26 2017',
                y: 38
            },
            {
                x: 'Dec 27 2017',
                y: null
            },
            {
                x: 'Dec 28 2017',
                y: 32
            },
            {
                x: 'Dec 29 2017',
                y: 55
            },
            {
                x: 'Dec 30 2017',
                y: 51
            },
            {
                x: 'Dec 31 2017',
                y: 67
            },
            {
                x: 'Jan 01 2018',
                y: 22
            },
            {
                x: 'Jan 02 2018',
                y: 34
            },
            {
                x: 'Jan 03 2018',
                y: null
            },
            {
                x: 'Jan 04 2018',
                y: null
            },
            {
                x: 'Jan 05 2018',
                y: 11
            },
            {
                x: 'Jan 06 2018',
                y: 4
            },
            {
                x: 'Jan 07 2018',
                y: 15,
            },
            {
                x: 'Jan 08 2018',
                y: null
            },
            {
                x: 'Jan 09 2018',
                y: 9
            },
            {
                x: 'Jan 10 2018',
                y: 34
            },
            {
                x: 'Jan 11 2018',
                y: null
            },
            {
                x: 'Jan 12 2018',
                y: null
            },
            {
                x: 'Jan 13 2018',
                y: 13
            },
            {
                x: 'Jan 14 2018',
                y: null
            }
        ],
    }],
    chart: {
        type: 'area',
        fontFamily: "Rubik, serif",
        height: 350,
        animations: {
            enabled: false
        },
        zoom: {
            enabled: false
        },
    },

    colors: ['rgba(var(--secondary))'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight'
    },
    fill: {
        opacity: 0.8,
        type: 'pattern',
        pattern: {
            style: ['verticalLines', 'horizontalLines'],
            width: 5,
            height: 6
        },
    },
    markers: {
        size: 5,
        hover: {
            size: 9
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
    theme: {
        palette: 'palette1'
    },
    xaxis: {
        type: 'datetime',
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            }
        },
    },
    yaxis: {
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            }
        },
    },

};

const nullChart = new ApexCharts(document.querySelector("#null-chart"), nullChartOptions);
nullChart.render();
