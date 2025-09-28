
// Basic site JS: load models, hero slider simple, model detail rendering, tabs, responsive nav, form handling.

const MODELS_FILE = 'data/models.json';

document.addEventListener('DOMContentLoaded', () => {
  // Toggle mobile nav
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  navToggle && navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('show');
  });

  // Load models grid on index
  const modelsGrid = document.getElementById('modelsGrid');
  fetch(MODELS_FILE).then(r=>r.json()).then(data=>{
    // populate models dropdown in contact page
    const select = document.getElementById('model');
    for(const key in data){
      const m = data[key];
      // grid card
      if(modelsGrid){
        const div = document.createElement('div');
        div.className = 'model-card';
        div.innerHTML = `
          <img src="${m.image}" alt="${m.name}">
          <h3>${m.name}</h3>
          <p class="muted">${m.tagline || ''}</p>
          <p class="price">${m.price}</p>
          <a class="btn-small" href="model.html?model=${key}">View Details</a>
        `;
        modelsGrid.appendChild(div);
      }
      // contact form select
      if(select){
        const opt = document.createElement('option');
        opt.value = key;
        opt.innerText = m.name;
        select.appendChild(opt);
      }
    }

    // If on model.html, render specific model
    const modelDetail = document.getElementById('modelDetail');
    if(modelDetail){
      const params = new URLSearchParams(window.location.search);
      const modelKey = params.get('model') || Object.keys(data)[0];
      const model = data[modelKey];
      if(model){
        document.getElementById('modelName').innerText = model.name;
        document.getElementById('modelTagline').innerText = model.tagline || '';
        document.getElementById('modelImage').src = model.hero || model.image;
        document.getElementById('modelPrice').innerText = model.price || '—';
        document.getElementById('overview').innerHTML = '<p>'+ (model.overview || '') +'</p>';
        document.getElementById('features').innerHTML = '<ul>'+(model.features.map(f => '<li>'+f+'</li>').join(''))+'</ul>';
        const specList = document.getElementById('specList');
        specList.innerHTML = '';
        for(const k in model.specs){
          const li = document.createElement('li');
          li.innerText = k + ': ' + model.specs[k];
          specList.appendChild(li);
        }
        // gallery
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = model.gallery.map(u => '<img src="'+u+'" alt="" style="width:48%;margin:1% 1%;">').join('');
        // brochure link (download JSON as simple brochure)
        const brochureBtn = document.getElementById('brochureBtn');
        brochureBtn && brochureBtn.addEventListener('click', (e)=>{
          e.preventDefault();
          const blob = new Blob([JSON.stringify(model, null, 2)],{type:'application/json'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = model.name.replace(/\s+/g,'_') + '_brochure.json';
          a.click();
          URL.revokeObjectURL(url);
        });
      }
    }
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
      const panel = document.getElementById(tab);
      if(panel) panel.style.display = 'block';
    });
  });

  // Contact form simple handler (no backend)
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = form.name.value;
      const email = form.email.value;
      const phone = form.phone.value;
      const model = form.model.value;
      const date = form.date.value;
      const msg = document.getElementById('formMsg');
      msg.innerText = `Thanks ${name}! We've received your request for ${model || 'a test drive'}. We'll contact you at ${email || phone}.`;
      form.reset();
    });
  }

});
