(function(){
  document.documentElement.classList.remove('no-js');
  /* every page opens at the top, not mid-page or shifted sideways */
  try{ if('scrollRestoration' in history) history.scrollRestoration = 'manual' }catch(e){}
  function toTop(){ if(!location.hash){ window.scrollTo(0,0); document.documentElement.scrollLeft = 0; document.body.scrollLeft = 0 } }
  toTop(); window.addEventListener('load', toTop);
  var $ = function(s,c){return (c||document).querySelector(s)};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* mobile drawer */
  var drawer = $('#drawer'), mb = $('#menuBtn'), mc = $('#menuClose');
  function setDrawer(open){
    if(!drawer) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if(mb) mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if(open && mc) mc.focus();
  }
  if(mb) mb.addEventListener('click', function(){ setDrawer(true) });
  if(mc) mc.addEventListener('click', function(){ setDrawer(false) });
  if(drawer) drawer.addEventListener('click', function(e){ if(e.target === drawer) setDrawer(false) });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setDrawer(false) });

  /* cinematic wipes on media blocks */
  $$('.svc-media, .work, .poster, .bts-p, .bts-v, .aud-item, .fcard').forEach(function(el){ if(el.querySelector('img,video')) el.classList.add('wipe') });
  /* reveal on scroll */
  var rv = $$('.rv, .kw, .wipe');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target) } });
    },{rootMargin:'0px 0px -8% 0px', threshold:.08});
    rv.forEach(function(el){ io.observe(el) });
  } else { rv.forEach(function(el){ el.classList.add('in') }) }

  /* back to top */
  var tt = $('#toTop');
  if(tt){
    window.addEventListener('scroll', function(){ tt.classList.toggle('show', window.scrollY > 700) }, {passive:true});
    tt.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}) });
  }

  /* reel sound */
  var reel = $('#reel'), snd = $('#sound');
  if(reel && snd){
    snd.addEventListener('click', function(){
      var on = reel.muted;
      reel.muted = !on;
      if(on){ var p = reel.play(); if(p && p.catch) p.catch(function(){}) }
      snd.setAttribute('aria-pressed', on ? 'true' : 'false');
      snd.innerHTML = on ? '<span class="ms" aria-hidden="true">volume_up</span>Sound off' : '<span class="ms" aria-hidden="true">volume_off</span>Sound on';
    });
  }

  /* copy helpers */
  function copyText(txt, btn, label){
    function done(ok){
      if(!btn) return;
      var old = label || btn.textContent;
      btn.textContent = ok ? 'Copied' : 'Select & copy';
      setTimeout(function(){ btn.textContent = old }, 1600);
    }
    try{
      navigator.clipboard.writeText(txt).then(function(){ done(true) }, function(){ done(false) });
    }catch(e){ done(false) }
  }
  $$('.copy[data-copy]').forEach(function(b){
    b.addEventListener('click', function(){ copyText(b.getAttribute('data-copy'), b, 'Copy') });
  });

  /* work filters */
  var fb = $$('.filters button');
  fb.forEach(function(b){
    b.addEventListener('click', function(){
      var f = b.getAttribute('data-f');
      fb.forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false') });
      $$('.work[data-cat]').forEach(function(w){
        w.classList.toggle('hide', f !== 'all' && w.getAttribute('data-cat').indexOf(f) === -1);
      });
    });
  });

  /* brief builder */
  var form = $('#brief');
  if(form){
    var pv = $('#pv'), pa = $('#pa'), wa = $('#wa'), cp = $('#cp'), er = $('#err'), msgText = '';
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var svcs = $$('#svc input:checked').map(function(i){ return i.value });
      var bud = ($('#bud input:checked') || {}).value || 'Not sure yet';
      var nm = $('#nm').value.trim(), co = $('#co').value.trim(), msg = $('#msg').value.trim();
      if(!svcs.length){ er.textContent = 'Pick at least one service.'; er.classList.add('show'); return }
      if(!nm){ er.textContent = 'Please add your name.'; er.classList.add('show'); $('#nm').focus(); return }
      er.classList.remove('show');
      msgText = 'Hi iCube Media! 👋\n\n' +
        'Name: ' + nm + '\n' +
        (co ? 'Business: ' + co + '\n' : '') +
        'Services: ' + svcs.join(', ') + '\n' +
        'Budget: ' + bud + '\n' +
        (msg ? '\nProject: ' + msg + '\n' : '');
      pv.textContent = msgText;
      pv.classList.add('show'); pa.classList.add('show');
      wa.href = 'https://wa.me/919310896048?text=' + encodeURIComponent(msgText);
      pv.scrollIntoView({behavior:'smooth', block:'nearest'});
    });
    if(cp) cp.addEventListener('click', function(){ copyText(msgText, cp, 'Copy text') });
  }

  /* icons: if the icon font cannot load (offline), hide icon names instead of showing raw words */
  try{
    document.fonts.load('24px "Material Symbols Rounded"', 'home').then(function(f){
      if(!f || !f.length) document.documentElement.classList.add('no-icons');
    }, function(){ document.documentElement.classList.add('no-icons') });
    setTimeout(function(){ if(!document.fonts.check('24px "Material Symbols Rounded"', 'home')) document.documentElement.classList.add('no-icons') }, 4000);
  }catch(e){}

  /* BTS videos: play only while on screen, tap the speaker for sound */
  var bv = $$('.bts-v video');
  if(bv.length && 'IntersectionObserver' in window){
    var vio = new IntersectionObserver(function(es){
      es.forEach(function(e){
        var v = e.target;
        if(e.isIntersecting){ var p = v.play(); if(p && p.catch) p.catch(function(){}) } else { v.pause() }
      });
    },{threshold:.35});
    bv.forEach(function(v){ vio.observe(v) });
  }
  $$('.bts-sound').forEach(function(b){
    b.addEventListener('click', function(){
      var v = b.parentNode.querySelector('video'); if(!v) return;
      var on = v.muted;
      bv.forEach(function(o){ if(o !== v){ o.muted = true } });
      $$('.bts-sound').forEach(function(o){ if(o !== b){ o.setAttribute('aria-pressed','false'); o.innerHTML = '<span class="ms" aria-hidden="true">volume_off</span>' } });
      v.muted = !on;
      if(on){ var p = v.play(); if(p && p.catch) p.catch(function(){}) }
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
      b.innerHTML = '<span class="ms" aria-hidden="true">' + (on ? 'volume_up' : 'volume_off') + '</span>';
    });
  });

  /* featured film: muted live preview when on screen, full film with sound on click */
  $$('.film').forEach(function(f){
    var id = f.getAttribute('data-id'), pv = f.querySelector('.film-preview'), screen = f.querySelector('.film-screen');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(pv && !reduce && 'IntersectionObserver' in window){
      var fio = new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting && !pv.src){ pv.src = pv.getAttribute('data-src'); pv.addEventListener('load', function(){ setTimeout(function(){ f.classList.add('playing-preview') }, 600) }) }
        });
      },{rootMargin:'200px'});
      fio.observe(f);
    }
    function play(){
      if(f.classList.contains('is-playing')) return;
      var full = document.createElement('iframe');
      full.className = 'film-full';
      full.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      full.title = 'PPS Annual Function film';
      full.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      full.setAttribute('allowfullscreen','');
      screen.appendChild(full);
      f.classList.add('is-playing');
      if(pv){ pv.src = 'about:blank' }
    }
    var btn = f.querySelector('.film-play');
    if(btn) btn.addEventListener('click', play);
    if(screen) screen.addEventListener('click', function(){ play() });
  });

  /* intro: camera focus-lock, once per visit */
  var intro = $('#intro');
  if(intro){
    var seen = false; try{ seen = sessionStorage.getItem('icubeIntro') === '1' }catch(e){}
    var reduce2 = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(seen || reduce2){ intro.parentNode.removeChild(intro) }
    else{
      document.body.style.overflow = 'hidden';
      var finish = function(){ intro.classList.add('zoom'); setTimeout(function(){ intro.classList.add('done'); document.body.style.overflow = ''; setTimeout(function(){ if(intro.parentNode) intro.parentNode.removeChild(intro) }, 700) }, 450) };
      var t = setTimeout(finish, 2100);
      intro.addEventListener('click', function(){ clearTimeout(t); finish() });
      try{ sessionStorage.setItem('icubeIntro','1') }catch(e){}
    }
  }

  /* viewfinder: running timecode + rotating status */
  var tcs = $$('.tc'), vfMsg = $('#vfMsg');
  if(tcs.length){
    var t0 = Date.now();
    setInterval(function(){
      var ms = Date.now() - t0, f = Math.floor(ms / 40) % 25, sec = Math.floor(ms / 1000);
      var pad = function(n){ return (n < 10 ? '0' : '') + n };
      var v = '00:' + pad(Math.floor(sec / 60) % 60) + ':' + pad(sec % 60) + ':' + pad(f);
      tcs.forEach(function(el){ el.textContent = v });
    }, 40);
  }
  if(vfMsg){
    var msgs = ['Framing your story', 'Lighting the brand', 'Grading the colour', 'Cutting for Instagram', 'Ready to grow'], mi = 0;
    setInterval(function(){ mi = (mi + 1) % msgs.length; vfMsg.textContent = msgs[mi] }, 3600);
  }

  /* scroll zoom on the hero frame */
  var art = $('.hero-art');
  if(art && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
    var ticking = false;
    window.addEventListener('scroll', function(){
      if(ticking) return; ticking = true;
      requestAnimationFrame(function(){
        var p = Math.min(Math.max(window.scrollY / 700, 0), 1);
        art.style.transform = 'scale(' + (1 + p * .05).toFixed(3) + ') translateY(' + (p * -18).toFixed(1) + 'px)';
        ticking = false;
      });
    }, {passive:true});
  }

  var y = $('#yr'); if(y) y.textContent = new Date().getFullYear();
})();
