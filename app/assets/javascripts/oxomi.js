// OXOMI JavaScript Bibliothek einbinden und laden
setTimeout(function() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = (window.location.protocol == 'https:' ? 'https:' : 'http:')
                + "//" + (typeof oxomi_server == 'undefined' ? 'oxomi.com' : oxomi_server)
                + "/assets/frontend/oxomi.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}, 0);
 
// Wir warten bis die OXOMI JavaScript Bibliothek geladen ist...
function oxomi_ready() {
    // Initialisierung
    var something = {};
    oxomi.init({
        "portal": "DEMO",
        "lang": "en",
        "infoplayItemLookup": function (infoplayData, next) {
            //next(infoplayData);
            
            $.ajax('https://private-b64244-infoplay.apiary-mock.com/articel-info/'+ infoplayData.itemNumber, 
                {'success': function(meineDaten, status, jqxhr) { 
                    // Neues Item zum befüllen definieren 
                    var artikeldaten = {};

                    // Artikelnummer aus dem Aufruf übernehmen
                    artikeldaten['itemNumber'] = infoplayData.itemNumber;

                    // Stammdaten
                    artikeldaten['supplierName'] = meineDaten['supplierName'];
                    artikeldaten['shortText'] = meineDaten['shortText'];
                    // artikeldaten['previewImageUrl']
                    // artikeldaten['itemUrl']

                    // Verkaufsdaten
                    artikeldaten['quantity'] = meineDaten['minQuantity'];
                    artikeldaten['price'] = meineDaten['price'] ;
                    artikeldaten['currency'] = meineDaten['currency']
                    artikeldaten['quantityUnitName'] = meineDaten['quantityUnitName'];
                    artikeldaten['additionalSections'] = [
                        {'fields': [
                            {
                            'name': 'Verkaufspreis',
                            'value': meineDaten['price'] + ' '+ meineDaten['currency']
                            },
                            {
                            'name': 'Mindestbestellmenge',
                            'value': meineDaten['minQuantity'] + ' ' + meineDaten['quantityUnitName']
                            },
                            {
                            'name': 'Bestellschritt',
                            'value': meineDaten['quantityStep'] + ' ' + meineDaten['quantityUnitName']
                            }
                        ]},
                        {'title' : 'Verfügbarkeit',
                        'fields' : [
                            {
                            'name': 'Hauptstandort',
                            'value': meineDaten['availability'] + ' ' + meineDaten['quantityUnitName']
                            }
                        ]}
                    ];
                    something = artikeldaten;
                    infoplayData.items.push(artikeldaten);
                    // Nachfolgenden Verarbeitungs-Schritt auslösen
                    next(infoplayData);
                }}
            );
        },
        "infoplayMenuTitle" : "Add to basket...",
        "infoplayBasketHandler": function(infoplayData, next) {
            // Hier Warenkorb URL aufrufen und Antwort verarbeiten
           

            $.ajax({
                type: "POST",
                url: "/oxomi_products",
                data: { 
                    product: {
                        name: infoplayData.itemNumber,
                        sku: infoplayData.itemNumber,
                        description: infoplayData.items[0].shortText,
                        image_url: infoplayData.items[0].previewImageUrl,
                        price: infoplayData.items[0].price,
                        currency: infoplayData.items[0].currency
                    } 
                },
                success(data) {
                    $.post("/orders/populate",
                    {
                        variant_id: data.id,
                        quantity: infoplayData.quantity
                    },
                    function(data, status){
                        alert("Data: " + data + "\nStatus: " + status);
                    });
                },
                error(data) {
                    return false;
                }
            });
             /*
           */

            //alert(infoplayData.items[0].price +": " +infoplayData.items[0].features[0].fields[0].value  + ":  "+ infoplayData.items[0].itemNumber +": " + infoplayData.items[0].shortText+ ": " + infoplayData.items[0].previewImageUrl + ": " + infoplayData.quantity);
            
            // a way for calling it but it uses a get request and dont really like this way
            // Its a redirecting the user
            //location.href = '/oxomi_products?item='+ infoplayData.itemNumber +'&quantity=' + infoplayData.quantity;
            next(infoplayData);
        },
        "itemDataActivator": function (context) {
            context.json.datasheetUrl = window.location.href;
            oxomi.defaultActivators.itemDataActivator(context);
        },
        infoplayExternalLookupClosure: function (infoplayData, infoplayExternalLookup, processInfoplayItemResult) {
            infoplayExternalLookup(infoplayData, function (infoplayData) {
                if (infoplayData.items.length) {
                    infoplayData.items[0].datasheet = "https://www.ihre-seite.de?selection=itemnr_" + infoplayData.items[0].itemNumber;
                }
                processInfoplayItemResult(infoplayData);
            })
        }
    });

    // Infoplay Funktion auf den Eingabe-Button legen
    $('#infoplay-button').bind('click', function(e) {
        
        // Infoplay für den angegeben Aritkel aufrufen 
        oxomi.infoplayItem({'itemNumber': $('#item-number').val()});
    });

     // Funktionsaufruf, um Exposes zu einem Artikel anzuzeigen
     oxomi.itemImages({
        "target": "#bilder-output",
        "supplierItemNumber": "ST.001.A",
        "supplierNumber": "ST",
        "showDetails": true
    });
  
  
    // Funktionsaufruf, um Dokument-Seiten zu einem Artikel anzuzeigen
    oxomi.itemPages({
        "target": "#dok-output",
        "itemNumber": "WZ.003.C",
        "supplierItemNumber": "ST.001.A",
        "supplierNumber": "ST",
        "showDetails": true,
        "limit": "10"
    }); 

  
// Funktionsaufruf, um Videos zu einem Artikel anzuzeigen
    oxomi.itemVideos({
        "target": "#video-output",
        "supplierItemNumber": "ST.001.A",
        "supplierNumber": "ST",
        "mode": "overlay",
        "size": "small",
        "showDetails": true
    }); 
  
  // Funktionsaufruf, um Exposes zu einem Artikel anzuzeigen
    oxomi.itemFeatures({
        "target": "#merkmale-output",
        "supplierItemNumber": "ST.001.A",
        "supplierNumber": "ST",
        "showDetails": true
    }); 
  
  oxomi.itemAttachments({
        "target": "#download-output",
        "supplierItemNumber": "AS.001.A",
        "supplierNumber": "ST",
    }); 
  
  oxomi.itemReferences({
        "target": "#accessory-output",
        "supplierItemNumber": "WZ.001.A",
        "supplierNumber": "ST",
    }); 
  
  oxomi.itemDatasheet({
        "target": "#datasheet-output",
        "supplierItemNumber": "ST.001.A",
        "supplierNumber": "ST",
        "videoMode": "overlay",
        "fullWidthHeading": true,
    }); 

    // Funktionsaufruf, um Portaloberflche anzuzeigen
    oxomi.portalSearch({
        "target": "#universal-search-output",
        "input": "#universal-search-input",
        "showDetails": true,
        "lang": "de",
        "contentLimit": "250",
        "itemLimit": "100",
        "filterBox": "#universal-search-filter",
        "filterBoxGroups": "types,categories,tags,langs",
        "withDownload": false,
        "showAnchorLinks": true,
        "selection": oxomi.parseQueryString().selection ||"",
        "updatePortalUrl": true
    }); 
};
