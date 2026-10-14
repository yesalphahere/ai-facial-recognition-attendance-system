// **------ pie_charts 1**
const pie1Options = {
    series: [44, 55, 13, 43, 22],
    chart: {
        fontFamily: "Rubik, serif",
        height: 340,
        type: 'pie',
    },
    tooltip: {
        x: {
            show: false,
        },
        style: {
            fontSize: '16px',
        },
    },
    colors: [getLocalStorageItem('color-primary','#0F626A'),getLocalStorageItem('color-secondary','#626262'),'#0AB964','#E14E5A','#F9C123'],
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    legend: {
        position: 'bottom'
    },
    responsive: [{
        breakpoint: 1366,
        options: {
            chart: {

                height: 250
            },
            legend: {
                show: false,
            },
        }
    }]
};

const pie1Chart = new ApexCharts(document.querySelector("#pie1"), pie1Options);
pie1Chart.render();

// updating donuts chart //
const pie9Options = {
    series: [44, 55, 13, 33],
    chart: {
        height: 340,
        type: 'donut',
    },
    dataLabels: { enabled: false },
    markers: {
        colors: [
            getLocalStorageItem('color-primary', '#0F626A'),
            getLocalStorageItem('color-secondary', '#626262'),
            '#0AB964', '#E14E5A', '#F9C123', '#4196FA', '#C8B9D2', '#28232D'
        ]
    },
    fill: {
        colors: [
            getLocalStorageItem('color-primary', '#0F626A'),
            getLocalStorageItem('color-secondary', '#626262'),
            '#0AB964', '#E14E5A', '#F9C123', '#4196FA', '#C8B9D2', '#28232D'
        ]
    },
    labels: ["Device 1", "Device 2", "Device 3", "Device 4"],
    colors: [
        getLocalStorageItem('color-primary', '#0F626A'),
        getLocalStorageItem('color-secondary', '#626262'),
        '#0AB964', '#E14E5A', '#F9C123', '#4196FA', '#C8B9D2', '#28232D'
    ],
    responsive: [{
        breakpoint: 1366,
        options: {
            chart: { height: 240 },
            legend: { show: false }
        }
    }],
    legend: {
        position: 'bottom',
        offsetY: 0,
    },
    tooltip: {
        x: { show: false },
        style: { fontSize: '16px' }
    },
};

// Global chart instance
let pie9OChart = null;

document.addEventListener("DOMContentLoaded", function () {
    // Initialize chart
    const chartEl = document.querySelector("#chart9");
    if (!chartEl) return;

    pie9OChart = new ApexCharts(chartEl, pie9Options);
    pie9OChart.render();

    // Button references
    const addBtn = document.querySelector("#add");
    const removeBtn = document.querySelector("#remove");
    const resetBtn = document.querySelector("#reset");

    // Helper functions
    const appendData = () => {
        const arr = pie9OChart.w.globals.series.slice();
        arr.push(Math.floor(Math.random() * 100) + 1);
        return arr;
    };

    const removeData = () => {
        const arr = pie9OChart.w.globals.series.slice();
        arr.pop();
        return arr;
    };

    const reset = () => [44, 55, 13, 33];

    // Event listeners
    addBtn?.addEventListener("click", () => pie9OChart.updateSeries(appendData()));
    removeBtn?.addEventListener("click", () => pie9OChart.updateSeries(removeData()));
    resetBtn?.addEventListener("click", () => pie9OChart.updateSeries(reset()));
});


// simple donut chart //
const polarOptions = {
    series: [14, 23, 21, 17, 15],
    height: 600,
    chart: {
        fontFamily: "Rubik, serif",
        type: 'polarArea',
    },
    stroke: {
        colors: ['#fff']
    },
    fill: {
        opacity: 0.8
    },
    legend: {
        position: 'bottom'
    },
    colors: [getLocalStorageItem('color-primary','#106068'),getLocalStorageItem('color-secondary','#606060'), '#0bb462', '#db4d58', '#f2bc23'],
    responsive: [{
        breakpoint: 1366,
        options: {
            chart: {
                height:250,
            },
        }
    }]
};

const polarChart = new ApexCharts(document.querySelector("#polar1"), polarOptions);
polarChart.render();

// patterned donut chart //
const chart4Options = {
    series: [44, 55, 41, 17, 15],
    chart: {
        fontFamily: "Rubik, serif",
        height: 380,
        type: 'donut',
        dropShadow: {
            enabled: true,
            color: '#111',
            top: -1,
            left: 3,
            blur: 3,
            opacity: 0.2
        }
    },
    stroke: {
        width: 0,
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    total: {
                        showAlways: true,
                        show: true
                    }
                }
            }
        }
    },
    labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
    dataLabels: {
        dropShadow: {
            blur: 3,
            opacity: 0.8
        }
    },
    fill: {
        type: 'pattern',
        opacity: 1,
        pattern: {
            enabled: true,
            style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
        },
    },
    states: {
        hover: {
            filter: 'none'
        }
    },
    theme: {
        palette: 'palette2'
    },
    title: {
        text: "Favourite Movie Type"
    },
    legend: {
        position: 'bottom',
    },
    responsive: [{
        breakpoint: 1366,
        options: {
            chart: {
                height: 250
            },
            legend: {
                show: false,
            },
        }
    }],
    colors: [getLocalStorageItem('color-primary','#106068'),getLocalStorageItem('color-secondary','#606060'),'#0bb462','#db4d58','#f2bc23'],
};

const chart4Chart = new ApexCharts(document.querySelector("#chart4"), chart4Options);
chart4Chart.render();


// pie chart with img //
const chart5Options = {
    series: [44, 33, 54, 45],
    chart: {

        height: 340,
        type: 'pie',
    },
    colors: [getLocalStorageItem('color-primary','#106068'),getLocalStorageItem('color-secondary','#606060'),'#0bb462','#db4d58','#f2bc23'],
    fill: {
        type: 'image',
        opacity: 0.85,
        image: {
            src: ['../assets/images/blog-app/03.jpg', '../assets/images/blog-app/03.jpg', '../assets/images/blog-app/03.jpg', '../assets/images/blog-app/03.jpg'],
            width: 25,
            imagedHeight: 25
        },
    },
    stroke: {
        width: 4
    },
    legend: {
        position: 'bottom',
    },
    dataLabels: {
        enabled: true,
        style: {
            colors: ['#111']
        },
        background: {
            enabled: true,
            foreColor: '#fff',
            borderWidth: 0
        }
    },
};

const chart5Chart = new ApexCharts(document.querySelector("#chart5"), chart5Options);
chart5Chart.render();
