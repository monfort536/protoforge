'use strict';

(() => {
  const fixture = window.ProtoForgeDashboardData;
  if (!fixture) return;
  let data = fixture;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;
  const date = value => new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'});
  const localUser = () => { try { return JSON.parse(localStorage.getItem('protoforge_current_user')); } catch { return null; } };
  const localProjects = () => { const account = localUser(); if (!account) return []; try { return JSON.parse(localStorage.getItem(`protoforge_projects_${account.id}`)) || []; } catch { return []; } };
  const statusClass = value => `status-${String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const statusTag = value => `<span class="tag ${statusClass(value)}">${esc(value)}</span>`;
  const empty = (title, copy, href = '../dashboard/upload-design.html', label = 'Upload Your Design') => `<div class="empty"><span class="blue" aria-hidden="true" style="font-size:32px">◇</span><h3>${esc(title)}</h3><p>${esc(copy)}</p><a class="btn" href="${href}">${esc(label)}</a></div>`;
  const link = (kind, id, label = 'View details') => `<a class="text-link" href="../dashboard/${kind}.html?${kind === 'client-dashboard' ? 'project' : kind.slice(0, -1)}=${encodeURIComponent(id)}">${label}</a>`;
  const localNotice = `<p class="small muted demo-note">Demo data is shown for presentation. Your uploaded designs and profile changes remain stored separately in this browser.</p>`;

  function projectCard(project) {
    return `<article class="dashboard-project card"><div class="dashboard-project-media"><img src="../assets/images/optimized/${esc(project.image)}" alt="Illustrative ${esc(project.name)} component" loading="lazy"></div><div class="card-body"><div class="dashboard-project-top">${statusTag(project.status)}<span class="small muted">${date(project.created)}</span></div><h3>${esc(project.name)}</h3><p class="mono muted">${esc(project.id)}</p><div class="project-facts"><span><b>Material</b>${esc(project.material)}</span><span><b>Process</b>${esc(project.technology)}</span><span><b>Qty</b>${esc(project.quantity)}</span></div><div class="progress-label"><span>Production progress</span><strong>${esc(project.progress)}%</strong></div><progress value="${Number(project.progress)}" max="100" aria-label="${esc(project.name)} progress">${Number(project.progress)}%</progress><div class="actions"><a class="btn secondary" href="../dashboard/client-dashboard.html?project=${encodeURIComponent(project.id)}">View Project</a></div></div></article>`;
  }

  function statCards() {
    const s = data.stats;
    return `<div class="stats"><a class="stat" href="../dashboard/orders.html"><span>Active Orders</span><strong>${s.activeOrders}</strong><small>In production</small></a><a class="stat" href="../dashboard/quotes.html"><span>Pending Quotes</span><strong>${s.pendingQuotes}</strong><small>Awaiting decisions</small></a><a class="stat" href="../dashboard/models.html"><span>Models Uploaded</span><strong>${s.modelsUploaded}</strong><small>Files analysed</small></a><a class="stat" href="../dashboard/my-print-jobs.html"><span>Completed Prints</span><strong>${s.completedPrints}</strong><small>Delivered projects</small></a></div>`;
  }

  function activity() {
    const activityContent = data.activities.length ? data.activities.map(item => `<a class="activity-item" href="../dashboard/${item.page}.html?${item.page === 'client-dashboard' ? 'project' : item.page.slice(0, -1)}=${encodeURIComponent(item.detail)}"><span class="activity-dot" aria-hidden="true"></span><span><strong>${esc(item.message)}</strong><small>${esc(item.time)}</small></span></a>`).join('') : '<p class="small muted">No recent activity yet.</p>';
    const notificationContent = data.notifications.length ? data.notifications.map(n => `<a class="notification-item ${n.unread ? 'unread' : ''}" href="../dashboard/notifications.html?notification=${encodeURIComponent(n.id)}"><span>${statusTag(n.title)}</span><strong>${esc(n.message)}</strong><small>${esc(n.time)}</small></a>`).join('') : '<p class="small muted">You’re all caught up.</p>';
    return `<section class="dashboard-lower-grid"><div class="form-panel"><div class="section-head compact"><h2>Recent activity</h2><a class="text-link" href="../dashboard/notifications.html">All notifications</a></div><div class="activity-list">${activityContent}</div></div><div class="form-panel"><div class="section-head compact"><h2>Notifications</h2><a class="text-link" href="../dashboard/notifications.html">View all</a></div><div class="notification-summary">${notificationContent}</div></div></section>`;
  }

  function projectDetail(id) {
    const project = data.projects.find(item => item.id === id);
    if (!project) return empty('Project not found', 'This demo project is no longer available.', '../dashboard/client-dashboard.html', 'Back to Overview');
    return `<div class="detail-view"><div class="section-head"><div><a class="text-link" href="../dashboard/client-dashboard.html">Back to projects</a><h2>${esc(project.name)}</h2><p>${esc(project.id)} · created ${date(project.created)}</p></div>${statusTag(project.status)}</div><div class="detail-strip"><div><h3>${esc(project.material)}</h3><p>Material</p></div><div><h3>${esc(project.technology)}</h3><p>Technology</p></div><div><h3>${esc(project.quantity)}</h3><p>Quantity</p></div></div><div class="form-panel project-detail-progress"><div class="progress-label"><strong>Production progress</strong><strong>${project.progress}%</strong></div><progress value="${project.progress}" max="100" aria-label="Project progress">${project.progress}%</progress><p>Demo project timeline for this workspace.</p></div><div class="actions"><a class="btn" href="../dashboard/upload-design.html?application=${encodeURIComponent(project.name)}">Start a revision</a>${project.orderId ? `<a class="btn secondary" href="../dashboard/orders.html?order=${project.orderId}">View related order</a>` : ''}</div></div>`;
  }

  function records(kind, records) {
    if (!records.length) return empty(kind === 'orders' ? 'No active orders.' : 'No quote requests yet.', 'Your workspace will show updates here after you upload a design.', kind === 'orders' ? '../dashboard/upload-design.html' : '../dashboard/upload-design.html');
    return `<div class="record-list">${records.map(item => `<article class="record-card form-panel"><div class="record-heading"><div>${statusTag(item.status)}<h3>${esc(item.name)}</h3><p class="mono muted">${esc(item.id)}</p></div><strong class="record-amount">${money(item.amount)}</strong></div><div class="project-facts"><span><b>Material</b>${esc(item.material)}</span><span><b>Quantity</b>${esc(item.quantity)}</span><span><b>${kind === 'orders' ? 'Delivery' : 'Estimate'}</b>${kind === 'orders' ? date(item.delivery) : 'Review in progress'}</span></div>${item.progress !== undefined ? `<div class="progress-label"><span>${esc(item.status)}</span><strong>${item.progress}%</strong></div><progress value="${item.progress}" max="100" aria-label="${esc(item.name)} progress">${item.progress}%</progress>` : ''}<div class="actions"><a class="btn secondary" href="../dashboard/${kind}.html?${kind === 'orders' ? 'order' : 'quote'}=${encodeURIComponent(item.id)}">View ${kind === 'orders' ? 'Order' : 'Quote'}</a></div></article>`).join('')}</div>`;
  }

  function recordDetail(kind, id) {
    const item = data[kind].find(entry => entry.id === id);
    if (!item) return empty(`${kind === 'orders' ? 'Order' : 'Quote'} not found`, 'This demo record is no longer available.', `../dashboard/${kind}.html`, `Back to ${kind}`);
    return `<div class="detail-view"><div class="section-head"><div><a class="text-link" href="../dashboard/${kind}.html">Back to ${kind}</a><h2>${esc(item.name)}</h2><p>${esc(item.id)}</p></div>${statusTag(item.status)}</div><div class="detail-strip"><div><h3>${money(item.amount)}</h3><p>${kind === 'orders' ? 'Order amount' : 'Estimated amount'}</p></div><div><h3>${esc(item.material)}</h3><p>Material · Qty ${esc(item.quantity)}</p></div><div><h3>${kind === 'orders' ? date(item.delivery) : 'Pending review'}</h3><p>${kind === 'orders' ? 'Expected delivery' : 'Next step'}</p></div></div>${item.progress !== undefined ? `<div class="form-panel project-detail-progress"><div class="progress-label"><strong>Production progress</strong><strong>${item.progress}%</strong></div><progress value="${item.progress}" max="100" aria-label="Production progress">${item.progress}%</progress></div>` : ''}<p class="small muted">This is a frontend demo record. No payment or manufacturing request has been submitted.</p></div>`;
  }

  function models() {
    if (!data.models.length) return empty('No uploaded models yet.', 'Upload a STL, OBJ, STEP or 3MF file to begin.');
    return `<div class="table-wrap"><table><caption class="sr-only">Uploaded models</caption><thead><tr><th>File</th><th>Type</th><th>Size</th><th>Uploaded</th><th>Status</th><th></th></tr></thead><tbody>${data.models.map(m => `<tr><td><strong>${esc(m.name)}</strong><small class="muted">${esc(m.id)}</small></td><td>${esc(m.type)}</td><td>${esc(m.size)}</td><td>${date(m.uploadedAt)}</td><td>${statusTag(m.status)}</td><td><a class="text-link" href="../dashboard/models.html?model=${encodeURIComponent(m.id)}">View</a></td></tr>`).join('')}</tbody></table></div><div class="section-head compact dashboard-subsection"><h2>Recently completed</h2><span class="small muted">${data.stats.completedPrints} total completed prints</span></div><div class="record-list compact-records">${data.completed.map(item => `<article class="record-card form-panel"><div><span class="mono muted">${esc(item.id)}</span><h3>${esc(item.name)}</h3></div><div>${statusTag(item.status)}<small>${date(item.completedAt)}</small></div></article>`).join('')}</div>`;
  }

  function materials() {
    if (!data.materials.length) return empty('No saved materials yet.', 'Explore the material library to build a shortlist.','../materials.html','Explore Materials');
    return `<div class="grid dashboard-material-grid">${data.materials.map(m => `<article class="form-panel saved-material-card"><img src="../assets/images/optimized/${esc(m.image)}" alt="${esc(m.name)} material" loading="lazy"><div class="dashboard-project-top">${statusTag(m.technology)}<span class="tag status-saved">Saved</span></div><h3>${esc(m.name)}</h3><p>${esc(m.feature)}</p><dl class="material-specs"><div><dt>Strength</dt><dd>${esc(m.strength)}</dd></div><div><dt>Finish</dt><dd>${esc(m.finish)}</dd></div><div><dt>Best for</dt><dd>${esc(m.use)}</dd></div></dl><a class="text-link" href="../material-${esc(m.slug)}.html">Explore material</a></article>`).join('')}</div>`;
  }

  function notifications() {
    if (!data.notifications.length) return empty('You’re all caught up.', 'New project updates will appear here.');
    return `<div class="notification-list">${data.notifications.map(n => `<a class="notification-item ${n.unread ? 'unread' : ''}" href="../dashboard/${n.page}.html?${n.page === 'client-dashboard' ? 'project' : n.page.slice(0, -1)}=${encodeURIComponent(n.detail)}"><div class="notification-heading"><span>${statusTag(n.title)}</span><small>${esc(n.time)}</small></div><strong>${esc(n.message)}</strong><span class="small muted">${n.unread ? 'Unread' : 'Read'}</span></a>`).join('')}</div>`;
  }

  function payments() {
    const b = data.billing;
    return `<div class="stats billing-stats"><div class="stat"><span>Outstanding amount</span><strong>${money(b.outstanding)}</strong><small>Due on approved work</small></div><div class="stat"><span>Total spent</span><strong>${money(b.totalSpent)}</strong><small>Across ${b.invoices} invoices</small></div><div class="stat"><span>Saved payment method</span><strong>•••• 4242</strong><small>${esc(b.paymentMethod)}</small></div></div><div class="section-head compact dashboard-subsection"><h2>Recent payments</h2><span class="small muted">Demo history</span></div><div class="record-list compact-records">${data.payments.map(p => `<article class="record-card form-panel"><div><span class="mono muted">${esc(p.id)}</span><h3>${esc(p.name)}</h3></div><div><strong class="record-amount">${money(p.amount)}</strong>${statusTag(p.status)}</div></article>`).join('')}</div><p class="small muted demo-note">Payment details are illustrative. This workspace does not process payments.</p>`;
  }

  function profile() {
    const account = localUser();
    if (!account) {
      const u = data.user;
      $('#profile-name').value = u.name; $('#profile-email').value = u.email; $('#profile-phone').value = u.phone; $('#profile-company').value = u.company; $('#profile-address').value = u.address;
      if (!$('#profile-demo-summary')) $('#profileForm').insertAdjacentHTML('afterend', `<div id="profile-demo-summary" class="form-panel profile-summary"><h2 style="font-size:24px">Workspace profile</h2><div class="project-facts"><span><b>Account type</b>${esc(u.accountType)}</span><span><b>Member since</b>${esc(u.memberSince)}</span></div>${localNotice}</div>`);
      $('#profileForm').addEventListener('submit', e => { e.preventDefault(); const node = $('#profile-status'); node.textContent = 'Demo profile saved for this session.'; });
    } else {
      const summary = $('#profileForm'); if (summary && !$('#profile-demo-summary')) summary.insertAdjacentHTML('afterend', `<p class="small muted demo-note">Your signed-in profile is connected to this browser account. Demo workspace records remain separate.</p>`);
    }
  }

  function render(options = {}) {
    const root = document.querySelector('#dashboard-content');
    const page = document.querySelector('[data-dashboard]')?.dataset.dashboard;
    if (!root || !page) { if (page === 'profile') profile(); if (page === 'support') { const main = document.querySelector('.dash-main'); main?.insertAdjacentHTML('beforeend', '<div id="dashboard-content" aria-live="polite"></div>'); return render(options); } return true; }
    const query = new URLSearchParams(location.search);
    const account = localUser();
    const name = account?.name || data.user.name;
    document.querySelectorAll('[data-user-name]').forEach(node => node.textContent = name.split(' ')[0]);
    if (page === 'profile') { profile(); return true; }
    if (page === 'client-dashboard') {
      if (query.has('project')) { root.innerHTML = projectDetail(query.get('project')); return true; }
      const saved = localProjects();
      root.innerHTML = `<div class="workspace-start"><div><h2>What are you building next?</h2><p>Bring a model, explore an estimate and keep every revision in one place.</p></div><a class="btn" href="../dashboard/upload-design.html">Upload Your Design</a></div>${statCards()}<div class="section-head"><div><h2 style="font-size:25px">Your recent projects</h2><p>Active work across your prototype pipeline.</p></div><a class="text-link" href="../dashboard/upload-design.html">Start New Print</a></div><div class="grid dashboard-project-grid">${data.projects.map(projectCard).join('')}</div>${saved.length ? `<div class="section-head dashboard-subsection"><div><h2 style="font-size:25px">Your saved projects</h2><p>Stored locally in this browser account.</p></div></div><div class="record-list">${saved.map(p => `<article class="record-card form-panel"><div>${statusTag(p.status)}<h3>${esc(p.name)}</h3><p>${esc(p.fileName)}</p></div><a class="text-link" href="../dashboard/quotes.html">View saved project</a></article>`).join('')}</div>` : ''}${activity()}${localNotice}`;
    } else if (page === 'orders' || page === 'quotes') root.innerHTML = query.has(page === 'orders' ? 'order' : 'quote') ? recordDetail(page, query.get(page === 'orders' ? 'order' : 'quote')) : records(page, data[page]);
    else if (page === 'models') root.innerHTML = query.has('model') ? `<div class="detail-view"><a class="text-link" href="../dashboard/models.html">Back to models</a><h2>${esc(data.models.find(m => m.id === query.get('model'))?.name || 'Model details')}</h2><p>This model is analysed and ready for quotation.</p><div class="actions"><a class="btn" href="../dashboard/upload-design.html">Start a print</a></div></div>` : models();
    else if (page === 'saved-materials') root.innerHTML = materials();
    else if (page === 'notifications') root.innerHTML = notifications();
    else if (page === 'payments') root.innerHTML = payments();
    else if (page === 'my-print-jobs') root.innerHTML = `<div class="section-head compact"><h2>Completed prints</h2><span class="small muted">${data.stats.completedPrints} total</span></div>${models()}`;
    else if (page === 'support') root.innerHTML = `<div class="form-panel"><div class="section-head compact"><h2>Recent activity</h2><a class="text-link" href="../dashboard/notifications.html">Notifications</a></div><div class="activity-list">${data.activities.map(item => `<a class="activity-item" href="../dashboard/${item.page}.html"><span class="activity-dot" aria-hidden="true"></span><span><strong>${esc(item.message)}</strong><small>${esc(item.time)}</small></span></a>`).join('')}</div></div>${localNotice}`;
    if (page === 'client-dashboard' && !data.projects.length) { const grid = root.querySelector('.dashboard-project-grid'); if (grid) grid.outerHTML = empty('No projects yet.', 'Upload a design to start your first project.'); }
    return true;
  }
  window.ProtoForgeDashboard = { render, setData(next) { data = {...data, ...next}; render(); } };
})();
