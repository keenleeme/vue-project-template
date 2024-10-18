import { getCurrentInstance } from 'vue';
import { isEmpty } from 'lodash';
import {
  ALL_OPERATORS_OPTIONS,
  FIELDTYPE_OPERATOR_MAP,
  FIELD_TYPE_SUPPORT_OP_DEFAULT_MAP
} from './keytype-op-comtype.js';

/**
 * @description 处理当前字段对应的运算符选项
 * @param {type} 字段类型
 * @param {operatorsConfig} 运算符配置项
 */

export function setCurrentOperatorList(type, operatorsConfig, instance) {
  // const instance = getCurrentInstance();
  console.log(instance, 'instance');
  // 转换对应类型
  if (type) type = FIELDTYPE_OPERATOR_MAP[type];
  // 分场景取对应的运算符
  const currentOpList =
    !isEmpty(operatorsConfig) && operatorsConfig[type]
      ? operatorsConfig[type]
      : FIELD_TYPE_SUPPORT_OP_DEFAULT_MAP[instance.provides.contextData.provideProjectType.value][type];
  const opList = ALL_OPERATORS_OPTIONS.filter((item) => currentOpList.includes(item.value));
  return opList;
}

export function dispatch(componentName, eventName, params) {
  const instance = getCurrentInstance();
  if (!instance) return;

  findParentComponent(instance, componentName)?.$emit(eventName, ...params);
}

function findParentComponent(currentInstance, componentName) {
  let { parent } = currentInstance;

  while (parent) {
    if (parent.type.name === componentName) {
      return parent;
    }
    parent = parent.parent;
  }

  return null;
}

export function getDOMElement() {
  const instance = getCurrentInstance();
  if (!instance) return null;

  return instance.vnode.el;
}
