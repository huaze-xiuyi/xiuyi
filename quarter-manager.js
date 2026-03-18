/**
 * 季度数据管理器
 * 支持在Q3和Q4数据之间切换
 */

class QuarterManager {
  constructor() {
    this.quarters = ['2025Q4', '2025Q3'];
    this.currentQuarter = this.loadQuarter();
    this.callbacks = [];
    this.dataCache = {};
    this.dataType = 'happiness'; // 'happiness' 或 'happy'
  }

  /**
   * 从localStorage加载保存的季度
   */
  loadQuarter() {
    const saved = localStorage.getItem('selectedQuarter');
    return saved && this.quarters.includes(saved) ? saved : '2025Q4';
  }

  /**
   * 保存季度到localStorage
   */
  saveQuarter(quarter) {
    localStorage.setItem('selectedQuarter', quarter);
  }

  /**
   * 获取当前季度
   */
  getQuarter() {
    return this.currentQuarter;
  }

  /**
   * 设置季度并触发回调
   */
  setQuarter(quarter) {
    if (!this.quarters.includes(quarter) || quarter === this.currentQuarter) {
      return;
    }

    this.currentQuarter = quarter;
    this.saveQuarter(quarter);
    this.notifyCallbacks();
  }

  /**
   * 获取指定季度的数据
   */
  getQuarterData(quarter = this.currentQuarter, dataType = null) {
    const type = dataType || this.dataType;

    if (type === 'happy') {
      // 上海区整体数据
      if (quarter === '2025Q4') {
        return typeof happy !== 'undefined' ? happy : [];
      } else if (quarter === '2025Q3') {
        return typeof happyQ3 !== 'undefined' ? happyQ3 : [];
      }
    } else {
      // 片区数据（默认）
      if (quarter === '2025Q4') {
        return typeof happiness !== 'undefined' ? happiness : [];
      } else if (quarter === '2025Q3') {
        return typeof happinessQ3 !== 'undefined' ? happinessQ3 : [];
      }
    }
    return [];
  }

  /**
   * 获取当前季度的数据
   */
  getCurrentData(dataType = null) {
    return this.getQuarterData(this.currentQuarter, dataType);
  }

  /**
   * 获取所有季度的数据
   */
  getAllQuartersData(dataType = null) {
    const result = {};
    this.quarters.forEach(quarter => {
      result[quarter] = this.getQuarterData(quarter, dataType);
    });
    return result;
  }

  /**
   * 设置数据类型 ('happiness' 或 'happy')
   */
  setDataType(type) {
    if (['happiness', 'happy'].includes(type)) {
      this.dataType = type;
    }
  }

  /**
   * 获取当前数据类型
   */
  getDataType() {
    return this.dataType;
  }

  /**
   * 注册季度变化回调
   */
  onQuarterChange(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  /**
   * 触发所有回调
   */
  notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback(this.currentQuarter, this.getCurrentData());
      } catch (error) {
        console.error('季度变化回调执行出错:', error);
      }
    });
  }

  /**
   * 获取所有可用季度
   */
  getAvailableQuarters() {
    return [...this.quarters];
  }

  /**
   * 按条件过滤数据
   */
  filterData(data, conditions = {}) {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(item => {
      for (const [key, value] of Object.entries(conditions)) {
        if (item[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * 获取指定字段的统计信息
   */
  getSummary(data, field = '幸福指数综合得分') {
    if (!Array.isArray(data) || data.length === 0) {
      return { total: 0, avg: 0, max: 0, min: 0, count: 0 };
    }

    const values = data
      .map(item => {
        const val = parseFloat(item[field]);
        return isNaN(val) ? 0 : val;
      })
      .filter(val => val > 0);

    if (values.length === 0) {
      return { total: 0, avg: 0, max: 0, min: 0, count: 0 };
    }

    const total = values.reduce((a, b) => a + b, 0);
    return {
      total: parseFloat(total.toFixed(2)),
      avg: parseFloat((total / values.length).toFixed(2)),
      max: parseFloat(Math.max(...values).toFixed(2)),
      min: parseFloat(Math.min(...values).toFixed(2)),
      count: values.length
    };
  }
}

// 创建全局实例
const quarterManager = new QuarterManager();

// 支持全局方式访问
if (typeof window !== 'undefined') {
  window.quarterManager = quarterManager;
}
