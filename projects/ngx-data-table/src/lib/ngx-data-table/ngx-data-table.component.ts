import { Component, OnInit, ViewChild, Input, ViewChildren,
  QueryList, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { NgxDataTableDataSource } from './ngx-data-table-datasource';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DataTableColumnGroup} from './ngx-data-table-column-group';
import { timer, Observable, of as observableOf, merge, BehaviorSubject, combineLatest} from 'rxjs';
import * as _ from 'lodash';


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
      if ( this.isMasterTable ) {
        this.totalCount = this._getTableTotalRowCount(_data);
        console.log('dataCount:' + this.totalCount);
        this.totalCountObservable.next(this.totalCount);
      }
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
  @Input() getColumnStyle: Function;
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
  @Input() set columnGroup (_columnGroup: DataTableColumnGroup[]) {
    if ( this.isMasterTable) {
      this.columnGroupRaw = _columnGroup;
    this.groupColumns = [];

    _columnGroup.forEach( obj => {
      this.groupColumns.push(obj.groupName.toString());
    });
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
  groupColumns: Array<string>;
  columnGroupRaw: DataTableColumnGroup[];

  expandedRows: Array<Array<string>>;
  expandedRowIndexs: Array<number>;

  filteredData: any[];
  isLoading = true;
  rowLoadMillSecond = 10;
  totalCount;
  totalCountObservable = new BehaviorSubject<number>(0);


  ngOnInit() {
    this.getDisplayName();
    this.getTotal();
    this.getColumnStyle();
    this.filterValue = this.filterValue === undefined ? '' : this.filterValue;
    this.showHeader = false;

  //  const tableType = this.isDetailTable ? 'Detail Table' : this.isMasterTable ? 'Master Table' : 'Mid Table';
  //  console.log('init' + tableType);

}



  ngAfterViewInit() {
    if ( this.isMasterTable ) {
      const timeNow = new Date();
    const timeString = timeNow.getHours() + ':' + timeNow.getMinutes() + ':'
    + timeNow.getSeconds() + ' ' + timeNow.getMilliseconds();
    console.log('after view init at ' + timeString ) ;
    }

    if ( this.isMasterTable && this.isLoading  ) {
      this.totalCountObservable.subscribe( total => {
        if (total > 0 ) {
          this.stopLoadingSpin(total);
        }

      });
    }

  }


  getGroupStyle(groupName: string) {

    const group = this.columnGroupRaw.filter( obj => obj.groupName === groupName)[0] ;

    if ( group ) {
      return {
        'flex': group.colspan,
        'background-color': group.backgroundColor,
        'color': group.color,

      };
    }

    return {
      'flex': 1,
      'background-color': 'white',
      'color': 'black',
    };

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

  hideHeader() {
    return (this.isLoading && this.isMasterTable)
          || (!this.isMasterTable && this.isParentOfDetailTable)
          || (this.isDetailTable && !this.showHeader);
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

  private _filterDataDeep(data: any[], filterValue: string, detailName = 'details' ) {

    if ( ! filterValue ) {
      return data;
    }

    const isDetail = ( data && data[0][detailName] === undefined );

    if ( isDetail ) {
      return this._filterData(data, filterValue);
    }

    data = data.filter(obj => this._hasFilterDataDeep(obj[detailName], filterValue) ) ;
    data.forEach( child => {
      child.details = this._filterDataDeep([...child[detailName]], filterValue);
    } );
    return data;

  }


  private _filterData(data: any[] , filterValue: string) {

    const filterd = !filterValue ? data : data.filter(obj => {

      return this._hasValueInValue(obj, filterValue);
    });

    return filterd;
  }


  private _hasValueInValue(obj: any, filterValue: string ) {
    const filted = _.filter(obj, function(value, key) {
      return value && value.toString().toLowerCase().indexOf(filterValue.toLocaleLowerCase()) >= 0;
    });
    return filted.length > 0 ;


  }


  private _hasFilterDataDeep(data: any[], filterValue: string ,  detailName = 'details') {

    const allDetailData = _.flatMapDeep(data, item => [item, ...item[detailName]] );
    for ( let i = 0 ; i < allDetailData.length; i++ ) {
      if ( this._hasValueInValue(allDetailData[i], filterValue )) {
        return true;
      }
    }

    return false;
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

  private calculateSpinningWaitingTime( totalCount: number ) {
    return totalCount * this.rowLoadMillSecond - 3000;
  }

  private stopLoadingSpin(totalCount: number ) {
    const loadingTime = this.calculateSpinningWaitingTime(totalCount);
    const spinMng = timer( loadingTime);
    spinMng.subscribe( val => {
      this.isLoading = false;
    });
  }


  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    const clone = _.cloneDeep(this.rawData);
    const newData = this._filterDataDeep(clone, filterValue ) ;
    this.data = newData;
    this.stopLoadingSpin(this._getTableTotalRowCount(newData));
  }
}
