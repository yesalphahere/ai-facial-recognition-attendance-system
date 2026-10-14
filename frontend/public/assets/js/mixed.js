// Line & Column Chart //
const mixed1ChartOptions = {
  series: [{
    name: 'Website Blog',
    type: 'column',
    data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
  }, {
    name: 'Social Media',
    type: 'line',
    data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
  }],
  chart: {
    fontFamily: "Rubik, serif",
    height: 350,
    type: 'line',
  },
  colors:['#0F626A', "#626263"],
  stroke: {
    width: [0, 4]
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1]
  },

  labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
  yaxis: [{
    labels: {
      style: {
        fontSize: '14px',
        fontWeight: 500,
      },
    },
  },
    {
      opposite: true,

    }],
  xaxis: {
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

const mixed1Chart = new ApexCharts(document.querySelector("#mixed1"), mixed1ChartOptions);
mixed1Chart.render();



// ----- multiple y-axis chart ---- //
const mixed2ChartOptions = {
  series: [{
    name: 'Income',
    type: 'column',
    data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
  }, {
    name: 'Cashflow',
    type: 'column',
    data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5]
  }, {
    name: 'Revenue',
    type: 'line',
    data: [20, 29, 37, 36, 44, 45, 50, 58]
  }],
  chart: {
    fontFamily: "Rubik, serif",
    height: 350,
    type: 'line',
    stacked: false
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: [1, 1, 4]
  },
  title: {
    text: '',
    align: 'left',
    offsetX: 110
  },
  xaxis: {
    categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
    labels: {
      style: {
        fontSize: '14px',
        fontWeight: 500,
      },
    },

  },

  colors: ['#0F626A', '#E14E5A', '#4196FA'],
  yaxis: [
    {
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#AECC34'
      },
      labels: {
        style: {
          colors: '#008FFB',
          fontSize: '14px',
          fontWeight: 500,
        }
      },
      title: {
        text: "",
        style: {
          color: '#008FFB',
        }
      },
      tooltip: {
        enabled: true
      }
    },
    {
      seriesName: 'Income',
      opposite: true,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#00E396'
      },
      labels: {
        style: {
          colors: '#00E396',
        }
      },
      title: {
        text: "",
        style: {
          color: '#00E396',
        }
      },
    },
    {
      seriesName: 'Revenue',
      opposite: true,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#FEB019'
      },
      labels: {
        style: {
          colors: '#FEB019',
        },
      },
      title: {
        text: "",
        style: {
          color: '#FEB019',
        }
      }
    },
  ],
  tooltip: {
      x: {
          show: false,
      },
      style: {
          fontSize: '16px',
      },
    fixed: {
      enabled: true,
      position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
      offsetY: 30,
      offsetX: 60
    },
  },
  legend: {
    horizontalAlign: 'left',
    offsetX: 40
  },
  grid: {
    show: true,
    borderColor: 'rgba(var(--dark),.2)',
    strokeDashArray: 2,
  },
};

const mixed2Chart = new ApexCharts(document.querySelector("#mixed2"), mixed2ChartOptions);
mixed2Chart.render();


// Line & Area Chart //
const mixed3ChartOptions = {
  series: [{
    name: 'TEAM A',
    type: 'area',
    data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33]
  }, {
    name: 'TEAM B',
    type: 'line',
    data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43]
  }],
  chart: {
    fontFamily: "Rubik, serif",
    height: 350,
    type: 'line',
  },
  stroke: {
    curve: 'smooth'
  },
  fill: {
    type: 'solid',
    opacity: [0.35, 1],
  },

  colors: ['#0AB964', '#0F626A'],
  labels: ['Dec 01', 'Dec 02', 'Dec 03', 'Dec 04', 'Dec 05', 'Dec 06', 'Dec 07', 'Dec 08', 'Dec 09 ', 'Dec 10', 'Dec 11'],
  markers: {
    size: 0
  },

  xaxis: {
    labels: {
      style: {
        fontSize: '14px',
        fontWeight: 500,
      },
    },

  },
  yaxis: [
    {
      title: {
        text: '',

      },
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 500,
        },
      },
    },
    {
      opposite: true,
      title: {
        text: '',
      },
    },

  ],
  tooltip: {
    shared: true,
    intersect: false,
      x: {
          show: false,
      },
      style: {
          fontSize: '16px',
      },
    y: {
      formatter: function (y) {
        if (typeof y !== "undefined") {
          return y.toFixed(0) + " points";
        }
        return y;
      }
    }
  },
  grid: {
    show: true,
    borderColor: 'rgba(var(--dark),.2)',
    strokeDashArray: 2,
  }
};

const mixed3Chart = new ApexCharts(document.querySelector("#mixed3"), mixed3ChartOptions);
mixed3Chart.render();



// Line, Column & Area Chart //

const mixed4ChartOptions = {
  series: [{
    name: 'TEAM A',
    type: 'column',
    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
  }, {
    name: 'TEAM B',
    type: 'area',
    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
  }, {
    name: 'TEAM C',
    type: 'line',
    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
  }],
  chart: {
    fontFamily: "Rubik, serif",
    height: 350,
    type: 'line',
    stacked: false,
  },
  stroke: {
    width: [0, 2, 5],
    curve: 'smooth'
  },
  plotOptions: {
    bar: {
      columnWidth: '50%'
    }
  },


  fill: {
    opacity: [0.85, 0.25, 1],
    gradient: {
      inverseColors: false,
      shade: 'light',
      type: "vertical",
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100, 100, 100]
    }
  },
  labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003',
    '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
  ],
  markers: {
    size: 0
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        fontSize: '14px',
        fontWeight: 500,
      },
    },
  },

  colors: [getLocalStorageItem('color-primary','#0F626A'),getLocalStorageItem('color-secondary','#626262'), '#0AB964'],
  yaxis: {
    title: {
      text: '',
    },
    labels: {
      style: {
        fontSize: '14px',
        fontWeight: 500,
      },
    },
    min: 0
  },
  tooltip: {
    shared: true,
    intersect: false,
      x: {
          show: false,
      },
      style: {
          fontSize: '16px',
      },
    y: {
      formatter: function (y) {
        if (typeof y !== "undefined") {
          return y.toFixed(0) + " points";
        }
        return y;

      }
    }
  },
  grid: {
    show: true,
    borderColor: 'rgba(var(--dark),.2)',
    strokeDashArray: 2,
  }
};

const mixed4Chart = new ApexCharts(document.querySelector("#mixed4"), mixed4ChartOptions);
mixed4Chart.render();

