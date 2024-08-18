let graph_section_1 = null; // Variable para almacenar el gráfico
let graph_section_2 = null; // Variable para almacenar el gráfico
let array_time = [];
let array_heights = [];
let interval = null;
let time_label = 'Hora'; // Etiqueta del eje X
let height_label = 'Altura (cm)'; // Etiqueta del eje Y
// const array_buttons = Array.from(document.getElementsByClassName('filter_button'));
// const background_color_button = '';

function generate_graphs_of_sections(period_of_time) {
  // activate_button(period_of_time);
  fetch('/api/nivel/1?periodo_de_tiempo=' + period_of_time)
    .then(response => response.json())
    .then(data => {
      handle_json_response(data, period_of_time);
      graph_section_1 = make_graph('graph_1', graph_section_1);
      return fetch('/api/nivel/2?periodo_de_tiempo=' + period_of_time);
    })
    .then(response => response.json())
    .then(data => {
      handle_json_response(data, period_of_time);
      graph_section_2 = make_graph('graph_2', graph_section_2);
      if (period_of_time === 'tiempo_real') {
        if (!interval) {
          interval = setInterval(() => generate_graphs_of_sections('tiempo_real'), 2000);
        }
      } else {
        clearInterval(interval);
        interval = null;
      }
    })
    .catch(error => console.error('Error al obtener los datos:', error));
}

// function activate_button(period_of_time) {
//   array_buttons.forEach(button => {
//     background_color_button = window.getComputedStyle(button).backgroundColor;
//     if (background_color_button === '#0094d3') {
//       button.style.backgroundColor = '#0094d380';
//     }
//   });
//   switch (period_of_time) {
//     case 'tiempo_real':
//       array_buttons[0].style.backgroundColor = '#0094d3';
//       break;
//     case '24_horas':
//       array_buttons[1].style.backgroundColor = '#0094d3';
//       break;
//     case '7_dias':
//       array_buttons[2].style.backgroundColor = '#0094d3';
//       break;
//     case '30_dias':
//       array_buttons[3].style.backgroundColor = '#0094d3';
//       break;
//     case '12_meses':
//       array_buttons[4].style.backgroundColor = '#0094d3';
//   }
// }

function handle_json_response(json_response, period_of_time) {
  switch (period_of_time) {
    case 'tiempo_real':
      array_time = json_response.nivel.map(item => item.hora);
      array_heights = json_response.nivel.map(item => item.altura);
      time_label = 'Hora';
      height_label = 'Altura (cm)';
      break;
    case '24_horas':
      array_time = json_response.nivel.map(item => item.hora);
      array_heights = json_response.nivel.map(item => item.promedio_altura);
      time_label = 'Hora';
      height_label = 'Promedio altura (cm)';
      break;
    case '7_dias':
      array_time = json_response.nivel.map(item => item.dia);
      array_heights = json_response.nivel.map(item => item.promedio_altura);
      time_label = 'Día';
      height_label = 'Promedio altura (cm)';
      break;
    case '30_dias':
      array_time = json_response.nivel.map(item => item.dia);
      array_heights = json_response.nivel.map(item => item.promedio_altura);
      time_label = 'Día';
      height_label = 'Promedio altura (cm)';
      break;
    case '12_meses':
      array_time = json_response.nivel.map(item => item.mes);
      array_heights = json_response.nivel.map(item => item.promedio_altura);
      time_label = 'Mes';
      height_label = 'Promedio altura (cm)';
  }
}

function make_graph(graph_id, graph_section) {
  const context = document.getElementById(graph_id).getContext('2d'); // Se obtiene el contexto del canvas
  if (!graph_section) { // Si no existe una gráfica, se crea
    graph_section = new Chart(context, {
      type: 'line', // Tipo de gráfico
      data: {
        labels: array_time, // Etiquetas del eje X
        datasets: [{
          backgroundColor: '#0094d380',
          borderColor: '#0094d3',
          borderWidth: 1,
          data: array_heights, // Datos del eje Y
          fill: true, // Relleno del gráfico
          label: height_label, // Etiqueta de la gráfica
          pointRadius: 15, // Tamaño de los puntos
          pointHoverRadius: 5, // Tamaño de los puntos al pasar el cursor
          pointHoverBackgroundColor: '#0094d3', // Color de los puntos al pasar el cursor
          pointHoverBorderColor: '#0094d3', // Color del borde de los puntos al pasar el cursor
          pointBackgroundColor: '#0000', // Color de los puntos
          pointBorderColor: '#0000', // Color del borde de los puntos
          tension: 0.5, // Curvatura de las líneas
        }]
      },
      options: {
        responsive: true, // Gráfico responsivo
        scales: {
          x: {
            reverse: true, // Eje X invertido
            title: {
              display: true,
              text: time_label
            }
          },
          y: {
            beginAtZero: true, // Eje Y comienza en 0
            title: {
              display: true,
              text: height_label
            }
          }
        }
      }
    });
  } else { // Si ya existe una gráfica, se actualiza
    graph_section.data.labels = array_time;
    graph_section.data.datasets[0].data = array_heights;
    graph_section.data.datasets[0].label = height_label;
    graph_section.options.scales.x.title.text = time_label;
    graph_section.options.scales.y.title.text = height_label;
    graph_section.update();
  }
  return graph_section;
}

generate_graphs_of_sections('tiempo_real');

window.generate_graphs_of_sections = generate_graphs_of_sections;