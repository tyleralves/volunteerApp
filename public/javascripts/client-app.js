/**
 * Created by Tyler on 12/23/2015.
 */
//Creating Object Literal
VOLUNTEERAPP = {
    common: {//Common code
        init: function() {

            Dropzone.options.userimages = {
                maxFileSize: 2,
                maxFiles: 6,
                acceptedFiles: 'image/*'
            };

            tinymce.init({
                selector: '#about'
            });
            //Sitewide user nonspecific code
            var slideoutPanels = function(){
                var activateDiv = $(".activateDiv");

                $(activateDiv).on("click", function () {  //Must have one open to begin
                    var slidingDiv = $(this).siblings('.initialHidden');
                    slidingDiv.slideToggle(500);
                });
            }();

            //Removes active class from previous menu item
            $('.navbar .active').removeClass('active');

            var menuResize = function(){
                var scrolling;
                var initialLogoSize = true;

                var width = $(window).width();
                if(width>992) {
                    $(window).scroll(function () {
                        var scrollPos = $(window).scrollTop();

                        if (initialLogoSize && scrollPos > 50) {
                            $('#logoImg').animate({height: '60px'}, 200);
                            $('.nav li>a').css({height: '50px', lineHeight: '50px'});
                            $('.templateContent').animate({'margin-top': '120px'}, 200);
                            $('#bodyDiv-anchor').css({top: '-90px'});
                            initialLogoSize = false;
                        } else if (!initialLogoSize && scrollPos < 50) {
                            $('#logoImg').animate({height: '119px'}, 200);
                            $('.nav li>a').css({height: '100px', lineHeight: '100px'});
                            $('.templateContent').animate({'margin-top': '219px'}, 200);
                            $('#bodyDiv-anchor').css({top: '-185px'});
                            initialLogoSize = true;
                        }
                    });
                }
            }();

        },
        guest: function(){
            /*$(".volDiv").css('display','none');
            $('.orgDiv').css('display', 'none');
            $(".guestDiv").css('display', "block");*/
        },
        volunteer: function(){
            //Sitewide user(volunteer) specific code
            $(".guestDiv").css('display', 'none');
            $('.orgDiv').css('display', 'none');
            $(".volDiv").css("display", "block");
        },
        organization: function(){
            //Sitewide user(organization) specific code
            $(".guestDiv").css('display', 'none');
            $('.volDiv').css('display','none');
            $(".orgDiv").css("display", "block");
        }
    },
    index:{
        init: function(){
            //Activate nav item
            $('#navItemIndex').addClass('active');

            //Newest Organization Carousel
            $('#newestCarousel').carousel({
                interval: 5000
            });

            //Displays multi-item or single-item carousel depending on window width
            var carouselMulti = false;
            var carouselType = function(){
                var width = $(window).width();
                if(width>992 && !carouselMulti){
                    $('.carousel .item').each(function(){
                        var next = $(this).next();
                        if(!next.length){
                            next = $(this).siblings(':first');
                        }
                        next.children(':first-child').clone().appendTo($(this));

                        for(var i = 0; i<1; i++){
                            next = next.next();
                            if(!next.length){
                                next = $(this).siblings(':first');
                            }
                            next.children(':first-child').clone().appendTo($(this));
                        }
                    });
                    carouselMulti = true;
                }else if(width<992 && carouselMulti){
                    $('.carousel .item').each(function(){
                        var replace = $(this).children(':first-child');
                        $(this).empty().append(replace);
                    });
                    carouselMulti = false;
                }

            };

            //Run carouselType on screen resize event
            $(window).on('load',carouselType);
            $(window).on("resize", carouselType);
        }
    },
    orglist: {
        init: function(){
            //orglist user nonspecific code goes here
            //Activate nav item
            $('#navItemOrgList').addClass('active');

            //PAGINATION
            var currentPage = $('#bodyDiv').attr('data-currentPage');
            var totalPages = $('#bodyDiv').attr('data-totalPages');
                //Adds page portion of query string while preserving search query
            for(var i = 1; i<=totalPages; i++){
                var currentUrl = window.location.toString();
                if(window.location.search !== ''){
                    alert(currentUrl);
                    if(currentUrl.indexOf("page=")>-1){
                        currentUrl = currentUrl.replace(/page=\d*/i,"page=");
                    }else{
                        currentUrl += "&page=";
                    }
                }else{
                    currentUrl += "?page=";
                }

                $('.pagination').append("<li><a href="+ currentUrl + i + ">" + i + "</a></li>");
            }

            if(currentPage !== '1'){
                $('.pagination').prepend("<li><a href=" + currentUrl + 1 + ">&laquo;</a></li>");
            }

            if(currentPage !== totalPages){
                $('.pagination').append("<li><a href=" + currentUrl + totalPages + ">&raquo;</a></li>");
            }


            //Search form action changer
            $("input").blur(function(){
                var currentAction = $('form').serialize();
                $('#formSearchOrglist').attr('action', '?' + currentAction);
            });

        }

    },
    register: {
        init: function(){
            //Register user nonspecific code
            //Activate nav item
            $('#navItemRegister').addClass('active');


            //Sliding registration panels


            var activateDiv = $(".activateDivRegister");

            $(activateDiv).on("click", function () {  //Must have one open to begin
                activateDiv.next().slideToggle(500);
            });

        }
    },
    login: {
        init: function(){
            //Register user nonspecific code
            //Activate nav item
            $('#navItemLogin').addClass('active');


            //Sliding registration panels


            var activateDiv = $(".activateDivRegister");

            $(activateDiv).on("click", function () {  //Must have one open to begin
                activateDiv.next().slideToggle(500);
            });

        }
    },
    dashboard: {
        init: function(){
            //dashboard user nonspecific code
            //Activate nav item
            $('#navItemDashboard').addClass('active');

            //Delete image in images collection

            $('.user-image-remove').on('click', function(){
                var that = $(this);
                var imageId = that.data('imageid');
                var imageIndex = that.data('imageindex');
                console.log(imageIndex);
                $.ajax({
                    type: 'POST',
                    url: '/removeimage',
                    data: {imageId: imageId, imageIndex: imageIndex},
                    success: function(response){
                        that.parent().remove();
                    }
                });
            });


            // Upload pictures to AWS S3
            (function() {
                document.getElementById("profileImgUpload").onchange = function() {
                    var files = document.getElementById('profileImgUpload').files;
                    var file = files[0];
                    if(file == null){
                        return alert('No file selected.');
                    }
                    getSignedRequest(file);
                };
            })();

            function getSignedRequest(file){
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/sign-s3?file-name=' + file.name + '&file-type=' + file.type);
                xhr.onreadystatechange = function() {
                    if(xhr.readyState === 4){
                        if(xhr.status === 200){
                            var response = JSON.parse(xhr.responseText);
                            uploadFile(file, response.signedRequest, response.url);
                        }
                        else{
                            alert('Could not get signed URL.');
                        }
                    }
                };
                xhr.send();
            }
            function uploadFile(file, signedRequest, url){
                var xhr = new XMLHttpRequest();
                console.log(file + ' - ' + signedRequest + ' - ' + url);
                xhr.open('PUT', signedRequest);
                xhr.onreadystatechange = function() {
                    if(xhr.readyState === 4){
                        if(xhr.status === 200 || xhr.status === 307){
                            document.getElementById('preview').src = url;
                            document.getElementById('profileImgUrl').value = url;
                        }
                        else{
                            alert('Could not upload file.');
                        }
                    }
                };
                xhr.send(file);
            }
            
        },
        volunteer: function(){
            //dashboard user(volunteer) specific code

        },
        organization:function(){
            //dashboard user(organization) specific code

        }
    },
    profile: {
        init: function(){
            //profile onload code
            //Activate nav item


            //Toggle feedback form
            $('.btn-enableFeedback').on('click', function(){
                $('.sendMessage').css('display','block');
            });
        },
        volunteer: function(){
            //profile user(volunteer) specific code

        },
        organization: function(){
            //profile user(organization) specific code

        }
    },
    messages: {
        init: function(){
            //profile onload code
            $('#navItemMessages').addClass('active');
            //Activate nav item? Add if necessary

            //Show message form if user has been selected
            if(document.location.href.indexOf('username=')>0){
                $('.sendMessage.initialHidden').css('display','block');
            }

            //Handlebars template adds class 'activateDiv' to first message from each user to enable slideToggle in 'common' property(above)

            $('.btn-reply').on('click',function(){
                $(this).parent().siblings().css('display','none');
            })

        },
        volunteer: function(){
            //profile user(volunteer) specific code

        },
        organization: function(){
            //profile user(organization) specific code

        }
    },
    feedback: {
        init: function(){
            //profile onload code
            //Activate nav item? Add if necessary

            //Show message form if user has been selected
            if(document.location.href.indexOf('id=')>0){
                $('.sendMessage.initialHidden').css('display','block');
            }

            //Handlebars template adds class 'activateDiv' to first message from each user to enable slideToggle in 'common' property(above)

            $('.btn-reply').on('click',function(){
                $(this).parent().siblings().css('display','none');
            })

        },
        volunteer: function(){
            //profile user(volunteer) specific code

        },
        organization: function(){
            //profile user(organization) specific code

        }
    }
};

UTIL = {
    exec: function(controller, action){
        var ns = VOLUNTEERAPP,
            action = (action === ''||action === undefined)?'guest':action;

        if(controller !== '' && ns[controller] && typeof ns[controller][action] == "function"){
            ns[controller][action]();
        }
    },
    init: function(){
        var body = $('#bodyDiv'),
            controller = body.attr('data-controller'),
            action = body.attr('data-action');

        UTIL.exec('common','init');
        UTIL.exec('common',action);
        UTIL.exec(controller,'init');
        UTIL.exec(controller,action);
    }
};

//Creating trigger function
$(document).ready(UTIL.init);

