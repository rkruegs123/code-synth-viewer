function MobileNavMenu(){this.status;this.$body;this.$overlay;this.$container;this.init()}
MobileNavMenu.prototype.init=function(){this.status="closed";this.$body=$("body");this.$overlay=$('<div class="mnm_overlay" />');this.$overlay.append($('<div class="mnm_header" />').html('<span class="mnm_hamIcon">&#9776;</span>'));this.$container=$('<div class="mnm_container" />');for(var e=$(".mnm_link"),f={},g=0,c=[],a=0,d=e.length;a<d;a++){var b=$(e[a]);"number"==typeof b.data("mnm")?(f[b.data("mnm")]=b.clone(),g++):c.push(b.clone());b.removeClass("mnm_link")}for(a=0;a<g;a++)this.$container.append(f[a]),
this.$container.append($('<div class="mnm_spacer" />'));a=0;for(d=c.length;a<d;a++)this.$container.append(c[a]),this.$container.append($('<div class="mnm_spacer" />'));this.$overlay.append(this.$container);$("body").prepend(this.$overlay.hide());var h=this;$(".mnm_ham, .mnm_hamIcon").on("click.mnm_hamIcon",function(){h.toggle()});$(".mnm_link").on("click.mnm_link",function(){h.close()})};
MobileNavMenu.prototype.open=function(){"opened"!=this.status&&(this.status="opened",this.$body.css("overflow","hidden"),this.$overlay.show())};MobileNavMenu.prototype.close=function(){"closed"!=this.status&&(this.status="closed",this.$overlay.hide(),this.$body.css("overflow",""))};MobileNavMenu.prototype.toggle=function(){"closed"==this.status?this.open():"opened"==this.status&&this.close()};

var topHam = new MobileNavMenu();
$(document).on("click.trackOutboundLink","a",function(){/^(http|https):\/\//.test(this.getAttribute("href"))&&trackOutboundLink(this.getAttribute("href"))});

function demo_call(e,f,a){$.ajax({type:"POST",url:e,dataType:"json",data:f,success:function(b,c,d){"function"==typeof a.beforeComplete&&a.beforeComplete();"function"==typeof a.success&&a.success(b,c,d)},error:function(b,c,d){"function"==typeof a.beforeComplete&&a.beforeComplete();"function"==typeof a.error&&a.error(b,c,d)},complete:function(b,c){"function"==typeof a.complete&&a.complete(b,c)}})};

