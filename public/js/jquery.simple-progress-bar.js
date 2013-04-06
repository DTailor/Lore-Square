/*
Title: Simple Progress bar
Desc: Re-usable animated bar plugin
Created: 01.12
Updated: 01.27.12
Version 0.91

Compiled with CoffeeScript, use original for detailed comments
*/
$(function() {
  return $.fn.simpleProgressBar = function(options) {
    var defaults;
    defaults = {
      direction: 'horizontal',
      innerLength: 0,
      outerLength: 100
    };
    options = $.extend(defaults, options);
    return this.each(function(options) {
      var $direction, $directionStyle, $innerBar, $innerLength, $newLength, $outerLength, $this, animArg, animDirection;
      $this = $(this);
      $direction = defaults.direction;
      $innerLength = $this.attr("data-bar-length") || defaults.innerLength;
      if ($direction === 'horizontal') {
        $outerLength = $(this).width();
        $directionStyle = 'width';
      } else if ($direction === 'vertical') {
        $outerLength = $(this).height();
        $directionStyle = 'height';
      }
      $innerLength = parseInt($innerLength, 10) * 0.01;
      $newLength = $innerLength * $outerLength;
      animDirection = $directionStyle;
      animArg = {};
      animArg[animDirection] = $newLength + 'px';
      $innerBar = $this.append('<div class="innerbar"></div>');
      return $this.children('.innerbar').css($directionStyle, '0px').animate(animArg, 'slow');
    });
  };
});
