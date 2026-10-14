//  **------radialBar 1**

const radialBar1Options = {
  series: [70],
  chart: {
    fontFamily: "Rubik, serif"  ,
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '70%',
      }
    },
  },
  labels: ['Cricket'],
  colors: [getLocalStorageItem('color-primary','#0F626A')],
  responsive: [{
    breakpoint: 567,
    options: {
      chart: {
        height:250,
      },
    }
  }]
};

const radialBar1chart = new ApexCharts(document.querySelector("#radial-bar1"), radialBar1Options);
radialBar1chart.render();

//  **------radialBar 2**


const radialBar2Options = {
  series: [44, 55, 67, 83],
  chart: {
    fontFamily: "Rubik, serif"  ,
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '22px',
        },
        value: {
          fontSize: '16px',
        },

        total: {
          show: true,
          label: 'Total',
            formatter: () => 249
        }
      }
    }
  },
  labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
  responsive: [{
    breakpoint: 567,
    options: {
      chart: {
        height:250,
      },
    }
  }],
    colors: [hexToRGB(getLocalStorageItem('color-primary', '#0F626A'), 1)],
};

const radialBar2Chart = new ApexCharts(document.querySelector("#radial-bar2"), radialBar2Options);
radialBar2Chart.render();


//  **------radialBar 3**
const radialBar3Options = {
  series: [76, 67, 61, 90],
  chart: {
    fontFamily: "Rubik, serif"  ,
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 270,
      hollow: {
        margin: 5,
        size: '30%',
        background: 'transparent',
        image: undefined,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        }
      }
    }
  },
  colors: [getLocalStorageItem('color-primary','#0F626A'), '#0AB964',getLocalStorageItem('color-secondary','#626262'), '#E14E5A'],
  labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
  legend: {
    show: true,
    floating: true,
    fontSize: '16px',
    position: 'left',
    offsetX: 20,
    offsetY: 20,
    labels: {
      useSeriesColors: true,
    },
    markers: {
      size: 0
    },
    formatter: function(seriesName, opts) {
      return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
    },
    itemMargin: {
      vertical: 3
    }
  },
  responsive: [
    {
      breakpoint: 1550,
      options: {
        legend: {
          offsetX: -5,
          offsetY: 15,
        }
      }
    },
    {
      breakpoint: 567,
      options: {
        chart: {
          height:250,
        },
      }
    },
    {
      breakpoint: 480,
      options: {
        legend: {
          fontSize: '15px',
          offsetX: -30,
          offsetY: -10,
        }
      }
    }]

};

const radialBar3Chart = new ApexCharts(document.querySelector("#radial-bar3"), radialBar3Options);
radialBar3Chart.render();



//  **------radialBar 5**


const radialBar5Options = {
  series: [67],
  chart: {
    fontFamily: "Rubik, serif"  ,
    height: 350,
    type: 'radialBar',
    offsetY: -10
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        name: {
          fontSize: '16px',
          color: undefined,
          offsetY: 120
        },
        value: {
          offsetY: 76,
          fontSize: '22px',
          color: undefined,
          formatter: function (val) {
            return val + "%";
          }
        }
      }
    }
  },
  fill: {
    colors: ['#282632'],
  },
  stroke: {
    dashArray: 4
  },
  labels: ['Median Ratio'],
};

const radialBar5Chart = new ApexCharts(document.querySelector("#radial-bar5"), radialBar5Options);
radialBar5Chart.render();

//  **------radialBar 6**


const radialBar6Options = {
  series: [76],
  chart: {
    height: 410,
    type: 'radialBar',
    offsetY: -20,
    sparkline: {
      enabled: true
    }
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: "#e7e7e7",
        strokeWidth: '97%',
        margin: 5, // margin is in pixels
      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          offsetY: -2,
          fontSize: '22px'
        }
      }
    }
  },
  grid: {
    padding: {
      top: -10
    }
  },
  fill: {
    // type: 'gradient',
    colors: [getLocalStorageItem('color-primary','#106068')],
  },
  labels: ['Average Results'],
  responsive: [{
    breakpoint: 1366,
    options: {
      chart: {
        height:500,
      },
    }
  },{
    breakpoint: 567,
    options: {
      chart: {
        height:250,
      },
    }
  }]
};

const radialBar6Chart = new ApexCharts(document.querySelector("#radial-bar6"), radialBar6Options);
radialBar6Chart.render();

// **------ radialBar 7**


const radialBar7Options = {
  series: [67],
  chart: {
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: '70%',
        image: '../../assets/images/icons/radial-bar-icon/icon-5.png',
        imageWidth: 64,
        imageHeight: 64,
        imageClipped: false
      },
      dataLabels: {
        name: {
          show: false,

        },
        value: {
          show: true,
          color: '#333',
          offsetY: 70,
          fontSize: '22px'
        }
      }
    }
  },
  fill: {
    type: 'image',
    image: {
      src: ['../../assets/images/slick/11.jpg'],
    }
  },
  stroke: {
    lineCap: 'round'
  },
  labels: ['Volatility'],
  responsive: [{
    breakpoint: 567,
    options: {
      chart: {
        height:250,
      },
    }
  }]
};

const radialBar7Chart = new ApexCharts(document.querySelector("#radial-bar7"), radialBar7Options);
radialBar7Chart.render();



//  **------radial-progress 18**
const radialBar8Options = {
  chart: {
    height: 150,
    width: 110,
    type: "radialBar"
  },

  series: [5],

  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: "70%",
        image: '../../assets/images/icons/radial-bar-icon/icon-4.png',
        imageWidth: 80,
        imageHeight: 80,
        imageClipped: false
      },

      dataLabels: {
        showOn: "always",
        name: {
          offsetY: -10,
          show: false,
          fontSize: "15px",
        },
        style: {
          fontSize: '14px',
        },
        value: {
          fontSize: "30px",
          show: false
        }
      }
    }
  },

  stroke: {
    lineCap: "round",
  },
  colors: [hexToRGB(getLocalStorageItem('color-primary','#0F626A'),1)],
  labels: ["Primary"]
};

const radialBar8Chart = new ApexCharts(document.querySelector("#radial-progress18"), radialBar8Options);

radialBar8Chart.render();


//   **------ radial-progress 19**

const radialBar19Options = {
  chart: {
    height: 172,
    width: 200,
    type: "radialBar"
  },

  series: [25],

  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: "70%",
        image: '../../assets/images/icons/radial-bar-icon/icon-2.png',
        imageWidth: 90,
        imageHeight: 90,
        imageClipped: false
      },

      dataLabels: {
        showOn: "always",
        name: {
          offsetY: -10,
          show: false,
          color: hexToRGB(getLocalStorageItem('color-secondary','#8B8476'),1),
          fontSize: "13px"
        },
        value: {
          color: hexToRGB(getLocalStorageItem('color-secondary','#8B8476'),1),
          fontSize: "30px",
          show: false
        }
      }
    }
  },

  stroke: {
    lineCap: "round",
  },
  colors: [hexToRGB(getLocalStorageItem('color-secondary','#8B8476'),1)],
  labels: ["Secondary"]
};

const radialBar19Chart = new ApexCharts(document.querySelector("#radial-progress19"), radialBar19Options);

radialBar19Chart.render();
//  **------radial-progress 20**

const radialBar20Options = {
  chart: {
    height: 190,
    width: 200,
    type: "radialBar"
  },

  series: [57],

  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: "70%",
        image: '../../assets/images/icons/radial-bar-icon/icon-3.png',
        imageWidth: 90,
        imageHeight: 90,
        imageClipped: false
      },

      dataLabels: {
        showOn: "always",
        name: {
          offsetY: -10,
          show: false,
          color: "rgba(var(--success),1)",
          fontSize: "13px"
        },
        value: {
          color: "rgba(var(--success),1)",
          fontSize: "30px",
          show: false
        }
      }
    }
  },

  stroke: {
    lineCap: "round",
  },
  colors: ['rgba(var(--success),1)'],
  labels: ["Success"]
};

const radialBar20Chart = new ApexCharts(document.querySelector("#radial-progress20"), radialBar20Options);

radialBar20Chart.render();
//  **------radial-progress 21**

const radialBar21Options = {
  chart: {
    height: 210,
    width: 200,
    type: "radialBar"
  },

  series: [78],

  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: "65%",
        image: '../../assets/images/icons/radial-bar-icon/icon-4.png',
        imageWidth: 110,
        imageHeight: 110,
        imageClipped: false
      },

      dataLabels: {
        showOn: "always",
        name: {
          offsetY: -10,
          show: false,
          color: "rgba(var(--danger),1)",
          fontSize: "13px"
        },
        value: {
          color: "rgba(var(--danger),1)",
          fontSize: "30px",
          show: false
        }
      }
    }
  },

  stroke: {
    lineCap: "round",
  },
  colors: ['rgba(var(--danger),1)'],
  labels: ["Danger"]
};

const radialBar21Chart = new ApexCharts(document.querySelector("#radial-progress21"), radialBar21Options);

radialBar21Chart.render();
//  **------radial-progress 22**
const radialBar22Options = {
  chart: {
    height: 230,
    width: 200,
    type: "radialBar"
  },

  series: [88],

  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: "60%",
        image: '../../assets/images/icons/radial-bar-icon/icon-5.png',
        imageWidth: 110,
        imageHeight: 110,
        imageClipped: false
      },

      dataLabels: {
        showOn: "always",
        name: {
          offsetY: -10,
          show: false,
          color: "rgba(var(--warning),1)",
          fontSize: "13px"
        },
        value: {
          color: "rgba(var(--warning),1)",
          fontSize: "30px",
          show: false
        }
      }
    }
  },

  stroke: {
    lineCap: "round",
  },
  colors: ['rgba(var(--warning),1)'],
  labels: ["Warning"]
};

const radialBar22Chart = new ApexCharts(document.querySelector("#radial-progress22"), radialBar22Options);

radialBar22Chart.render();


const radialBar23Options = {
  chart: {
    height: 250,
    width: 200,
    type: "radialBar"
  },

  series: [95],

  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: "55%",
        image: '../../assets/images/icons/radial-bar-icon/icon-6.png',
        imageWidth: 110,
        imageHeight: 110,
        imageClipped: false
      },

      dataLabels: {
        showOn: "always",
        name: {
          offsetY: -10,
          show: false,
          color: "rgba(var(--info),1)",
          fontSize: "13px"
        },
        value: {
          color: "rgba(var(--info),1)",
          fontSize: "30px",
          show: false
        }
      }
    }
  },

  stroke: {
    lineCap: "round",
  },
  colors: ['rgba(var(--info),1)'],
  labels: ["Info"]
};

const radialBar23Chart = new ApexCharts(document.querySelector("#radial-progress23"), radialBar23Options);

radialBar23Chart.render();


const radialBar24Option = {
  chart: {
    height: 280,
    width: 200,
    type: "radialBar"
  },

  series: [100],

  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: "55%",
        image: '../../assets/images/icons/radial-bar-icon/icon-8.png',
        imageWidth: 120,
        imageHeight: 120,
        imageClipped: false
      },

      dataLabels: {
        showOn: "always",
        name: {
          offsetY: -10,
          show: false,
          color: "rgba(var(--dark),1)",
          fontSize: "13px"
        },
        value: {
          color: "rgba(var(--dark),1)",
          fontSize: "30px",
          show: false
        }
      }
    }
  },

  stroke: {
    lineCap: "round",
  },
  colors: ['rgba(var(--dark),1)'],
  labels: ["dark"]
};

const radialBar24Chart = new ApexCharts(document.querySelector("#radial-progress24"), radialBar24Option);

radialBar24Chart.render();

