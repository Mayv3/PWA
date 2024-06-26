function calcularCaloriasQuemadas(tipoActividad, duracion) {
  const esfuerzo = {
    correr: 10,
    caminar: 3.8,
    ejercicioDemandante: 8,
  };

  const pesoPromedio = 70;
  const tipoDeActividad = esfuerzo[tipoActividad];
  return (tipoDeActividad * 3.5 * pesoPromedio * duracion) / 200;
}
