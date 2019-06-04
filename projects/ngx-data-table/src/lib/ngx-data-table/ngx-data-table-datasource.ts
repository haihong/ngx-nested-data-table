import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, filter } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, combineLatest} from 'rxjs';


/**
 * Data source for the NgxDataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class NgxDataTableDataSource extends DataSource<any> {
  public data: any[];
  public rawData: any[];
  constructor(
    private paginator: MatPaginator,
    private _data: any[],
    private sort: MatSort,
  ) {
    super();
    this.data = this._enrichData(_data);
    this.rawData = _data;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<any[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
       observableOf(this.data),
      this.sort.sortChange,
    ];


    let merged = merge(...dataMutations);

    // Set the paginator length
    if ( this.paginator) {
      this.paginator.length = this.data.length;
      merged = merge(...dataMutations, this.paginator.page);
    }


    return merged.pipe(
      map(() => {
        // let timeNow = new Date();
        // let timeString = timeNow.getHours() + ':' + timeNow.getMinutes() + ':'
        // + timeNow.getSeconds() + ' ' + timeNow.getMilliseconds();
        // console.log('start pipe at ' + timeString );


        const sorted = this.getSortedData([...this._data]);
        const paged = this.getPagedData([...sorted]);

        const timeNow = new Date();
        const timeString = timeNow.getHours() + ':' + timeNow.getMinutes() + ':'
        + timeNow.getSeconds() + ' ' + timeNow.getMilliseconds();
        console.log('end pipe at ' + timeString ) ;

        return this._enrichData(paged);
      })
    );
  }

  private _enrichData(filtered) {
    const rows = [];
    filtered.forEach(
      element =>
        element.details
          ? rows.push(element, {detailRow: true, element} )
          : rows.push(element)
    );
    return rows;
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: any[]) {
    if (this.paginator != null) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    }
    return data;
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: any[]) {

    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      if (isNaN(a[this.sort.active])) {
        return compare(a[this.sort.active], b[this.sort.active], isAsc);
      } else {
        return compare(+a[this.sort.active], +b[this.sort.active], isAsc);
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
