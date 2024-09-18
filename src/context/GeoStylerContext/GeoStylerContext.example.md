<!--
 * Released under the BSD 2-Clause License
 *
 * Copyright © 2023-present, terrestris GmbH & Co. KG and GeoStyler contributors
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
-->

The `GeoStylerContext` lets you define translations, static component props, and default values for many fields.

#### Example

Provide static component props. Here, we globally define the rendererType to use OpenLayers for rendering.
It also configures `unsupportedProperties`. e.g. you could use the `unsupportedProperties` of a geostyler-style-parser
here.

```jsx
import React from 'react';
import { GeoStylerContext, Style, locale } from 'geostyler';
import { Switch } from 'antd';

const GeoStylerContextExample = () => {
  const myContext = {
    composition: {
      Renderer: {
        rendererType: 'OpenLayers'
      }
    },
    // locale: locale.de_DE,
    unsupportedProperties: {
      Symbolizer: {
        LineSymbolizer: {
          dasharray: 'none',
          opacity: {
            support: 'none',
            info: 'Opacity is not supported in this example.'
          },
          join: {
            support: 'partial',
            info: 'Line join is only partially supported in this example.'
          }
        }
      },
      options: {
        locale: {
          notSupported: 'not supported 😞'
        },
        hideUnsupported: false
      }
    }
  };

  const style = {
    name: 'GeoStylerContext Example',
    rules: [
      {
        name: 'Rule 1',
        symbolizers: [
          {
            kind: 'Line',
            color: '#ff0000',
            width: 5
          }
        ]
      }
    ]
  }

  return (
    <GeoStylerContext.Provider value={myContext}>
      <Style
        style={style}
      />
    </GeoStylerContext.Provider>
  );
};

<GeoStylerContextExample />
```
