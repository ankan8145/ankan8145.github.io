const filters = document.querySelectorAll('[data-filter]');
const publications = document.querySelectorAll('.publication');
function filterPublications(filter) {
  let count = 0;
  publications.forEach(paper => {
    paper.hidden = filter !== 'all' && paper.dataset.status !== filter;
    if (!paper.hidden) count++;
  });
  filters.forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('.results-count').textContent = `${count} publications`;
}
filters.forEach(button => button.addEventListener('click', () => filterPublications(button.dataset.filter)));
function revealLinkedPaper() {
  if (location.hash.startsWith('#paper-')) {
    const paper = document.getElementById(location.hash.slice(1));
    if (paper) { filterPublications('all'); paper.scrollIntoView({block: 'center'}); }
  }
}
window.addEventListener('hashchange', revealLinkedPaper);
revealLinkedPaper();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('nav a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}

// Keep long award lists to five visible entries, with keyboard-accessible scrolling.
const honorsList = document.querySelector('.recognition-grid');
if (honorsList) {
  const updateHonorsScroll = () => {
    const items = [...honorsList.children].filter(item => item.matches('article'));
    const scrollable = items.length > 5;
    honorsList.classList.toggle('honors-scrollable', scrollable);
    if (scrollable) {
      honorsList.setAttribute('tabindex', '0');
      honorsList.setAttribute('role', 'region');
      honorsList.setAttribute('aria-labelledby', 'honors-heading');
      const first = items[0].getBoundingClientRect();
      const fifth = items[4].getBoundingClientRect();
      honorsList.style.maxHeight = `${Math.ceil(fifth.bottom - first.top)}px`;
    } else {
      honorsList.style.removeProperty('max-height');
      honorsList.removeAttribute('tabindex');
      honorsList.removeAttribute('role');
      honorsList.removeAttribute('aria-labelledby');
    }
  };
  updateHonorsScroll();
  new MutationObserver(updateHonorsScroll).observe(honorsList, { childList: true });
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateHonorsScroll).observe(honorsList);
  } else {
    window.addEventListener('resize', updateHonorsScroll);
  }
  document.fonts.ready.then(updateHonorsScroll);
}
