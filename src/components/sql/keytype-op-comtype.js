// 所有逻辑连接符列表
const ALL_LOGIC_OPERATOR = ['AND', 'OR', 'NOT'];
const ALL_LOGIC_OPERATOR_OPTIONS = [
  {
    label: 'AND',
    value: 'AND'
  },
  {
    label: 'OR',
    value: 'OR'
  },
  {
    label: 'NOT',
    value: 'NOT'
  }
];
const ALL_LOGIC_OPERATOR_WITHOUT_NOT = ['AND', 'OR'];
const ALL_LOGIC_OPERATOR_OPTIONS_WITHOUT_NOT = [
  {
    label: 'AND',
    value: 'AND'
  },
  {
    label: 'OR',
    value: 'OR'
  }
];

// 所有操作符列表
const ALL_OPERATORS = [
  '==',
  '!=',
  '=~', // 正则匹配
  '!~', // 正则不匹配
  '>',
  '<',
  '>=',
  '<=',
  'exist',
  'notexist',
  'in',
  'notin',
  'contains',
  'notcontains',
  'match',
  'startwith',
  'endwith'
];

// 所有属于number的类型
const ALL_NUMBER_TYPE = ['number', 'double', 'long', 'int', 'float'];
// 字典里属于number的类型
const DICTONARY_NUMBER_TYPE = ['double', 'long', 'int', 'float'];

const ALL_OPERATORS_NORMAL = ['==', '!=', '=~', '!~', '>', '<', '>=', '<='];

const ALL_OPERATORS_OPTIONS = [
  {
    label: '等于(==)',
    value: '=='
  },
  {
    label: '不等于(!=)',
    value: '!='
  },
  {
    label: '正则匹配(=~)',
    value: '=~'
  },
  {
    label: '正则不匹配(!~)',
    value: '!~'
  },
  {
    label: '大于(>)',
    value: '>'
  },
  {
    label: '小于(<)',
    value: '<'
  },
  {
    label: '大于等于(>=)',
    value: '>='
  },
  {
    label: '小于等于(<=)',
    value: '<='
  },
  {
    label: '属于(in)',
    value: 'in'
  },
  {
    label: '不属于(notin)',
    value: 'notin'
  },
  {
    label: '存在(exist)',
    value: 'exist'
  },
  {
    label: '不存在(notexist)',
    value: 'notexist'
  },
  {
    label: '包含(contains)',
    value: 'contains'
  },
  {
    label: '不包含(notcontains)',
    value: 'notcontains'
  },
  {
    label: '开始于(startwith)',
    value: 'startwith'
  },
  {
    label: '结束于(endwith)',
    value: 'endwith'
  },
  {
    label: '匹配(match)',
    value: 'match'
  }
];
// 字段类型支持的运算符对应的默认值, 目前mirror,auth,cdms默认值一样都使用default, 后续有新增可补充
const FIELD_TYPE_SUPPORT_OP_DEFAULT_MAP = {
  default: {
    number: ['==', '!=', '>', '<', '>=', '<=', 'in', 'notin', 'exist', 'notexist'],
    string: ['==', '!=', 'in', 'notin', 'exist', 'notexist', 'contains', 'notcontains', 'startwith', 'endwith'],
    ip: ['==', '!=', 'in', 'notin', 'exist', 'notexist'],
    timestamp: ['==', '!=', 'in', 'notin', 'exist', 'notexist'],
    boolean: ['==', '!=', 'exist', 'notexist'],
    enum: ['==', '!=', 'in', 'notin', 'exist', 'notexist'],
    array: ['in', 'notin', 'exist', 'notexist', 'contains', 'notcontains', 'startwith', 'endwith'],
    dylist: ['match']
  },
  baas: {
    number: ['==', '!=', '>', '<', '>=', '<=', 'in', 'notin', 'exist', 'notexist', 'match'],
    string: [
      '==',
      '!=',
      'in',
      'notin',
      'exist',
      'notexist',
      'contains',
      'notcontains',
      '=~',
      '!~',
      'startwith',
      'endwith',
      'match'
    ],
    ip: ['==', '!=', 'in', 'notin', 'exist', 'notexist', 'match'],
    timestamp: ['==', '!=', 'in', 'notin', 'exist', 'notexist'],
    boolean: ['==', '!=', 'exist', 'notexist'],
    enum: ['==', '!=', 'in', 'notin', 'exist', 'notexist'],
    array: ['in', 'notin', 'exist', 'notexist', 'contains', 'notcontains', 'startwith', 'endwith'],
    dylist: ['match']
  }
  // cdms: {},
};
// 字段类型转换现有类型 double，long，int，float都属于number
const FIELDTYPE_OPERATOR_MAP = {
  double: 'number',
  long: 'number',
  int: 'number',
  float: 'number',
  number: 'number',
  string: 'string',
  ip: 'ip',
  timestamp: 'timestamp',
  boolean: 'boolean',
  enum: 'enum',
  array: 'array',
  dylist: 'dylist'
};

// // V5.1.0 兼容后端不支持exit/notexit运算符的情况 【涉及图表管理和资产失陷态势配置模块】
// const NOT_SUPPORT_EXIT_OPERATOR = [
//   't_security_incidents',
//   't_asset_information',
//   't_asset_vulnerability_information',
//   't_work_order',
// ];

const FIELDTYPE_COMTYPE_MAP = {
  // INPUTNUMBER
  double: 'INPUTNUMBER',
  long: 'INPUTNUMBER',
  int: 'INPUTNUMBER',
  float: 'INPUTNUMBER',
  number: 'INPUTNUMBER',
  //
  string: 'INPUTSTRING',
  ip: 'INPUTSTRING',
  timestamp: 'INPUTSTRING',
  //
  boolean: 'MULTISELECT',
  //
  enum: 'MULTISELECT',
  //
  array: 'INPUTSTRING'
};

const ELEMENT_AND_OBJECT_SUPPORT_TYPE = ['ip', 'string', 'number', 'double', 'long', 'int', 'float'];
const THRESHOLD_SUPPORT_OPERATOR = ['==', '!=', '>', '<', '>=', '<='];

export {
  ALL_OPERATORS,
  ALL_NUMBER_TYPE,
  DICTONARY_NUMBER_TYPE,
  ALL_OPERATORS_NORMAL,
  ALL_OPERATORS_OPTIONS,
  ALL_LOGIC_OPERATOR,
  ALL_LOGIC_OPERATOR_WITHOUT_NOT,
  FIELDTYPE_COMTYPE_MAP,
  ALL_LOGIC_OPERATOR_OPTIONS,
  ALL_LOGIC_OPERATOR_OPTIONS_WITHOUT_NOT,
  ELEMENT_AND_OBJECT_SUPPORT_TYPE,
  THRESHOLD_SUPPORT_OPERATOR,
  FIELDTYPE_OPERATOR_MAP,
  FIELD_TYPE_SUPPORT_OP_DEFAULT_MAP
};
