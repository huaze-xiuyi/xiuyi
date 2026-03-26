/**
 * 下拉列表筛选UI组件
 * 用于替代按钮式筛选，提供更紧凑的筛选界面
 */

class FilterDropdown {
  constructor(options = {}) {
    this.containerId = options.containerId;
    this.label = options.label || '筛选';
    this.items = options.items || [];
    this.onSelect = options.onSelect || (() => {});
    this.selectedValue = options.defaultValue || null;
    this.className = options.className || '';
  }

  /**
   * 初始化下拉列表
   */
  init() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }

    container.innerHTML = this.render();
    this.attachEventListeners();
  }

  /**
   * 渲染HTML
   */
  render() {
    const uniqueId = `dropdown-${this.containerId}`;
    const selectedItem = this.items.find(item => item.value === this.selectedValue) || this.items[0];
    const selectedText = selectedItem ? selectedItem.label : this.label;

    return `
      <div class="filter-dropdown-wrapper ${this.className}">
        <button
          class="filter-dropdown-button"
          id="${uniqueId}-btn"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-label="${this.label}筛选"
        >
          <span class="filter-dropdown-label">${this.label}:</span>
          <span class="filter-dropdown-value">${selectedText}</span>
          <svg class="filter-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <div class="filter-dropdown-menu" id="${uniqueId}-menu" role="listbox">
          ${this.items.map((item, idx) => `
            <div
              class="filter-dropdown-item ${item.value === this.selectedValue ? 'active' : ''}"
              data-value="${item.value}"
              role="option"
              aria-selected="${item.value === this.selectedValue}"
              tabindex="${idx === 0 ? '0' : '-1'}"
            >
              ${item.label}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * 绑定事件监听
   */
  attachEventListeners() {
    const btnId = `dropdown-${this.containerId}-btn`;
    const menuId = `dropdown-${this.containerId}-menu`;
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);

    if (!btn || !menu) return;

    const items = menu.querySelectorAll('.filter-dropdown-item');

    // 按钮点击切换菜单
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('active');
      btn.setAttribute('aria-expanded', isOpen);
    });

    // 菜单项点击
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = item.dataset.value;

        // 更新选中状态
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
        items.forEach(i => {
          if (i !== item) i.setAttribute('aria-selected', 'false');
        });

        // 更新按钮文本
        const selectedLabel = item.textContent;
        const valueSpan = btn.querySelector('.filter-dropdown-value');
        if (valueSpan) {
          valueSpan.textContent = selectedLabel;
        }

        // 关闭菜单
        menu.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');

        // 调用回调
        this.selectedValue = value;
        this.onSelect(value);
      });

      // 键盘导航
      item.addEventListener('keydown', (e) => {
        const allItems = Array.from(items);
        const currentIdx = allItems.indexOf(item);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextItem = allItems[currentIdx + 1];
          if (nextItem) {
            nextItem.focus();
            nextItem.click();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevItem = allItems[currentIdx - 1];
          if (prevItem) {
            prevItem.focus();
            prevItem.click();
          }
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });

    // 文档点击关闭菜单
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * 获取当前选中值
   */
  getValue() {
    return this.selectedValue;
  }

  /**
   * 设置选中值
   */
  setValue(value) {
    this.selectedValue = value;
    const menuId = `dropdown-${this.containerId}-menu`;
    const menu = document.getElementById(menuId);
    if (menu) {
      const items = menu.querySelectorAll('.filter-dropdown-item');
      items.forEach(item => {
        if (item.dataset.value === value) {
          item.classList.add('active');
          item.setAttribute('aria-selected', 'true');
          const btn = document.getElementById(`dropdown-${this.containerId}-btn`);
          const valueSpan = btn.querySelector('.filter-dropdown-value');
          if (valueSpan) {
            valueSpan.textContent = item.textContent;
          }
        } else {
          item.classList.remove('active');
          item.setAttribute('aria-selected', 'false');
        }
      });
    }
  }

  /**
   * 更新选项列表
   */
  setItems(items) {
    this.items = items;
    this.init();
  }

  /**
   * 销毁组件
   */
  destroy() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = '';
    }
  }
}

// 导出给全局使用
window.FilterDropdown = FilterDropdown;
