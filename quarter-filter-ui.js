/**
 * 季度筛选UI组件
 */

class QuarterFilterUI {
  constructor(containerSelector = 'nav') {
    this.container = document.querySelector(containerSelector);
    this.quarterManager = window.quarterManager;
    this.isInitialized = false;
    this.init();
  }

  /**
   * 初始化UI
   */
  init() {
    if (!this.container || !this.quarterManager) {
      console.warn('季度过滤器UI初始化失败：容器或季度管理器不存在');
      return;
    }

    // 检查是否已存在季度选择器
    if (document.getElementById('quarter-filter-wrapper')) {
      this.isInitialized = true;
      this.attachEventListeners();
      return;
    }

    this.createUI();
    this.attachEventListeners();
    this.isInitialized = true;
  }

  /**
   * 创建UI元素
   */
  createUI() {
    const wrapper = document.createElement('div');
    wrapper.id = 'quarter-filter-wrapper';
    wrapper.className = 'quarter-filter-wrapper';
    wrapper.innerHTML = `
      <div class="quarter-filter-container">
        <label for="quarter-select" class="quarter-label">
          季度：
        </label>
        <select id="quarter-select" class="quarter-select">
          <option value="2025Q4">2025Q4</option>
          <option value="2025Q3">2025Q3</option>
        </select>
      </div>
    `;

    // 在导航栏的合适位置插入
    const navRight = this.container.querySelector('.nav-right');
    if (navRight) {
      navRight.insertBefore(wrapper, navRight.firstChild);
    } else {
      this.container.appendChild(wrapper);
    }

    this.addStyles();
  }

  /**
   * 添加样式
   */
  addStyles() {
    if (document.getElementById('quarter-filter-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'quarter-filter-styles';
    style.textContent = `
      .quarter-filter-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
      }

      .quarter-filter-container {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(15, 23, 42, 0.5);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 6px;
        padding: 6px 12px;
      }

      .quarter-label {
        font-size: 0.875rem;
        color: rgba(148, 163, 184, 0.8);
        font-weight: 500;
        white-space: nowrap;
      }

      .quarter-select {
        padding: 6px 10px;
        border: 1px solid rgba(100, 116, 139, 0.4);
        border-radius: 4px;
        background: rgba(30, 41, 59, 0.8);
        color: rgba(226, 232, 240, 0.95);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 100px;
      }

      .quarter-select:hover {
        background: rgba(30, 41, 59, 0.95);
        border-color: rgba(148, 163, 184, 0.5);
      }

      .quarter-select:focus {
        outline: none;
        border-color: rgba(6, 182, 212, 0.6);
        background: rgba(15, 23, 42, 0.9);
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
      }

      .quarter-select option {
        background: rgba(15, 23, 42, 0.95);
        color: rgba(226, 232, 240, 0.95);
        border: 1px solid rgba(100, 116, 139, 0.3);
      }

      /* 浅色模式 */
      :not(.dark) .quarter-filter-container {
        background: rgba(255, 255, 255, 0.7);
        border-color: rgba(100, 116, 139, 0.2);
      }

      :not(.dark) .quarter-label {
        color: rgba(51, 65, 85, 0.7);
      }

      :not(.dark) .quarter-select {
        background: rgba(248, 250, 252, 0.9);
        color: rgba(15, 23, 42, 0.95);
        border-color: rgba(100, 116, 139, 0.3);
      }

      :not(.dark) .quarter-select:hover {
        background: rgba(248, 250, 252, 0.95);
        border-color: rgba(51, 65, 85, 0.4);
      }

      :not(.dark) .quarter-select:focus {
        border-color: rgba(6, 182, 212, 0.5);
        background: rgba(240, 249, 255, 0.9);
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
      }

      :not(.dark) .quarter-select option {
        background: rgba(248, 250, 252, 0.95);
        color: rgba(15, 23, 42, 0.95);
      }

      /* 响应式 */
      @media (max-width: 768px) {
        .quarter-filter-wrapper {
          padding: 6px 8px;
          gap: 8px;
        }

        .quarter-filter-container {
          padding: 4px 8px;
        }

        .quarter-label {
          font-size: 0.75rem;
        }

        .quarter-select {
          font-size: 0.75rem;
          padding: 4px 8px;
          min-width: 80px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * 绑定事件监听
   */
  attachEventListeners() {
    const select = document.getElementById('quarter-select');
    if (!select) {
      return;
    }

    // 设置初始值
    select.value = this.quarterManager.getQuarter();

    // 监听选择变化
    select.addEventListener('change', (e) => {
      const selectedQuarter = e.target.value;
      this.quarterManager.setQuarter(selectedQuarter);
      this.updateStatus();
    });

    // 监听季度变化
    this.quarterManager.onQuarterChange(() => {
      this.updateStatus();
    });
  }

  /**
   * 更新状态显示
   */
  updateStatus() {
    const select = document.getElementById('quarter-select');

    if (select) {
      select.value = this.quarterManager.getQuarter();
    }
  }

  /**
   * 获取当前选择的季度
   */
  getSelectedQuarter() {
    return this.quarterManager.getQuarter();
  }

  /**
   * 以编程方式设置季度
   */
  setQuarter(quarter) {
    this.quarterManager.setQuarter(quarter);
    this.updateStatus();
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.quarterFilterUI = new QuarterFilterUI();
  });
} else {
  window.quarterFilterUI = new QuarterFilterUI();
}
