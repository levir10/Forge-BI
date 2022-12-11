$(document).ready(function () {//we are using JQuary construct ("wrap") on the document, which is the entire HTML document
    //when the HTML "event" is ready, 
    $(document).on('DOMNodeInserted', function (e) {//create another event listener for en event called " DOMNodeInserted ":
        //which is event that "fires up" when another html IS BEING ADDED TO THE PARENT HTML--> we are using it to find the right timing to enicialize our dashboard

        if ($(e.target).hasClass('orbit-gizmo')) {//if the css class 'orbit-gizmo' is inserted, it means the new html is ready
            // here, viewer represents the variable defined at viewer initialization
            if (viewer === null || viewer === undefined) return;//once we have inserted our viewer object, we are checking if the viewer is available. and if it is - we are going tocreate a new dashboard.
            new Dashboard(viewer, [
                // create a BAR CHART-->each bar will present a material, and the height of the bar will be the amount
                new BarChart('Material'),//we are telling the chart to present all the accurences of the different values of the material properties.
                new PieChart('Material')
            ])
        }
    });
})

// Handles the Dashboard panels
class Dashboard {
    constructor(viewer, panels) {
        var _this = this;
        this._viewer = viewer;
        this._panels = panels;
        this.adjustLayout();
        this._viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (viewer) => {
            _this.loadPanels();//only when the viewer geometry loaded up, we will populate the dashboard
        });
    }
//---->שים לבבבב!!!! אם אני מבטל את מה שבין ההיערות האלו , הלייאאוט של הדאשבורדים מצד ימין לדף חוזרים!!!
    // adjustLayout() {
    //     // this function may vary for layout to layout...
    //     // for learn forge tutorials, let's get the ROW and adjust the size of the 
    //     // columns so it can fit the new dashboard column, also we added a smooth transition css class for a better user experience
    //     let dashdiv = document.getElementById('dashboard');
    //     if (!!dashdiv) {
    //         dashdiv.parentElement.removeChild(dashdiv);
    //     }
    //     var row = $(".row").children();
    //     // $(row[0]) is the first element of the sidebar (first row) 
    //     $(row[0]).removeClass('col-sm-4').addClass('col-sm-2 transition-width');//change the width of the css class of the sidebar container from 4 to 2 and make some room
    //     //$(row[1]) the div vontainer of the viewer and make is smaller
    //     $(row[1]).removeClass('col-sm-8').addClass('col-sm-7 transition-width').after('<div class="col-sm-3 transition-width" id="dashboard"></div>');
    // }
//---->שים לבבבב!!!! אם אני מבטל את מה שבין ההיערות האלו , הלייאאוט של הדאשבורדים מצד ימין לדף חוזרים!!!
    
loadPanels() {
        var _this = this;
        var data = new ModelData(this);//"data" is being computed from our model (all the different ocurences of the property values) 
        data.init(function () {
            $('#dashboard').empty();// when that is ready, we're gonna empty the dashboard div element
            $('#dashboard').append('<select id="property-name"></select>');// USING JQUARY to add a dropdown to the HTML progrematically 
            for (const propName of data.getAllProperyNames()){
                $('#property-name').append("<option value ='"+{propName}.propName+"'>"+ {propName}.propName +"</option>"); 
            }
            $('#property-name').on('change',function (){
               // debugger; 
                $('.dashboardPanel').remove();
                 _this._panels.forEach(function (panel) {//and for each pannel that has been passed to us by the constructon( inside "Dashboard class in line 9 here) 
                     // let's create a DIV with the Panel Function name and load it
                     panel.propertyToUse = $('#property-name').val();
                     panel.load('dashboard', viewer, data);// we will create a new pannel in the dashboard div
                 });
             });

            _this._panels.forEach(function (panel) {//and for each pannel that has been passed to us by the constructon( inside "Dashboard class in line 9 here) 
                // let's create a DIV with the Panel Function name and load it
                panel.load('dashboard', viewer, data);// we will create a new pannel in the dashboard div
            });
        });
    }
}
