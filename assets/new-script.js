/**
 * The Luxé Haus - Theme Scripts
 * Handles interactive behaviors for Luxé sections (Ladder/Portraits, Filtering, etc.)
 */

(function () {
  'use strict';

  /**
   * Initializes ladder component on a container element
   */
  function initLadderSection(section) {
    if (!section) return;

    const switchBtns = section.querySelectorAll('.lux_switch_btn');
    const groups = section.querySelectorAll('.lux_ladder_group');

    // Setup each group's steps and detail updates
    groups.forEach((group) => {
      const stepBtns = group.querySelectorAll('.lux_step');
      const detailBox = group.querySelector('.lux_ladder_detail');

      if (!stepBtns.length || !detailBox) return;

      function updateGroupDetail(btn) {
        if (!btn) return;
        const quote = btn.dataset.quote || '';
        const pieces = btn.dataset.pieces || '';
        const availability = btn.dataset.availability || '';
        const price = btn.dataset.price || '';
        const btnLabel = btn.dataset.btnLabel || '';
        const btnLink = btn.dataset.btnLink || '/collections/all';

        detailBox.innerHTML = `
          <div>
            ${quote ? `<p class="lux_quote">&ldquo;${quote}&rdquo;</p>` : ''}
            ${pieces ? `<p class="lux_pieces_text">${pieces}</p>` : ''}
            ${availability ? `<p class="lux_muted lux_avail_text">${availability}</p>` : ''}
          </div>
          <div>
            ${price ? `<p class="lux_muted lux_price_text" style="margin: 0 0 14px;">${price}</p>` : ''}
            ${btnLabel ? `<a class="lux_btn_primary lux_action_btn" href="${btnLink}">${btnLabel}</a>` : ''}
          </div>
        `;
      }

      stepBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          stepBtns.forEach((b) => {
            const isTarget = b === btn;
            b.classList.toggle('lux_active', isTarget);
            b.setAttribute('aria-selected', isTarget.toString());
            b.setAttribute('tabindex', isTarget ? '0' : '-1');
          });
          updateGroupDetail(btn);
        });

        btn.addEventListener('keydown', (e) => {
          let next = null;
          const total = stepBtns.length;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % total;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx + total - 1) % total;
          if (next !== null) {
            e.preventDefault();
            const targetBtn = stepBtns[next];
            targetBtn.click();
            targetBtn.focus();
          }
        });
      });
    });

    // Tab switcher (For her / For him)
    switchBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const line = btn.dataset.line;

        switchBtns.forEach((b) => {
          const isCurrent = b === btn;
          b.setAttribute('aria-selected', isCurrent.toString());
          b.classList.toggle('lux_active', isCurrent);
        });

        groups.forEach((g) => {
          const matches = g.dataset.line === line;
          g.classList.toggle('lux_hidden', !matches);
        });
      });
    });
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

  document.addEventListener('shopify:block:select', (event) => {
    const blockEl = event.target;
    if (blockEl && blockEl.classList.contains('lux_step')) {
      blockEl.click();
    }
  });
})();
