import { Component } from '@angular/core';
import { LucideAngularModule, Telescope, Share2, Cable } from 'lucide-angular';

@Component({
  selector: 'app-nav',
  imports: [LucideAngularModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {

  readonly Telescope = Telescope
  readonly Share2 = Share2
  readonly Cable = Cable
}
