export const DataSource = [
  {
    value: 'pcapRecord',
    label: '取证PCAP',
    type: 'boolean',
    desc: '确定告警是否有pcap包下载',
    list: [
      {
        label: '是',
        value: true
      },
      {
        name: '否',
        value: false
      }
    ]
  },
  {
    value: 'dhcpAddress',
    label: 'ip地址',
    type: 'string',
    desc: '分配的IP地址'
  },
  {
    value: 'minTTLtoClient',

    label: '响应包最小生存时间',
    type: 'int',
    desc: '响应包最小生存时间'
  },
  {
    value: 'deviceAssetSubType',
    label: '设备类型',
    type: 'enum',
    desc: '添加时选定的资产设备类型',
    list: [
      {
        label: 'Windows',
        value: 'Windows',
        name: 'Windows'
      },
      {
        label: 'Nix',
        value: 'Nix',
        name: 'Nix'
      }
    ]
  },

  {
    value: 'TIName',
    label: '匹配情报库',
    type: 'array',
    desc: '情报名称，默认出厂或用户添加的情报名称，接收到的日志字段信息与该情报库的IoC相匹配。'
  }
];
// 表格数据
export const InputTipExplanation = [
  {
    grammar: 'AND',
    description: '与',
    example: 'srcAddress == "192.168.1.101" AND destAddress == "192.168.1.102"'
  },
  {
    grammar: 'OR',
    description: '或',
    example: 'srcAddress == "192.168.1.101" OR destAddress == "192.168.1.102"'
  },
  {
    grammar: '==',
    description: '等于',
    example: 'srcAddress == "192.168.1.101"'
  },
  {
    grammar: '!=',
    description: '不等于',
    example: 'srcAddress != "192.168.1.101"'
  },
  {
    grammar: '>',
    description: '大于',
    example: 'destPort > 1024'
  },
  {
    grammar: '<',
    description: '小于',
    example: 'destPort < 1024'
  },
  {
    grammar: '>=',
    description: '大于等于',
    example: 'destPort >= 1024'
  },
  {
    grammar: '<=',
    description: '小于等于',
    example: 'destPort <= 1024'
  },
  {
    grammar: 'exist',
    description: '存在',
    example: 'destAddress exist'
  },
  {
    grammar: 'notexist',
    description: '不存在',
    example: 'destAddress notexist'
  },
  {
    grammar: 'in',
    description: '属于',
    example: 'destAddress in ["192.168.1.101","192.168.1.102"]'
  },
  {
    grammar: 'notin',
    description: '不属于',
    example: 'destAddress notin ["192.168.1.101","192.168.1.102"]'
  },
  {
    grammar: 'contains',
    description: '包含',
    example: 'message contains "SQL注入"'
  }
];
