/**
 * TikTok-Detektiv: Video & Scene Renderer
 * Renders high-resolution photo scenes with interactive glowing hotspot clues & zoom capabilities
 */

window.VideoRenderer = {
  renderScene(video, container, onHotspotClick) {
    container.innerHTML = '';

    const sceneWrapper = document.createElement('div');
    sceneWrapper.className = 'tt-video-canvas';
    sceneWrapper.style.position = 'relative';
    sceneWrapper.style.width = '100%';
    sceneWrapper.style.height = '100%';
    sceneWrapper.style.overflow = 'hidden';
    sceneWrapper.style.backgroundColor = '#000';

    if (video.imageSrc) {
      const img = document.createElement('img');
      img.src = video.imageSrc;
      img.alt = video.title;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
      img.style.userSelect = 'none';
      img.draggable = false;
      sceneWrapper.appendChild(img);
    }

    // Overlay interactive hotspots
    if (video.hotspots && video.hotspots.length > 0) {
      video.hotspots.forEach(hotspot => {
        const spotEl = document.createElement('div');
        spotEl.className = 'tt-hotspot';
        spotEl.style.left = `${hotspot.x}%`;
        spotEl.style.top = `${hotspot.y}%`;
        spotEl.style.width = `${hotspot.width}%`;
        spotEl.style.height = `${hotspot.height}%`;
        spotEl.title = `Hinweis: ${hotspot.label}`;
        spotEl.dataset.clueId = hotspot.id;

        const pin = document.createElement('div');
        pin.className = 'tt-hotspot-pin';
        pin.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        `;
        spotEl.appendChild(pin);

        spotEl.addEventListener('click', (e) => {
          e.stopPropagation();
          onHotspotClick(hotspot, video);
        });

        sceneWrapper.appendChild(spotEl);
      });
    }

    container.appendChild(sceneWrapper);
  }
};
