export class DataTableColumnGroup {
    groupName: string;
    colspan: number;
    backgroundColor: string;
    color: string;

    constructor(groupName: string, rowCount: number, color: string = '', backgroundColor= '') {
        this.groupName = groupName;
        this.colspan = rowCount;
        this.color = color === '' ? 'black' : color;
        this.backgroundColor = backgroundColor === '' ? 'white' : backgroundColor;
    }
}
