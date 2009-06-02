$(document).ready(function() {
    // hide the extended me
    $('#meonline ul').hide();
    // turn the extended me into an expanding list
    $('#meonline > a').click(function() {
        $('#meonline ul').toggle('slow');
    })
});