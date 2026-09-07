/**
 * TikTok-Detektiv: Video & Scene Renderer
 * Generates rich interactive visual scenes with animated details and clickable hotspot clues
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

    // Generate SVG / HTML visual scene
    const visualContent = this.generateSceneVisuals(video);
    sceneWrapper.innerHTML = visualContent;

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
        pin.innerHTML = '🔍';
        spotEl.appendChild(pin);

        spotEl.addEventListener('click', (e) => {
          e.stopPropagation();
          onHotspotClick(hotspot, video);
        });

        sceneWrapper.appendChild(spotEl);
      });
    }

    container.appendChild(sceneWrapper);
  },

  generateSceneVisuals(video) {
    switch (video.sceneType) {
      case 'window_berlin':
        return `
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, #6ba5d8 0%, #dbe6f0 50%, #b88656 100%);">
            <!-- Sunny outdoor sky with autumn sun -->
            <div style="position: absolute; top: 15%; right: 20%; width: 90px; height: 90px; border-radius: 50%; background: radial-gradient(circle, #fff7b3 0%, #ffd043 60%, rgba(255,208,67,0) 80%); box-shadow: 0 0 40px #ffd043;"></div>
            
            <!-- Window frame -->
            <div style="position: absolute; inset: 10px; border: 14px solid #2a1e17; box-shadow: inset 0 0 20px rgba(0,0,0,0.5);">
              <!-- Cross bars -->
              <div style="position: absolute; left: 50%; top: 0; width: 8px; height: 100%; background: #2a1e17; transform: translateX(-50%);"></div>
              <div style="position: absolute; top: 45%; left: 0; width: 100%; height: 8px; background: #2a1e17; transform: translateY(-50%);"></div>
            </div>

            <!-- Glass Reflection: Berlin M10 Yellow Tram -->
            <div style="position: absolute; right: 12%; top: 35%; width: 140px; padding: 10px; background: rgba(255, 230, 0, 0.45); border: 2px solid #ffd000; border-radius: 8px; backdrop-filter: blur(2px); transform: rotate(-3deg) scaleX(-1); color: #111; font-weight: 900; font-size: 14px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <div style="font-size: 11px; color: #000; letter-spacing: 1px;">BVG BERLIN</div>
              <div style="font-size: 18px; color: #000; font-family: monospace;">M10 Warschauer Str.</div>
              <div style="font-size: 9px; color: #333;">🚊 Straßenbahn</div>
            </div>

            <!-- Cozy Desk & Tea cup -->
            <div style="position: absolute; bottom: 0; width: 100%; height: 160px; background: linear-gradient(180deg, #422d1d 0%, #20140c 100%); border-top: 6px solid #5a3e28;">
              <div style="position: absolute; left: 25%; bottom: 40px; font-size: 58px; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5));">
                ☕️
                <div style="position: absolute; top: -20px; left: 10px; font-size: 18px; opacity: 0.7; animation: pulse-pin 2s infinite;">♨️</div>
              </div>
            </div>
          </div>
        `;

      case 'phone_screenshot':
        return `
          <div style="position: absolute; inset: 0; background: #000000; display: flex; flex-direction: column;">
            <!-- Simulated Phone Status Bar with School WiFi -->
            <div style="height: 38px; background: #111; padding: 6px 14px; display: flex; justify-content: space-between; align-items: center; color: #fff; font-size: 11px; font-family: monospace; border-bottom: 1px solid #333;">
              <span>14:45</span>
              <div style="display: flex; gap: 8px; align-items: center; background: rgba(37, 244, 238, 0.2); padding: 2px 8px; border-radius: 4px; border: 1px solid #25f4ee;">
                <span>📶 5G</span>
                <span>🛜 WiFi: <b>Schule_Gast_5G</b></span>
                <span>🔋 88%</span>
              </div>
            </div>

            <!-- Meme Image -->
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; background: linear-gradient(135deg, #1e272e, #0f1419);">
              <div style="font-size: 64px; margin-bottom: 12px;">🥱📱</div>
              <div style="font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 8px;">„Wenn kein Netz bei Oma ist...“</div>
              <div style="font-size: 13px; color: #888;">(Aber Statusleiste sagt Schul-WLAN 💀)</div>
            </div>
          </div>
        `;

      case 'mirror_selfie':
        return `
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, #1e1e24 0%, #121215 100%); display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="font-size: 14px; color: #aaa; margin-bottom: 20px;">🪞 Spiegelselfie vor 2 Tagen</div>
            <!-- Character with yellow hoodie & skate patch -->
            <div style="position: relative; width: 220px; height: 320px; display: flex; flex-direction: column; align-items: center;">
              <!-- Head -->
              <div style="font-size: 54px; z-index: 2;">🦁</div>
              <!-- Yellow Skate Hoodie -->
              <div style="position: relative; width: 140px; height: 160px; background: #ffbe0b; border-radius: 20px 20px 8px 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;">
                <!-- Skater Patch on Sleeve -->
                <div style="position: absolute; left: 8px; top: 35px; width: 32px; height: 32px; background: #3a86ff; border: 2px solid #ff006e; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; transform: rotate(-15deg); box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
                  🛹
                </div>
                <span style="font-size: 12px; font-weight: 800; color: #222;">VIBEZ SKATE</span>
              </div>
              <!-- Red white sneakers -->
              <div style="margin-top: 15px; font-size: 24px; letter-spacing: 12px;">👟👟</div>
            </div>
          </div>
        `;

      case 'dubai_balcony_fake':
        return `
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, #4a90e2 0%, #a1c4fd 60%, #e0c3fc 100%);">
            <!-- European Clouds & Blue Sky (Not Sandstorm Dubai) -->
            <div style="position: absolute; top: 10%; left: 15%; font-size: 36px; opacity: 0.8;">☁️</div>
            <div style="position: absolute; top: 20%; right: 25%; font-size: 42px; opacity: 0.9;">☁️</div>

            <!-- European Oak Tree Leaves blowing in the wind -->
            <div style="position: absolute; top: 12%; right: 5%; font-size: 48px; transform: rotate(20deg); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
              🌿🍃
            </div>

            <!-- Balcony Railing -->
            <div style="position: absolute; bottom: 120px; width: 100%; height: 80px; border-top: 8px solid #999; background: repeating-linear-gradient(90deg, #666, #666 8px, transparent 8px, transparent 30px);"></div>

            <!-- Room Wall with German Schuko Plug (Type F) -->
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 120px; background: #2c3e50; border-top: 4px solid #34495e; padding: 14px;">
              <!-- Wall socket -->
              <div style="position: absolute; left: 15%; top: 30px; width: 50px; height: 50px; background: #fff; border-radius: 8px; border: 3px solid #ccc; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #eaeaea; border: 2px solid #bbb; display: flex; justify-content: space-around; align-items: center; padding: 0 6px;">
                  <div style="width: 5px; height: 5px; background: #333; border-radius: 50%;"></div>
                  <div style="width: 5px; height: 5px; background: #333; border-radius: 50%;"></div>
                </div>
              </div>
              <div style="position: absolute; left: 35%; top: 40px; color: #fff; font-size: 11px;">🇩🇪 Schuko-Steckdose (Typ F)</div>
            </div>
          </div>
        `;

      case 'watch_unboxing':
        return `
          <div style="position: absolute; inset: 0; background: #111; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px;">
            <!-- Luxury Watch Box -->
            <div style="position: relative; width: 260px; height: 190px; background: #1b4d3e; border: 4px solid #d4af37; border-radius: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 15px 35px rgba(0,0,0,0.8);">
              <!-- Luxury Watch -->
              <div style="position: relative; width: 90px; height: 90px; border-radius: 50%; background: #222; border: 5px solid #d4af37; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
                <span style="font-size: 28px;">⌚️</span>
                <!-- Glass reflection showing Airport Hotel Frankfurt -->
                <div style="position: absolute; inset: 6px; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%); display: flex; align-items: center; justify-content: center; text-align: center; font-size: 7px; color: #fff; font-weight: bold; text-shadow: 0 1px 2px #000;">
                  HOTEL REGENT<br>FRANKFURT
                </div>
              </div>
              <span style="font-size: 10px; color: #d4af37; font-weight: bold; margin-top: 6px; letter-spacing: 2px;">LUXURY TIMEPIECE</span>
            </div>

            <!-- German Receipt -->
            <div style="position: absolute; bottom: 20px; left: 15%; width: 170px; background: #fdfbf7; color: #111; padding: 8px 12px; font-family: monospace; font-size: 9px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); transform: rotate(-5deg); border-left: 3px solid #ff4757;">
              <div style="font-weight: bold; text-align: center; border-bottom: 1px dashed #999; padding-bottom: 2px;">JUWELIER FRANKFURT</div>
              <div>Datum: 14.03. (vor 6 Mo.)</div>
              <div>Gesamt: 9.850,00 EUR</div>
              <div style="color: #d63031; font-weight: bold;">inkl. 19% MwSt.</div>
            </div>
          </div>
        `;

      case 'park_watertower':
        return `
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, #74b9ff 0%, #dfe6e9 50%, #55efc4 100%);">
            <!-- Sky & Sun -->
            <div style="position: absolute; top: 10%; left: 50%; transform: translateX(-50%); width: 70px; height: 70px; background: #ffeaa7; border-radius: 50%; box-shadow: 0 0 30px #fdcb6e;"></div>

            <!-- Historic Moosbruch Watertower Landmark in Background -->
            <div style="position: absolute; top: 20%; right: 12%; width: 70px; height: 130px; background: #d63031; border-radius: 8px 8px 0 0; border: 3px solid #b71540; display: flex; flex-direction: column; align-items: center; padding-top: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
              <div style="width: 45px; height: 20px; background: #636e72; border-radius: 4px; border: 2px solid #2d3436;"></div>
              <div style="color: #fff; font-size: 8px; font-weight: bold; margin-top: 8px; text-align: center;">MOOSBRUCH<br>1898</div>
            </div>

            <!-- Nature Grass & Trees -->
            <div style="position: absolute; bottom: 80px; width: 100%; display: flex; justify-content: space-around; font-size: 42px;">
              <span>🌲</span>
              <span>🌳</span>
              <span>🌲</span>
            </div>

            <!-- Park Bench & Backpack with Drone -->
            <div style="position: absolute; bottom: 20px; width: 100%; height: 110px; background: #00b894; border-top: 6px solid #00cec9; padding: 10px;">
              <!-- Backpack with Drone -->
              <div style="position: absolute; left: 10%; bottom: 25px; font-size: 38px; filter: drop-shadow(0 6px 6px rgba(0,0,0,0.4));">
                🎒
                <div style="position: absolute; top: -12px; right: -12px; font-size: 24px;">🚁</div>
              </div>

              <!-- Bench Shadow pointing North (11:30 solar noon) -->
              <div style="position: absolute; left: 40%; bottom: 15px; width: 120px; height: 18px; background: rgba(0,0,0,0.45); border-radius: 50%; transform: rotate(2deg);"></div>
              <div style="position: absolute; left: 45%; bottom: 25px; font-size: 42px;">🪑</div>
            </div>
          </div>
        `;

      default:
        return `
          <div style="position: absolute; inset: 0; background: #1a1a1a; display: flex; align-items: center; justify-content: center; color: white;">
            <span>🎬 Video-Vorschau</span>
          </div>
        `;
    }
  }
};
