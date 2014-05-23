var navbarDivision = document.getElementById("navbar");

navbarDivision.innerHTML = '<div class="navbar navbar-inverse" role="navigation">\
    <div class="container">\
    <div class="navbar-header">\
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\
            <span class="sr-only">Toggle navigation</span>\
            <span class="icon-bar"></span>\
            <span class="icon-bar"></span>\
            <span class="icon-bar"></span>\
        </button>\
        <a class="navbar-brand" href="index.html">Michael Hablich\'s Filing Cabinet</a>\
    </div>\
    <div class="collapse navbar-collapse">\
    <ul class="nav navbar-nav">\
        <li><a href="index.html">Cabinet</a></li>\
        <li><a href="bio.html">Bio</a></li>\
    </ul>\
    </div>\
    </div>\
    </div>';

/* old:

    <div class="navbar navbar-inverse" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="index.html">Michael Hablich's Filing Cabinet</a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li><a href="index.html">Cabinet</a></li>
                    <li><a href="bio.html">Bio</a></li>
                </ul>
            </div>
        </div>
    </div>

*/
