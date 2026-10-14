// delete button js //

  $('#account_delete').on('click', function () {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
})

//  chart js
const timeSpentOptions = {
  series: [{
  name: 'Spent Time',
  type: 'column',
  data: [35, 45, 32, 40, 35, 38, 40]
}, {
  name: 'Total Time',
  type: 'line',
  data: [30, 25, 36, 30, 40, 35]
}],
  chart: {
  height: 280,
  type: 'line',
  stacked: false,
},
annotations: {
  points: [{
    x: 'S',
    y: 35,
    marker: {
      size: 5,
      colors: '#fff',
      strokeColor: 'rgba(var(--warning),1)',
      strokeWidth: 4,
      cssClass: 'marker-warning',
    }
  }],
},
stroke: {
  width: [0, 2, 5],
  curve: 'smooth'
},
plotOptions: {
  bar: {
    columnWidth: '80'
  }
},
legend: {
  show: false,
},
colors:['rgba(var(--warning),1)'],
fill: {
  type: ["gradient", "solid"],
  opacity: [0.8, .1],
  gradient: {
    inverseColors: false,
    shade: 'light',
    type: "vertical",
    opacityFrom: 0.1,
    opacityTo: 0.1,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(var(--primary),.1)',
        opacity: 1,
      },
      {
          offset: 50,
          color: 'rgba(var(--primary),.1)',
          opacity: 1,
        },
      {
        offset: 100,
        color: 'rgba(var(--primary),.1)',
        opacity: 1,
      },
    ],
  }
},
markers: {
  size: 0
},
xaxis: {
  type: 'category',
  categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  tooltip: {
      enabled: false
    },
    axisBorder: {
      show: false,
  }
},
yaxis: {
  show: false,
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
  x: {
    show: false,
  },
  style: {
    fontSize: '16px',
    fontFamily: '"Outfit", sans-serif',
  },
},
// responsive: [{
//   breakpoint: 1440,
//   options: {
//     chart: {
//       height: 200
//     },
//   }
// }]
};

const timeSpentChart = new ApexCharts(document.querySelector("#timeSpent"), timeSpentOptions);
timeSpentChart.render();


// language selection //
$(function() {
  $('.select-language').select2();
});

function setupPasswordToggle(toggleId, inputId, iconClass) {
    const toggleBtn = document.querySelector(toggleId);
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.querySelector(iconClass);

    if (!toggleBtn || !passwordInput || !toggleIcon) return;

    toggleBtn.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        toggleIcon.classList.toggle("ph-eye", isPassword);
        toggleIcon.classList.toggle("ph-eye-slash", !isPassword);
    });
}

// Apply to each password field
setupPasswordToggle("#showPassword", "password", ".eyes-icon");
setupPasswordToggle("#showPassword1", "password1", ".eyes-icon1");
setupPasswordToggle("#showPassword2", "password2", ".eyes-icon2");


//  **------image js**
GLightbox({
    touchNavigation: true,
    loop: true,
    width: "90vw",
    height: "90vh",
});

