document.getElementById("generateBtn").addEventListener('click', generateColors);

function generateColors() {
  // Generate three distinct random colors
  const colors = [chroma.random(), chroma.random(), chroma.random()];

  // Apply colors to SVG elements
  document.getElementById("body").setAttribute("fill", colors[0]);
  document.getElementById("button").setAttribute("fill", colors[1]);
  document.getElementById("flame").setAttribute("fill", colors[2]);
}
