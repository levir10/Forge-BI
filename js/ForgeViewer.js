
var viewer;
var modData = {};
// @urn the model to show
// @viewablesId which viewables to show, applies to BIM 360 Plans folder
function launchViewer(urn, viewableId) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken,
    api: 'derivativeV2' + (atob(urn.replace('_', '/')).indexOf('emea') > -1 ? '_EU' : '') // handle BIM 360 US and EU regions
  };

  Autodesk.Viewing.Initializer(options, () => {
    
    const config = {// an object with a different properties
        //here we transfer the string name of the extentions
        // extensions: [ 'Autodesk.DocumentBrowser','HandleSelectionExtension','ModelSummaryExtension','testTest', 'HistogramExtension','DataGridExtension',] // OLD list of strings that represent the extentions we want to load to the viewer
         extensions: [ 'Autodesk.DocumentBrowser', 'HistogramExtension','DataGridExtension',"ToolBar",] // ACTUAL list of strings that represent the extentions we want to load to the viewer
        };
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), config);
    viewer.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });


  //This section will run only when the model will load fully 
  function onDocumentLoadSuccess(doc) {
    // if a viewableId was specified, load that view, otherwise the default view
    var viewables = (viewableId ? doc.getRoot().findByGuid(viewableId) : doc.getRoot().getDefaultGeometry());
    viewer.loadDocumentNode(doc, viewables).then(i => {
      // any additional action here?

      this.viewer.addEventListener(//
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,//-->(10) geometry load event - go to "extensions"
      onGeometryLoaded
    );
    });
  }
  function onGeometryLoaded() {
    console.log("Geometry Loaded");
    
    viewer.search(
      "",
      function (dbIds,propertyNames) {
        viewer.model.getBulkProperties(
          dbIds,
          // ["Category"],
        //{propFilter:["Category","System Classification","Area","Reference Level",'Level']},
          {propFilter:["Category","System Classification","Area","Reference Level",'System Type','Level','Type Name','Size','CFM','Length']},
          function (elements) {
            // var levelName = setLevelDropDown(elements);//-->the  first time- get the first level name
            var levelNames = FindLevelNames(elements);//-->the  first time- get the first level name
            var property = "AF_Flow";
            getListCategories(elements, function (cateElem) {
              arraySimplify(elements,levelNames[0],property,cateElem, function (object) {
                modData.quantities = object.quantities;
                modData.Elements = object.Elements;
                modData["Load"] = "Done";
                // console.log(propNames);
                // showPowerBIReport(levelNames,propNames);
                showPowerBIReport(levelNames);
              });
            });
          }
        );
      },
      null,
      ["Comments"]
    );
    
    DashBoardColors = generateColorsRandom();
  }


  function onDocumentLoadFailure(viewerErrorCode, viewerErrorMsg) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode + '\n- errorMessage:' + viewerErrorMsg);
  }
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });

  
}
function generateColorsRandom() {
  var background = [];

  background.push("rgba(" + 243 + ", " + 132 + ", " + 12 + ", 0.8)");
  background.push("rgba(" + 243 + ", " + 182 + ", " + 0 + ", 0.8)");
  background.push("rgba(" + 241 + ", " + 212 + ", " + 76 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 142 + ", " + 155 + ", 0.8)");
  background.push("rgba(" + 244 + ", " + 76 + ", " + 127 + ", 0.8)");
  background.push("rgba(" + 131 + ", " + 227 + ", " + 119 + ", 0.8)");
  background.push("rgba(" + 249 + ", " + 138 + ", " + 172 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 179 + ", " + 200 + ", 0.8)");
  background.push("rgba(" + 196 + ", " + 241 + ", " +241 + ", 0.8)");
  background.push("rgba(" + 114 + ", " + 220 + ", " + 202 + ", 0.8)");
  background.push("rgba(" + 241 + ", " + 255 + ", " + 111 + ", 0.8)");
  background.push("rgba(" + 241 + ", " + 166 + ", " + 111 + ", 0.8)");
  background.push("rgba(" + 188 + ", " + 0 + ", " + 221 + ", 0.8)");
  background.push("rgba(" + 219 + ", " + 0 + ", " + 182 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 0 + ", " + 1 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 111 + ", " + 1 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 180 + ", " + 15 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 195 + ", " + 100 + ", 0.8)");
  background.push("rgba(" + 65 + ", " + 95 + ", " + 134 + ", 0.8)");
  background.push("rgba(" + 25 + ", " + 145 + ", " + 158 + ", 0.8)");
  background.push("rgba(" + 0 + ", " + 98 + ", " + 255 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 242 + ", " + 0 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 0 + ", " + 123 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 0 + ", " + 43 + ", 0.8)");
  background.push("rgba(" + 0 + ", " + 187 + ", " + 255 + ", 0.8)");
  background.push("rgba(" + 0 + ", " + 187 + ", " + 255 + ", 0.8)");
  background.push("rgba(" + 41 + ", " + 227 + ", " + 134 + ", 0.8)");
  background.push("rgba(" + 109 + ", " + 189 + ", " + 40 + ", 0.8)");
  background.push("rgba(" + 39 + ", " + 159 + ", " + 245 + ", 0.8)");
  shuffle(background);

  return { background: background };
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

async function findPropertyNames(model) {
  const dbids = await this.findLeafNodes(model);
  return new Promise(function (resolve, reject) {
      model.getBulkProperties(dbids, {}, function (results) {
          let propNames = new Set();
          for (const result of results) {
              for (const prop of result.properties) {
                  propNames.add(prop.displayName);
              }
          }
          resolve(Array.from(propNames.values()));
      }, reject);
  });
}

function findLeafNodes(model) {
        
  return new Promise(function (resolve, reject) {
      model.getObjectTree(function (tree) {
          let leaves = [];
          tree.enumNodeChildren(tree.getRootId(), function (dbid) {
              if (tree.getChildCount(dbid) === 0) {
                  leaves.push(dbid);
              }
          }, true);
          resolve(leaves);
      }, reject);
  });
}

