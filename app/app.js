(function() {
    var fb = firebase.database().ref();
    var fbResources = firebase.database().ref('resources');
    var source   = $("#entry-template").html();
    var template = Handlebars.compile(source);


    fbResources.on('value', function(snap) {

        //returning data from firebase
        var data = snap.val();
        //sorting function for handlebar template
        //using concat to create a copy of array coming from fb
        Object.defineProperty(data, 'resourcesByRatingUp', {
            get: function() {
                return this.concat()
                    .sort(function(a,b) {
                        var keya = a.ratingUp,
                            keyb = b.ratingUp;
                            //sorting by highest ratings
                            if(keya > keyb) return -1;
                            if(keya < keyb) return 1;
                        return 0;
                    });
            }
        });
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