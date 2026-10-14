// Ecommerce_dashboard js

// Earnings chart
const earningChartOptions = {
    series: [
        {
            name: 'sales',
            type: 'bar',
            data: [44, 55, 41, 67, 22, 43, 53, 22, 12, 65],
        },
        {
            name: 'order',
            type: 'bar',
            data: [-13, -23, -20, -8, -13, -27, -24, -15, -17, -25],
        }
    ],
    chart: {
        height: 242,
        type: 'bar',
        stacked: true,
        fontFamily: '"Rubik", serif',
        offsetX: 0,
        offsetY: 0
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
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        }
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
            }
        }
    },
    legend: {
        show: false
    },
    xaxis: {
        show: false,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Dec'],
        axisBorder: {
            show: false
        },
        labels: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        show: false,
        labels: {
            show: false
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        x: {
            show: false
        },
        style: {
            fontSize: '16px'
        }
    }
};

const earningChart = new ApexCharts(document.querySelector("#earningChart"), earningChartOptions);
earningChart.render();


// Sale Performance Chart
const revenueChartOptions = {
    chart: {
        height: 230,
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
            show: false
        },
        style: {
            fontSize: '16px',
            fontFamily: '"Rubik", serif'
        }
    }
};

const revenueChart = new ApexCharts(document.querySelector("#revenueChart"), revenueChartOptions);
revenueChart.render();


// Glightbox JS
const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    width: "40vw",
    height: "40vh",
    zoomable: true
});
