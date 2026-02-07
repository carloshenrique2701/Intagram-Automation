function initEditor() {
  const canvas = document.querySelector('#canvas');
  const ctx = canvas.getContext('2d');

  const uploadImageInput = document.querySelector('#upload-image');
  const slider = document.querySelector('#slider');

  const filterButtons = document.querySelectorAll('.filter-buttons button');

  const rotateLeftBtn = document.querySelector('#rotate-left');
  const rotateRightBtn = document.querySelector('#rotate-right');
  const flipVerticalBtn = document.querySelector('#flip-vertical');
  const resetFiltersBtn = document.querySelector('#reset-filters');
  const saveBtn = document.querySelector('#save');

  const defaultImageUrl =
    'https://raw.githubusercontent.com/Ninja1375/Editor-de-Fotos-Responsivo/main/Logo%20editor%20de%20imagens%20.png';

  let img = new Image();
  let currentFilter = 'brightness';

  let filters = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sepia: 0,
    blur: 0,
    invert: 0,
  };

  img.src = defaultImageUrl;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    applyFilters();
  };

  function applyFilters() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      sepia(${filters.sepia}%)
      blur(${filters.blur}px)
      invert(${filters.invert}%)
    `;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  // 📥 Upload da imagem
  uploadImageInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // 🎚 Slider
  slider.addEventListener('input', () => {
    filters[currentFilter] = slider.value;
    applyFilters();
  });

  // 🎨 Botões de filtro
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.id;
      slider.value = filters[currentFilter];
    });
  });
  
  // Rotação e Inversão da Imagem
  document.getElementById('rotate-left').addEventListener('click', (e) => {
    e.preventDefault();
    rotateImage(-90);
  });

  document.getElementById('rotate-right').addEventListener('click', (e) => {
    e.preventDefault();
    rotateImage(90);
  });

  document.getElementById('flip-vertical').addEventListener('click', (e) => {
    e.preventDefault();
    flipImage();
  });

  // Limpar Filtros
  document.getElementById('reset-filters').addEventListener('click', (e) => {
    e.preventDefault();
    // Restaurar os valores dos filtros
    filters = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
      blur: 0,
      invert: 0,
    };
    applyFilters();
    slider.value = 100; // Resetar o slider para 100%

    // Desativar todos os botões de filtro
    filterButtons.forEach(btn => btn.classList.remove('active'));
  });

  // Funções de rotação e inversão
  function rotateImage(degrees) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = canvas.height;
    tempCanvas.height = canvas.width;

    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((degrees * Math.PI) / 180);
    tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.drawImage(tempCanvas, 0, 0);
    applyFilters();
  }

  function flipImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    applyFilters();
  }
  // 💾 Salvar
  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.download = 'imagem-editada.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}
