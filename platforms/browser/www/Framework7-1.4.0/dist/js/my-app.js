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


// Commot Events

$('#hmmTabel tr').click(function () {
    var href = $(this).find("a").attr("href");
    if (href) {
        window.location = href;
    }
});
