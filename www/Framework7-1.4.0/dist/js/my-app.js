window.onerror = function (errorMsg, url, lineNumber) {
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
}

// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;
var pictureSource;
// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


function onPhotoURISuccesshitsimages(imageData) {
    var image = '<li><a rel="gallery-3" href="' + imageData + '" title="Photo title" class="swipebox"><img width="100%" height="80%" src="' + imageData + '" alt="image"/></a></li>';
    $('#photoslist').prepend(image);
}

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;



}

function onFail(message) {
        alert('Failed because: ' + message);
}

function onPhotoURISuccessfarimage(imageData) {

    $('.farimage').attr({
        'src': imageData,
        'width': '100%'
    });
}

function onPhotoURISuccesshitsimages(imageData) {


    var image = '<li><a rel="gallery-3" href="' + imageData + '" title="Photo title" class="swipebox"><img width="100%" height="80%" src="' + imageData + '" alt="image"/></a></li>';
    console.log($('#photoslist'));
    $('#photoslist').prepend(image);

}

function capturePhotoWithFile(type) {

    if (type == 'farimage') {

        navigator.camera.getPicture(onPhotoURISuccessfarimage, onFail, {
            quality: 50,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true
        });
    } else {
        navigator.camera.getPicture(onPhotoURISuccesshitsimages, onFail, {
            quality: 50,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true
        });
    }
}

function getPhoto(source, type) {
    // Retrieve image file location from specified source


    if (type == 'farimage') {
        navigator.camera.getPicture(onPhotoURISuccessfarimage, onFail, {
            quality: 50,
            destinationType: destinationType.FILE_URI,
            sourceType: source
        });
    } else {
        navigator.camera.getPicture(onPhotoURISuccesshitsimages, onFail, {
            quality: 50,
            destinationType: destinationType.FILE_URI,
            sourceType: source
        });
    }

}    
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    try{
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    }catch(e){console.log(e);}
}    


$(document).ajaxSend(function (event, jqXHR, settings) {
    $('#general-ajax-load').fadeIn();
});

$(document).ajaxComplete(function (event, jqXHR, settings) {
    $('#general-ajax-load').fadeOut();
});

// Handlebars Helpers
Handlebars.registerHelper('ToJson', function (context) {
    return JSON.stringify(context);
});

// Save Conditions To LocalStorage
Handlebars.registerHelper('is_status', function (msg, matchMsg, options)
{
    if (msg === matchMsg)
        return true;
    else
        return false;
});


Handlebars.registerHelper('option', function (value, allOptions) {
    var allOptions = eval(allOptions);
    var arrayLength = allOptions.length;
    var selectedOption = '';
    var options = '';
    for (var x = 0; x < arrayLength; x++) {
        if (value == allOptions[x])
            selectedOption = value;
        else
            options += '<option>' + allOptions[x] + '</option>';
    }
    return new Handlebars.SafeString('<option value="' + selectedOption + '" selected>' + selectedOption + "</option>" + options);
});


var update_cond_tpl = {"Action_Update_Conditions_Input": {
        "ActionMobile": {
            "ActivitySerialNumber": "{{conditionsReq.ActivitySerialNumber}}",
            "ActivityUID": "{{conditionsReq.ActivityUID}}",
            "Category": "عام",
            "Display": "التقويم والأنشطة",
            "RowStatusOld": "Y",
            "InspectSubType": "{{conditionsReq.InspectSubType}}",
            "LiceNumber": "{{conditionsReq.LiceNumber}}",
            "PrimaryOwnerId": "{{conditionsReq.PrimaryOwnerId}}",
            "SourcesName": "{{conditionsReq.SourcesName}}",
            "Status": "{{conditionsReq.Status}}",
            "StoreMainActivity": "{{conditionsReq.StoreMainActivity}}",
            "StoreNameARA": "{{conditionsReq.StoreNameARA}}",
            "StoreNameENU": "{{conditionsReq.StoreNameENU}}",
            "StoreOrder": "{{conditionsReq.StoreOrder}}",
            "StoreRegNo": [],
            "StoreStartDate": [],
            "StoreStartHijriDate": [],
            "StoreSubActivity": "{{conditionsReq.StoreSubActivity}}",
            "Type": "{{conditionsReq.Type}}",
            "ListOfActivitiesCond": []
        },
        "ActionId": "{{conditionsReq.ActionId}}"
    }
};

var MobileApp = new HmmMobileApp();

$('.login-btn').click(function () {
    var userName = $('.userNameLogin').val();
    var userPass = $('.passwordLogin').val();

    var myparams = {"userId": userName, "userPass": userPass};
    MobileApp.sendRequest('login', myparams, function (loginFlag) {
        localStorage.setItem('loginFlag', loginFlag);

        myparams = {"userName": userName};
        MobileApp.sendRequest('loginData', myparams, function (loginData) {
            if (loginData != null) {
                localStorage.setItem('loginData', loginData);
                mainView.router.loadPage('tasks.html');
            } else {
                alert('Invalid user name or password');
            }
        });
    });

    return false;
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('first_task', function (page) {

    var loginId = localStorage.getItem('loginData');
    var myparams = {"logInId": loginId};

    MobileApp.sendRequest('listActivities', myparams, function (ActivitiesArray) {
        if (ActivitiesArray != null) {
            // Save Activities To LocalStorage
            localStorage.setItem('Activities', JSON.stringify(ActivitiesArray));

            // Compile Template
            var source = $("#activity-template").html();
            var template = Handlebars.compile(source);
            var context = {Activities: ActivitiesArray};
            var html = template(context);

            // Append Result
            $("#hmmTabel").append(html);

            // detect activity selection
            var $activities = $('a[data-activitySN]');
            $activities.click(function () {
                var id = $(this).attr('data-activitySN');
                localStorage.setItem('active_activity_id', id);

                var activity_date = $(this).attr('data-activity');
                localStorage.setItem('active_activity', activity_date);

            });
        }
    });
});



myApp.onPageInit('gis', function (page) {
    /*var initialLocation;
    var siberia = new google.maps.LatLng(60, 105);
    var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
    var browserSupportFlag = new Boolean();
    function initialize() {
        var myOptions = {
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("googleMap1"), myOptions);

        // Try W3C Geolocation (Preferred)
        if (navigator.geolocation) {
            browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition(function (position) {
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(initialLocation);
            }, function () {
                handleNoGeolocation(browserSupportFlag);
            });
        }
        // Browser doesn't support Geolocation
        else {
            browserSupportFlag = false;
            handleNoGeolocation(browserSupportFlag);
        }

        function handleNoGeolocation(errorFlag) {
            if (errorFlag == true) {
                alert("Geolocation service failed.");
                initialLocation = newyork;
            } else {
                alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
                initialLocation = siberia;
            }
            map.setCenter(initialLocation);
        }
    }
    google.maps.event.addDomListener(window, 'click', initialize);*/
});


// List Conditions
myApp.onPageInit('conditions', function (page) {


    var actionId = localStorage.getItem('active_activity_id');
    var myparams = {"actionId": actionId};
    MobileApp.sendRequest('listConditions', myparams, function (ConditionsArray) {

        if (ConditionsArray != null) {
            localStorage.setItem('Conditions', JSON.stringify(ConditionsArray));
            // Compile Template
            var source = $("#conditions-template").html();
            var template = Handlebars.compile(source);
            var context = {
                Conditions: ConditionsArray['result']
            };
            var html = template(context);

            // Append Result
            $("#hmmTabel").append(html);



            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["ActivitySerialNumber"] = ConditionsArray["request"]["ActivitySerialNumber"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["ActivityUID"] = ConditionsArray["request"]["ActivityUID"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["InspectSubType"] = ConditionsArray["request"]["InspectSubType"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["LiceNumber"] = ConditionsArray["request"]["LiceNumber"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["PrimaryOwnerId"] = ConditionsArray["request"]["PrimaryOwnerId"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["SourcesName"] = ConditionsArray["request"]["SourcesName"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["Status"] = ConditionsArray["request"]["Status"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["StoreMainActivity"] = ConditionsArray["request"]["StoreMainActivity"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["StoreNameARA"] = ConditionsArray["request"]["StoreNameARA"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["StoreNameENU"] = ConditionsArray["request"]["StoreNameENU"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["StoreOrder"] = ConditionsArray["request"]["StoreOrder"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["StoreSubActivity"] = ConditionsArray["request"]["StoreSubActivity"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["Type"] = ConditionsArray["request"]["Type"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["Category"] = ConditionsArray["request"]["Category"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["Display"] = ConditionsArray["request"]["Display"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["RowStatusOld"] = ConditionsArray["request"]["RowStatusOld"];
            update_cond_tpl["Action_Update_Conditions_Input"]["ActionId"] = localStorage.getItem('active_activity_id');




            $('.button').on('click', function () {
                $('[data-flag]').each(function () {
                    var $parentTr = $($(this).closest('tr'));
                    var json = eval('(' + $parentTr.attr('data-json') + ')');
                    update_cond_tpl["Action_Update_Conditions_Input"]["ActionMobile"]["ListOfActivitiesCond"].push(json);
                });


                MobileApp.sendRequest('listUpdConditions', update_cond_tpl, function (ConditionsArray) {

                    var violationslist = JSON.stringify(ConditionsArray['ActionMobile']);
                    localStorage.setItem('violations', violationslist);
                });

            });

            //Flag on change
            $('[data-flag]').change(function () {

                var checked = $(this).is(':checked') ? 'Y' : 'N';
                var $parentTr = $($(this).closest('tr'));
                var json = eval('(' + $parentTr.attr('data-json') + ')');
                json['IdenticalFlag'] = checked;
                json = JSON.stringify(json);
                $parentTr.attr('data-json', json);

            });
        }

    });
});

myApp.onPageInit('receive-operation', function (page) {
    if (localStorage.getItem('active_activity') != null) {
        var activity = eval('(' + localStorage.getItem('active_activity') + ')');
        localStorage.setItem('activituUId', activity['ActivityUID']);
        var $fields = $('input[type="text"]');
        $fields.each(function () {
            var xmlName = $(this).attr('data-xmlname');
            $(this).val(activity[xmlName]);
        });
    }
});


// List violations
myApp.onPageInit('violations', function (page) {
    if (localStorage.getItem('violations') != null) {
        var violationsArray = eval('(' + localStorage.getItem('violations') + ')');
        if(violationsArray != null) {
        var activityUID = violationsArray['ActivityUID'];
        var source = $("#violations-template").html();
        var violationList = violationsArray['ListOfHmmMaidanActivtiesVio'];
        var activityUId = localStorage.getItem('activituUId');
        var template = Handlebars.compile(source);
        var context = {
            Violations: violationList,
            totalValue: violationsArray['TotalFinesValue']
        };
        var html = template(context);

        // Append Result
        $(".violations").append(html);

        source = $('#violations-popup-template').html();
        template = Handlebars.compile(source);
        context = {
            Violations: violationList

        };
        html = template(context);
        $('.violationPopup').append(html);

        $('[data-popup]').click(function () {
            var violationId = $(this).data('vioid');
            localStorage.setItem('violationId', violationId);
            // localStorage.setItem('activituUId', violationId);
        });
        var violationID = localStorage.getItem('violationId');
        var myparams = {"ViolationId": violationID, "ActivityId": activityUID};
        $('.saveViolations').click(function () {
            $ListDiv = $(this).closest('.list-block');
            var xmlName = $ListDiv.children().find("[data-vioname]");
            $(xmlName).each(function (index, value) {
                myparams[$(this).data('vioname')] = $(this).val();
            });

            MobileApp.sendRequest('listUptViolations', myparams, function (ViolationsUptArray) {

            });
        });
      }
    }
});


myApp.onPageInit('notes', function (page) {
    var data = eval('(' + localStorage.getItem('violations') + ')');
    if(data != null) {
    if(data['ActivityUID'] != null) {
    localStorage.setItem('activityUId', data['ActivityUID']);
    $('.saveNotes').click(function () {
        var note = $('#noteText').val()
        var notesParam = {
            "activitySerialNumber": data['ActivitySerialNumber'],
            "activityUId": data['ActivityUID'],
            "inspectSubType": data['InspectSubType'],
            "liceNumber": data['LiceNumber'],
            "primaryOwnerId": data['PrimaryOwnerId'],
            "sourceName": data['SourcesName'],
            "status": data['Status'],
            "storeMainActivity": data['StoreMainActivity'],
            "storeNameAra": data['StoreNameARA'],
            "storeNameEnu": data['StoreNameENU'],
            "storeOrder": data['StoreOrder'],
            "storeRegNo": data['StoreRegNo'],
            "storeStartDate": data['StoreStartDate'],
            "storeStartHijriDate": data['StoreStartHijriDate'],
            "storeSubActivity": data['StoreSubActivity'],
            "type": data['Type'],
            "id": "1-EE2OB1",
            "caseId": data['ActivityUID'],
            "note": note,
            "recordId": "1-EE2OB1"
        };

        MobileApp.sendRequest('listNotes', notesParam, function (NotesArray) {
            console.log(NotesArray);
        });
    });
  }
}
});


myApp.onPageInit('end', function (page) {
    var activityUId = localStorage.getItem('activityUId');
    var listStatusParam = {"objectSpcId": activityUId};
    $('.save').click(function () {
        MobileApp.sendRequest('listStatus', listStatusParam, function (statusArray) {

        });
    });

});

myApp.onPageInit('upload', function (page) {
    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: 'pickfiles', // you can pass an id...
        container: document.getElementById('container'), // ... or DOM Element itself
        url: 'upload.php',
        flash_swf_url: 'Moxie.swf',
        silverlight_xap_url: 'Moxie.xap',
        filters: {
            max_file_size: '10mb',
            mime_types: [
                {title: "Image files", extensions: "jpg,gif,png"},
                {title: "Zip files", extensions: "zip"}
            ]
        },
        init: {
            PostInit: function () {
                document.getElementById('filelist').innerHTML = '';

                document.getElementById('uploadfiles').onclick = function () {
                    uploader.start();
                    return false;
                };
            },
            FilesAdded: function (up, files) {
                plupload.each(files, function (file) {
                    document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                });
            },
            UploadProgress: function (up, file) {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            },
            Error: function (up, err) {
                document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
            }
        }
    });

    uploader.init();

});

// Commot Events

$('#hmmTabel tr').click(function () {
    var href = $(this).find("a").attr("href");
    if (href) {
        window.location = href;
    }
});
