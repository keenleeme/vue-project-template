/**
 * 1. 中英文翻译
 * 英文：保留原有代码，不需要做特殊处理，针对新增的一些运算符做补充即可
 * 中文：通过统一的翻译接口获取结果
 *
 * 2. 特殊值的高亮处理
 * 英文：不需要做改动
 * 中文：针对中英对照表，翻译为指定的中文关键字，再通过正则进行匹配
 */
// import API from '@/common/apis/common';

/**
 * @description 【英文】高亮条件语句
 */
export function hightlightQueryByEnglish(val) {
  const GrammarMap =
    /(?<=\s)(exist|notexist|==|!=|>=|<=|>|<|in|notin|contains|notcontains|=~|!~|startwith|endwith)(?=\s)|(?<=\s)(exist|notexist)$/gi;
  const OperateMap = /(?<=\s)(AND|OR)(?=\s)/gi;
  const valueMap = /\[(?<!\\)"(.*?)(?<!\\)"\]|\[(.*?)\]|\['(.*?)'\]|(?<!\\)"(.*?)(?<!\\)"|((?<=(<|<=|>|>=)\s)\d+)/g;
  let res;
  res = val.replace(GrammarMap, (ele) => `<span style='color: #2d8cf0;'>${ele}</span>`);
  res = res.replace(
    valueMap,
    (item) => `<span style='color: blue;'>${item.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`
  );
  res = res.replace(OperateMap, (item1) => `<span style='color: orange;'>${item1}</span>`);
  return res;
}

/**
 * @description 【中文】高亮条件语句
 */
export function hightlightQueryByChinese(val) {
  const GrammarMap =
    /(?<=\s)(存在|不存在|等于|不等于|大于等于|小于等于|大于|小于|属于|不属于|包含|正则匹配|正则不匹配|开始于|结束于)(?=\s)|(?<=\s)(存在|不存在)$/gi;
  const OperateMap = /(?<=\s)(与|或)(?=\s)/gi;
  const valueMap = /\[(?<!\\)"(.*?)(?<!\\)"\]|\[(.*?)\]|\['(.*?)'\]|(?<!\\)"(.*?)(?<!\\)"|((?<=(<|<=|>|>=)\s)\d+)/g;
  let res;
  res = val.replace(GrammarMap, (ele) => `<span style='color: #2d8cf0;'>${ele}</span>`);
  res = res.replace(
    valueMap,
    (item) => `<span style='color: blue;'>${item.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`
  );
  res = res.replace(OperateMap, (item1) => `<span style='color: orange;'>${item1}</span>`);
  return res;
}

/**
 * @description mixins 中英文翻译
 */
export default {
  data() {
    return {
      // 当前表头选择的值 en / zh
      data_lang_table_val: 'en',
      // 缓存 翻译为中文的原英文内容
      data_lang_cache_en: [],
      // 翻译接口请求中
      data_lang_loading: false
    };
  },
  methods: {
    /**
     * @description 渲染Table表头
     * 中英文切换 icon
     */
    method_lang_table_renderHeader(h, title) {
      return h('span', { style: {} }, [
        // title
        h('span', { style: { 'margin-right': '4px' } }, title),
        // icon wrap
        h('span', { style: { position: 'relative' } }, [
          // icon
          this.data_lang_table_val === 'en'
            ? h(
                'svg',
                {
                  class: {
                    iconfont: true
                  },
                  style: {
                    color: 'var(--theme-color)',
                    cursor: 'pointer',
                    'font-size': '14px',
                    'vertical-align': '-3px'
                  },
                  attrs: {
                    'aria-hidden': true
                  },
                  on: {
                    click: () => {
                      this.data_lang_table_val = 'zh';
                      this.method_lang_change('zh');
                    }
                  }
                },
                [
                  h('use', {
                    attrs: {
                      'xlink:href': '#icon-AIQL-Chinese-line'
                    }
                  })
                ]
              )
            : h(
                'svg',
                {
                  class: {
                    iconfont: true
                  },
                  style: {
                    color: 'var(--theme-color)',
                    cursor: 'pointer',
                    'font-size': '14px',
                    'vertical-align': '-3px'
                  },
                  attrs: {
                    'aria-hidden': true
                  },
                  on: {
                    click: () => {
                      this.data_lang_table_val = 'en';
                      this.method_lang_change('en');
                    }
                  }
                },
                [
                  h('use', {
                    attrs: {
                      'xlink:href': '#icon-AIQL-English-line'
                    }
                  })
                ]
              ),
          // loading
          this.data_lang_loading
            ? h('Spin', { style: { display: 'inline-block' }, attrs: { fix: true, size: 'small' } })
            : null
        ])
      ]);
    },
    /**
     * @description columns中直接配置 render 函数
     */
    method_lang_hightlightQuery_byRender(h, val) {
      return h(
        'Tooltip',
        {
          attrs: {
            placement: 'top',
            content: this.method_lang_hightlightQuery(val),
            transfer: true
          }
        },
        [
          h(
            'div',
            {
              style: {
                width: '100%',
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap'
              }
            },
            val
          )
        ]
      );
    },
    /**
     * @description 转换数据，请求接口
     * 当Table列表请求接口返回数据时，如果当前指定为中文，需要翻译
     * 1. 以分页10条为例，拿到列表数据和指定需要翻译的 key 所在的一列
     * 2. 翻译合并之后再按原格式返回
     */
    async method_lang_translate(data = [], key, option) {
      // 缓存英文数据
      if (this.data_lang_table_val === 'zh') {
        this.data_lang_cache_en = data;
      } else {
        return this.data_lang_cache_en;
      }
      // 接口请求
      let result = [];
      try {
        this.data_lang_loading = true;
        // 数据应该是按照传入的顺序一一对应返回
        const targetData = data.map((n) => n[key] || '');
        const params = { querys: targetData };
        // 翻译：字典名称、第三方字典id
        if (option && option.dataSource) params.dataSource = option.dataSource;
        if (option && option.datasourceCode) params.datasourceCode = option.datasourceCode;
        // TODO
        const res = {}; // await API.fetchTranslateLanguage(params);
        if (res.code === 0 && Array.isArray(res.data)) {
          result = data.map((item, index) => {
            // 中文引号影响字符匹配，替换为英文引号
            const strVal = (res.data[index] || '').replace(/“/g, '"').replace(/”/g, '"');
            return { ...item, [key]: strVal };
          });
        }
      } catch (error) {
        this.$Message.error(error.message || '翻译接口错误');
      } finally {
        this.data_lang_loading = false;
      }
      return result;
    },
    /**
     * @description 针对接口列表中请求数据时，直接对结果进行翻译
     */
    async method_lang_translate_inRequest(data = [], key, option) {
      // 数据缓存一次
      this.data_lang_cache_en = data;
      // 英文：不做处理直接返回
      if (this.data_lang_table_val === 'en') return data;
      // 中文：先调用接口翻译
      let result = [];
      try {
        // 数据应该是按照传入的顺序一一对应返回
        const targetData = data.map((n) => n[key] || '');
        const params = { querys: targetData };
        // 翻译：字典名称、第三方字典id
        if (option && option.dataSource) params.dataSource = option.dataSource;
        if (option && option.datasourceCode) params.datasourceCode = option.datasourceCode;
        // TODO fetch
        const res = {}; // await API.fetchTranslateLanguage(params);
        if (res.code === 0 && Array.isArray(res.data)) {
          result = data.map((item, index) => {
            // 中文引号影响字符匹配，替换为英文引号
            const strVal = (res.data[index] || '').replace(/“/g, '"').replace(/”/g, '"');
            return { ...item, [key]: strVal };
          });
        }
      } catch (error) {
        this.$Message.error(error.message || '翻译接口错误');
      }
      return result;
    },
    /**
     * @description 当前语言切换
     * 切换后需要重新渲染Table列表
     * 1. 翻译接口只做 英文 => 中文
     * 2. 如果切换为英文，一般不需要请求接口
     *
     * 注意：该方法应该用于在组件内使用（相同名称的函数会被覆盖，这里应该不会被调用执行）
     */
    method_lang_change(val) {
      console.warn('lang-change提醒: 你应该在组件中添加 method_lang_change 方法', val);
    },
    /**
     * @description 高亮文本 处理函数
     */
    method_lang_hightlightQuery(val) {
      return this.data_lang_table_val === 'en' ? hightlightQueryByEnglish(val) : hightlightQueryByChinese(val);
    },
    /**
     * @description 高亮文本 处理函数,针对单条数据，传入语言跟高亮的文本
     */
    method_lang_hightlightQueryForSingle(lang, val) {
      return lang === 'en' ? hightlightQueryByEnglish(val) : hightlightQueryByChinese(val);
    }
  }
};
