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

import React, { createContext, useContext, useMemo } from 'react';
import { isAuthoring } from './utils';
import { useSpreadState } from './hooks';

export const GlobalContext = createContext();

function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(`useGlobalContext must be used within a GlobalContextProvider`);
  }
  return context;
}

function GlobalContextProvider(props) {
  const [state, setState] = useSpreadState({
    isAuthoring: isAuthoring(),
    locale: 'en',
    pages: null,
    pagesLoading: false,
    theme: 'light'
  });
  const value = useMemo(() => [state, setState], [state, setState]);
  return <GlobalContext.Provider value={value} {...props} />;
}

export { GlobalContextProvider, useGlobalContext };
