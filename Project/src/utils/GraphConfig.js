//Used to build Graphs Axis & Series, then return those arr vals.
//Imports Here

//Functions & Vars Here
//DataInput is the Database Datagrid.
//QueryArgs is a string for filtering the Datagrid.
function filterDataGrid(data){
    
}

//GraphTypes: 0 = BarGraph, 1 = LineGraph, 2 = TestCase, Any other val is null.
//Builds xAxis for a graph, will need configged for yAxis implementations.
//
function buildAxis(graphType, userArgs){
    let inputAxisGrid = [];
    //let scaleStr = "";
    //let dataArr = [];

    switch (graphType) {
        case 0:
            //Make BarGraph axis data
            break;
        case 1:
            //Make LineGraph axis data
            break;
        case 2:
            //Make TestCase axis data for other Charts.
            //If other axis data for other graphs is needed,
            //A new case can be made accordingly.
            break;
        default:
            //Return invalid.
            break;
    }
}

//GraphTypes: 0 = BarGraph, 1 = LineGraph, 2 = PieGraph, 3 = TestCase, Any other val is null.
//Builds Series for a graph, will need configged for other implementations.
function buildSeries(graphType, userArgs){
    let inputSeriesGrid = [];
    let idCount = 0;
    //let valueArr = [];
    //let labelArr = [];
    //let dataArr = [];

    switch (graphType) {
        case 0:
            //Make BarGraph series data
            break;
        case 1:
            //Make LineGraph series data
            break;

        case 2:
            //Make PieGraph series data
            break;
        case 3:
            //Make TestCase series data for other Charts.
            //If other series data for other graphs is needed,
            //A new case can be made accordingly.
            break;
        default:

            break;
    }
}