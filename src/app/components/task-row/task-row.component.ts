import { Task } from './../../services/data.service';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Gesture, GestureController, AnimationController, GestureConfig } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
 
@Component({
  selector: 'app-task-row',
  templateUrl: './task-row.component.html',
  styleUrls: ['./task-row.component.scss'],
})
export class TaskRowComponent implements AfterViewInit {
  @Input('task')task: Task;
  @Output()taskComplete = new EventEmitter();
  @ViewChild('itemref', { static: false, read: ElementRef}) item: ElementRef;
  @ViewChild('container', { static: false })container: ElementRef;
  private gesture: Gesture;
 
  constructor(private gestureCtrl: GestureController, private animationCtrl: AnimationController,
    private dataService: DataService, private sanitizer: DomSanitizer) { }
 
 
    async ngAfterViewInit() {
      const innerItem = this.item.nativeElement;
      const style = innerItem.style;
      const windowWidth = window.innerWidth;
  
      const deleteAnimation = this.animationCtrl.create()
      .addElement(this.container.nativeElement)
      .duration(200)
      .easing('ease-out')
      .fromTo('height', '48px', '0');
      
      const options: GestureConfig = {
        el: this.item.nativeElement,
        gestureName: 'swipe-delete',
        onStart: () => {
          style.transition = '';
        },
        onMove: (ev) => {
          if(ev.deltaX > 0){
            style.transform = `translate3d(${ev.deltaX}px, 0, 0)`;
          }
        },
        onEnd: (ev) =>{
          style.transition = '0.2s ease-out';
  
          if(ev.deltaX > 150){
            style.transform = `translate3d(${windowWidth}px, 0, 0)`;       
            deleteAnimation.play()
  
            deleteAnimation.onFinish(() => {
              this.taskComplete.emit(true);
            });
  
          } else {
            style.transform = ''
          }
        }
      }
  
      this.gesture = await this.gestureCtrl.create(options);
      this.gesture.enable(true);
    }
 
    getTaskColor() {
      const priorities = this.dataService.getPriorities();
      return priorities.filter(p => p.value == this.task.priority)[0].color;
    }
}