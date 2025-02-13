/*
 * MIT License
 *
 * Copyright (c) 2022 Crafter Software Corporation. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Spinner from './components/shared/Spinner';

import 'bootstrap/dist/css/bootstrap.css';
import './scss/app.scss';

const App = React.lazy(() => import('./components/App'));

render(
  <Suspense fallback={<Spinner/>}>
    <App/>
  </Suspense>,
  document.getElementById('root')
);

function render(component, container) {

  // Some libs have components with still "unsafe" lifecycle stuff.
  // Cant' switch concurrent mode on yet.
  // ReactDOM.unstable_createRoot(container).render(component);

  ReactDOM.render(component, container);

}
