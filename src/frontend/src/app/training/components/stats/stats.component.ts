import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionService } from 'src/app/core/services/session.service';
import { HeaderDict, TableIndicator } from '../../models/table_models';
import { HeadersService } from '../../services/headers.service';
import { ShowTableComponent } from '../show-table/show-table.component';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  @ViewChild('numIndicators') private numIndicators!: ShowTableComponent;
  @ViewChild('catIndicators') private catIndicators!: ShowTableComponent;
  @ViewChild('basicInfo') private basicInfo!:ShowTableComponent;
  @ViewChild('missingValues') private missingValues!:ShowTableComponent;

  corrMatrixImgSource: any;
  showImage:boolean = false;
  previewImage:boolean = false;
  stats_tab_index:number = 0;

  constructor(private headersService:HeadersService, 
              private domSanitizer: DomSanitizer,
              private sessionService: SessionService) { }

  ngOnInit(): void 
  {
    if (this.sessionService.getData('stats_tab_index') != null)
      this.stats_tab_index = parseInt(this.sessionService.getData('stats_tab_index')!);
    else
      this.sessionService.saveData('stats_tab_index',this.stats_tab_index.toString());
  }

  showTables(response:any)
  {
    var headerContinuous = this.headersService.getStatIndicatorHeader(response['continuous']);
    this.numIndicators.setPaginationEnabled(false);
    this.numIndicators.setTableStyle("height: 400px;");
    this.numIndicators.prepareTable(TableIndicator.STATS, response['continuous'], headerContinuous);

    var headerCategorical = this.headersService.getStatIndicatorHeader(response['categorical']);
    this.catIndicators.setPaginationEnabled(false);
    this.catIndicators.setTableStyle("height: 400px;");
    this.catIndicators.prepareTable(TableIndicator.STATS, response['categorical'], headerCategorical);
  }

  showMatrix(response:any)
  {
    this.corrMatrixImgSource = this.domSanitizer.bypassSecurityTrustUrl(response);
  }

  showInfo(response:any)
  {
    this.basicInfo.setPaginationEnabled(false);
    this.basicInfo.setTableStyle("height: 100px;");
    var headerInfo = this.headersService.getInfoStatsHeader(response);
    this.basicInfo.prepareTable(TableIndicator.INFO, response, headerInfo) 
  }

  showMissingValues(response:any)
  {
    this.missingValues.setPaginationEnabled(false);
    this.missingValues.setTableStyle("height: 100px;");
    var headerMissing = this.headersService.getInfoStatsHeader(response);
    this.missingValues.prepareTable(TableIndicator.INFO, response, headerMissing) 
  }
  openImage()
  {
    this.showImage = true;
    this.previewImage = true;
  }
  closeImage()
  {
    this.showImage = false;
    this.previewImage = false;
  }
  setIndex(index:number)
  {
    this.stats_tab_index = index;
    this.sessionService.saveData('stats_tab_index',this.stats_tab_index.toString());
  }
}
