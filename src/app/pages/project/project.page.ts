import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Project, Task } from 'src/app/services/data.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  project: Project = null;
  reorderDisabled = true;
  
  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(data => {
      console.log('data: ', data);
      this.dataService.getProjectById(data.get('id')).then(proj => {
        this.project = proj;
        console.log('my project: ', proj);
      });
    });
  }

  doReorder(ev: any) {
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    ev.detail.complete();
  }

  taskComplete(task:Task) {
    task.done =true;
    this.dataService.updateTask(task).then(() => {
      this.project.tasks = this.project.tasks.filter(t => t.id != task.id);
    })
  }

}
