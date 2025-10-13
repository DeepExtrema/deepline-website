/**
 * InfoCard Component
 * Unified card component with multiple variants
 * Token-driven styling, theme-aware
 */

export class InfoCard {
  /**
   * Create InfoCard instance
   * @param {Object} options - Configuration options
   * @param {string} options.variant - 'default' | 'feature' | 'playbook' | 'step'
   * @param {string} [options.icon] - Icon URL (for default/feature variants)
   * @param {number} [options.number] - Step number (for step variant)
   * @param {string} options.title - Card heading
   * @param {string} [options.description] - Main description text
   * @param {string} [options.subtitle] - Subtitle/tagline (for playbook variant)
   * @param {Array<string>} [options.bullets] - Bullet points
   * @param {string} [options.badge] - Badge text (for playbook variant)
   * @param {Object} [options.cta] - CTA configuration
   * @param {string} options.cta.text - CTA button text
   * @param {string} options.cta.href - CTA button link
   * @param {string} [options.cta.event] - Analytics event name
   * @param {string} [options.className] - Additional CSS classes
   * @param {string} [options.id] - Element ID
   */
  constructor(options) {
    this.options = {
      variant: 'default',
      icon: null,
      number: null,
      title: '',
      description: '',
      subtitle: '',
      bullets: [],
      badge: '',
      cta: null,
      className: '',
      id: '',
      ...options
    };
    
    this.element = null;
    this.validateOptions();
  }
  
  /**
   * Validate required options
   */
  validateOptions() {
    const validVariants = ['default', 'feature', 'playbook', 'step'];
    if (!validVariants.includes(this.options.variant)) {
      console.warn(`Invalid variant: ${this.options.variant}. Defaulting to 'default'.`);
      this.options.variant = 'default';
    }
    
    if (!this.options.title) {
      console.error('InfoCard requires a title');
    }
    
    if (this.options.variant === 'step' && this.options.number === null) {
      console.warn('Step variant should have a number');
    }
  }
  
  /**
   * Render card element
   * @returns {HTMLElement}
   */
  render() {
    const card = document.createElement('div');
    card.className = this.buildClassName();
    
    if (this.options.id) {
      card.id = this.options.id;
    }
    
    // Build content based on variant
    switch (this.options.variant) {
      case 'step':
        this.renderStep(card);
        break;
      case 'playbook':
        this.renderPlaybook(card);
        break;
      case 'feature':
        this.renderFeature(card);
        break;
      default:
        this.renderDefault(card);
    }
    
    this.element = card;
    return card;
  }
  
  /**
   * Build CSS class names
   */
  buildClassName() {
    const classes = ['info-card', `info-card--${this.options.variant}`];
    
    if (this.options.className) {
      classes.push(this.options.className);
    }
    
    return classes.join(' ');
  }
  
  /**
   * Render default variant
   */
  renderDefault(card) {
    if (this.options.icon) {
      const icon = document.createElement('img');
      icon.src = this.options.icon;
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');
      icon.className = 'info-card__icon';
      icon.width = 112;
      icon.height = 72;
      card.appendChild(icon);
    }
    
    const title = document.createElement('h3');
    title.className = 'info-card__title';
    title.textContent = this.options.title;
    card.appendChild(title);
    
    if (this.options.description) {
      const desc = document.createElement('p');
      desc.className = 'info-card__description';
      desc.textContent = this.options.description;
      card.appendChild(desc);
    }
  }
  
  /**
   * Render feature variant
   */
  renderFeature(card) {
    if (this.options.icon) {
      const icon = document.createElement('img');
      icon.src = this.options.icon;
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');
      icon.className = 'info-card__icon info-card__icon--feature';
      card.appendChild(icon);
    }
    
    const title = document.createElement('h3');
    title.className = 'info-card__title info-card__title--accent';
    title.textContent = this.options.title;
    card.appendChild(title);
    
    if (this.options.description) {
      const desc = document.createElement('p');
      desc.className = 'info-card__description';
      desc.textContent = this.options.description;
      card.appendChild(desc);
    }
  }
  
  /**
   * Render step variant
   */
  renderStep(card) {
    if (this.options.number !== null) {
      const numberEl = document.createElement('div');
      numberEl.className = 'info-card__number';
      numberEl.textContent = this.options.number;
      card.appendChild(numberEl);
    }
    
    const title = document.createElement('h3');
    title.className = 'info-card__title';
    title.textContent = this.options.title;
    card.appendChild(title);
    
    if (this.options.description) {
      const desc = document.createElement('p');
      desc.className = 'info-card__description';
      desc.textContent = this.options.description;
      card.appendChild(desc);
    }
  }
  
  /**
   * Render playbook variant
   */
  renderPlaybook(card) {
    const title = document.createElement('h3');
    title.className = 'info-card__title info-card__title--accent';
    title.textContent = this.options.title;
    card.appendChild(title);
    
    if (this.options.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.className = 'info-card__subtitle';
      subtitle.textContent = this.options.subtitle;
      card.appendChild(subtitle);
    }
    
    if (this.options.bullets && this.options.bullets.length > 0) {
      const list = document.createElement('ul');
      list.className = 'info-card__bullets';
      
      this.options.bullets.forEach(bullet => {
        const item = document.createElement('li');
        item.textContent = bullet;
        list.appendChild(item);
      });
      
      card.appendChild(list);
    }
    
    if (this.options.badge) {
      const badge = document.createElement('span');
      badge.className = 'info-card__badge';
      badge.textContent = this.options.badge;
      card.appendChild(badge);
    }
    
    if (this.options.cta) {
      const cta = document.createElement('a');
      cta.href = this.options.cta.href;
      cta.className = 'info-card__cta btn btn-outline';
      cta.textContent = this.options.cta.text;
      
      if (this.options.cta.event) {
        cta.setAttribute('data-event', this.options.cta.event);
      }
      
      card.appendChild(cta);
    }
  }
  
  /**
   * Mount card to DOM
   * @param {HTMLElement|string} target - Target element or selector
   */
  mount(target) {
    const container = typeof target === 'string' 
      ? document.querySelector(target)
      : target;
    
    if (!container) {
      console.error('Mount target not found');
      return;
    }
    
    if (!this.element) {
      this.render();
    }
    
    container.appendChild(this.element);
  }
  
  /**
   * Unmount card from DOM
   */
  unmount() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
  
  /**
   * Update card content
   * @param {Object} options - Options to update
   */
  update(options) {
    this.options = { ...this.options, ...options };
    
    if (this.element) {
      const parent = this.element.parentNode;
      this.unmount();
      this.render();
      
      if (parent) {
        parent.appendChild(this.element);
      }
    }
  }
  
  /**
   * Destroy card instance
   */
  destroy() {
    this.unmount();
    this.element = null;
    this.options = null;
  }
}

/**
 * Helper function to create and mount multiple cards
 * @param {Array<Object>} cardsData - Array of card options
 * @param {HTMLElement|string} container - Target container
 */
export function createCards(cardsData, container) {
  const cards = cardsData.map(data => {
    const card = new InfoCard(data);
    card.mount(container);
    return card;
  });
  
  return cards;
}

/**
 * Replace existing elements with InfoCard instances
 * Useful for progressive enhancement
 * @param {string} selector - Selector for elements to replace
 * @param {Function} mapper - Function to map element to card options
 */
export function replaceWithCards(selector, mapper) {
  const elements = document.querySelectorAll(selector);
  const cards = [];
  
  elements.forEach(el => {
    const options = mapper(el);
    const card = new InfoCard(options);
    const parent = el.parentNode;
    
    // Insert new card before old element
    parent.insertBefore(card.render(), el);
    
    // Remove old element
    el.remove();
    
    cards.push(card);
  });
  
  return cards;
}

/**
 * Batch create cards from JSON data
 * @param {string} jsonUrl - URL to fetch card data from
 * @param {HTMLElement|string} container - Target container
 */
export async function createCardsFromJSON(jsonUrl, container) {
  try {
    const response = await fetch(jsonUrl);
    const data = await response.json();
    
    return createCards(data, container);
  } catch (error) {
    console.error('Failed to load cards from JSON:', error);
    return [];
  }
}

