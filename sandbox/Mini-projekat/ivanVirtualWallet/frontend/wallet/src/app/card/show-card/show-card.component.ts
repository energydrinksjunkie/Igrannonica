import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CardApiService } from 'src/app/card-api.service';

@Component({
  selector: 'app-show-card',
  templateUrl: './show-card.component.html',
  styleUrls: ['./show-card.component.css']
})
export class ShowCardComponent implements OnInit {

  constructor(private service:CardApiService) { }

  cardList$!:Observable<any[]>;



  ngOnInit(): void {
    this.cardList$=this.service.getAllCards();
    console.log(this.cardList$);
  }

  onClickDel(id:number|string):void{
     this.service.deleteCard(id).subscribe((data)=>{
      console.log("success");

 });;



  }

}
