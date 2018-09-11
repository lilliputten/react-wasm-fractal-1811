import React from 'react';
import ReactDOM from 'react-dom';

import Canvas from './canvas';

const title = 'My Minimal React Webpack Babel Setup';

ReactDOM.render(
  <Canvas height={500} width={500} />,
  document.getElementById('app')
);

module.hot.accept();
