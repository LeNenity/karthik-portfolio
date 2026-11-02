(() => {
  const root=document.documentElement;
  const themeButton=document.getElementById('all-theme-toggle');
  const themeIcon=document.getElementById('all-theme-icon');
  function updateTheme(theme){
    root.dataset.theme=theme;
    themeButton.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');
    themeIcon.setAttribute('icon',theme==='dark'?'lucide:sun':'lucide:moon');
    try{localStorage.setItem('karthik-beige-theme',theme);}catch{}
  }
  let savedTheme;
  try{savedTheme=localStorage.getItem('karthik-beige-theme');}catch{}
  updateTheme(savedTheme==='dark'?'dark':'light');
  themeButton.addEventListener('click',()=>updateTheme(root.dataset.theme==='dark'?'light':'dark'));

  const lightbox=document.getElementById('internship-lightbox');
  document.querySelectorAll('.intern-photo [data-photo]').forEach(button=>{
    button.addEventListener('click',()=>{
      const image=lightbox.querySelector('img');
      image.src=button.dataset.photo;
      image.alt=button.dataset.alt;
      lightbox.showModal();
    });
  });
  lightbox.querySelector('.ed-lightbox-close').addEventListener('click',()=>lightbox.close());
  lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close();});

})();
