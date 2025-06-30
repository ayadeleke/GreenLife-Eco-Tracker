// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => React.createElement('div', null, children),
  TileLayer: () => React.createElement('div', null, 'TileLayer'),
  Marker: () => React.createElement('div', null, 'Marker'),
  Popup: ({ children }: any) => React.createElement('div', null, children),
  useMap: () => ({
    addControl: vi.fn(),
    on: vi.fn(),
    remove: vi.fn(),
  }),
  useMapEvents: () => ({}),
}));


vi.mock('leaflet', () => {
  class Icon {
    constructor() {}
    static Default = class {};
  }
  class Control {
    constructor() {}
    onAdd() {}
    addTo() { return this; }
    remove() {}
    static extend = () => Control;
    static mergeOptions = () => {};
  }
  class MockMap {
    addControl() {}
    removeControl() {}
    on() {}
    remove() {}
  }
  const leafletMock = {
    Icon,
    IconDefault: Icon.Default,
    Control,
    LatLng: class {},
    map: () => new MockMap(),
  };
  return {
    ...leafletMock,
    default: leafletMock,
  };
});
import axios from 'axios';
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          results: [{ species: 'Oak' }, { species: 'Maple' }],
          count: 2,
        },
      })
    ),
  },
}));
