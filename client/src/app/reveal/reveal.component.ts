import { Component, ViewChild, ElementRef, EventEmitter, Output, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
declare let $: any;

@Component({
  selector: 'app-reveal',
  templateUrl: './reveal.component.html',
  styleUrls: ['./reveal.component.scss']
})
export class RevealComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('reveal') el: ElementRef;
  private revealView: any;
  private observer: ResizeObserver;

  @Output() dataPointClicked = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const dashboardId = 'Analytics.rdash';
    const revealSettings = new $.ig.RevealSettings(dashboardId);

    $.ig.RevealUtility.loadDashboard(dashboardId, (dashboard) => {
      revealSettings.dashboard = dashboard;
      revealSettings.canSaveAs = true;
      revealSettings.canEdit = true;
      revealSettings.showDataBlending = true;
      
      this.revealView = new $.ig.RevealView(this.el.nativeElement, revealSettings);

      this.revealView.onVisualizationDataPointClicked = (widget, cell, row) => {
        console.log('widget', widget.title(), widget);
        //console.log('dataSpec', widget._widgetModel._dataSpec._dataSourceItem);
        console.log('cell', cell.columnLabel, cell.value, cell.formattedValue, cell);
        console.log("First cell in the row has label:" + row[0].columnLabel);

        this.dataPointClicked.emit({
          dataSource: widget._widgetModel._dataSpec._dataSourceItem._id,
          widget: {id: widget.id(), title: widget.title() },
          cell: {columnName: cell.columnName, value: cell.value }
        });
      };
    },
    (err) => {
      console.error('revealView', err);
    });

    this.observer = new ResizeObserver(() => {
      if (!!this.revealView) this.revealView.updateSize();
    });
    this.observer.observe(this.el.nativeElement);
  }
  
  ngOnDestroy() {
    this.observer.unobserve(this.el.nativeElement);
  }

  updateView() {
    if (!!this.revealView) this.revealView.updateSize();
  }
}