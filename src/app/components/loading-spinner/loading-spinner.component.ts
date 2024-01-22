import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  @Input({ required: true, transform: (value: unknown) => !!value })
  public show!: boolean;

  @Input()
  public color: 'accent' | 'primary' | 'warn' = 'accent';

  @Input({ transform: (value: unknown) => Number(value) })
  public strokeWidth = 3;

  @Input({ transform: (value: unknown) => Number(value) })
  public diameter = 25;
}
