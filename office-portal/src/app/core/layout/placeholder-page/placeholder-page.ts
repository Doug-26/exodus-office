import { Component, input } from '@angular/core';

/**
 * Stands in for a workspace area that has a navigation entry but no implementation yet.
 * Inputs are bound from the route's `data` via `withComponentInputBinding()`.
 */
@Component({
  selector: 'app-placeholder-page',
  template: `
    <section class="placeholder">
      <div class="eyebrow">PLANNED</div>
      <h1>{{ heading() }}</h1>
      <p class="description">{{ description() }}</p>
      <p class="phase">Scheduled for {{ phase() }} of the development roadmap.</p>
    </section>
  `,
  styles: `
    .placeholder {
      max-width: 560px;
      padding: 40px 0;
    }
    .eyebrow {
      margin-bottom: 8px;
      color: #7771d4;
      font-size: 9px;
      font-weight: 750;
      letter-spacing: 1.15px;
    }
    h1 {
      margin: 0;
      color: #23263a;
      font-size: 27px;
      font-weight: 730;
      letter-spacing: -0.8px;
    }
    .description {
      margin: 10px 0 0;
      color: #55596c;
      font-size: 13px;
      line-height: 1.6;
    }
    .phase {
      margin: 16px 0 0;
      color: #85889a;
      font-size: 11px;
    }
  `,
})
export class PlaceholderPage {
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly phase = input.required<string>();
}
