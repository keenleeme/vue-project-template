const EmptyTree = {
  depth: 0,
  id: 'rootNodeId',
  category: 'group',
  condition: 'AND',
  defaultExpand: true,
  defaultTreeExpand: true,
  rules: []
};

const SAMPLE_TREE1 = {
  id: 'rootNodeId',
  category: 'group',
  condition: 'AND',
  rules: []
};

const SAMPLE_TREE = {
  id: 'rootNodeId',
  category: 'group',
  condition: 'AND',
  rules: [
    {
      id: 'single1',
      category: 'single',
      type: 'string',
      field: '',
      operator: '',
      operatorType: '',
      value: ''
    },
    {
      id: 'group1',
      category: 'group',
      condition: 'OR',
      rules: [
        {
          id: 'single3',
          category: 'single',
          type: 'string',
          field: '',
          operator: '',
          operatorType: '',
          value: ''
        },
        {
          id: 'single4',
          category: 'single',
          type: 'string',
          field: '',
          operator: '',
          operatorType: '',
          value: ''
        },
        {
          id: 'group4',
          category: 'group',
          condition: 'AND',
          rules: [
            {
              id: 'single6',
              category: 'single',
              type: 'string',
              field: '',
              operator: '',
              operatorType: '',
              value: ''
            }
          ]
        }
      ]
    },
    {
      id: 'single2',
      category: 'single',
      type: 'string',
      field: '',
      operator: '',
      operatorType: '',
      value: ''
    },
    {
      id: 'group2',
      category: 'group',
      condition: 'AND',
      rules: [
        {
          id: 'single5',
          category: 'single',
          type: 'string',
          field: '',
          operator: '',
          operatorType: '',
          value: ''
        }
      ]
    }
  ]
};

export { EmptyTree, SAMPLE_TREE, SAMPLE_TREE1 };
