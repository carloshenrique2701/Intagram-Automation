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

  const fileNameElement = document.getElementById('fileName');

  const defaultImageUrl =
    '../imgs/img-default.jpeg';

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

  let rotation = 0;
  let flipY = false;

  // =========================
  // LOAD IMAGEM PADRÃO
  // =========================
  img.src = defaultImageUrl;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    applyFilters();
  };

  // =========================
  // APLICA FILTROS + TRANSFORM
  // =========================
  function applyFilters() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      sepia(${filters.sepia}%)
      blur(${filters.blur}px)
      invert(${filters.invert}%)
    `;

    ctx.translate(canvas.width / 2, canvas.height / 2);

    if (flipY) {
      ctx.scale(1, -1);
    }

    ctx.rotate((rotation * Math.PI) / 180);

    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    ctx.restore();
  }

  // =========================
  // UPLOAD DA IMAGEM
  // =========================
  uploadImageInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    fileNameElement.textContent = file.name;
    fileNameElement.classList.add('has-file');

    const reader = new FileReader();
    reader.onload = ev => {
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // =========================
  // SLIDER (BARRA DE INTENSIDADE)
  // =========================
  slider.addEventListener('input', () => {
    filters[currentFilter] = slider.value;
    applyFilters();
  });

  // =========================
  // BOTÕES DE FILTRO
  // =========================
  filterButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.id;
      slider.value = filters[currentFilter];

      if (currentFilter === 'blur') {
        slider.max = 10;
        slider.min = 0;
      } else if (currentFilter === 'invert') {
        slider.max = 100;
        slider.min = 0;
      } else {
        slider.max = 200;
        slider.min = 0;
      }
    });
  });

  // =========================
  // ROTATE & FLIP
  // =========================
  rotateLeftBtn.addEventListener('click', e => {
    e.preventDefault();
    rotation -= 90;
    applyFilters();
  });

  rotateRightBtn.addEventListener('click', e => {
    e.preventDefault();
    rotation += 90;
    applyFilters();
  });

  flipVerticalBtn.addEventListener('click', e => {
    e.preventDefault();
    flipY = !flipY;
    applyFilters();
  });

  // =========================
  // ♻ RESET
  // =========================
  resetFiltersBtn.addEventListener('click', e => {
    e.preventDefault();

    filters = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
      blur: 0,
      invert: 0,
    };

    rotation = 0;
    flipY = false;

    slider.value = 100;
    filterButtons.forEach(btn => btn.classList.remove('active'));

    applyFilters();
  });

  // =========================
  // SALVAR IMAGEM
  // =========================
  saveBtn.addEventListener('click', () => {
    try {
      const dataURL = canvas.toDataURL('image/png');
  
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'imagem-editada.png';
  
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      alert('Não foi possível salvar a imagem.');
      console.error(err);
    }
  });
  
}

//INICIALIZA
document.addEventListener('DOMContentLoaded', initEditor);
