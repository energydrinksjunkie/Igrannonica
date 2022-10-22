import { Component, OnInit } from '@angular/core';
declare function animation(): void;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  ngOnInit(): void {
   animation();
 }
 
 constructor() {}
}
