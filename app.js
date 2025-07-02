function generateColors() {
  const palette = chroma.scale(['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0']).mode('lch').colors(3);

  document.getElementById("body").setAttribute("fill", palette[0]);
  document.getElementById("button").setAttribute("fill", palette[1]);
  document.getElementById("flame").setAttribute("fill", palette[2]);
}
