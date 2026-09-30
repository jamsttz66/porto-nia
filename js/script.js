(function(){
  const nav=document.querySelector('.nav nav');
  const burger=document.querySelector('.burger');
  if(burger&&nav){
    burger.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    }));
  }

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals=[...document.querySelectorAll('.reveal')];
  if(reduce||!('IntersectionObserver' in window)){
    reveals.forEach(el=>el.classList.add('visible'));
    document.querySelectorAll('.edu-bar i,.bars i').forEach(el=>el.classList.add('fill'));
  }else{
    const io=new IntersectionObserver((entries)=>{
      entries.forEach((entry,i)=>{
        if(entry.isIntersecting){
          const el=entry.target;
          setTimeout(()=>el.classList.add('visible'), i*70);
          io.unobserve(el);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -60px 0px'});
    reveals.forEach(el=>io.observe(el));

    const barIO=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('fill'); barIO.unobserve(e.target); } });
    },{threshold:.4});
    document.querySelectorAll('.edu-bar i,.bars i').forEach(el=>barIO.observe(el));
  }

  // counters
  const counters=[...document.querySelectorAll('[data-count]')];
  if(counters.length&&!reduce){
    const cIO=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        const el=e.target;
        const target=parseFloat(el.dataset.count);
        const suffix=el.dataset.suffix||'';
        const dec=(String(target).split('.')[1]||'').length;
        let start=null;const dur=1300;
        const step=(ts)=>{
          if(!start) start=ts;
          const p=Math.min((ts-start)/dur,1);
          const eased=1-Math.pow(1-p,3);
          const val=(target*eased).toFixed(dec);
          el.textContent=val+suffix;
          if(p<1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cIO.unobserve(el);
      });
    },{threshold:.5});
    counters.forEach(el=>cIO.observe(el));
  }

  // lightbox untuk dokumentasi & sertifikat
  const lb=document.createElement('div');
  lb.className='lightbox';
  lb.innerHTML='<button aria-label="Tutup">✕</button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lb);
  const lbImg=lb.querySelector('img'), lbCap=lb.querySelector('figcaption'), lbClose=lb.querySelector('button');
  const openLB=(src,alt,cap)=>{
    lbImg.src=src; lbImg.alt=alt||''; lbCap.textContent=cap||'';
    lb.classList.add('open'); document.body.style.overflow='hidden';
  };
  const closeLB=()=>{ lb.classList.remove('open'); document.body.style.overflow=''; lbImg.src=''; };
  document.querySelectorAll('.gal,.cert>img,.job-gallery img').forEach(el=>{
    const img=el.tagName==='IMG'?el:el.querySelector('img');
    if(!img) return;
    const cap=el.dataset?.title||el.querySelector('figcaption b')?.textContent||img.alt||'';
    img.style.cursor='zoom-in';
    img.addEventListener('click',()=>openLB(img.src,img.alt,cap));
  });
  lbClose.addEventListener('click',closeLB);
  lb.addEventListener('click',e=>{ if(e.target===lb) closeLB(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLB(); });

  // subtle parallax on hero blob
  if(!reduce){
    const blob=document.querySelector('.hero-blob');
    if(blob){
      let raf=false;
      window.addEventListener('scroll',()=>{
        if(raf) return;
        raf=true;
        requestAnimationFrame(()=>{
          const y=Math.min(window.scrollY*.18,110);
          blob.style.transform=`translate3d(0,${y}px,0)`;
          raf=false;
        });
      },{passive:true});
    }
  }
})();
