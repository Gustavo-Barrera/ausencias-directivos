// Función para enviar el formulario
document.getElementById('ausenciaForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  // Si se seleccionó "Otros", reemplazar por el texto ingresado
  const tipoSeleccionado = formData.get('tipo');
  if (tipoSeleccionado === 'Otros') {
    const otroTipo = document.getElementById('otroTipoInput').value.trim();
    if (otroTipo !== '') {
      formData.set('tipo', otroTipo);
    }
  }

  const data = Object.fromEntries(formData.entries());

  const res = await fetch('http://localhost:3000/ausencias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    document.getElementById('respuesta').textContent = '¡Ausencia registrada con éxito!';
    e.target.reset();
    document.getElementById('otroTipoContainer').style.display = 'none';
    cargarAusencias(); // Actualiza la lista de ausencias
  } else {
    document.getElementById('respuesta').textContent = 'Error al registrar ausencia.';
  }
});

// Mostrar campo adicional si el tipo es "Otros"
document.addEventListener('DOMContentLoaded', () => {
  const tipoSelect = document.getElementById('tipo');
  const otroTipoContainer = document.getElementById('otroTipoContainer');
  const otroTipoInput = document.getElementById('otroTipoInput');

  tipoSelect.addEventListener('change', () => {
    if (tipoSelect.value === 'Otros') {
      otroTipoContainer.style.display = 'block';
      otroTipoInput.required = true;
    } else {
      otroTipoContainer.style.display = 'none';
      otroTipoInput.required = false;
    }
  });
});

// Función para cargar los nombres desde el archivo JSON
async function cargarNombres() {
  const res = await fetch('nombres_personal.json');
  const nombres = await res.json();

  const select = document.getElementById('nombre');
  nombres.forEach(nombre => {
    const option = document.createElement('option');
    option.value = nombre;
    option.textContent = nombre;
    select.appendChild(option);
  });
}

// Función para cargar las ausencias registradas
async function cargarAusencias() {
  const res = await fetch('http://localhost:3000/ausencias');
  const datos = await res.json();

  const lista = document.getElementById('listaAusencias');
  lista.innerHTML = ''; // Limpiar lista

  datos.forEach(a => {
    const item = document.createElement('li');
    item.textContent = `${a.nombre} - ${a.tipo} (${a.fecha_inicio}, ${a.dias} días)`;
    lista.appendChild(item);
  });
}

// Ejecutar al cargar la página
window.onload = function() {
  cargarAusencias();
  cargarNombres();
};
