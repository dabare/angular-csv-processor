import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {

  title = 'Angular7-readCSV';


  public showRawdata = true;
  public showPredata = true;
  public showGroups = true;

  public records: any[] = [];
  public headers: any[] = [];

  public preprocessedRecords: any[] = [];

  ngOnInit() {
    console.log(this.preproces('  asd,as\\\\////da--sd.as234234234234UOKBHKJHBda   sd,asd  Madhava0774457794', true));
  }


  uploadListener($event: any): void {
    const files = $event.srcElement.files;

    this.fileReset();

    if (this.isValidCSVFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);

        const headersRow = this.getHeaderArray(csvRecordsArray);

        this.headers = headersRow;

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = () => {
        console.log('error is occured while reading file!');
      };

    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    const csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length === headerLength) {
        csvArr.push(curruntRecord);


        const tmp = Object.assign([], curruntRecord);


        for (let j = 0 ; j < this.headers.length; j++) {

          if (this.headers[j].name !== 'Telephone' && this.headers[j].name !== 'Telephone2'
            && this.headers[j].name !== 'Fax1' && this.headers[j].name !== 'Fax2' ) {
            tmp[j] = this.preproces(tmp[j], false);
            this.headers[j].groups[tmp[j]] = (this.headers[j].groups[tmp[j]] || 0) + 1;
          } else {
            tmp[j] = this.preproces(tmp[j], true);
            this.headers[j].groups[tmp[j]] = (this.headers[j].groups[tmp[j]] || 0) + 1;
          }
        }
        this.preprocessedRecords.push(tmp);

      }
    }
    console.log(this.headers);
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  getHeaderArray(csvRecordsArr: any) {
    const headers = (csvRecordsArr[0] as string).split(',');
    const headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push({
        name: headers[j],
        use: true,
        groups: {}
      });
    }
    return headerArray;
  }

  fileReset() {
    this.records = [];
    this.headers = [];
    this.preprocessedRecords = [];
  }

  preproces(str, isPhone) {
   const regex = /[^0-9a-zA-Z]/gi;
   let ret = str.replace(regex, '').toUpperCase();
   if (isPhone) {
     ret = ret.substring(ret.length - 9, ret.length);
   }
   return ret;
  }

  doPreprocessing() {
    this.preprocessedRecords = [];
    for (let i = 1; i < this.records.length; i++) {
      const tmp = Object.assign([], this.records[i]);


      for (let j = 0 ; j < this.headers.length; j++) {

          if (this.headers[j].name !== 'Telephone' && this.headers[j].name !== 'Telephone2'
            && this.headers[j].name !== 'Fax1' && this.headers[j].name !== 'Fax2' ) {
            tmp[j] = this.preproces(tmp[j], false);
          } else {
            tmp[j] = this.preproces(tmp[j], true);
          }
        }
      this.preprocessedRecords.push(tmp);
    }
  }

  showHideRawdata() {
  this.showRawdata = !this.showRawdata;
  }

  showHidePreData() {
    this.showPredata = !this.showPredata;
  }

  showHideGroups() {
    this.showGroups = !this.showGroups;
  }


  getLength(i) {
   return Object.keys(i.groups).length;
  }

  getGroups(i){
    return Object.keys(i.groups);
  }
}
