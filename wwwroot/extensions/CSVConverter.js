export default function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {

    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    let CSV = '';
    //This condition will generate the Label/Header
    if (ShowLabel) {
        let row = "";

        //This loop will extract the label from 1st index of on array
        for (let index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (let i = 0; i < arrData.length; i++) {
        let row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (let index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //this trick will generate a temp "a" tag
    let link = document.createElement("a");
    link.id = "lnkDwnldLnk";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);

    let csv = CSV;
    const blob = new Blob([csv], { type: 'text/csv' });
    let csvUrl = window.webkitURL.createObjectURL(blob);
    let filename =  (ReportTitle || 'UserExport') + '.csv';

    document.getElementById("lnkDwnldLnk").download = filename; 
    document.getElementById("lnkDwnldLnk").href = csvUrl;

    document.getElementById('lnkDwnldLnk').click();
    document.body.removeChild(link);
}