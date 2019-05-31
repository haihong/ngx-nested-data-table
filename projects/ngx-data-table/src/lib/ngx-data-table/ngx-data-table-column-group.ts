export class DataTableColumnGroup {
    groupName: string;
    colspan: number;

    constructor(groupName: string, rowCount: number) {
        this.groupName = groupName;
        this.colspan = rowCount;
    }
}
