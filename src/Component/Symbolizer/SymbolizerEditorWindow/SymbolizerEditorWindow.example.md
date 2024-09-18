<!--
 * Released under the BSD 2-Clause License
 *
 * Copyright © 2018-present, terrestris GmbH & Co. KG and GeoStyler contributors
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

This demonstrates the use of `SymbolizerEditorWindow`.

```jsx
import React from 'react';
import { Button } from 'antd';
import { SymbolizerEditorWindow } from 'geostyler';

class SymbolizerEditorWindowExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showWindow: false,
      symbolizers: [{
        kind: 'Fill'
      }, {
        kind: 'Line'
      }]
    };

    this.onSymbolizersChange = this.onSymbolizersChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onSymbolizersChange(symbolizers) {
    this.setState({
      symbolizers: symbolizers
    });
  }

  onButtonClick() {
    this.setState({
      showWindow: true
    });
  }

  onClose() {
    this.setState({
      showWindow: false
    });
  }

  render() {
    const {
      symbolizers,
      showWindow
    } = this.state;

    return (
      <div>
        <Button onClick={this.onButtonClick}>Show SymbolizerEditorWindow</Button>
        <SymbolizerEditorWindow
          open={showWindow}
          symbolizers={symbolizers}
          onSymbolizersChange={this.onSymbolizersChange}
          onClose={this.onClose}
        />
      </div>
    );
  }
}

<SymbolizerEditorWindowExample />
```
