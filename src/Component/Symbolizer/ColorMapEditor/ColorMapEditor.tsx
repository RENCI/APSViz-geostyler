/* Released under the BSD 2-Clause License
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
 */

import React, { BaseSyntheticEvent } from 'react';
import {
  Form,
  //Table,
  //Input,
  //Popover,
  //InputNumber
} from 'antd';

import {
  Input,
  Typography,
} from '@mui/joy';

import { ColorMap, ColorMapType, ColorMapEntry, isGeoStylerStringFunction } from 'geostyler-style';
//import { ExtendedField } from '../Field/ExtendedField/ExtendedField';
import { ColorMapTypeField } from '../Field/ColorMapTypeField/ColorMapTypeField';
//import { ColorField } from '../Field/ColorField/ColorField';
//import { OffsetField } from '../Field/OffsetField/OffsetField';
//import { OpacityField } from '../Field/OpacityField/OpacityField';
import RasterUtil from '../../../Util/RasterUtil';
import { ColorRampCombo } from '../../RuleGenerator/ColorRampCombo/ColorRampCombo';
import RuleGeneratorUtil from '../../../Util/RuleGeneratorUtil';
import { brewer } from 'chroma-js';

import './ColorMapEditor.less';

import _cloneDeep from 'lodash/cloneDeep';

import {
  InputConfig,
  useGeoStylerComposition,
  //useGeoStylerLocale
} from '../../../context/GeoStylerContext/GeoStylerContext';
import FunctionUtil from '../../../Util/FunctionUtil';
import { getFormItemConfig } from '../../../Util/FormItemUtil';

export interface ColorMapEntryRecord extends ColorMapEntry {
  key: number;
}

export interface ColorMapEditorComposableProps {
  // TODO add support for default values in ColorMapTypeField
  colorMapTypeField?: {
    visibility?: boolean;
  };
  nrOfClassesField?: InputConfig<number>;
  // TODO add support for default values in ColorRampCombo
  colorRampComboField?: {
    visibility?: boolean;
  };
  // TODO add support for default values in ExtendedField
  extendedField?: {
    visibility?: boolean;
  };
  // TODO add support for default values in ColorMapTable
  colorMapTable?: {
    visibility?: boolean;
  };
  colorRamps?: {
    [name: string]: string[];
  };
}

export interface ColorMapEditorInternalProps {
  colorMap?: ColorMap;
  onChange?: (colorMap: ColorMap) => void;
}

export type ColorMapEditorProps = ColorMapEditorInternalProps & ColorMapEditorComposableProps;

export const ColorMapEditor: React.FC<ColorMapEditorProps> = (props) => {

  const composition = useGeoStylerComposition('ColorMapEditor');
  const composed = { ...props, ...composition };
  const {
    colorMap,
   // colorMapTable,
    colorMapTypeField,
    colorRampComboField,
    colorRamps = {
      DefaultMaxWaterLevel: ['#313695', '#323C98', '#4E80B9', '#84BAD8', '#C0E3EF', '#EFF9DB', '#FEECA2', '#FDBD6F', '#F57A49', '#D93629', '#A50026'],
      DefaultMaxWindVelocity: ['#3E26A9', '#4433CD', '#4743E8', '#4755F6', '#4367FE', '#337AFD', '#2D8CF4', '#259CE8', '#1BAADF', '#04B6CE', '#12BEB9', '#2FC5A2', '#47CB86', '#71CD64', '#9FC941', '#C9C128', '#EBBB30', '#FFC13A', '#FBD42E', '#F5E824', '#FAFB14'],
      DefaultMaxSignificantWaveHeight: ['#30123B', '#3D3790', '#455ACD', '#467BF3', '#3E9BFF', '#28BBEC', '#18D7CC', '#21EBAC', '#46F884', '#78FF5A', '#A3FD3C', '#C4F133', '#E2DD37', '#F6C33A', '#FEA531', '#FC8021', '#F05B11', '#DE3D08', '#C42502', '#A31201', '#7A0402'],
      GeoStyler: ['#E7000E', '#F48E00', '#FFED00', '#00943D', '#272C82', '#611E82'],
      GreenRed: ['#00FF00', '#FF0000'],
      ...brewer
    },
    //extendedField,
    nrOfClassesField,
    onChange
  } = composed;

  //const locale = useGeoStylerLocale('ColorMapEditor');

  // Note that color ramps defined in the current colormap, may be
  // modified versions of the original list of colors, because the
  // user my have modified the number of intervals.
  // However the first and last color in the list should alsways
  // remain the same. I will depend on that fact to find the color
  // ramp name.
  const getColormapColorRampName = () => {
    // extract array of colors from the colormap
    const colorList = colorMap.colorMapEntries.map((entry) => {
      return (
        entry.color.toString()
      )
    });

    // now find this color ramp by match the first and last values of the
    // colors in the color ramp
    // defualt to first ramp in the list
    let rampName = Object.keys(colorRamps)[0]; 
    for (const [key, value] of Object.entries(colorRamps)) {
      if ((value[0].toUpperCase() === colorList[0].toUpperCase()) && (value[value.length-1].toUpperCase() === colorList[colorList.length-1].toUpperCase())) {
        rampName = key;
        break;
      }
    };
    return(rampName);
  };

  // set the colorRamp to the one used in the current colormap
  // TODO add colorRamp to CompositionContext
  const colorRamp = getColormapColorRampName();

  //const [colorRamp, setColorRamp] = useState<string>(initalValue);
  //let colorRamp = initialValue;

  const updateColorMap = (prop: string, value: any) => {
    let newColorMap: ColorMap;
    if (colorMap) {
      newColorMap = _cloneDeep(colorMap);
    } else {
      newColorMap = {
        type: 'ramp'
      };
    }
    newColorMap[prop as keyof ColorMap] = value;
    if (onChange) {
      onChange(newColorMap);
    }
  };

  /* const onExtendedChange = (extended: boolean) => {
    updateColorMap('extended', extended);
  }; */

  const onTypeChange = (type: ColorMapType) => {
    updateColorMap('type', type);
  };

  /**
   * Creates the number of default ColorMapEntries according to specified
   * number of classes. Table will be updated accordingly.
   *
   */
  //const onNrOfClassesChange = (value: number) => {
  const onNrOfClassesChange = (e: BaseSyntheticEvent) => {
    const value = e.target.value;
    const cmEntries = colorMap?.colorMapEntries;
    const newCmEntries: ColorMapEntry[] = cmEntries ? _cloneDeep(cmEntries) : [];

    if (value > newCmEntries.length) {
      while (newCmEntries.length < value) {
        newCmEntries.push(RasterUtil.generateColorMapEntry());
      }
    } else {
      while (newCmEntries.length > value) {
        newCmEntries.pop();
      }
    }
    applyColors(colorRamp, newCmEntries);
    updateColorMap('colorMapEntries', newCmEntries);
  };

  const onColorRampChange = (e: BaseSyntheticEvent, newColorRamp: string) => {
    const cmEntries = colorMap?.colorMapEntries;
    const newCmEntries = applyColors(newColorRamp, _cloneDeep(cmEntries));
    updateColorMap('colorMapEntries', newCmEntries);
    //setColorRamp(newColorRamp);
    // make a copy of the color ramp name
    //colorRamp = newColorRamp.substring(0, newColorRamp.length);

  };

  /**
   * Applies the colors of the selected colorRamp to the colorMapEntries.
   * Important: This method modifies the array of colorMapEntries 'cmEntries'.
   *
   * @return {ColorMapEntry[]} cmEntries, the modified array of colorMapEntries.
   */
  const applyColors = (newColorRamp: string, cmEntries: ColorMapEntry[] = []): ColorMapEntry[] => {
    const ramp = colorRamps[newColorRamp] ?
      colorRamps[newColorRamp] : colorRamps[Object.keys(colorRamps)[0]];
    const colors = RuleGeneratorUtil.generateColors(ramp, cmEntries.length);
    cmEntries.forEach((entry: ColorMapEntry, idx: number) => {
      entry.color = colors[idx];
    });
    return cmEntries;
  };

  /**
   * Updates property 'key' with 'value' of colorMapEntry at position 'index'.
   * Creates a new colorMapEntry if it did not exist yet.
   */
 /*  const setValueForColorMapEntry = (idx: number, key: string, value: any) => {
    const cmEntries = colorMap?.colorMapEntries;
    let newCmEntries: ColorMapEntry[];
    if (cmEntries) {
      newCmEntries = _cloneDeep(cmEntries);
      newCmEntries[idx][key as keyof ColorMapEntry] = value;
    } else {
      newCmEntries = [{}] as ColorMapEntry[];
      newCmEntries[0][key as keyof ColorMapEntry] = value;
    }
    updateColorMap('colorMapEntries', newCmEntries);
  }; */

  /*
  const colorMapRecords = colorMap?.colorMapEntries?.map((entry: ColorMapEntry, index: number): ColorMapEntryRecord => {
    return {
      key: index,
      ...entry
    };
  });
  */

  /**
   * Renderer method for the label column.

  const labelRenderer = (text: string, record: ColorMapEntryRecord) => {
    const input = (
      <Input
        className="gs-colormap-label-input"
        value={record.label as string}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const target = event.target;
          setValueForColorMapEntry(record.key, 'label', target.value);
        }}
      />);
    return (
      <Popover
        content={record.label as string}
        title={locale.labelLabel}
      >
        {input}
      </Popover>
    );
  };
  */

  /**
   * Renderer method for the color column.

  const colorRenderer = (text: string, record: ColorMapEntryRecord) => {
    const input = (
      <ColorField
        value={record.color as string}
        onChange={(color: Expression<string>) => {
          setValueForColorMapEntry(record.key, 'color', color);
        }}
      />
    );
    return input;
  };
  */

  /**
   * Renderer method for the quantity column.
  
  const quantityRenderer = (text: string, record: ColorMapEntryRecord) => {
    const input = (
      <OffsetField
        className="gs-colormap-quantity-input"
        offset={record.quantity}
        onChange={value => {
          setValueForColorMapEntry(record.key, 'quantity', value);
        }}
      />
    );
    return input;
  };
   */

  /**
   * Renderer method for the opacity column.
  
  const opacityRenderer = (text: string, record: ColorMapEntryRecord) => {
    const input = (
      <OpacityField
        className="gs-colormap-opacity-input"
        value={record.opacity}
        onChange={opacity => {
          setValueForColorMapEntry(record.key, 'opacity', opacity);
        }}
      />
    );
    return input;
  };
   */

  /* const columns: any = [{
    title: locale.colorLabel,
    dataIndex: 'color',
    render: colorRenderer
  }, {
    title: locale.quantityLabel,
    dataIndex: 'quantity',
    render: quantityRenderer
  }, {
    title: locale.labelLabel,
    dataIndex: 'label',
    render: labelRenderer
  }, {
    title: locale.opacityLabel,
    dataIndex: 'opacity',
    render: opacityRenderer
  }]; */

  // make sure colorMapEntries does exist
  let colorMapEntries: ColorMapEntry[] = colorMap?.colorMapEntries;
  if (!colorMapEntries) {
    colorMapEntries = [];
  }
  //const nrOfClasses = colorMapEntries.length;

  const colorMapType = isGeoStylerStringFunction(colorMap?.type)
    ? FunctionUtil.evaluateFunction(colorMap?.type) as ColorMapType
    : colorMap?.type;

  const itemConfig = getFormItemConfig();

  return (
    <div className="gs-colormap-symbolizer-editor" >
      <div className="gs-colormap-header-row">
        {
          colorMapTypeField?.visibility === false ? null : (
            <Form.Item
              {...itemConfig}
              //label={locale.typeLabel}
            >
              <Typography mb={2} level="title-md">Type</Typography>
              <ColorMapTypeField
                colorMapType={colorMapType}
                onChange={onTypeChange}
              />
            </Form.Item>
          )
        }
        {
          nrOfClassesField?.visibility === false ? null : (
            <Form.Item
              {...itemConfig}
              //label="Number of classes"
            >
              <Typography mb={2} level="title-md">Number of Classes</Typography>
              <Input
                type="number"
                value={colorMap.colorMapEntries.length} 
                className="number-of-classes-field"
                sx={{ width: 80 }}
                //defaultValue={nrOfClassesField?.default}
                slotProps={{
                  input: {
                    min: 2,
                    max: 30,
                  },
                }}
                onChange={onNrOfClassesChange}
                onKeyDown={(event) => {
                  event.preventDefault();
                }}
              />
            </Form.Item>
          )
        }
        {
          colorRampComboField?.visibility === false ? null : (
            <Form.Item
              {...itemConfig}
              //label={locale.colorRampLabel}
            >
              <Typography mb={2} level="title-md">Color Ramp</Typography>
              <ColorRampCombo
                onChange={onColorRampChange}
                colorRamp={colorRamp}
                colorRamps={colorRamps}
              />
            </Form.Item>
          )
        }
      </div>
    </div>
  );
};
