import { Component, OnInit, ViewChild, Input, ViewChildren,
  QueryList, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { NgxDataTableDataSource } from './ngx-data-table-datasource';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { repeatWhen } from 'rxjs/operators';
import { timer} from 'rxjs';

@Component({
  selector: 'ngx-data-table',
  templateUrl: './ngx-data-table.component.html',
  styleUrls: ['./ngx-data-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class NgxDataTableComponent implements OnInit, AfterViewInit {


  constructor() {
    if ( this.isMasterTable === undefined ) {
      this.isMasterTable = false;
    }
  }
  @Input()
  set data(_data: any[]) {

    if (_data) {
       this.isLoading = true;
       this.expandedRowIndexs = [];
       this.expandedRows = [];
       this.isDetailTable = _data[0] == null ? false : _data[0].details === undefined;
       this.isParentOfDetailTable = (_data[0] == null || _data[0].details === undefined || _data[0].details.length === 0 ) ? false
          :  _data[0].details[0].details === undefined;

      if ( this.rawData == null || this.rawData.length === 0  ) {
        this.rawData =  _data;
      }
      const source = timer(100);
      source.subscribe( val => {
        this.dataSource = new NgxDataTableDataSource(
          this.paginator ,
          _data,
          this.sort,
        );
        this.displayedColumns = _data[0] == null ? [] : Object.keys(_data[0]).filter(
          key => key !== 'details'
        );
        if ( !this.isDetailTable ) {
          this.filterValue !== '' ? this.expandAllDetails() : this.collapseAllDetails();
        }
      });
    }
  }

  @Input() showFilter: boolean;
  @Input() isMasterTable: boolean;
  @Input() getDisplayName: Function;
  @Input() getTotal: Function;
  @Input() set globalFilter(_filter: string) {
    // console.log( 'filter value' + _filter );
    this.filterValue = _filter;
    if ( _filter ) {
      this.showFilter = false;
    } else {
      this.showFilter = true;
    }


  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren(NgxDataTableComponent) detailTables: QueryList<NgxDataTableComponent>;
  filterValue: string;

  dataSource: NgxDataTableDataSource;
  rawData: any[];
  showHeader: boolean;
  isDetailTable: boolean;
  isParentOfDetailTable: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: Array<string>;
  expandedElement: Array<string>;

  expandedRows: Array<Array<string>>;
  expandedRowIndexs: Array<number>;

  filteredData: any[];
  isLoading = true;
  rowLoadMillSecond = 60;


  ngOnInit() {
    this.getDisplayName();
    this.getTotal();
    this.filterValue = this.filterValue === undefined ? '' : this.filterValue;
    this.showHeader = false;

  //  const tableType = this.isDetailTable ? 'Detail Table' : this.isMasterTable ? 'Master Table' : 'Mid Table';
  //  console.log('init' + tableType);

}



  ngAfterViewInit() {

    if ( this.isMasterTable && this.isLoading  ) {
      this.stopLoadingSpin(this.rawData);
    }
  }

  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty('detailRow')

  /**
   * expand collapse a row
   * @param row
   */

  getTableClass() {

    if ( this.isParentOfDetailTable ) {
      return 'detail-table';
    } else {
      return 'middle-table';
    }
  }

  isRowExpanded( row: Array<string>) {
    const isRowExpanded =  this.expandedRows.filter(rw => rw === row).length > 0 ;
    return isRowExpanded;
  }

  isExpandedRowCol( col: string, value: string) {
    const isExpandedRowCol =  this.expandedRows.filter( rw => rw[col] === value).length > 0 ;
    return isExpandedRowCol;
  }

  toggleRow(row) {
    const isExisted = this.expandedRows.filter( rw => rw === row).length > 0 ;

    if ( isExisted ) {
        this.expandedRows = this.expandedRows.filter( rw => rw !== row );
    } else {
       this.expandedRows.push(row);
    }

  }

  toggleShowFilter() {
    this.showFilter = !this.showFilter;
  }

  collapseAllDetails() {
    this.expandedRows = [];
  }

  expandAllDetails() {
    this.expandedRows = [];

    if ( this.dataSource.data && this.dataSource.data.length > 0 ) {
      this.dataSource.data.forEach((row) => {
        if ( row.details) {
          this.expandedRows.push(row);
        }
      });
    }
  }

  private _filterDataWithDetails(data: any[], filterValue: string ) {

    if ( ! filterValue ) {
      return data;
    }

    const isDetail = data[0].details === undefined;

    if ( isDetail ) {
      return this._filterData(data, filterValue);
    }

    data = data.filter(obj => this._hasFilterData(obj.details, filterValue) ) ;
    data.forEach( child => {
      child.details = this._filterDataWithDetails([...child.details], filterValue);
    } );
    return data;

  }


  private _filterData(data: any[] , filterValue: string) {

    return !filterValue ? data : data.filter(obj => {

      const accumulator = (currentTerm, key) => currentTerm + obj[key];
      const dataStr = Object.keys(obj).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filterValue.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    });
  }

  private _getTableTotalRowCount(data: any[] ) {
     if ( ! data || data.length === 0 ) {
       return 0;
     }

     if ( data[0].details === undefined ) {
        return data.length;
      }

      let count = 0;
      data.forEach( child => {
        count = count + 1;
        if (child.details && child.details.length > 0 ) {
          count = count + this._getTableTotalRowCount(child.details );
        }

      });
      return count;
  }

   deepCopy(obj) {
    let copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) { return obj; }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (const attr in obj) {
            if (obj.hasOwnProperty(attr)) {
              copy[attr] = this.deepCopy(obj[attr]);
            }
        }
        return copy;
    }

    throw new Error('Unable to copy obj! Its type isnot supported.');
}

  private _hasFilterData(data: any[], filterValue: string) {

    let hasData = false;

    for ( let i = 0 ; i < data.length ; i++ ) {

      if ( data[i].details !== undefined ) {
        if ( this._hasFilterData(data[i].details, filterValue) ) {
          hasData = true;
          break;
        }
      }
      const accumulator = (currentTerm, key) => currentTerm + data[i][key];
      const dataStr = Object.keys(data[i]).reduce(accumulator, '').toLowerCase();

      const transformedFilter = filterValue.trim().toLowerCase();

      if ( dataStr.indexOf(transformedFilter) !== -1) {
        hasData = true;
        break;
      }
    }
    return hasData;
  }

  private calculateSpinningWaitingTime( data: any[] ) {
    const allRowCounts = this._getTableTotalRowCount(data);
    return allRowCounts * this.rowLoadMillSecond - 1000;
  }

  private stopLoadingSpin(data: any[] ) {
    const loadingTime = this.calculateSpinningWaitingTime(data);
    const spinMng = timer( loadingTime);
    spinMng.subscribe( val => {
      this.isLoading = false;
    });
  }


  applyFilter(filterValue: string) {

    this.filterValue = filterValue;
    const clone = this.deepCopy(this.rawData);
    const newData = this._filterDataWithDetails(clone, filterValue ) ;

    this.data = newData;
    this.stopLoadingSpin(newData);



  }
}
