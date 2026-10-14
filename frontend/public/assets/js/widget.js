// 01. salePerformance chart

const revenueChartOptions = {
    chart: {
        height: 260,
        fontFamily: '"Rubik", serif',
        toolbar: { show: false }
    },
    series: [
        {
            type: 'line',
            name: "This week",
            data: [1200, 1900, 3000, 2800, 3500, 4100, 4500],
        },
        {
            type: 'area',
            name: "Last week",
            data: [1500, 1700, 2600, 2900, 3100, 3800, 4000],
        }
    ],
    colors: ['rgba(var(--primary),1)', 'rgba(var(--danger),1)'],
    stroke: {
        curve: 'smooth',
        width: 3
    },
    fill: {
        type: ['solid', 'gradient'],
        colors: ['#e14e5a'],
        gradient: {
            shadeIntensity: 0,
            opacityFrom: 0.8,
            opacityTo: 0.6,
            stops: [0, 90, 100]
        }
    },
    xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        labels: {
            style: {
                colors: 'rgba(var(--dark),.8)',
                fontSize: '14px',
                fontWeight: 500
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: 'rgba(var(--dark),.8)',
                fontSize: '14px'
            }
        }
    },
    grid: {
        borderColor: 'rgba(var(--secondary),.4)',
        padding: {
            top: -20
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right'
    },
    tooltip: {
        enabled: true,
        y: {
            formatter: function (value) {
                return "$" + value;
            }
        },
        x: {
            show: false,
        },
        style: {
            fontSize: '16px',
            fontFamily: '"Rubik", serif',
        },
    },
    // responsive: [{
    //     breakpoint: 768,
    //     options: {
    //         chart: {
    //             height: 210
    //         }
    //     }
    // }]
};

// Render the chart
const revenueChart = new ApexCharts(document.querySelector("#revenueChart"), revenueChartOptions);
revenueChart.render();


// 02. Ecommerce_dashboard js
const earningChartOptions = {
    series: [
        {
            name: 'sales',
            type: 'bar',
            data: [44, 55, 41, 67, 22, 43, 53, 22, 12, 65],
        }, {
            name: 'order',
            type: 'bar',
            data: [-13, -23, -20, -8, -13, -27, -24, -15, -17, -25],
        }
    ],

    chart: {
        height: 210,
        type: 'bar',
        stacked: true,
        fontFamily: '"Rubik", serif',
    },
    dataLabels: {
        enabled: false
    },
    colors: ['rgba(var(--primary), 0.8)', 'rgba(var(--danger), 0.8)'],

    grid: {
        borderColor: 'rgba(var(--dark),0.1)',
        xaxis: {
            lines: {
                show: false
            },
        },
        yaxis: {
            lines: {
                show: true,
            }
        },
    },

    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "20%",
            borderRadius: [2, 2],

            dataLabels: {
                total: {
                    enabled: true,
                    style: {
                        fontSize: '12px',
                        fontWeight: 900
                    }
                }
            },
        },

    },
    legend: {
        show: false,
    },
    xaxis: {
        show: false,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Dec'],
        axisBorder: {
            show: false,
        },
        labels: {
            show: false,
        }
    },
    yaxis: {
        labels: {
            show: false,
        }
    },
    fill: {
        opacity: 1,
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

const earningChart = new ApexCharts(document.querySelector("#earningChart"), earningChartOptions);
earningChart.render();


// 03. profit overview js
const profitOverviewOptions = {
    series: [{
        name: 'Website Blog',
        type: 'column',
        data: [20, 25, 30, 35, 40, 50, 60]
    }, {
        name: 'Social Media',
        type: 'line',
        data: [25, 25, 50, 25, 40],
        color: 'green',
        stroke: {
            curve: 'smooth',
            width: 2
        },
    }],
    chart: {
        height: 180,
        type: 'line',
    },
    colors:['rgba(var(--white),1)','rgba(var(--white),1)'],
    stroke: {
        curve: 'smooth',
        width: [0, 2]
    },

    plotOptions: {
        bar: {
            columnWidth: '4px',
            distributed: true,
            // borderRadius: 8,
        }
    },
    yaxis: {
        show: false,
        labels: {
            show: false
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    xaxis: {
        show: true,
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
            show: true,
            style: {
                colors: '#fff', // Adjust color for visibility if needed
                fontSize: '12px'
            }
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    grid: {
        show: false,
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: false
            }
        },

    },
    tooltip: {
        enabled: false,
    },
    legend: {
        show: false
    },
};

const profitOverview = new ApexCharts(document.querySelector("#profitOverview"), profitOverviewOptions);
profitOverview.render();

// 04. Audience Chart js
const audienceChartOptions = {
    series: [22, 48, 16, 11],
    chart: {
        height: 180,
        type: 'donut'
    },
    plotOptions: {
        pie: {
            startAngle: 10,

            donut: {
                size: '80%',
                dataLabels: {
                    enabled: false
                },
            }
        }
    },
    labels: ['18 - 24 years', '25 - 40 years', '40 - 55 years', '55+ years'],
    colors: ['rgba(var(--primary),1)', 'rgba(var(--primary),.8)', 'rgba(var(--primary),.6)', 'rgba(var(--primary),.4)'],
    legend: {
        show: false
    },
    dataLabels: {
        enabled: false
    },

};

const audienceChart = new ApexCharts(document.querySelector("#audienceChart"), audienceChartOptions);
audienceChart.render();
