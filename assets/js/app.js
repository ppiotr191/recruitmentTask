
// any CSS you import will output into a single css file (app.css in this case)

import React from 'react';
import ReactDOM from 'react-dom';
import App from './Controller/App';
import '../css/app.css';

ReactDOM.render(<App />, document.getElementById('root'));