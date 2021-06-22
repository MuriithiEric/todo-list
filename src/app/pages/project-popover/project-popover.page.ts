import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataService, Project } from 'src/app/services/data.service';

@Component({
  selector: 'app-project-popover',
  templateUrl: './project-popover.page.html',
  styleUrls: ['./project-popover.page.scss'],
})
export class ProjectPopoverPage implements OnInit {
  projects = [];

  constructor(private dataService: DataService, private popoverCtrl: PopoverController) { }

  ngOnInit() {
    this.dataService.getProjects().then(projects => {
      this.projects = projects;
    })
  }

  selectProject(project: Project) {
    this.popoverCtrl.dismiss({project})
  }

}
