import {Component, ViewChild} from '@angular/core';
import { NgxDataTableComponent } from 'projects/ngx-data-table/src/lib/ngx-data-table/ngx-data-table.component';
import * as faker from 'faker';
import { OriginationPipeline, OriginationPipelineDetail} from './models/origination-pipeline.model';
import { ActivityTrackerStatus, ActivityTrackerGroup, ActivityTrackerUser} from './models/activity-tracker.model';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';

  data: any[] = [];
  team: string[] = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
  appStatus: string[] = ['App Received', 'App Processed', 'Indicative Sent',
                      'Val Requested', 'Val Received', 'Credit Approved', 'Offer Prepared',
                      'Settled', 'Cancelled'];


  testActivityDataInit() {
    for ( let i = 0 ; i < this.appStatus.length; i++ ) {
      const activityStatus: ActivityTrackerStatus = {
        name: this.appStatus[i],
        'Apr 19 $': faker.random.number(),
        'Apr 19 #': faker.random.number() % 20,
        'Mar 19 $': faker.random.number(),
        'Mar 19 #': faker.random.number() % 20,
        'Feb 19 $': faker.random.number(),
        'Feb 19 #': faker.random.number() % 20,
        'Jan 19 $': faker.random.number(),
        'Jan 19 #': faker.random.number() % 20,
        'Dec 18 $': faker.random.number(),
        'Dec 18 #': faker.random.number() % 20,
        'Nov 18 $': faker.random.number(),
        'Nov 18 #': faker.random.number() % 20,
        'Oct 18 $': faker.random.number(),
        'Oct 18 #': faker.random.number() % 20,
        'Sep 18 $': faker.random.number(),
        'Sep 18 #': faker.random.number() % 20,
        'Aug 18 $': faker.random.number(),
        'Aug 18 #': faker.random.number() % 20,
        'Jul 18 $': faker.random.number(),
        'Jul 18 #': faker.random.number() % 20,
        'Jun 18 $': faker.random.number(),
        'Jun 18 #': faker.random.number() % 20,
        'May 18 $': faker.random.number(),
        'May 18 #': faker.random.number() % 20,
        details: [],
      };

      for ( let j = 0 ; j < this.team.length; j++ ) {
        const activityGroup: ActivityTrackerGroup = {

        name: this.team[j],
        'Apr 19 $': faker.random.number(),
        'Apr 19 #': faker.random.number() % 10,
        'Mar 19 $': faker.random.number(),
        'Mar 19 #': faker.random.number() % 10,
        'Feb 19 $': faker.random.number(),
        'Feb 19 #': faker.random.number() % 10,
        'Jan 19 $': faker.random.number(),
        'Jan 19 #': faker.random.number() % 10,
        'Dec 18 $': faker.random.number(),
        'Dec 18 #': faker.random.number() % 10,
        'Nov 18 $': faker.random.number(),
        'Nov 18 #': faker.random.number() % 10,
        'Oct 18 $': faker.random.number(),
        'Oct 18 #': faker.random.number() % 10,
        'Sep 18 $': faker.random.number(),
        'Sep 18 #': faker.random.number() % 10,
        'Aug 18 $': faker.random.number(),
        'Aug 18 #': faker.random.number() % 10,
        'Jul 18 $': faker.random.number(),
        'Jul 18 #': faker.random.number() % 10,
        'Jun 18 $': faker.random.number(),
        'Jun 18 #': faker.random.number() % 10,
        'May 18 $': faker.random.number(),
        'May 18 #': faker.random.number() % 10,
        details: [],
        };

        let randomSize = faker.random.number() % 20;
        if ( randomSize <= 2) {
          randomSize = 2;
        }

        for ( let u = 0 ; u < randomSize; u++ ) {
          const activityUser: ActivityTrackerUser = {
            name: faker.name.findName(),
            'Apr 19 $': faker.random.number(),
            'Apr 19 #': faker.random.number() % 10,
            'Mar 19 $': faker.random.number(),
            'Mar 19 #': faker.random.number() % 10,
            'Feb 19 $': faker.random.number(),
            'Feb 19 #': faker.random.number() % 10,
            'Jan 19 $': faker.random.number(),
            'Jan 19 #': faker.random.number() % 10,
            'Dec 18 $': faker.random.number(),
            'Dec 18 #': faker.random.number() % 10,
            'Nov 18 $': faker.random.number(),
            'Nov 18 #': faker.random.number() % 10,
            'Oct 18 $': faker.random.number(),
            'Oct 18 #': faker.random.number() % 10,
            'Sep 18 $': faker.random.number(),
            'Sep 18 #': faker.random.number() % 10,
            'Aug 18 $': faker.random.number(),
            'Aug 18 #': faker.random.number() % 10,
            'Jul 18 $': faker.random.number(),
            'Jul 18 #': faker.random.number() % 10,
            'Jun 18 $': faker.random.number(),
            'Jun 18 #': faker.random.number() % 10,
            'May 18 $': faker.random.number(),
            'May 18 #': faker.random.number() % 10,
          };
          activityGroup.details.push(activityUser);
        }

        activityStatus.details.push(activityGroup);

      }
      this.data.push(activityStatus);

    }
  }
  testPipelineDataInit() {

    for (let i = 0; i < 8; i++) {
      const pipeline: OriginationPipeline = {
        name: this.team [i],
        receivedAmount: faker.random.number(),
        receivedCount: faker.random.number() % 30,
        processedAmount: faker.random.number(),
        processedCount: faker.random.number() % 30,
        indicativeAmount: faker.random.number(),
        indicativeCount: faker.random.number() % 30,
        valReqAmount: faker.random.number(),
        valuationRequestedCount: faker.random.number() % 30,
        valRecAmount: faker.random.number(),
        valuationReceivedCount: faker.random.number() % 30,
        recommendAmount: faker.random.number(),
        applicationRecommendedCount: faker.random.number() % 30,
        approvedAmount: faker.random.number(),
        creditApprovedCount: faker.random.number() % 30,
        totalAmount: faker.random.number(),
        totalCount: faker.random.number() % 30,
        details: [],
      };

      let randomSize = faker.random.number() % 20;
      if ( randomSize <= 2) {
         randomSize = 2;
      }

      for (let j = 0; j < randomSize; j++) {
        const detail: OriginationPipelineDetail = {
          name: faker.name.findName(),
          receivedAmount: faker.random.number(),
          receivedCount: faker.random.number() % 10,
          processedAmount: faker.random.number(),
          processedCount: faker.random.number() % 10,
          indicativeAmount: faker.random.number(),
          indicativeCount: faker.random.number() % 10,
          valReqAmount: faker.random.number(),
          valuationRequestedCount: faker.random.number() % 10,
          valRecAmount: faker.random.number(),
          valuationReceivedCount: faker.random.number() % 10,
          recommendAmount: faker.random.number(),
          applicationRecommendedCount: faker.random.number() % 10,
          approvedAmount: faker.random.number(),
          creditApprovedCount: faker.random.number() % 10,
          totalAmount: faker.random.number(),
          totalCount: faker.random.number() % 10,
        };

        pipeline.details.push(detail);
      }

      this.data.push(pipeline);
    }


  }


  constructor() {
    //  this.testPipelineDataInit();
      this.testActivityDataInit();
    // console.log(this.data);
  }

  getTotal(columnName: string, index: number, data: any[], isDetailTable: boolean) {
    if ( columnName == null || columnName === '' || index == null || data == null ) {
      return '';
    }

    if ( index === 0 ) {
      if ( isDetailTable) {
        return 'Sum';
      } else {
        return 'Total';
      }

    } else {
      let num = 0 ;
      for ( let i = 0 ; i < data.length; i++ ) {
        num  = num + data[i][columnName];
      }
     return num;

    }
}

  getDisplayName(columnName: string): string {

    return columnName;

    // if ( columnName == null || columnName === '') {
    //   return columnName;
    // }

    // if ( columnName.indexOf('Count') > 0 ) {
    //   return '#';
    // } else {
    //   const re = /([A-Za-z]?)([a-z]+)/g, output = [];
    //   let match;

    // match = re.exec(columnName);
    // while (match) {
    //   output.push([match[1].toUpperCase(), match[2]].join(''));
    //   match = re.exec(columnName);
    // }

    // if ( output[ output.length - 1 ].toLowerCase() === 'amount') {
    //   output[ output.length - 1 ] = '$';
    // }

    // return output.join(' ');

    // }

  }
}

