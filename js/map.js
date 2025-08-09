import {
  MAP_CENTER,
  MAP_DEFAULT_ZOOM,
  DEFAULT_DECIMAL_PRECISION,
  MAX_VISIBLE_PINS,
} from './constants.js';
import { qs, showErrorMessage } from './util.js';

let mapInstance = null;
let mainPinMarker = null;
let markerLayerGroup = null;
let activeTileLayer = null;

const MAIN_PIN_ICON = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const PIN_ICON = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export function formatCoords({ lat, lng }) {
  return `${lat.toFixed(DEFAULT_DECIMAL_PRECISION)}, ${lng.toFixed(DEFAULT_DECIMAL_PRECISION)}`;
}

function addTileLayerWithFallback(map) {
  const sources = [
    {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    {
      url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap France',
    },
    {
      url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap Germany',
    },
    {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap, &copy; CartoDB',
    },
  ];

  let index = 0;
  const tryAdd = () => {
    const src = sources[index];
    if (!src) {
      showErrorMessage('Не удалось загрузить карту. Попробуйте позже.');
      return;
    }
    if (activeTileLayer) {
      map.removeLayer(activeTileLayer);
      activeTileLayer = null;
    }
    activeTileLayer = L.tileLayer(src.url, {
      attribution: src.attribution,
      crossOrigin: true,
      detectRetina: true,
      subdomains: 'abcd',
      maxZoom: 19,
    })
      .on('tileerror', () => {
        index += 1;
        tryAdd();
      })
      .addTo(map);
  };

  tryAdd();
}

export function initMap(onReady) {
  if (typeof L === 'undefined') {
    showErrorMessage('Карта не загрузилась. Проверьте подключение Leaflet.');
    return null;
  }
  const canvas = qs('#map-canvas');
  mapInstance = L.map(canvas)
    .on('load', () => {
      if (typeof onReady === 'function') onReady();
    })
    .setView([MAP_CENTER.lat, MAP_CENTER.lng], MAP_DEFAULT_ZOOM);

  addTileLayerWithFallback(mapInstance);

  markerLayerGroup = L.layerGroup().addTo(mapInstance);

  mainPinMarker = L.marker([MAP_CENTER.lat, MAP_CENTER.lng], {
    draggable: true,
    icon: MAIN_PIN_ICON,
  }).addTo(mapInstance);

  return mapInstance;
}

export function onMainPinMove(callback) {
  if (!mainPinMarker) return () => {};
  const handler = (evt) => {
    const { lat, lng } = evt.target.getLatLng();
    callback({ lat, lng });
  };
  mainPinMarker.on('move', handler);
  return () => mainPinMarker.off('move', handler);
}

export function resetMainPin() {
  if (mainPinMarker) {
    mainPinMarker.setLatLng([MAP_CENTER.lat, MAP_CENTER.lng]);
  }
}

export function renderPins(ads, buildPopupContent) {
  if (!markerLayerGroup) return;
  markerLayerGroup.clearLayers();
  ads.slice(0, MAX_VISIBLE_PINS).forEach((ad) => {
    const marker = L.marker([ad.lat, ad.lng], { icon: PIN_ICON });
    if (typeof buildPopupContent === 'function') {
      const node = buildPopupContent(ad);
      const html = node && node.outerHTML ? node.outerHTML : '';
      marker.bindPopup(html, { closeButton: true });
    }
    marker.addTo(markerLayerGroup);
  });
}


