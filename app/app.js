'use strict';
$(function() {
    var divCard = '<div class="card col-xs-12 col-md-12 col-lg-6">',
        divEnd = '</div>',
        divCardBlock = '<div class="card-block">',
        hCardTitle = '<h4 class="card-title">',
        hCardTitleEnd = '</h4>',
        pCardText = '<p class="card-text">',
        pCardTextFoot = '<p class="card-footer text-muted">',
        pCardTextEnd = '</p>',
        faThumbsUp = '<button class="clickUp"><i class="fa fa-thumbs-up" aria-hidden="true"></i></button>',
        faThumbsDown = '<button class="clickDown"><i class="fa fa-thumbs-down" aria-hidden="true"></i></button>',
        list = $('.resources'),
        firebaseRef = firebase.database().ref('/resources/'),
        resources = [];

    function renderRes() {
        $.each(resources, function(j) {
            var pHref = '<p class="card-text">Visit: <a href="' +
                            resources[j].url +
                            '" target="_blank">' +
                            resources[j].name +
                        '</a></p>';


            list.append(
                divCard +
                    divCardBlock +
                        hCardTitle +  resources[j].name + hCardTitleEnd +
                        pCardText +  resources[j].description + pCardTextEnd +
                        pHref +
                        pCardTextFoot + faThumbsUp + ' ' + resources[j].ratingUp + '&nbsp' + '&nbsp' + '&nbsp' +'&nbsp' + faThumbsDown + ' ' + resources[j].ratingDown + pCardTextEnd +
                    divEnd +
                divEnd
            );

            var thumbUp = $('.clickUp'),
                resVal = resources[j].ratingUp,
                resName = resources[j].name;
            thumbUp.on('click', function () {
                resVal++
                console.log('vrednost ratingup-a za ' + resName + ' je '  + resources[j].ratingUp + ', a bice: ' + resVal);
                console.log('------');
            })

        });
    }

    firebaseRef
        .once('value')
        .then(function(snapshot) {
            var data = snapshot.val();
            //console.log(data);
            for(var i = 0; i < data.length; i++) {
                resources.push(data[i]);
            }
            renderRes();
        });

});


