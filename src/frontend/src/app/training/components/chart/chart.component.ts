import { Component, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DisplayType } from 'src/app/shared/models/navigation_models';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  chartDisplay:string = DisplayType.HIDE;

  @Input() epoch!:number[];
  @Input() training!:number[];
  @Input() val!:number[];
  @Input() prikaz!:string;
  @Input() numberOfEpochs!:number;
  @Input() started!:boolean;

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges()
  {
    // TODO modifikovati da prima samo element i onda dodati u niz ovde
    this.lineChartData.datasets[0].data=this.training;
    this.lineChartData.datasets[1].data=this.val;
    this.lineChartData.labels=this.epoch;
    this.chart?.chart?.update();
    if(this.started)
    {
      this.chartDisplay=this.prikaz;
      this.started=false
    }
    
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        // data: this.epoches_data.map(a => a.loss),
        data: [],
        label: 'Error on training set',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
        spanGaps:true
      },
      {
        data: [],
        label: 'Error on validation set',
        //yAxisID: 'y-axis-1',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
        spanGaps:true
      }
      // {
      //   data: [],
      //   label: 'Validation loss',
      //   backgroundColor: 'rgba(77,83,96,0.2)',
      //   borderColor: 'rgba(77,83,96,1)',
      //   pointBackgroundColor: 'rgba(77,83,96,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(77,83,96,1)',
      //   fill: 'origin',
      // }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    animation:false,
    elements: {
      line: {
        tension: 0.5
      },
      point: {
        radius: 0 // default to disabled in all datasets
    }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      
      'y-axis-0':
        {
          position: 'left',
          title: {
            text:'Error',
            display:true,
            align:'center',
            font:{
              size: 17
            }
          }
        },
        x:{
          title: {
            text:'Epoch',
            display:true,
            align:'center',
            font:{
              size: 17
            }
          }
        }
      // 'y-axis-1': {
      //   position: 'right',
        
        // ticks: {
        //   color: 'red'
        // }
     // }
    },
    

    plugins: {
      legend: { display: true },
    }
  };

  public lineChartType: ChartType = 'line'; 
  

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

}
