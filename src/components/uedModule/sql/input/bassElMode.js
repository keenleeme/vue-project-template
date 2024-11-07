// import EventBus from '@/common/libs/bus.js';

export default function customizeMode(_CodeMirror, fieldList = [], eventName) {
  const data_language = 'en';
  // TODO
  // EventBus.$on(eventName, (val) => {
  //   data_language = val;
  // });

  _CodeMirror.defineMIME('baas/el', 'baasel');
  _CodeMirror.defineMode('baasel', function (config, parserConfig) {
    function parseKeyWords(str) {
      const obj = {};
      str
        .replace(/\s+/g, ' ')
        .split(' ')
        .forEach((word) => {
          obj[word] = true;
        });
      return obj;
    }

    const fieldsString = fieldList.map((obj) => obj.value).join(' ');
    const fields = parseKeyWords(fieldsString);
    // en
    const booleanValues = parseKeyWords('true false');
    const operators1 = parseKeyWords('exist notexist in notin like contains notcontains match startwith endwith');
    const keywords = parseKeyWords('and or not');
    // zh
    const booleanValuesZh = parseKeyWords('是 否');
    const operators1Zh = parseKeyWords(
      '存在 不存在 等于 不等于 大于等于 小于等于 大于 小于 属于 不属于 包含 匹配 匹配活动列表 正则匹配 正则不匹配 开始于 结束于'
    );
    const keywordsZh = parseKeyWords('与 或');

    function tokenString(quote) {
      return function (stream, state) {
        let escaped = false;
        let next;
        if (parserConfig.jsonld && stream.peek() === '@' && stream.match(isJsonldKeyword)) {
          state.tokenize = tokenBase; 
          return 'meta';
        }
        while ((next = stream.next()) != null) {
          if (next === quote && !escaped) break;
          escaped = !escaped && next === '\\';
        }
        if (!escaped) state.tokenize = tokenBase; 
        return 'ql-string';
      };
    }

    // 匹配英文字符，添加 class
    const queryEnglishToken = (stream, state) => {
      state.beforeParams = false;
      const ch = stream.next();
      if (ch === '"' /*  || ch === "'" */) {
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      }
      if (ch === '.' && stream.match(/^\d[\d_]*(?:[eE][+-]?[\d_]+)?/)) {
        return 'ql-number';
      }
      if (ch === '[') {
        stream.skipTo(']');
        // stream.eat(']');
        // return 'ql-string';
        stream.eatWhile(']');
        const word = stream.current();
        if (word.indexOf('"') > -1 || word.indexOf("'") > -1) {
          return 'ql-string';
        }
        return 'ql-fieldName';
      }
      if (/\d/.test(ch)) {
        stream.eatWhile(/[\w.]/);
        return 'ql-number';
      }
      stream.eatWhile(/[\w$_{}:\xa1-\uffff]/);
      const word = stream.current();
      if (word.indexOf('dynList') > -1) {
        stream.eatWhile(/(dynList:)(\B)*/);
        return 'ql-string';
      }
      if (operators1 && word.toLowerCase() in operators1) {
        return 'ql-operator';
      }
      if (ch === '>' || ch === '<' || ch === '!' || ch === '=') {
        stream.eatWhile(/=|~/);
        return 'ql-operator';
      }
      if (keywords && word.toLowerCase() in keywords) {
        return 'ql-keyword';
      }
      if (booleanValues && word in booleanValues) {
        return 'ql-boolean';
      }
      if (fields && word in fields) {
        return 'ql-fieldName';
      }
      return null;
    };

    // 匹配中文字符，添加 class
    const queryChineseToken = (stream, state) => {
      state.beforeParams = false;
      const ch = stream.next();
      if (ch === '"' /*  || ch === "'" */) {
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      }
      if (ch === '.' && stream.match(/^\d[\d_]*(?:[eE][+-]?[\d_]+)?/)) {
        return 'ql-number';
      }
      if (ch === '[') {
        stream.skipTo(']');
        stream.eatWhile(']');
        const word = stream.current();
        if (word.indexOf('"') > -1 || word.indexOf("'") > -1) {
          return 'ql-string';
        }
        return 'ql-fieldName';
      }
      if (/\d/.test(ch)) {
        stream.eatWhile(/[\w.]/);
        return 'ql-number';
      }
      stream.eatWhile(/[\w$_{}:\xa1-\uffff]/);
      const word = stream.current();
      // 活动列表字段匹配
      if (word.indexOf('对象列表') > -1) {
        stream.eatWhile(/(对象列表:)(\B)*/);
        return 'ql-string';
      }
      if (word.indexOf('动态阈值') > -1) {
        stream.eatWhile(/(动态阈值:)(\B)*/);
        return 'ql-string';
      }
      if (word.indexOf('元素列表') > -1) {
        stream.eatWhile(/(元素列表:)(\B)*/);
        return 'ql-string';
      }

      if (operators1Zh && word in operators1Zh) {
        return 'ql-operator';
      }
      if (keywordsZh && word in keywordsZh) {
        return 'ql-keyword';
      }
      if (booleanValuesZh && word in booleanValuesZh) {
        return 'ql-boolean';
      }
      if (fields && word in fields) {
        return 'ql-fieldName';
      }
      return null;
    };

    function tokenBase(stream, state) {
      return data_language === 'zh' ? queryChineseToken(stream, state) : queryEnglishToken(stream, state);
    }

    return {
      startState() {
        return {
          tokenize: tokenBase,
          beforeParams: false,
          inParams: false
        };
      },
      token(stream, state) {
        if (stream.eatSpace()) {
          return null;
        }
        return state.tokenize(stream, state);
      }
    };
  });
}
