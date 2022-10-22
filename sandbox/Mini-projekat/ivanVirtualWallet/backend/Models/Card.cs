using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Card
    {
        
        public int ID { get; set; }
        public String HolderName { get; set; }=string.Empty;
        public String HolderLastName { get; set; }=string.Empty;
        public String CardNumber{get;set;}="xxxx-xxxx-xxxx-xxxx";
        public double Balance { get; set; }=0.00;
        
        public Card(int ID,String HolderLastName,String HolderName,String CardNumber,double Balance){
            this.ID=ID;
            this.HolderLastName=HolderLastName;
            this.HolderName=HolderName;
            this.CardNumber=CardNumber;
            this.Balance=Balance;
        }
        public Card(){
            
        }
    }
    }
