(function() {

    var fbResources = firebase.database().ref('resources');
    var source   = $("#entry-template").html();
    var template = Handlebars.compile(source);


    fbResources.on('value', function(snap) {
        //returning data and rendering template
        var data = snap.val();
        $('#container').empty().append(template(data));

        //click event handler for ratingUp
        $('button.up').on('click', function (e) {

            //convert button value to number
            var btntext = Number($(this).text());
            //assign to tempId variable the id of the clicked button
            var tempId = this.id;
            $(this).text(++btntext);


                //update fb with new value of button element
                var newBtnValue = $(this).text();
                //loop through childSnap for match of button id = id from fb
                snap.forEach(function (childSnap) {
                    var key = childSnap.key;
                    var temp;
                    if (tempId === key) {
                        temp = key;
                        fbResources.child(temp).update({"ratingUp": newBtnValue}, function (err) {
                            if (err) {
                                console.log('god damn error is: ' + err);
                            } else {
                                console.log('updated fb-s resource: ' + childSnap.val().name + ' ratingUp.');
                            }
                        });
                    }
                });
        });

        //click event handler for ratingDown
        $('button.down').on('click', function (e) {
            e.preventDefault();
            //convert button value to number
            var btntext = Number($(this).text());
            //assign to tempId variable the id of the clicked button
            var tempId = this.id;
            $(this).text(++btntext);

            //update fb with new value of button element
            var newBtnValue = $(this).text();
            //loop through childSnap for match of button id = id from fb
            snap.forEach(function (childSnap) {
                var key = childSnap.key;
                var temp;
                if (tempId === key) {
                    temp = key;
                    fbResources.child(temp).update({"ratingDown": newBtnValue}, function (err) {
                        if (err) {
                            console.log('god damn error is: ' + err);
                        } else {
                            console.log('updated fb-s resource: ' + childSnap.val().name + ' ratingDown.');
                        }
                    });
                }
            });
        });
    });
})();