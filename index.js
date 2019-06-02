let store = {
  curTool: 'paint_bucket',
  curColor: 'green',
  prevColor: '',
  divs: {},
};
let count = 0;
let intervalId;
let frames = [];

function saveStore() {
  localStorage.setItem('store', JSON.stringify(store));
}

function loadStore() {
  try {
    const json = localStorage.getItem('store');
    store = JSON.parse(json) || store;
    document.querySelectorAll('#canvas > div').forEach(d => {
      if (store.divs[d.id]) {
        d.style.backgroundColor = store.divs[d.id].color;
        d.style.borderRadius = store.divs[d.id].border;
      }
    });
  } catch (err) {
    console.error(err);
  }
}

function paintBucket(e) {
  e.target.style.backgroundColor = store.curColor;
  if (!store.divs[e.target.id]) {
    store.divs[e.target.id] = {};
  }
  store.divs[e.target.id].color = store.curColor;
  saveStore();
}

function chooseColor(e) {
  store.curColor = e.target.style.backgroundColor || 'lightblue';
}

function transform(e) {
  if (e.target.style.borderRadius) {
    e.target.style.borderRadius = '';
  } else {
    e.target.style.borderRadius = '50%';
  }

  if (!store.divs[e.target.id]) {
    store.divs[e.target.id] = {};
  }
  store.divs[e.target.id].border = e.target.style.borderRadius;
  saveStore();
}

function dispatcher(e) {
  switch (store.curTool) {
    case 'paint_bucket':
      return paintBucket(e);
    case 'choose_color':
      return chooseColor(e);
    case 'transform':
      return transform(e);
  }
}

function setTool(e) {
  store.curTool = e.target.id;
  saveStore();
}

// q - paint bucket, w - choose color, a - transform
function setToolByKey(e) {
  switch (e.keyCode) {
    case 81:
      store.curTool = 'paint_bucket';
      break;
    case 87:
      store.curTool = 'choose_color';
      break;
    case 65:
      store.curTool = 'transform';
      break;
  }
  saveStore();
}

function setColor(e) {
  store.prevColor = store.curColor;
  store.curColor = e.target.id;
  document.querySelector('#current>div').style.backgroundColor = store.curColor;
  document.querySelector('#prev>div').style.backgroundColor = store.prevColor;
  saveStore();
}

function createPreview() {
  const preview = document.createElement('div');
  preview.setAttribute('id', `frame-preview-${count}`);
  preview.setAttribute('class', `frame-preview-${count}`);
  preview.innerHTML = `
        <img id='delete' src='./assets/delete.png' alt='delete'/>
        <img id='copy' src='./assets/copy.png'/ alt='copy'>`;
  return preview;
}

function addPreview() {
  const preview = createPreview();
  let item = {
    id: `frame-preview-${count++}`,
    color: document.querySelector('#figure_1').style.backgroundColor,
    isActive: false,
  };
  frames.push(item);
  document.querySelector('#preview').appendChild(preview);
}

function selectActiveFrame(e) {
  frames.forEach(item => {
    if (item.id == e.target.id) {
      item.isActive = true;
      e.target.classList.add('active');
      document.querySelector('#canvas > div').style.backgroundColor =
        e.target.style.backgroundColor;
    }
    if (item.id != e.target.id && item.isActive == true) {
      document.querySelector(`#${item.id}`).classList.remove('active');
      item.isActive = false;
    }
  });
}

function updatePreview(e) {
  window.setInterval(update, 500);
  function update() {
    frames.forEach(item => {
      if (item.isActive == true) {
        document.querySelector(`#${item.id}`).style.backgroundColor =
          e.target.style.backgroundColor;
        item.color = e.target.style.backgroundColor;
      }
    });
  }
}

function startAnimation(value) {
  if (!frames.length) {
    return;
  }
  colorIndex = 0;
  function animate() {
    document.querySelector('#animation').style.backgroundColor =
      frames[colorIndex].color;
    colorIndex = (colorIndex + 1) % frames.length;
  }
  intervalId = window.setInterval(animate, 1000 / value);
}

function changeInterval(e) {
  if (e.target.value == '0') {
    window.clearInterval(intervalId);
    return;
  }
  window.clearInterval(intervalId);
  startAnimation(e.target.value);
}

function deleteFrame(e) {
  frames = frames.filter(item => item.id != e.target.parentNode.id);
  e.target.parentNode.remove();
}

function copyFrame(e) {
  const copied = createPreview();
  copied.style.backgroundColor = e.target.parentNode.style.backgroundColor;
  document
    .querySelector('#preview')
    .insertBefore(copied, document.querySelector(`#${e.target.parentNode.id}`));
}

function init() {
  loadStore();

  document.querySelector('#add').addEventListener('click', e => {
    e.preventDefault();
    addPreview();
    document.querySelectorAll('#preview > div').forEach(d => {
      d.addEventListener('click', selectActiveFrame);
    });

    document.querySelectorAll('#delete').forEach(d => {
      d.addEventListener('click', deleteFrame);
    });

    document.querySelectorAll('#copy').forEach(d => {
      d.addEventListener('click', copyFrame);
    });
  });

  document.querySelector('#fps').addEventListener('input', changeInterval);

  document.querySelectorAll('#canvas > div').forEach(d => {
    d.addEventListener('click', updatePreview);
    d.addEventListener('click', dispatcher);
    d.addEventListener('mousedown', dispatcher);
    d.addEventListener('mouseup', dispatcher);
  });

  document.addEventListener('keydown', setToolByKey);

  document
    .querySelectorAll('#pallete li')
    .forEach(li => li.addEventListener('click', setTool));

  document
    .querySelectorAll('#color-config li')
    .forEach(li => li.addEventListener('click', setColor));
}

init();
