import { Component,Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CardApiService } from 'src/app/card-api.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {

  cardList$!: Observable<any>;



  constructor(private service:CardApiService,private formBuilder: FormBuilder,
) { }
  checkoutForm = this.formBuilder.group({
    holderName: '',
    lastName: '',
    cardNumber:''
  });





  ngOnInit(): void {

  }

  onSubmit(): void {
    // Process checkout data here
    var card={
      holderName:this.checkoutForm.value.holderName,
      lastName:this.checkoutForm.value.lastName,
      cardNumber:this.checkoutForm.value.cardNumber

    }
    console.warn('Your order has been submitted', this.checkoutForm.value);
    this.checkoutForm.reset();
    this.service.insertCard(card).subscribe((data)=>{
      console.log(data);
      window.location.reload();
 });;



  }


}
