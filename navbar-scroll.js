/**
 * 导航栏水平滚动管理器
 * 用于手机端导航栏的响应式滚动功能
 */

class NavbarScrollManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navbarNav = document.querySelector('.navbar-nav');
    this.isScrollable = false;
    this.init();
  }

  init() {
    if (!this.navbar || !this.navbarNav) return;

    // 检测滚动是否可用
    this.checkScrollability();

    // 监听窗口大小变化
    window.addEventListener('resize', () => this.checkScrollability());

    // 监听滚动事件
    this.navbarNav.addEventListener('scroll', () => this.onScroll());

    // 移动端触摸滑动增强
    this.setupTouchScroll();
  }

  checkScrollability() {
    if (!this.navbarNav) return;

    // 检查是否超出容器宽度
    const isScrollable = this.navbarNav.scrollWidth > this.navbarNav.clientWidth;

    if (isScrollable !== this.isScrollable) {
      this.isScrollable = isScrollable;
      if (isScrollable) {
        this.navbar.classList.add('scrollable');
      } else {
        this.navbar.classList.remove('scrollable');
      }
    }
  }

  onScroll() {
    // 可以在这里添加其他滚动相关的逻辑
    this.updateScrollIndicator();
  }

  updateScrollIndicator() {
    if (!this.navbarNav) return;

    const { scrollLeft, scrollWidth, clientWidth } = this.navbarNav;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    // 如果滚动到末尾，隐藏指示器
    if (isAtEnd) {
      this.navbar.classList.remove('scrollable');
    } else {
      this.navbar.classList.add('scrollable');
    }
  }

  setupTouchScroll() {
    if (!this.navbarNav) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    this.navbarNav.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - this.navbarNav.offsetLeft;
      scrollLeft = this.navbarNav.scrollLeft;
    });

    this.navbarNav.addEventListener('mouseleave', () => {
      isDown = false;
    });

    this.navbarNav.addEventListener('mouseup', () => {
      isDown = false;
    });

    this.navbarNav.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - this.navbarNav.offsetLeft;
      const walk = (x - startX) * 1; // 滚动速度倍数
      this.navbarNav.scrollLeft = scrollLeft - walk;
    });

    // 触摸事件支持（移动端）
    let touchStartX = 0;
    let touchScrollLeft = 0;

    this.navbarNav.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = this.navbarNav.scrollLeft;
    });

    this.navbarNav.addEventListener('touchmove', (e) => {
      if (!touchStartX) return;
      const touchCurrentX = e.touches[0].pageX;
      const diff = touchStartX - touchCurrentX;
      this.navbarNav.scrollLeft = touchScrollLeft + diff;
    });

    this.navbarNav.addEventListener('touchend', () => {
      touchStartX = 0;
    });
  }

  // 自动滚动到指定导航项
  scrollToActive() {
    if (!this.navbarNav) return;

    const activeLink = this.navbarNav.querySelector('a.active');
    if (activeLink) {
      // 使用 scrollIntoView 使活跃项居中可见
      activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // 手动滚动到指定位置
  scrollToPosition(position) {
    if (!this.navbarNav) return;
    this.navbarNav.scrollLeft = position;
  }

  // 获取当前滚动位置
  getScrollPosition() {
    return this.navbarNav ? this.navbarNav.scrollLeft : 0;
  }
}

// 初始化（页面加载完成后）
document.addEventListener('DOMContentLoaded', () => {
  // 仅在移动设备或小屏幕上初始化
  const navbarScrollManager = new NavbarScrollManager();

  // 在导航项加载完成后自动滚动到活跃项
  setTimeout(() => {
    navbarScrollManager.scrollToActive();
  }, 100);

  // 将实例暴露到全局，方便调试
  window.navbarScrollManager = navbarScrollManager;
});
