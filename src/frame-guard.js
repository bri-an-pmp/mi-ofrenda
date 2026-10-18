// Clickjacking protection. GitHub Pages can't send the header that stops other websites from
// showing this page inside a hidden frame, so the page checks for itself: if it is inside
// someone else's frame, it shows only a link to open Mi Ofrenda directly and stops.
let framed = false;
try {
  framed = window.top !== window.self;
} catch {
  framed = true; // a frame from another site can't even be inspected
}

if (framed) {
  const link = document.createElement('a');
  link.href = window.location.href;
  link.target = '_top';
  link.rel = 'noopener';
  link.textContent = 'Abrir Mi Ofrenda · Open Mi Ofrenda';
  const box = document.createElement('p');
  box.className = 'framed';
  box.append(link);
  document.body.replaceChildren(box);
  throw new Error('Mi Ofrenda will not run inside another site\'s frame.');
}
