(() => {
  'use strict';
  const DATA_URL = 'data/units.json';
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const safeURL = (value) => {
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  };
  const gradeName = (grade) => `${grade}학년`;
  const dateLabel = (value) => value ? escapeHTML(value) : '날짜 미정';

  function mountChrome(units = []) {
    const header = $('#site-header');
    if (header) header.innerHTML = `<header class="site-header"><a class="skip-link" href="#main">본문 바로가기</a><div class="header-inner"><a class="brand" href="index.html">과학 자료실</a><nav class="nav-links" aria-label="주 메뉴"><a href="index.html">홈</a><a href="grade.html?g=2">2학년</a><a href="grade.html?g=3">3학년</a></nav></div></header>`;
    const footer = $('#site-footer');
    if (footer) {
      const dates = units.map((unit) => unit.updated).filter(Boolean).sort();
      const latest = dates[dates.length - 1] || '';
      const formatted = latest ? latest.replaceAll('-', '.') : '날짜 미정';
      footer.innerHTML = `<footer class="site-footer"><div class="footer-inner"><p>과학 자료실 · 수업 자료 안내</p><p>자료 마지막 수정일: <time${latest ? ` datetime="${escapeHTML(latest)}"` : ''}>${escapeHTML(formatted)}</time></p></div></footer>`;
    }
    const main = $('main');
    if (main) main.id = 'main';
  }

  async function loadUnits() {
    const response = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`자료를 불러오지 못했습니다 (${response.status}).`);
    const data = await response.json();
    if (!Array.isArray(data.units)) throw new Error('단원 자료 형식을 확인해 주세요.');
    return data.units;
  }
  const byOrder = (a, b) => Number(a.order || 0) - Number(b.order || 0);
  function unitCard(unit) {
    const href = `unit.html?id=${encodeURIComponent(unit.id)}`;
    return `<a class="unit-card" href="${href}"><span class="badge">${escapeHTML(gradeName(unit.grade))}</span><h3>${escapeHTML(unit.title)}</h3><span class="card-meta"><span>수정일 ${dateLabel(unit.updated)}</span></span></a>`;
  }
  function showError(element, message) {
    if (element) element.innerHTML = `<p class="status" role="status">${escapeHTML(message)} 로컬 서버 실행 방법은 README.md를 확인하세요.</p>`;
  }
  function renderHome(units) {
    const target = $('#recent-units');
    if (!target) return;
    const sorted = [...units].sort((a, b) => String(b.updated || '').localeCompare(String(a.updated || ''))).slice(0, 4);
    target.innerHTML = sorted.length ? sorted.map(unitCard).join('') : '<p class="status">등록된 단원이 없습니다.</p>';
  }
  function renderGrade(units) {
    const params = new URLSearchParams(location.search);
    const grade = Number(params.get('g'));
    const valid = [2, 3].includes(grade);
    const title = valid ? gradeName(grade) : '학년을 선택해 주세요';
    $('#grade-title').textContent = title;
    document.title = `${title} | 과학 자료실`;
    const target = $('#grade-units');
    if (!target) return;
    if (!valid) { showError(target, '학년 주소가 올바르지 않습니다.'); return; }
    const filtered = units.filter((unit) => Number(unit.grade) === grade).sort(byOrder);
    target.innerHTML = filtered.length ? filtered.map(unitCard).join('') : '<p class="status">아직 등록된 단원이 없습니다.</p>';
  }
  const hasItems = (value) => Array.isArray(value) && value.length > 0;
  const contentPath = (file) => {
    if (typeof file !== 'string' || !file || file.split('/').includes('..') || file.startsWith('/') || file.includes('\\')) return '';
    return `content/${file.split('/').map(encodeURIComponent).join('/')}`;
  };
  async function fileIsAvailable(path) {
    if (!path) return false;
    try {
      let response = await fetch(path, { method: 'HEAD', cache: 'no-cache' });
      if (response.status === 405 || response.status === 501) response = await fetch(path, { headers: { Range: 'bytes=0-0' }, cache: 'no-cache' });
      return response.ok;
    } catch { return false; }
  }
  function panel(title, content, className = '') {
    return `<section class="content-panel ${className}" aria-label="${escapeHTML(title)}"><h2>${escapeHTML(title)}</h2>${content}</section>`;
  }
  async function renderUnit(units) {
    const target = $('#unit-detail');
    if (!target) return;
    const id = new URLSearchParams(location.search).get('id');
    const unit = units.find((item) => item.id === id);
    if (!unit) { target.innerHTML = '<p class="status" role="status">요청한 단원을 찾을 수 없습니다. 주소의 단원 ID를 확인해 주세요.</p>'; return; }
    document.title = `${unit.title} | 과학 자료실`;
    let sections = '';
    if (hasItems(unit.worksheets)) {
      const cards = await Promise.all(unit.worksheets.map(async (item) => {
        const file = typeof item.file === 'string' ? item.file : '';
        const src = /\.pdf$/i.test(file) ? contentPath(file) : '';
        const available = await fileIsAvailable(src);
        return `<li><strong>${escapeHTML(item.title || '')}</strong>${item.description ? `<p>${escapeHTML(item.description)}</p>` : ''}${available ? `<object class="pdf-preview" data="${escapeHTML(src)}" type="application/pdf" aria-label="${escapeHTML(item.title || '학습지')} 미리보기"><p>이 기기에서 미리보기를 지원하지 않습니다. 아래 버튼을 이용하세요.</p></object><div class="resource-actions"><a class="button-link" href="${escapeHTML(src)}" target="_blank" rel="noopener noreferrer">PDF 새 창에서 열기</a><a class="button-link" href="${escapeHTML(src)}" download>PDF 다운로드</a></div>` : '<p class="muted">미등록</p>'}</li>`;
      }));
      sections += panel('학습지', `<ul class="resource-list">${cards.join('')}</ul>`);
    }
    const renderMaterials = (items, label) => `<ul class="resource-list">${items.map((item) => {
      const url = safeURL(item.url);
      const file = item.file ? contentPath(item.file) : '';
      const href = url || file;
      return `<li><strong>${escapeHTML(item.title || '')}</strong>${item.description ? `<p>${escapeHTML(item.description)}</p>` : ''}${href ? `<a class="button-link" href="${escapeHTML(href)}" ${url ? 'target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(label)} 열기</a>` : ''}</li>`;
    }).join('')}</ul>`;
    if (hasItems(unit.virtualLabs)) sections += panel('가상실험', renderMaterials(unit.virtualLabs, '가상실험'));
    if (hasItems(unit.resources)) sections += panel('관련 자료', renderMaterials(unit.resources, '자료'));
    target.innerHTML = `<header class="unit-heading"><p class="eyebrow">${escapeHTML(gradeName(unit.grade))} · ${escapeHTML(unit.order)}단원</p><h1>${escapeHTML(unit.title)}</h1><div class="card-meta"><span>마지막 수정일 ${dateLabel(unit.updated)}</span></div></header>${sections ? `<div class="unit-sections">${sections}</div>` : '<p class="status">자료 준비 중</p>'}`;
  }
  loadUnits().then((units) => {
    mountChrome(units);
    if ($('#recent-units')) renderHome(units);
    if ($('#grade-units')) renderGrade(units);
    if ($('#unit-detail')) renderUnit(units);
  }).catch((error) => {
    mountChrome();
    const target = $('#recent-units') || $('#grade-units') || $('#unit-detail');
    showError(target, error.message || '자료를 불러오지 못했습니다.');
  });
})();
