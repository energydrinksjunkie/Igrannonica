import { Component, Input, OnInit } from '@angular/core';

import { SharedService } from '../shared.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  constructor(private service:SharedService) { }

  LogsList:any=[];

  @Input() log:any;
  naziv:string | undefined;
  opis:string | undefined;

  ngOnInit(): void {
    this.refreshLogsList();
    this.naziv=this.log.naziv;
    this.opis=this.log.naziv;
  }

  refreshLogsList(){
    this.service.getLogsList().subscribe(data=>
      {
        this.LogsList=data;
      })
  }
  addClick(){
    var log={
      "id":"0",
      "naziv":this.naziv,
      "opis":this.opis,
      "datum":""
    }
    this.service.addLog(log).subscribe(res=>
      {
        alert(res.toString());
        this.refreshLogsList();
        this.naziv="";
        this.opis="";
      });
    }
    deleteClick(value: any){
      if(confirm("Jeste li sigurni?")){

        this.service.deleteLog(value.id).subscribe(res=>{
          alert(res.toString());
          this.refreshLogsList();
        })
      }
    }
}
