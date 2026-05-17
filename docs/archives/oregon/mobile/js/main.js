/*********************************
HIDE URL BAR MOBILE
*********************************/

	(function( win ){
	  var doc = win.document;
	  
	  
	  if( !location.hash && win.addEventListener ){
	    
	   
	    window.scrollTo( 0, 1 );
	    var scrollTop = 1,
	      getScrollTop = function(){
	        return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
	      },
	    
	  
	      bodycheck = setInterval(function(){
	        if( doc.body ){
	          clearInterval( bodycheck );
	          scrollTop = getScrollTop();
	          win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
	        } 
	      }, 15 );
	    
	    win.addEventListener( "load", function(){
	      setTimeout(function(){
	      
	        if( getScrollTop() < 20 ){
	      
	          win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
	        }
	      }, 0);
	    } );
	  }
	})( this );
	

/*********************************
iOS Sniffer
*********************************/	
	
function iOSversion() {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }
}


var ver = iOSversion();
	if(ver!=undefined) {
		if (ver[0] > 6) {
			
			$('.swiper-container').css({height: '460px', minHeight:'460px'});
			
			if (matchMedia('screen and (device-aspect-ratio: 2/3)').matches) {
				  		$('.swiper-container').css({height: '370px', minHeight:'370px'});
				  		$('.right-arrow,.left-arrow').css({top:'180px'});
				  		$('.scroll-arrow-2').css({bottom:'5px',height:'32px'});
				  		$('h1').css({marginTop:'100px',fontSize: '38px',lineHeight:'36px'});
				  		$('h4,h5').css({fontSize: '38px',lineHeight:'36px'});
				  		$('.sm-pad').css({marginTop:'60px',marginBottom:'10px',fontSize: '38px',lineHeight:'36px'});
				  		//$('.gallery-btn,.gallery-btn-2').css({top:'63%'});
				  		//alert('iPhone 4 running iOS 7 or later.');
				  		
		       }
	  }
}	   
	  
if(ver!=undefined) {
 if (ver[0] < 7) {  
 
 		if (matchMedia('screen and (device-aspect-ratio: 2/3)').matches) {
	  		$('.swiper-container').css({height: '415px', minHeight:'415px'});
	  		$('.swiper-uniforms img').css({maxHeight: '360px', marginTop:'5px'});
	  		$('h1').css({marginTop:'100px',fontSize: '38px',lineHeight:'36px'});
			$('h4,h5').css({fontSize: '38px',lineHeight:'36px'});
  		
 		}
   }
} /*6 or less*/


/*CHROME*/
if (navigator.userAgent.match('CriOS')) {
 
 	    if (matchMedia('screen and (device-aspect-ratio: 2/3)').matches) {
	  		
	           $('.swiper-container').css({height: '460px', minHeight:'460px'});
             
 		}
 		
 		if (matchMedia('screen and (device-aspect-ratio: 40/71)').matches) {
	  		
	          $('.swiper-container').css({height: '504px', minHeight:'504px'});
	
          }
 }


 
/*********************************
SIDE MENU
*********************************/

                                                     
$(document).ready(function() {
    $('.home-btn').addClass('active');
    $('.left-arrow').css({display: 'none'});
	$('#simple-menu').sidr({side: 'left'});
       
	    $("#sidr ul li, .swiper-container").click(function () { 
	    	 $('#sidr ul li').removeClass('active');
	    	 $(this).addClass('active');
		     $.sidr('close', 'sidr');
		    $('#wings').jsMovie("gotoFrame",1);
		    isHidden = true;
		     
	    });
        
     $("#logo").click(function () { 
    	swiperParent.swipeTo(0);   
    	 });  
	     
	 //var isVisible = $('#sidr').is(':visible');
     var isHidden = $('#sidr').is(':hidden');

    $("#simple-menu").click(function () { 
    
		    if (isHidden == true) {
		        // handle non visible state
		         //$('#wings').jsMovie("gotoFrame",1);
		         $('#wings').jsMovie("play");
		         isHidden = false;
		    } else {
		        // handle visible state
		          $('#wings').jsMovie("gotoFrame",1);
		          isHidden = true;
		    }
	});
  

/*********************************
SWIPE
*********************************/
    
   var swiperParent = new Swiper('.swiper-parent',{
    pagination: '.pagination-parent',
    paginationClickable: true,
    loop: false,
    slidesPerView: 1,
    
		 onSlideChangeStart: function() {
		 	
		 	$('.pagination-nested-1,.pagination-nested-2,.pagination-nested-3').css({opacity: '0',bottom: '-10px'});
		 	hideArrows();
		 	
		 },
		
			onTouchEnd : function() {
				$('#sidr ul li').removeClass('active');
				
				     if(swiperParent.activeIndex == 0){
				     	$('.home-btn').addClass('active');
				   
				     	
				     } else if(swiperParent.activeIndex == 1){
				     	$('.football-btn').addClass('active');
				     	
				     				     
				     } else if(swiperParent.activeIndex == 2){
				     	$('.edu-btn').addClass('active');
				     	
				     
				     }else if(swiperParent.activeIndex == 3){
				     	$('.campus-btn').addClass('active');
				     	
				     	
				     }
		    },
	    
		    onSlideChangeEnd : function() {
		    	$('.pagination-nested-1,.pagination-nested-2,.pagination-nested-3').stop().animate({opacity:'0.8',bottom: '25px'},500);
		    	
		    	swiperNested1.swipeTo(0)
		    	swiperNested2.swipeTo(0)
		    	swiperNested3.swipeTo(0)
		    	
		    	 if(swiperParent.activeIndex == 0){ /*main*/
				     	$('.left-arrow').css({display: 'none'});
				     	$('.right-arrow').css({display: 'block'});
				     	
				     	showArrows();
				     	
				     } else if(swiperParent.activeIndex == 1){/*football*/
				     
				     	$('.left-arrow').css({display: 'block'});
				     	$('.right-arrow').css({display: 'block'});
				     	
				     	$('.football .scroll-arrow').delay(1000).animate({opacity: '1', bottom: '10px'}, 500);
				     				     
				     } else if(swiperParent.activeIndex == 2){ /*education*/
				     	$('.left-arrow').css({display: 'block'});
				     	$('.right-arrow').css({display: 'block'});
				     	$('.education .scroll-arrow').delay(1000).animate({opacity: '1', bottom: '10px'}, 500);
				     
				     
				     }else if(swiperParent.activeIndex == 3){/*campus*/
				     	$('.right-arrow').css({display: 'none'});
				     	$('.campus .scroll-arrow').delay(1000).animate({opacity: '1', bottom: '10px'}, 500);
				     	
				     	
				     }
		    }

	    
  });
  
  	/*----Football Vertical-------*/
  			
	  var swiperNested1 = new Swiper('.swiper-football',{
	    mode: 'vertical',
	    pagination: '.pagination-nested-1',
	    paginationClickable: true,
	    slidesPerView: 1,
		 
		 onSlideChangeEnd: function() { 
		    $('.pagination-nested-1').stop().animate({opacity: '0'},1000);
		   
		    $('.left-arrow,.right-arrow').css({display: 'none'});
		  
		     if(swiperNested1.activeIndex == 0){
		     	  $('.left-arrow,.right-arrow').css({display: 'block'});
		   
		     	
		     }
		  
		 },
		 
		 onSlideChangeStart: function() { 
		   $('.pagination-nested-1').stop().animate({opacity: '1', bottom: '25px'},200);
		 
		 
		 }

	  });
	  
	  /*----Education Vertical-------*/
	  
	  var swiperNested2 = new Swiper('.swiper-education',{
	    mode: 'vertical',
	    pagination: '.pagination-nested-2',
	    paginationClickable: true,
	    slidesPerView: 1,
				 
		 onSlideChangeEnd: function() { 
		  $('.pagination-nested-2').stop().animate({opacity: '0'},1000);
		  $('.left-arrow,.right-arrow').css({display: 'none'});
		  
		     if(swiperNested2.activeIndex == 0){
		     	  $('.left-arrow,.right-arrow').css({display: 'block'});
		   
		     	
		     }
		 },
		 
		 onSlideChangeStart: function() { 
		   $('.pagination-nested-2').stop().animate({opacity: '1', bottom: '25px'},200);
		 
		 }
	  });
	  
	  /*----Campus Vertical-------*/
	  
	  var swiperNested3 = new Swiper('.swiper-campus',{
	    mode: 'vertical',
	    pagination: '.pagination-nested-3',
	    paginationClickable: true,
	    slidesPerView: 1,
		 
		 onSlideChangeEnd: function() { 
		  $('.pagination-nested-3').stop().animate({opacity: '0'},1000);
		  
		  $('.left-arrow,.right-arrow').css({display: 'none'});
		  
		     if(swiperNested3.activeIndex == 0){
		     	  $('.left-arrow').css({display: 'block'});
		     	
		     }
		 },
		 
		 onSlideChangeStart: function() { 
		   $('.pagination-nested-3').stop().animate({opacity: '1', bottom: '25px'},200);
		 
		 }
	  });
  
  
	/*----ARROW NAVIGATION-------*/	  

	 $('.left-arrow').on('click', function(e){
	    e.preventDefault()
	    swiperParent.swipePrev()
	  });
	  
	  $('.right-arrow').on('click', function(e){
	    e.preventDefault()
	    swiperParent.swipeNext()
	  });
	  
	   $('.home-btn').on('click', function(e){
	    e.preventDefault()
	    swiperParent.swipeTo(0)
	  });
	  
	  $('.football-btn').on('click', function(e){
	    e.preventDefault()
	    swiperParent.swipeTo(1)
	    swiperNested1.swipeTo(0)
	  });
	  
	  $('.edu-btn').on('click', function(e){
	    e.preventDefault()
	    swiperParent.swipeTo(2)
	    swiperNested2.swipeTo(0)
	  });
	  
	  $('.campus-btn').on('click', function(e){
	    e.preventDefault()
	    swiperParent.swipeTo(3)
	    swiperNested3.swipeTo(0)
	  });
	  
	  $('.swiper-football .top-btn').on('click', function(e){
	    e.preventDefault()
	    swiperNested1.swipeTo(0)
	  });
	  
	  $('.swiper-education .top-btn').on('click', function(e){
	    e.preventDefault()
	    swiperNested2.swipeTo(0)
	  });
	  
	  $('.swiper-campus .top-btn').on('click', function(e){
	    e.preventDefault()
	    swiperNested3.swipeTo(0)
	  });
    
});

/*********************************
AFTER LOAD BINDER
*********************************/
function afterLoad() {
    
    var facilitiesSwiper = new Swiper('.swiper-facilities',{
	    pagination: '.pagination-parent',
		    paginationClickable: true,
		    loop: false,
		    slidesPerView: 1,
		    
		     onImagesReady: function() {
				 	$('.swiper-slide-visible .caption h3').stop().animate({opacity: '1'},500);
				 	$('.swiper-slide-visible .caption p').stop().animate({opacity: '1'},900);
				 	
				 },
				 
				 onSlideChangeStart: function() {
				 	
				 	$('.caption h3,.caption p').stop().animate({opacity: '0'},200);
				 	$('.swiper-slide-visible .caption h3').stop().animate({opacity: '1'},500);
				 	$('.swiper-slide-visible .caption p').stop().animate({opacity: '1'},900);
				 	
				 }
  	  });  
	  
	  
	  var uniformsSwiper = new Swiper('.swiper-uniforms',{
	    pagination: '.pagination-parent',
		    paginationClickable: true,
		    loop: false,
		    slidesPerView: 1,
		    tdFlow: {
					rotate : 40,
					stretch :0,
					depth: 400,
					modifier : 1,
					shadows:false
				},
				
				 onImagesReady: function() {
				 	$('.swiper-slide-visible .uni-content').delay(2500).stop().animate({opacity: '1'},1000);
				 	
				 },
				 
				 onSlideChangeStart: function() {
				 	
				 $('.uni-content').stop().animate({opacity: '0'},100);
				  $('.swiper-slide-visible .uni-content').stop().delay(800).animate({opacity: '1'},1000);
				 	
				 }

	  });  
	  
	   /* iOS 7*/
		 var ver = iOSversion();
				
				if(ver!=undefined) {
					
					if (ver[0] > 6) {
						
					$('.swiper-container,.cell').css({height: '460px', minHeight:'460px'});
					$('.swiper-uniforms img').css({maxHeight: '390px',marginTop: '10px'});
					$('.uni-content').css({bottom: '33px'});
					
					
						if (matchMedia('screen and (device-aspect-ratio: 2/3)').matches) {
			  		       $('.swiper-container,.cell').css({height: '380px', minHeight:'380px'});
			  		       $('.swiper-uniforms img').css({maxHeight: '320px',marginTop: '5px'});
			  		
			          }
				}
			}	
			
			
		if(ver!=undefined) {
			 if (ver[0] < 7) {  
			 
			 		if (matchMedia('screen and (device-aspect-ratio: 2/3)').matches) {
				  		 $('.swiper-container,.cell').css({height: '415px', minHeight:'415px'});
			  		       $('.swiper-uniforms img').css({maxHeight: '340px',marginTop: '10px'});
			  		
			 		}
			 		
			   }
		     
    } /*6 or less*/
    
    
    
	 /*CHROME*/
		if (navigator.userAgent.match('CriOS')) {
		 
		 	    if (matchMedia('screen and (device-aspect-ratio: 2/3)').matches) {
			  		
			           $('.swiper-container,.cell').css({height: '460px', minHeight:'460px'});
			           $('.swiper-uniforms img').css({maxHeight: '380px',marginTop: '10px'});
		             
		 		}
		 		
		 		if (matchMedia('screen and (device-aspect-ratio: 40/71)').matches) {
			  		
			          $('.swiper-container,.cell').css({height: '504px', minHeight:'504px'});
			          $('.swiper-uniforms img').css({maxHeight: '420px',marginTop: '10px'});
			
		          }
		 }

    
    

} /*afterLoad*/


/*********************************
ARROWS
*********************************/

function hideArrows() {
	$('.scroll-arrow').css({opacity: '0', bottom: '40px'});
	
}

function showArrows() {
	$('.scroll-arrow').delay(1000).animate({opacity: '1', bottom: '10px'}, 500);
	
}


/*********************************
GALLERY MODAL LOADS
*********************************/

$(document).ready(function(){
	
	$('#close').click(function(){
		$('#modal').css({display: 'none'});
		$('.content-load').empty();
		
	});
		
	    $('.pop').click(function(){
	        
	        // GET THE CURRENT URL
	        var url = $(this).attr('name');
	        
	        $('#modal').css({display: 'block'});
	
	
	      // load in div from page
	        $('#modal .content-load').load(url + ' .cell', function(){
	            
	            //Bind the swiper js
	            afterLoad();
						
	        });
	        
	        return false;
	    });
});


/*********************************
*WINGS IMAGE SEQUENCE*
*********************************/ 

$(document).ready(function(){

	 $('#wings').jsMovie({
        sequence : "oh_##.png",
        folder   : "images/loops/oh/",
        from     : 1,
        to       : 22,
        width    : 100,
        height   : 60,  
        showPreLoader :false,
        playOnLoad : false,
        playBackwards : false,
        repeat: false,
        performStop: false,
        fps:35
 
      });      

});

