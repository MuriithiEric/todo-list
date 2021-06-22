import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-priority-popover',
  templateUrl: './priority-popover.page.html',
  styleUrls: ['./priority-popover.page.scss'],
})
export class PriorityPopoverPage implements OnInit {
  priorities = this.dataService.getPriorities();

  constructor(private dataService: DataService, private popoverCtrl: PopoverController) { }

  ngOnInit() {
    
  }

  select(p) {
    this.popoverCtrl.dismiss({priority: p.value})
  }

}
