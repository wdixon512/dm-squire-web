'use client';

import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
        /* latin */
        @font-face {
          font-family: 'Pixel';
          src: url('../static/fonts/PublicPixel.ttf') format('truetype');
          font-style: normal;
          font-weight: 100;
        }

        /* latin */
        @font-face {
          font-family: 'SM64';
          src: url('../static/fonts/SM64.ttf') format('truetype');
          font-style: normal;
          font-weight: 100;
          font-size: 48px;
        }`}
  />
);

export default Fonts;
