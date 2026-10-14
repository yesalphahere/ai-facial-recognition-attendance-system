//  **------radar chart 1**

const radar1options = {
    series: [{
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
    }],
    chart: {
        fontFamily: 'Montserrat, system-ui',
        height: 350,
        type: 'radar',
    },

    colors: [getLocalStorageItem('color-primary','#0F626A')],
    xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June']
    }
};

const radar1chart = new ApexCharts(document.querySelector("#radar1"), radar1options);
radar1chart.render();

//  **------radar chart 2**

const radar2options = {
    series: [{
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
    }, {
        name: 'Series 2',
        data: [20, 30, 40, 80, 20, 80],
    }, {
        name: 'Series 3',
        data: [44, 76, 78, 13, 43, 10],
    }],
    chart: {
        height: 350,
        type: 'radar',
        dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1
        }
    },

    stroke: {
        width: 2
    },
    fill: {
        opacity: 0.1
    },
    markers: {
        size: 0
    },
    xaxis: {
        categories: ['2011', '2012', '2013', '2014', '2015', '2016']
    },
    colors: [getLocalStorageItem('color-secondary','#626262'),'#0AB964','#E14E5A',],
};

const radar2chart = new ApexCharts(document.querySelector("#radar2"), radar2options);
radar2chart.render();

//  **------radar chart 3**

const radar3options = {
    series: [{
        name: 'Series 1',
        data: [20, 100, 40, 30, 50, 80, 33],
    }],
    chart: {
        fontFamily: 'Montserrat, system-ui',
        height: 350,
        type: 'radar',
    },
    dataLabels: {
        enabled: true
    },
    plotOptions: {
        radar: {
            size: 140,
            polygons: {
                strokeColors: '#e9e9e9',

            }
        }
    },

    colors: ['#F9D249'],
    markers: {
        size: 4,
        colors: ['#fff'],
        strokeColor: '#eaea4f',
        strokeWidth: 2,
    },
    tooltip: {
        y: {
            formatter: function(val) {
                return val
            }
        }
    },
    xaxis: {
        categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    yaxis: {
        tickAmount: 7,
        labels: {
            formatter: function(val, i) {
                if (i % 2 === 0) {
                    return val
                } else {
                    return ''
                }
            }
        }
    }
};

const radar3chart = new ApexCharts(document.querySelector("#radar3"), radar3options);
radar3chart.render();

