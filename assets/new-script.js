/**
 * The Luxé Haus - Theme Scripts
 * Handles interactive behaviors for Luxé sections (Ladder/Portraits, Filtering, etc.)
 */

(function () {
  'use strict';

  // Bottle SVG Generators for dynamic Ladder updates
  const COLOR = { ember: '#D8611A', champ: '#C9B48A' };

  function getBottleSvg(kind, stroke) {
    const s = stroke || COLOR.ember;
    const c = COLOR.champ;
    const shapes = {
      wash: `<svg viewBox="0 0 40 80" class="lux_bottle_svg lux_svg_wash" aria-hidden="true"><rect x="11" y="3" width="7" height="8" fill="none" stroke="${c}" stroke-width="2"/><rect x="5" y="11" width="18" height="66" rx="3" fill="none" stroke="${s}" stroke-width="2"/></svg>`,
      cream: `<svg viewBox="0 0 44 80" class="lux_bottle_svg lux_svg_cream" aria-hidden="true"><rect x="6" y="22" width="32" height="55" rx="4" fill="none" stroke="${s}" stroke-width="2"/><rect x="11" y="11" width="22" height="11" fill="none" stroke="${c}" stroke-width="2"/></svg>`,
      spray: `<svg viewBox="0 0 40 80" class="lux_bottle_svg lux_svg_spray" aria-hidden="true"><rect x="15" y="3" width="9" height="7" fill="none" stroke="${c}" stroke-width="2"/><rect x="13" y="10" width="14" height="7" fill="none" stroke="${c}" stroke-width="2"/><rect x="6" y="17" width="28" height="60" rx="7" fill="none" stroke="${s}" stroke-width="2"/></svg>`,
      cloth: `<svg viewBox="0 0 56 80" class="lux_bottle_svg lux_svg_cloth" aria-hidden="true"><rect x="4" y="30" width="48" height="46" fill="#3B2A24" stroke="${s}" stroke-width="2"/><path d="M10 36l36 34M10 50l22 20M24 36l22 20M46 36L10 70M32 36L10 56M46 50L24 70" stroke="${c}" stroke-width="1" opacity=".7"/></svg>`,
      room: `<svg viewBox="0 0 34 80" class="lux_bottle_svg lux_svg_room" aria-hidden="true"><rect x="13" y="2" width="8" height="8" fill="none" stroke="${c}" stroke-width="2"/><rect x="11" y="10" width="12" height="6" fill="none" stroke="${c}" stroke-width="2"/><rect x="7" y="16" width="20" height="61" rx="4" fill="none" stroke="${c}" stroke-width="2"/><path d="M12 44h10" stroke="${s}" stroke-width="2"/></svg>`
    };
    return shapes[kind] || shapes.spray;
  }

  const PORTRAITS = {
    her: [
      {
        tier: 1,
        name: 'The Polished Woman',
        label: 'The Everyday Standard',
        line: 'The baseline she does not negotiate.',
        pieces: ['wash', 'cream', 'spray'],
        price: 'GHS 600',
        available: 'Available in 11 scents.'
      },
      {
        tier: 2,
        name: 'The Poised Woman',
        label: 'The Elevated Standard',
        line: 'Chosen, not collected.',
        pieces: ['wash', 'cream', 'spray', 'cloth'],
        price: 'GHS 700',
        available: 'Available in 11 scents.'
      },
      {
        tier: 3,
        name: 'The Distinguished Woman',
        label: 'The Signature Standard',
        line: 'Complete, on her terms.',
        pieces: ['wash', 'cream', 'spray', 'cloth', 'room'],
        price: 'GHS 900',
        available: 'Available in Champagne Toast, where a matching room mist exists.'
      }
    ],
    him: [
      {
        tier: 1,
        name: 'The Tailored Gentleman',
        label: 'The Grounded Routine',
        line: 'Confidence begins with consistency.',
        pieces: ['wash', 'cream', 'spray'],
        price: 'GHS 600',
        available: 'Available in 7 scents.'
      },
      {
        tier: 2,
        name: 'The Refined Gentleman',
        label: 'The Composed Routine',
        line: "Refinement is noticed long before it's announced.",
        pieces: ['wash', 'cream', 'spray', 'cloth'],
        price: 'GHS 700',
        available: 'Available in 7 scents.'
      },
      {
        tier: 3,
        name: 'The Distinguished Gentleman',
        label: 'The Complete Routine',
        line: 'Nothing excessive. Nothing overlooked.',
        pieces: ['wash', 'cream', 'spray', 'cloth', 'room'],
        price: 'GHS 900',
        available: 'Available in Mahogany Teakwood, where a matching room mist exists.'
      }
    ]
  };

  function pieceNamesFormatted(line, pieces) {
    const names = {
      wash: 'wash',
      cream: 'cream',
      spray: line === 'him' ? 'deodorizing body spray' : 'mist',
      cloth: 'exfoliating cloth',
      room: 'room mist'
    };
    const list = pieces.map((k) => names[k]);
    if (list.length === 1) return list[0];
    return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Initializes ladder component on a container element
   */
  function initLadderSection(section) {
    if (!section) return;
    const switchBtns = section.querySelectorAll('.lux_switch_btn');
    const ladderEl = section.querySelector('.lux_ladder');
    const detailEl = section.querySelector('.lux_ladder_detail');

    if (!ladderEl || !detailEl) return;

    let currentState = {
      line: 'her',
      index: 0
    };

    function renderDetail() {
      const portraitList = PORTRAITS[currentState.line];
      const portrait = portraitList[currentState.index];
      const line = currentState.line;

      const piecesText = capitalize(pieceNamesFormatted(line, portrait.pieces));
      const shopUrl = section.dataset.shopUrl || '/collections/all';

      detailEl.innerHTML = `
        <div>
          <p class="lux_quote">&ldquo;${portrait.line}&rdquo;</p>
          <p>${piecesText}.</p>
          <p class="lux_muted">${portrait.available}</p>
        </div>
        <div>
          <p class="lux_muted" style="margin: 0 0 14px;">From ${portrait.price}, delivered in Accra.</p>
          <a class="lux_btn_primary" href="${shopUrl}?line=${line}&portrait=${portrait.tier}">Shop ${portrait.name}</a>
        </div>
      `;
    }

    function renderLadderSteps() {
      const portraitList = PORTRAITS[currentState.line];
      ladderEl.innerHTML = portraitList
        .map((p, idx) => {
          const isSelected = idx === currentState.index;
          const iconsHtml = p.pieces.map((k) => getBottleSvg(k)).join('');
          return `
            <button class="lux_step ${isSelected ? 'lux_active' : ''}" role="tab" aria-selected="${isSelected}" tabindex="${isSelected ? 0 : -1}" data-index="${idx}">
              <span class="lux_icons">${iconsHtml}</span>
              <span class="lux_step_name">${p.name}</span>
              <span class="lux_step_tier">${p.label}</span>
            </button>
          `;
        })
        .join('');

      // Add click & keyboard navigation to steps
      ladderEl.querySelectorAll('.lux_step').forEach((btn) => {
        const idx = parseInt(btn.dataset.index, 10);
        btn.addEventListener('click', () => {
          currentState.index = idx;
          updateStepActiveState();
          renderDetail();
        });

        btn.addEventListener('keydown', (e) => {
          let next = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % 3;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx + 2) % 3;
          if (next !== null) {
            e.preventDefault();
            currentState.index = next;
            updateStepActiveState();
            renderDetail();
            const targetBtn = ladderEl.children[next];
            if (targetBtn) targetBtn.focus();
          }
        });
      });

      renderDetail();
    }

    function updateStepActiveState() {
      ladderEl.querySelectorAll('.lux_step').forEach((btn, idx) => {
        const isSelected = idx === currentState.index;
        btn.setAttribute('aria-selected', isSelected.toString());
        btn.setAttribute('tabindex', isSelected ? '0' : '-1');
        btn.classList.toggle('lux_active', isSelected);
      });
    }

    switchBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const line = btn.dataset.line || 'her';
        currentState.line = line;
        currentState.index = 0;

        switchBtns.forEach((b) => {
          const isCurrent = b === btn;
          b.setAttribute('aria-selected', isCurrent.toString());
          b.classList.toggle('lux_active', isCurrent);
        });

        renderLadderSteps();
      });
    });

    renderLadderSteps();
  }

  // Initialize all ladder sections on DOMContentLoaded
  function initAllLuxSections() {
    document.querySelectorAll('.lux_ladder_section').forEach((section) => {
      initLadderSection(section);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllLuxSections);
  } else {
    initAllLuxSections();
  }

  // Support Shopify Theme Editor dynamic events
  document.addEventListener('shopify:section:load', (event) => {
    const section = event.target.querySelector('.lux_ladder_section') || (event.target.classList.contains('lux_ladder_section') ? event.target : null);
    if (section) initLadderSection(section);
  });
})();
