/**
 * Smart Hover Algorithm (Triangle/Intent-Based Detection)
 * Detects if user is moving toward a submenu or just passing over
 */

export class SmartHoverManager {
  constructor() {
    this.mousePos = { x: 0, y: 0 }
    this.lastMousePos = { x: 0, y: 0 }
    this.velocity = { x: 0, y: 0 }
    this.activeMenu = null
    this.hoverTimeout = null
    this.leaveTimeout = null
    this.DELAY = 150 // ms delay before closing
  }

  updateMousePosition(x, y) {
    this.lastMousePos = { ...this.mousePos }
    this.mousePos = { x, y }
    
    // Calculate velocity (pixels per frame approximation)
    this.velocity = {
      x: x - this.lastMousePos.x,
      y: y - this.lastMousePos.y,
    }
  }

  /**
   * Check if mouse is moving toward submenu using triangle algorithm
   * @param {DOMRect} menuRect - Bounding rect of menu item
   * @param {DOMRect} submenuRect - Bounding rect of submenu
   * @param {number} x - Current mouse X
   * @param {number} y - Current mouse Y
   * @returns {boolean} - True if moving toward submenu
   */
  isMovingTowardSubmenu(menuRect, submenuRect, x, y) {
    if (!submenuRect) return false

    // Calculate triangle vertices
    // A: current mouse position
    // B: menu item center
    // C: submenu entry point (closest point on submenu to menu)

    const menuCenter = {
      x: menuRect.left + menuRect.width / 2,
      y: menuRect.top + menuRect.height / 2,
    }

    const submenuEntry = {
      x: submenuRect.left,
      y: submenuRect.top + submenuRect.height / 2,
    }

    // Calculate vectors
    const toMenu = {
      x: menuCenter.x - x,
      y: menuCenter.y - y,
    }

    const toSubmenu = {
      x: submenuEntry.x - x,
      y: submenuEntry.y - y,
    }

    // Dot product to check direction
    const dotProduct = toMenu.x * toSubmenu.x + toMenu.y * toSubmenu.y

    // If moving toward submenu (positive velocity in submenu direction)
    const movingTowardSubmenu = 
      this.velocity.x * toSubmenu.x + this.velocity.y * toSubmenu.y > 0

    // Distance checks
    const distToMenu = Math.sqrt(toMenu.x ** 2 + toMenu.y ** 2)
    const distToSubmenu = Math.sqrt(toSubmenu.x ** 2 + toSubmenu.y ** 2)

    // Consider moving toward if:
    // 1. Velocity points toward submenu, OR
    // 2. Mouse is closer to submenu than menu item
    return movingTowardSubmenu || distToSubmenu < distToMenu
  }

  /**
   * Handle menu item enter
   */
  onMenuEnter(menuId, callback) {
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout)
      this.leaveTimeout = null
    }

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
    }

    this.hoverTimeout = setTimeout(() => {
      this.activeMenu = menuId
      callback?.()
    }, 50) // Small delay to prevent accidental triggers
  }

  /**
   * Handle menu item leave
   */
  onMenuLeave(menuRect, submenuRect, callback) {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    this.leaveTimeout = setTimeout(() => {
      const movingToward = this.isMovingTowardSubmenu(
        menuRect,
        submenuRect,
        this.mousePos.x,
        this.mousePos.y
      )

      if (!movingToward) {
        this.activeMenu = null
        callback?.()
      }
    }, this.DELAY)
  }

  /**
   * Handle submenu enter - cancel any pending leave
   */
  onSubmenuEnter() {
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout)
      this.leaveTimeout = null
    }
  }

  /**
   * Handle submenu leave
   */
  onSubmenuLeave(callback) {
    this.leaveTimeout = setTimeout(() => {
      this.activeMenu = null
      callback?.()
    }, this.DELAY)
  }

  cleanup() {
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout)
    if (this.leaveTimeout) clearTimeout(this.leaveTimeout)
  }
}

