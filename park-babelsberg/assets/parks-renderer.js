/**
 * Parks Renderer - Component-driven rendering for pillar page
 * Loads inline core data + lazy-loads extended data (specials, categories, FAQs)
 */

class AttractionCard {
  constructor(attractionData, parkColor) {
    this.data = attractionData;
    this.color = parkColor;
  }

  render() {
    const card = document.createElement('article');
    card.className = 'attraction-card';
    card.setAttribute('data-attraction-id', this.data.id);

    // Image placeholder (if no image URL, show placeholder)
    let imageHTML = '';
    if (this.data.image_url && this.data.image_url !== '') {
      imageHTML = `
        <div class="card-image" style="background-image: url('${this.data.image_url}');"></div>
      `;
    } else {
      imageHTML = `
        <div class="card-image-placeholder">
          <span>📷 Bild folgt</span>
        </div>
      `;
    }

    card.innerHTML = `
      ${imageHTML}
      <h3>${this.data.title}</h3>
      <p>${this.data.short_description}</p>
    `;

    // Click handler - navigate to detail page
    card.addEventListener('click', () => {
      window.location.href = this.data.details_url;
    });

    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = this.data.details_url;
      }
    });

    return card;
  }
}

class ParkSection {
  constructor(parkData) {
    this.data = parkData;
  }

  render() {
    const section = document.querySelector(`[data-park="${this.data.id}"]`);
    if (!section) {
      console.error(`Park section not found: ${this.data.id}`);
      return;
    }

    const grid = section.querySelector('.attractions-grid');
    if (!grid) {
      console.error(`Attractions grid not found for park: ${this.data.id}`);
      return;
    }

    // Clear existing content
    grid.innerHTML = '';

    // Render each attraction
    this.data.highlights.forEach(attraction => {
      const card = new AttractionCard(attraction, this.data.color);
      grid.appendChild(card.render());
    });

    console.log(`✓ Rendered ${this.data.highlights.length} attractions for ${this.data.name}`);
  }
}

class SpecialCard {
  constructor(specialData) {
    this.data = specialData;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'special-card';
    card.innerHTML = `
      <h3>${this.data.title}</h3>
      <p>${this.data.description}</p>
    `;
    return card;
  }
}

class CategoryCard {
  constructor(categoryData) {
    this.data = categoryData;
  }

  render() {
    const card = document.createElement('article');
    card.className = 'category-card';
    card.setAttribute('data-category-id', this.data.id);

    // Image or icon placeholder
    let imageHTML = '';
    if (this.data.image && this.data.image !== '') {
      imageHTML = `
        <div class="category-card-image" style="background-image: url('${this.data.image}');">
          <div class="category-card-icon">${this.data.icon}</div>
        </div>
      `;
    } else {
      imageHTML = `
        <div class="category-card-image">
          <div class="category-card-icon">${this.data.icon}</div>
        </div>
      `;
    }

    card.innerHTML = `
      ${imageHTML}
      <div class="category-card-content">
        <h3>
          ${this.data.title}
          <span class="category-count">${this.data.count}</span>
        </h3>
        <p>${this.data.description}</p>
      </div>
    `;

    // Click handler - navigate to link
    if (this.data.link) {
      card.addEventListener('click', () => {
        if (this.data.link.startsWith('#')) {
          // Internal anchor link - smooth scroll
          const target = document.querySelector(this.data.link);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          // External link - navigate
          window.location.href = this.data.link;
        }
      });

      // Keyboard accessibility
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    }

    return card;
  }
}

class ParksApp {
  constructor() {
    this.coreData = null;
    this.extendedData = null;
    this.currentLang = 'de';
  }

  async init() {
    console.log('🚀 Parks App initializing...');

    try {
      // Load inline core data
      this.loadCoreData();

      // Render parks immediately (fast FCP)
      this.renderParks();

      // Lazy-load extended data
      await this.loadExtendedData();

      // Render specials and categories after extended data loads
      this.renderSpecials();
      this.renderCategories();

      console.log('✓ Parks App initialized successfully');
    } catch (error) {
      console.error('❌ Parks App initialization failed:', error);
    }
  }

  loadCoreData() {
    const dataScript = document.getElementById('parks-core-data');
    if (!dataScript) {
      throw new Error('parks-core-data script not found');
    }

    try {
      this.coreData = JSON.parse(dataScript.textContent);
      console.log(`✓ Loaded core data: ${this.coreData.parks.length} parks`);
    } catch (error) {
      throw new Error(`Failed to parse parks-core-data: ${error.message}`);
    }
  }

  async loadExtendedData() {
    try {
      const response = await fetch('assets/data/parks-extended.json');
      if (!response.ok) {
        console.warn('⚠️ Extended data not found, skipping');
        this.extendedData = { specials: [], categories: [], faqs: [] };
        return;
      }
      this.extendedData = await response.json();
      const specialsCount = this.extendedData.specials ? this.extendedData.specials.length : 0;
      const categoriesCount = this.extendedData.categories ? this.extendedData.categories.length : 0;
      console.log(`✓ Loaded extended data: ${specialsCount} specials, ${categoriesCount} categories`);
    } catch (error) {
      console.warn('⚠️ Failed to load extended data:', error);
      this.extendedData = { specials: [], categories: [], faqs: [] };
    }
  }

  renderParks() {
    if (!this.coreData || !this.coreData.parks) {
      console.error('❌ No parks data to render');
      return;
    }

    this.coreData.parks.forEach(park => {
      const parkSection = new ParkSection(park);
      parkSection.render();
    });

    console.log(`✓ Rendered ${this.coreData.parks.length} park sections`);
  }

  renderSpecials() {
    const container = document.getElementById('specials-container');
    if (!container) {
      console.warn('⚠️ Specials container not found');
      return;
    }

    if (!this.extendedData || !this.extendedData.specials || this.extendedData.specials.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--ink-muted);">Besonderheiten werden demnächst ergänzt.</p>';
      return;
    }

    container.innerHTML = '';
    this.extendedData.specials.forEach(special => {
      const card = new SpecialCard(special);
      container.appendChild(card.render());
    });

    console.log(`✓ Rendered ${this.extendedData.specials.length} specials`);
  }

  renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) {
      console.warn('⚠️ Categories container not found');
      return;
    }

    if (!this.extendedData || !this.extendedData.categories || this.extendedData.categories.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--ink-muted);">Kategorien werden demnächst ergänzt.</p>';
      return;
    }

    container.innerHTML = '';
    this.extendedData.categories.forEach(category => {
      const card = new CategoryCard(category);
      container.appendChild(card.render());
    });

    console.log(`✓ Rendered ${this.extendedData.categories.length} categories`);
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new ParksApp();
  app.init();
});
