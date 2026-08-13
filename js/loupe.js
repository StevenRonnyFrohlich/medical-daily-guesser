window.initLoupe = function initLoupe(ocular, source, loupe, glass, readout) {
  const MIN = 0.25;
  const MAX = 10;
  const STEP = 0.2;
  let zoom = 3;
  let last = null;

  function cover(box, img) {
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!nw || !nh) return null;
    const scale = Math.max(box.width / nw, box.height / nh);
    return {
      scale,
      x: (box.width - nw * scale) / 2,
      y: (box.height - nh * scale) / 2
    };
  }

  function insideCircle(rect, x, y) {
    const dx = x - (rect.left + rect.width / 2);
    const dy = y - (rect.top + rect.height / 2);
    const r = rect.width / 2;
    return dx * dx + dy * dy <= r * r;
  }

  function hide() {
    loupe.hidden = true;
    ocular.classList.remove("is-examining");
    last = null;
  }

  function paint(clientX, clientY) {
    const rect = ocular.getBoundingClientRect();
    if (!insideCircle(rect, clientX, clientY) || !source.naturalWidth) {
      hide();
      return;
    }

    const placed = cover(rect, source);
    if (!placed) {
      hide();
      return;
    }

    const lx = clientX - rect.left;
    const ly = clientY - rect.top;
    const radius = loupe.offsetWidth / 2;
    glass.style.width = `${source.naturalWidth * placed.scale * zoom}px`;
    glass.style.height = `${source.naturalHeight * placed.scale * zoom}px`;
    glass.style.left = `${radius - (lx - placed.x) * zoom}px`;
    glass.style.top = `${radius - (ly - placed.y) * zoom}px`;

    loupe.style.left = `${clientX}px`;
    loupe.style.top = `${clientY}px`;
    loupe.hidden = false;
    ocular.classList.add("is-examining");
    readout.textContent = `${zoom.toFixed(1)}×`;
    last = { clientX, clientY };
  }

  ocular.addEventListener("pointerenter", (event) => paint(event.clientX, event.clientY));
  ocular.addEventListener("pointermove", (event) => paint(event.clientX, event.clientY));
  ocular.addEventListener("pointerleave", hide);
  ocular.addEventListener("wheel", (event) => {
    if (loupe.hidden) return;
    event.preventDefault();
    const next = zoom + (event.deltaY < 0 ? STEP : -STEP);
    zoom = Math.min(MAX, Math.max(MIN, next));
    if (last) paint(last.clientX, last.clientY);
  }, { passive: false });

  return {
    setSource(url) {
      glass.src = url;
      hide();
    }
  };
};
