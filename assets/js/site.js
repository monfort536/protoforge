'use strict';
// Static demo storage is intentionally local. No production auth or server upload is implied.
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
// Resolve navigation from the project folder for both file previews and HTTP.
const siteRoot = new URL('../../', document.currentScript.src);
const siteUrl = path => new URL(path.replace(/^\/+/, ''), siteRoot).href;
const pageRoute = '/' + (document.body.dataset.page || 'index.html');
const read = (key, fallback = null) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let user = read('protoforge_current_user');
if (!user || typeof user.email !== 'string' || typeof user.id === 'undefined') user = null;
const ownerKey = kind => `protoforge_${kind}_${user?.id}`;
const projects = () => user ? read(ownerKey('projects'), []) : [];
const money = n => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format(n);
const localNotice = 'Browser storage could not be updated. Check available space and your browser privacy settings.';
const status = (id, message, error = false) => { const node = $(id); if(node){ node.textContent = message; node.classList.toggle('error',error); } };
function loginUrl(){return siteUrl('login.html?next='+encodeURIComponent(pageRoute+location.search));}
function logout(){localStorage.removeItem('protoforge_current_user');user=null;renderAuthUI();location.assign(siteUrl('index.html'));}
const accountItems=[['My Orders','orders'],['Uploaded Designs','models'],['Profile','profile']];
function renderAuthUI(){
 const guest=`<a href="${siteUrl('dashboard/client-dashboard.html')}">Dashboard</a><a href="${siteUrl('login.html')}">Login</a>`;
 if(user){
  const dashboardLink=`<a href="${siteUrl('dashboard/client-dashboard.html')}">Dashboard</a>`;
  const accountLinks=accountItems.map(([t,r])=>`<a href="${siteUrl(`dashboard/${r}.html`)}">${t}</a>`).join('');
  const account=dashboardLink+'<details class="nav-drop"><summary>Account</summary><div class="dropdown"><span class="small muted" style="display:block;padding:8px 12px">'+escapeHTML(user.name||'Your workspace')+'</span>'+accountLinks+'<button type="button" data-logout>Sign Out</button></div></details>';
  const drawerAccount=dashboardLink+accountLinks+'<button type="button" data-logout>Sign Out</button>';
  $$('[data-account]').forEach(node=>node.innerHTML=account);
  $$('[data-drawer-account]').forEach(node=>node.innerHTML=drawerAccount);
  $$('[data-footer-account]').forEach(node=>node.innerHTML=accountItems.map(([t,r])=>`<li><a href="${siteUrl(`dashboard/${r}.html`)}">${t}</a></li>`).join(''));
  $$('[data-user-name]').forEach(node=>node.textContent=user.name?.split(' ')[0]||'maker');
 }else{
  $$('[data-account]').forEach(node=>node.innerHTML=guest);
  $$('[data-drawer-account]').forEach(node=>node.innerHTML=guest);
  $$('[data-footer-account]').forEach(node=>node.innerHTML=`<li><a href="${siteUrl('login.html')}">Sign In</a></li><li><a href="${siteUrl('register.html')}">Create Account</a></li>`);
 }
 $$('[data-logout]').forEach(button=>button.onclick=logout);
}
function setTheme(theme){const dark=theme==='dark';document.documentElement.dataset.theme=theme;localStorage.setItem('protoforge_theme',theme);$$('[data-theme-toggle]').forEach(b=>{b.textContent=b.hasAttribute('data-nav-toggle')?(dark?'Light':'Dark'):(dark?'Light mode':'Dark mode');b.setAttribute('aria-label',dark?'Use light theme':'Use dark theme');b.title=dark?'Use light theme':'Use dark theme';});}
function setDirection(dir){const rtl=dir==='rtl';document.documentElement.dir=dir;localStorage.setItem('protoforge_direction',dir);$$('[data-direction-toggle]').forEach(b=>{b.textContent=b.hasAttribute('data-nav-toggle')?(rtl?'LTR':'RTL'):(rtl?'LTR layout':'RTL layout');b.setAttribute('aria-label',rtl?'Switch to left-to-right layout':'Switch to right-to-left layout');b.title=rtl?'Switch to left-to-right layout':'Switch to right-to-left layout';});}
try {setTheme(localStorage.getItem('protoforge_theme')||'light');setDirection(localStorage.getItem('protoforge_direction')||'ltr');}catch{}
renderAuthUI();
const clientWorkspace=pageRoute.startsWith('/dashboard/')&&!pageRoute.startsWith('/dashboard/admin-');
if(document.body.dataset.protected && !user && !clientWorkspace) location.replace(loginUrl());
else $('#main')?.classList.remove('protected');
$$('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')));
$$('[data-direction-toggle]').forEach(b=>b.addEventListener('click',()=>setDirection(document.documentElement.dir==='rtl'?'ltr':'rtl')));
const menuButton=$('.menu-toggle'), navigation=$('#navigation'), drawerOverlay=$('[data-drawer-overlay]'), drawerClose=$('[data-drawer-close]');
function closeNavigation(){navigation?.classList.remove('open');drawerOverlay?.classList.remove('open');document.body.classList.remove('drawer-open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Open navigation');}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('open',open);drawerOverlay?.classList.toggle('open',open);document.body.classList.toggle('drawer-open',open);});
drawerClose?.addEventListener('click',closeNavigation);
drawerOverlay?.addEventListener('click',closeNavigation);
$$('#navigation a').forEach(a=>a.addEventListener('click',closeNavigation));
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeNavigation();});
document.addEventListener('focusin',e=>{$$('details.nav-drop[open]').forEach(d=>{if(!d.contains(e.target))d.open=false;});if(!e.target.closest('.header'))closeNavigation();});
matchMedia('(min-width:1280px)').addEventListener('change',e=>{if(e.matches)closeNavigation();});
document.addEventListener('click',e=>{$$('details.nav-drop[open]').forEach(d=>{if(!d.contains(e.target))d.open=false;});});
$$('details.nav-drop').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)$$('details.nav-drop').forEach(other=>{if(other!==d)other.open=false;});}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=$('details.nav-drop[open]');if(open){open.open=false;$('summary',open).focus();}else if(navigation?.classList.contains('open')){closeNavigation();menuButton.focus();}}});
$$('.navigation a').forEach(a=>{if(new URL(a.href).pathname===location.pathname||(location.pathname==='/'&&a.pathname==='/index.html')){a.classList.add('active');a.setAttribute('aria-current','page');a.closest('details')?.querySelector('summary')?.classList.add('active');}});
const parentRoute=pageRoute.startsWith('/application-')?'/products.html':/^\/(creative-service-|services2|service-details\.html)/.test(pageRoute)?'/services.html':null;
if(parentRoute){const parent=$$('.navigation a').find(a=>a.href===siteUrl(parentRoute));parent?.classList.add('active');parent?.closest('details')?.querySelector('summary')?.classList.add('active');}
$$('[data-password]').forEach(b=>b.addEventListener('click',()=>{const input=document.getElementById(b.dataset.password);const show=input.type==='password';input.type=show?'text':'password';b.textContent=show?'Hide':'Show';b.setAttribute('aria-label',show?'Hide password':'Show password');}));
$$('[data-auth-switch]').forEach(a=>{const next=new URLSearchParams(location.search).get('next');if(next)a.href+='?next='+encodeURIComponent(next);});
const hex = bytes => [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
async function passwordHash(password,salt){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
 return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:150000,hash:'SHA-256'},key,256));
}
$('#registerForm')?.addEventListener('submit',async e=>{
 e.preventDefault();const form=e.currentTarget,button=$('button[type=submit]',form);status('#auth-status','');
 const name=$('#name').value.trim(),email=$('#email').value.trim().toLowerCase(),password=$('#password').value;
 if(!name)return status('#auth-status','Enter your name.',true);
 if(password!==$('#confirm-password').value)return status('#auth-status','The passwords do not match.',true);
 const users=read('protoforge_users',[]);if(users.some(u=>u.email.toLowerCase()===email))return status('#auth-status','An account with this email already exists in this browser. Sign in instead.',true);
 button.disabled=true;
 try{const salt=hex(crypto.getRandomValues(new Uint8Array(16)));const account={id:crypto.randomUUID(),name,email,salt,hash:await passwordHash(password,salt),role:'client'};users.push(account);write('protoforge_users',users);localStorage.removeItem('protoforge_current_user');localStorage.setItem('protoforge_auth_notice','Registration successful. Your account is ready—sign in to continue.');location.assign(siteUrl('/login.html'));}
 catch{status('#auth-status',localNotice+' Use localhost or HTTPS for account features.',true);button.disabled=false;}
});
$('#loginForm')?.addEventListener('submit',async e=>{
 e.preventDefault();const button=$('button[type=submit]',e.currentTarget);button.disabled=true;status('#auth-status','');
 try{const email=$('#email').value.trim().toLowerCase(),password=$('#password').value;const users=read('protoforge_users',[]);const account=users.find(u=>u.email.toLowerCase()===email);const valid=account&&(account.hash?await passwordHash(password,account.salt)===account.hash:account.password===password);
 if(!valid){status('#auth-status','Email or password is incorrect. Accounts are local to the browser where they were created.',true);return;}
 // Migrate legacy plaintext demo credentials on successful sign-in.
 if(account.password){account.salt=hex(crypto.getRandomValues(new Uint8Array(16)));account.hash=await passwordHash(password,account.salt);delete account.password;write('protoforge_users',users);}
 user={id:account.id,name:account.name,email:account.email,role:'client'};write('protoforge_current_user',user);renderAuthUI();status('#auth-status','Login successful. Your account is now authenticated.');
 }catch{status('#auth-status',localNotice,true);}finally{button.disabled=false;}
});
if(/\/login\.html$/.test(location.pathname)){
  const clearLoginFields=()=>{const form=$('#loginForm');if(!form)return;form.setAttribute('autocomplete','off');$('#email').setAttribute('autocomplete','off');$('#password').setAttribute('autocomplete','new-password');form.reset();$('#email').value='';$('#password').value='';};
  clearLoginFields();
  window.addEventListener('pageshow',clearLoginFields);
 const notice=localStorage.getItem('protoforge_auth_notice');
 if(notice){localStorage.removeItem('protoforge_auth_notice');status('#auth-status',notice);}
}
const materialData=[{id:'pla',name:'PLA',process:'FDM',rate:.15},{id:'petg',name:'PETG',process:'FDM',rate:.22},{id:'abs',name:'ABS',process:'FDM',rate:.25},{id:'tpu',name:'TPU',process:'FDM',rate:.35},{id:'resin',name:'Resin',process:'SLA',rate:.40},{id:'nylon',name:'Nylon',process:'SLS',rate:.55},{id:'carbon-fiber',name:'Carbon Fiber',process:'FDM',rate:.75},{id:'metal-composite',name:'Metal Composite',process:'FDM',rate:.95}];
function updateEstimate(form){
 // File/project validity does not prevent configuration estimates.
 const fields=['weight','quantity'];if(fields.some(id=>{const field=$('#'+id,form);return window.ProtoForgeValidation?.validateField(field,false)===false||!field.checkValidity();})){['print','material','finish','discount','total','time'].forEach(id=>$('#cost-'+id).textContent='—');return;}
 const mat=materialData.find(m=>m.id===$('#material',form).value),w=+$('#weight',form).value,q=+$('#quantity',form).value,quality=+$('#quality',form).value,finish=$('#finish',form).value;
 const material=mat.rate*w*q,print=(5+w*.05)*quality*q*({FDM:1,SLA:1.8,SLS:2.3}[mat.process]),finishing=({raw:0,sanded:8,painted:18}[finish])*q,discount=(material+print+finishing)*(q>=10&&q<25?.1:q>=5&&q<10?.05:0);
 const estimate={material,print,finishing,discount,total:material+print+finishing-discount,days:Math.ceil(q/10)+2+(quality>1?1:0)+(finish==='raw'?0:2)};
 $('#cost-print').textContent=money(print);$('#cost-material').textContent=money(material);$('#cost-finish').textContent=money(finishing);$('#cost-discount').textContent='−'+money(discount);$('#cost-total').textContent=money(estimate.total);$('#cost-time').textContent=estimate.days+'–'+(estimate.days+2)+' working days';return estimate;
}
const configForm=$('#calculatorForm')||$('#uploadForm');
if(configForm){
 const technology=$('#technology'),material=$('#material');
 function syncMaterials(){const old=material.value;material.innerHTML=materialData.filter(m=>m.process===technology.value).map(m=>`<option value="${m.id}">${m.name}</option>`).join('');if([...material.options].some(o=>o.value===old))material.value=old;updateEstimate(configForm);}
 technology.addEventListener('change',syncMaterials);configForm.addEventListener('input',()=>updateEstimate(configForm));configForm.addEventListener('change',()=>updateEstimate(configForm));
 const params=new URLSearchParams(location.search);
 const service=params.get('service');
 const serviceProcess={'fdm-printing':'FDM','sla-printing':'SLA','sls-printing':'SLS'};
 if(serviceProcess[service])technology.value=serviceProcess[service];
 const preset=materialData.find(m=>m.id===params.get('material'));if(preset)technology.value=preset.process;syncMaterials();if(preset)material.value=preset.id;
 for(const key of ['weight','quantity','quality','finish','colour']){const field=$('#'+key,configForm),value=params.get(key);if(value!==null){if(field.tagName==='SELECT'){if([...field.options].some(o=>o.value===value))field.value=value;}else{const previous=field.value;field.value=value;if(!field.checkValidity())field.value=previous;}}}
 updateEstimate(configForm);
 if(service&&$('#notes'))$('#notes').value='Requested service: '+service.replace(/-/g,' ').slice(0,100)+'.';
 $$('#calculatorForm a').find(a=>a.href===siteUrl('upload-design.html'))?.addEventListener('click',e=>{if(!window.ProtoForgeValidation.validateForm(configForm)){e.preventDefault();return;}const config=new URLSearchParams();for(const key of ['material','weight','quantity','quality','finish','colour'])config.set(key,$('#'+key).value);e.currentTarget.href=siteUrl('upload-design.html?'+config);});
 const application=new URLSearchParams(location.search).get('application');
 if(application&&$('#project-name')){$('#project-name').value=application.replace(/-/g,' ').slice(0,100);$('#notes').value='Application: '+application.replace(/-/g,' ').slice(0,100)+'. Please review the process and material for my design.';}
 if($('#uploadForm')&&user){try{const pending=JSON.parse(sessionStorage.getItem('protoforge_pending_design'));if(pending&&Date.now()-pending.saved<3600000){technology.value=pending.technology;syncMaterials();for(const [key,value] of Object.entries(pending.fields)){const input=$('#'+key,configForm);if(input)input.value=value;}updateEstimate(configForm);status('#upload-status','Your project settings are restored. Select your model file again to save the draft.');sessionStorage.removeItem('protoforge_pending_design');}}catch{}}
 $('#calculatorForm')?.addEventListener('submit',e=>e.preventDefault());
}
function openFiles(){return new Promise((resolve,reject)=>{const req=indexedDB.open('protoforge_design_files',1);req.onupgradeneeded=()=>req.result.createObjectStore('files');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function fileStore(action,id,file){const db=await openFiles();return new Promise((resolve,reject)=>{const tx=db.transaction('files',action==='get'?'readonly':'readwrite');const store=tx.objectStore('files');const request=action==='put'?store.put(file,id):action==='delete'?store.delete(id):store.get(id);tx.oncomplete=()=>{resolve(request.result);db.close();};tx.onerror=()=>{reject(tx.error);db.close();};tx.onabort=()=>{reject(tx.error);db.close();};});}
let selectedFile=null;
function chooseFile(file){
 selectedFile=null;const input=$('#design-file');input.setCustomValidity('');
 if(!file){$('#file-name').textContent='';return;}
 if(!/\.(stl|obj|step|stp|3mf)$/i.test(file.name)||file.size===0||file.size>50*1024*1024){input.value='';input.setCustomValidity('Choose a non-empty STL, OBJ, STEP or 3MF file up to 50 MB.');status('#upload-status','Choose a non-empty STL, OBJ, STEP or 3MF file up to 50 MB.',true);$('#file-name').textContent='';return;}
 selectedFile=file;$('#file-name').textContent=file.name+' · '+(file.size/1024/1024).toFixed(2)+' MB';status('#upload-status','');
 if(!$('#project-name').value)$('#project-name').value=file.name.replace(/\.[^.]+$/,'').slice(0,100);
}
$('#design-file')?.addEventListener('change',e=>chooseFile(e.target.files[0]));
const dropzone=$('#dropzone');
if(dropzone){['dragenter','dragover'].forEach(type=>dropzone.addEventListener(type,e=>{e.preventDefault();dropzone.classList.add('dragging');}));['dragleave','drop'].forEach(type=>dropzone.addEventListener(type,e=>{e.preventDefault();dropzone.classList.remove('dragging');}));dropzone.addEventListener('drop',e=>{const file=e.dataTransfer.files[0];chooseFile(file);if(selectedFile){const transfer=new DataTransfer();transfer.items.add(file);$('#design-file').files=transfer.files;}});}
$('#uploadForm')?.addEventListener('submit',async e=>{
 e.preventDefault();if(!selectedFile)return status('#upload-status','Choose a design file to continue.',true);
 if(!user){let kept=false;try{const fields=Object.fromEntries(['project-name','material','weight','quantity','quality','finish','colour','notes'].map(key=>[key,$('#'+key).value]));sessionStorage.setItem('protoforge_pending_design',JSON.stringify({saved:Date.now(),technology:$('#technology').value,fields}));kept=true;}catch{}status('#upload-status','Sign in to save this project. '+(kept?'Your settings will be restored. ':'')+'After signing in, select your file again.');const a=document.createElement('a');a.href=loginUrl();a.textContent='Sign In to Save';a.className='btn';$('#upload-status').append(document.createElement('br'),a);return;}
 const form=e.currentTarget,button=$('button[type=submit]',form);button.disabled=true;let savedId;
 try{const estimate=updateEstimate(form);if(!estimate)throw new Error('Invalid configuration');const id=crypto.randomUUID();savedId=id;await fileStore('put',user.id+':'+id,selectedFile);
 const project={id,owner:user.id,name:$('#project-name').value.trim(),fileName:selectedFile.name,size:selectedFile.size,technology:$('#technology').value,material:$('#material').value,weight:+$('#weight').value,quantity:+$('#quantity').value,quality:$('#quality').value,finish:$('#finish').value,colour:$('#colour').value,notes:$('#notes').value,estimate,status:'Draft quote',created:new Date().toISOString()};
 const list=projects();list.unshift(project);write(ownerKey('projects'),list);try{sessionStorage.removeItem('protoforge_pending_design');}catch{}location.assign(siteUrl('/dashboard/quotes.html'));
 }catch{if(savedId)await fileStore('delete',user.id+':'+savedId).catch(()=>{});status('#upload-status','Could not save your design. '+localNotice,true);button.disabled=false;}
});
$('#contactForm')?.addEventListener('submit',async e=>{
 e.preventDefault();const form=e.currentTarget,button=$('button[type=submit]',form);button.disabled=true;status('#contact-status','Sending your enquiry…');
 try{const response=await fetch('https://formsubmit.co/ajax/clament.iq@outlook.com',{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});const result=await response.json();if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Not accepted');form.reset();status('#contact-status','Your enquiry was accepted by the contact service.');}
 catch{status('#contact-status','Your message could not be sent. Your entries are preserved; retry or email clament.iq@outlook.com.',true);}finally{button.disabled=false;}
});
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$$('[data-category]').forEach(card=>card.hidden=b.dataset.filter!=='All'&&card.dataset.category!==b.dataset.filter);}));
const recommendations={fdm:['Start with FDM.','An affordable way to check shape, fit and assembly in PLA or PETG.','fdm-printing.html'],sla:['Start with SLA / resin.','Smooth surfaces and small details for visual prototypes and presentation models.','sla-printing.html'],sls:['Explore SLS / nylon.','Complex geometry and tough nylon parts without traditional support structures.','sls-printing.html'],tpu:['Explore TPU.','Flexible printed parts for grips, protective covers and compliant geometry.','material-tpu.html'],cf:['Explore carbon-fiber composite.','A stiff, lightweight starting point for fixtures and structural prototypes.','material-carbon-fiber.html']};
function recommend(){const [title,desc,url]=recommendations[$('#recommend').value];$('#recommend-result').innerHTML=`<h3>${title}</h3><p>${desc}</p><a class="text-link" href="${siteRoot}${url}">Explore this option ↗</a>`;}
if($('#recommend')){$('#recommend').addEventListener('change',recommend);recommend();}
$$('[data-save-material]').forEach(b=>{if(user&&read(ownerKey('saved_materials'),[]).includes(b.dataset.saveMaterial))b.textContent='Saved · Remove';b.addEventListener('click',()=>{if(!user){location.assign(loginUrl());return;}try{let saved=read(ownerKey('saved_materials'),[]);const exists=saved.includes(b.dataset.saveMaterial);saved=exists?saved.filter(x=>x!==b.dataset.saveMaterial):[...saved,b.dataset.saveMaterial];write(ownerKey('saved_materials'),saved);b.textContent=exists?'Save material':'Saved · Remove';$('[data-save-status]').textContent=exists?'Removed from your saved materials.':'Saved to your workspace.';}catch{$('[data-save-status]').textContent=localNotice;}});});
if($('#profileForm')&&user){const profile=read(ownerKey('profile'),{});$('#profile-name').value=user.name||'';$('#profile-email').value=user.email;for(const key of ['phone','company','address'])$('#profile-'+key).value=profile[key]||'';$('#profileForm').addEventListener('submit',e=>{e.preventDefault();try{const name=$('#profile-name').value.trim();if(!name)return status('#profile-status','Enter your name.',true);const profile={phone:$('#profile-phone').value,company:$('#profile-company').value,address:$('#profile-address').value};write(ownerKey('profile'),profile);user.name=name;write('protoforge_current_user',user);const users=read('protoforge_users',[]);const account=users.find(x=>x.id===user.id);if(account){account.name=name;write('protoforge_users',users);}status('#profile-status','Your profile has been saved.');}catch{status('#profile-status',localNotice,true);}});}
const empty=(title,desc,cta='Upload Your Design',url='/dashboard/upload-design.html')=>`<div class="empty"><span class="blue" aria-hidden="true" style="font-size:32px">◇</span><h3>${title}</h3><p>${desc}</p><a class="btn" href="${siteUrl(url)}">${cta}</a></div>`;
function projectRows(list,mode){return list.map(p=>`<article class="project-row" data-search="${escapeHTML((p.name+' '+p.fileName).toLowerCase())}"><div><span class="tag">${escapeHTML(p.status)}</span><strong>${escapeHTML(p.name)}</strong><p>${escapeHTML(p.fileName)} · ${escapeHTML(p.technology)} / ${escapeHTML(p.material.toUpperCase())} · Qty ${p.quantity}</p><p>${money(p.estimate.total)} estimated · ${new Date(p.created).toLocaleDateString()}</p></div><div class="actions">${mode==='quotes'&&p.status==='Draft quote'?`<button class="btn" data-confirm="${p.id}">Create Demo Order</button>`:''}<button class="btn secondary" data-download="${p.id}">Download Model</button><button class="filter" data-delete="${p.id}">Delete</button></div></article>`).join('');}
function renderDashboard(){
 if(window.ProtoForgeDashboard?.render){window.ProtoForgeDashboard.render();return;}
 const root=$('#dashboard-content');if(!root)return;const mode=$('[data-dashboard]').dataset.dashboard,list=projects(),drafts=list.filter(p=>p.status==='Draft quote'),orders=list.filter(p=>p.status==='Demo order');
 if(mode==='client-dashboard')root.innerHTML=`<div class="workspace-start"><div><h2>What are you building next?</h2><p>Bring a model, explore an estimate and keep every revision in one place.</p></div><a class="btn" href="${siteRoot}dashboard/upload-design.html">Upload Your Design</a></div><div class="stats">${[['Active Orders',orders.length],['Pending Quotes',drafts.length],['Models Uploaded',list.length],['Completed Prints',0]].map(([t,n])=>`<div class="stat"><span>${t}</span><strong>${n}</strong></div>`).join('')}</div><div class="section-head"><h2 style="font-size:25px">Your recent projects</h2><a class="text-link" href="${siteRoot}dashboard/upload-design.html">Start New Print</a></div>`+(list.length?projectRows(list.slice(0,4),'overview'):empty('Your first idea starts here.','No active orders yet. Upload a design to start a project and keep your quote drafts together.','Start New Print'));
 else if(['quotes','orders','models','my-print-jobs'].includes(mode)){const rows=mode==='quotes'?drafts:mode==='orders'||mode==='my-print-jobs'?orders:list;root.innerHTML=rows.length?'<label class="field search" for="project-search">Search projects<input type="search" id="project-search" placeholder="Project or file name"></label><div id="project-list">'+projectRows(rows,mode)+'</div><p id="no-results" hidden>No matching projects. Try a different name.</p>':empty(mode==='quotes'?'No quote drafts yet.':mode==='models'?'No uploaded models yet.':'No active orders.','Upload a design to start your first project. Your saved models and estimates will appear here.');}
 else if(mode==='saved-materials'){const saved=read(ownerKey('saved_materials'),[]).map(id=>materialData.find(m=>m.id===id)).filter(Boolean);root.innerHTML=saved.length?'<div class="grid">'+saved.map(m=>`<article class="form-panel"><span class="tag">${m.process}</span><h3>${m.name}</h3><p>Illustrative material rate ${money(m.rate)}/g.</p><a class="text-link" href="${siteRoot}material-${m.id}.html">Explore material</a></article>`).join('')+'</div>':empty('Build your material shortlist.','Save materials from the library to compare options for a future project.','Explore Materials','/materials.html');}
 else if(mode==='payments')root.innerHTML=empty('No payments or invoices.','No payment processing is connected to this demo workspace. Contact the team to discuss a reviewed quote.','Contact the Team','/contact.html');
 else if(mode==='notifications')root.innerHTML=list.length?'<div class="form-panel"><h3>Your workspace activity</h3>'+list.map(p=>`<p><strong>${escapeHTML(p.name)}</strong> · ${escapeHTML(p.status)} saved on ${new Date(p.created).toLocaleDateString()}.</p>`).join('')+'</div>':empty('You’re all caught up.','Project activity will appear here when you save your first design.');
 $('#project-search')?.addEventListener('input',e=>{let count=0;$$('[data-search]').forEach(row=>{row.hidden=!row.dataset.search.includes(e.target.value.trim().toLowerCase());if(!row.hidden)count++;});$('#no-results').hidden=count>0;});
 $$('[data-confirm]').forEach(b=>b.addEventListener('click',()=>{const list=projects(),p=list.find(x=>x.id===b.dataset.confirm);if(!p)return;p.status='Demo order';try{write(ownerKey('projects'),list);renderDashboard();}catch{alert(localNotice);}}));
 $$('[data-download]').forEach(b=>b.addEventListener('click',async()=>{try{const p=projects().find(x=>x.id===b.dataset.download);const file=await fileStore('get',user.id+':'+p.id);if(!file)throw new Error();const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download=p.fileName;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{alert('The model file is unavailable in this browser. Please upload it again.');}}));
 $$('[data-delete]').forEach(b=>b.addEventListener('click',async()=>{if(!confirm('Delete this local project and its model file? This cannot be undone.'))return;try{await fileStore('delete',user.id+':'+b.dataset.delete);write(ownerKey('projects'),projects().filter(p=>p.id!==b.dataset.delete));renderDashboard();}catch{alert(localNotice);}}));
}
renderDashboard();
window.addEventListener('storage',e=>{if(e.key==='protoforge_current_user')location.reload();});
