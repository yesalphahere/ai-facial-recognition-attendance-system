// basic bar chart //
const basicBarOptions = {
    series: [{
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
    }],
    chart: {
        fontFamily: "Rubik, serif",
        type: 'bar',
        height: 350
    },
    colors:['#2e5ce2'],
    plotOptions: {
        bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
            'United States', 'China', 'Germany'
        ],
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
    },
};

const basicBarChart = new ApexCharts(document.querySelector("#basic-bar"), basicBarOptions);
basicBarChart.render();


// Patterned bar chart //

const patternedBarOptions = {
    series: [{
        name: 'Marine Sprite',
        data: [44, 55, 41, 37, 22, 43, 21]
    }, {
        name: 'Striking Calf',
        data: [53, 32, 33, 52, 13, 43, 32]
    }, {
        name: 'Tank Picture',
        data: [12, 17, 11, 9, 15, 11, 20]
    }, {
        name: 'Bucket Slope',
        data: [9, 7, 5, 8, 6, 9, 4]
    }],
    chart: {
        fontFamily: "Rubik, serif",
        type: 'bar',
        height: 350,
        stacked: true,
        dropShadow: {
            enabled: true,
            blur: 1,
            opacity: 0.25
        }
    },
    colors:['#0F626A', '#0AB964', "#E14E5A", "#F9C123"],
    plotOptions: {
        bar: {
            horizontal: true,
            barHeight: '60%',
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 2,
    },

    xaxis: {
        categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            },
        },
    },

    yaxis: {
        title: {
            text: undefined
        },
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            },
        },
    },
    fill: {
        type: 'pattern',
        opacity: 1,
        pattern: {
            style: ['circles', 'slantedLines', 'verticalLines', 'horizontalLines'], // string or array of strings

        }
    },
    states: {
        hover: {
            filter: 'none'
        }
    },
    legend: {
        position: 'right',
        offsetY: 40
    },
    grid: {
        show: true,
        borderColor: 'rgba(var(--dark),.2)',
        strokeDashArray: 2,
    },
    tooltip: {
        shared: false,
        y: {
            formatter: function (val) {
                return val + "K"
            }
        },
        x: {
            show: false,
        },
        style: {
            fontSize: '16px',
        },
    },
};

const patternedBarChart = new ApexCharts(document.querySelector("#patterned-bar"), patternedBarOptions);
patternedBarChart.render();


// stacked bar charts //
const stackedChartOptions = {
    series: [{
        name: 'Marine Sprite',
        data: [44, 55, 41, 37, 22, 43, 21]
    }, {
        name: 'Striking Calf',
        data: [53, 32, 33, 52, 13, 43, 32]
    }, {
        name: 'Tank Picture',
        data: [12, 17, 11, 9, 15, 11, 20]
    }, {
        name: 'Bucket Slope',
        data: [9, 7, 5, 8, 6, 9, 4]
    }, {
        name: 'Reborn Kid',
        data: [25, 12, 19, 32, 25, 24, 10]
    }],
    chart: {
        fontFamily: "Rubik, serif",
        type: 'bar',
        height: 350,
        stacked: true,
    },
    colors:["#0F626A" , "#626262", "#0AB964", "#E14E5A", '#F9C123'],
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                total: {
                    enabled: true,
                    offsetX: 0,
                    style: {
                        fontSize: '13px',
                        fontWeight: 900
                    }
                }
            }
        },
    },
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    xaxis: {
        categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            },
        },
    },
    yaxis: {
        title: {
            text: undefined
        },
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
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
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
                return val + "K"
            }
        }
    },
};

const stackedChart = new ApexCharts(document.querySelector("#stacked-chart"), stackedChartOptions);
stackedChart.render();


// Grouped Stacked Bars chart //
const groupedChartOptions = {
    series: [
        {
            name: 'Q1 Budget',
            group: 'budget',
            data: [44000, 55000, 41000, 67000, 22000]
        },
        {
            name: 'Q1 Actual',
            group: 'actual',
            data: [48000, 50000, 40000, 65000, 25000]
        },
        {
            name: 'Q2 Budget',
            group: 'budget',
            data: [13000, 36000, 20000, 8000, 13000]
        },
        {
            name: 'Q2 Actual',
            group: 'actual',
            data: [20000, 40000, 25000, 10000, 12000]
        }
    ],
    chart: {
        fontFamily: "Rubik, serif",
        type: 'bar',
        height: 350,
        stacked: true,
    },
    colors:['#E14E5A', "#4196FA"],
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    dataLabels: {
        formatter: (val) => {
            return val / 1000 + 'K'
        }
    },
    plotOptions: {
        bar: {
            horizontal: true
        }
    },
    xaxis: {
        categories: [
            'Online advertising',
            'Sales Training',
            'Print advertising',
            'Catalogs',
            'Meetings'
        ],
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            },
        },
    },

    fill: {
        opacity: 1,
    },

    legend: {
        position: 'top',
        horizontalAlign: 'left'
    },
    yaxis: {
        labels: {
            style: {
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

const groupedChart = new ApexCharts(document.querySelector("#grouped-chart"), groupedChartOptions);
groupedChart.render();
