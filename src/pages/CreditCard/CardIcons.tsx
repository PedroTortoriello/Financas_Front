import React from 'react';

// Ícone Visa
const VisaIcon = () => (
  <svg
    className="h-8 w-8" // Ajuste o tamanho conforme necessário
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    shapeRendering="geometricPrecision"
  >
    <g style={{ strokeWidth: 0.1 }}>
      <polygon
        points="10.4 15.76 8.45 15.76 9.67 8.24 11.63 8.24 10.4 15.76"
        style={{ fill: 'rgb(0, 92, 168)' }}
      />
      <path
        d="M6.8,8.24,4.93,13.42,4.71,12.3h0L4.05,8.92a.84.84,0,0,0-.93-.68H0l0,.13a7.53,7.53,0,0,1,2.05.86l1.7,6.53h2L8.91,8.24Z"
        style={{ fill: 'rgb(0, 92, 168)' }}
      />
      <path
        d="M22.2,15.76H24L22.43,8.24H20.86A.91.91,0,0,0,20,8.8l-2.92,7h2l.41-1.11H22ZM20.05,13.1l1-2.81.57,2.81Z"
        style={{ fill: 'rgb(0, 92, 168)' }}
      />
      <path
        d="M17.19,10.05l.28-1.62a5.86,5.86,0,0,0-1.77-.32c-1,0-3.28.42-3.28,2.49s2.71,2,2.71,3-2.43.83-3.23.19l-.29,1.69a5.57,5.57,0,0,0,2.21.42c1.34,0,3.35-.69,3.35-2.57s-2.73-2.14-2.73-3S16.35,9.59,17.19,10.05Z"
        style={{ fill: 'rgb(0, 92, 168)' }}
      />
      <path
        d="M4.71,12.3,4.05,8.92a.84.84,0,0,0-.93-.68H0l0,.13A7.68,7.68,0,0,1,2.91,9.83,5.83,5.83,0,0,1,4.71,12.3Z"
        style={{ fill: 'rgb(246, 167, 35)', strokeWidth: 0.01 }}
      />
    </g>
  </svg>
);

// Ícone MasterCard
const MasterCardIcon = () => (
  <svg
    className="h-8 w-8" // Ajuste o tamanho conforme necessário
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    shapeRendering="geometricPrecision"
  >
    <g style={{ strokeWidth: 0.1 }}>
      <rect x="8.76" y="6.17" width="6.49" height="11.66" style={{ fill: 'rgb(255, 95, 0)' }} />
      <path
        d="M9.17,12A7.38,7.38,0,0,1,12,6.17a7.42,7.42,0,1,0,0,11.66A7.38,7.38,0,0,1,9.17,12Z"
        style={{ fill: 'rgb(235, 0, 27)' }}
      />
      <path
        d="M24,12a7.41,7.41,0,0,1-12,5.83A7.42,7.42,0,0,0,12,6.17,7.41,7.41,0,0,1,24,12Z"
        style={{ fill: 'rgb(247, 158, 27)' }}
      />
    </g>
  </svg>
);

export { VisaIcon, MasterCardIcon };
