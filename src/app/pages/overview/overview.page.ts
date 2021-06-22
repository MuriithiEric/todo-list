import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonRouterOutlet, ModalController, PopoverController } from '@ionic/angular';
import { DataService, Task } from 'src/app/services/data.service';
import { NewProjectModalPage } from '../new-project-modal/new-project-modal.page';
import { PriorityPopoverPage } from '../priority-popover/priority-popover.page';
import { ProjectPopoverPage } from '../project-popover/project-popover.page';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  projects = [];
  showTaskInput = false;
  searching = false;
  searchResults = [];

  task: Task = {
    name: '',
    project: 0,
    due: new Date().toISOString(),
    priority: 4
  }

 @ViewChild('due', {static:false, read: ElementRef}) due:ElementRef; 
  
  constructor(private modalCtrl: ModalController, private routerOutlet: IonRouterOutlet,
    private dataService: DataService, private popoverCtrl: PopoverController) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.projects = await this.dataService.getTaskOverview();
    console.log('my projects: ', this.projects);
  }

  async addCategory() {
    const modal = await this.modalCtrl.create({
      component: NewProjectModalPage,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: false
    });

    await modal.present();
    const result = await modal.onDidDismiss();

    if (result && result.data && result.data.reload) {
      this.loadData();
    }
  }

  saveTask() {
    const fakeProject = this.task.project as any;
    this.task.project = this.task.project ? fakeProject.id : null;

    this.dataService.addTask(this.task).then(() => {
      this.showTaskInput = false;
      this.loadData();
      this.task = {
        name: '',
        project: 0,
        due: '',
        priority: 4
      }; 
    })
  }

  async openProjectPopover(event) {
    const popover = await this.popoverCtrl.create({
      component: ProjectPopoverPage,
      event
    });

    await popover.present();
    popover.onDidDismiss().then(result => {
      console.log('my popover result: ', result);

      if (result.data && result.data.project) {
        this.task.project = result.data.project;
      }
    });
  }

  async openPriorityPopover(event) {
    const popover = await this.popoverCtrl.create({
      component: PriorityPopoverPage,
      event

    });

    await popover.present();
    popover.onDidDismiss().then(result => {
      if (result.data && result.data.priority) {
        this.task.priority = result.data.priority;
      }
    });
  }

  getTaskColor() {
    const priorities = this.dataService.getPriorities();
    return priorities.filter(p => p.value == this.task.priority)[0].color;
  }

  selectDue() {
    this.due.nativeElement.click();
  }

  searchTask(event) {
    this.searching = true;
    const term = event.detail.value;
    this.dataService.searchTask(term.toLowerCase()).then(results => {
      this.searchResults = results;
    });
  }

}
