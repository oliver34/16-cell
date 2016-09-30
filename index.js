"use strict";

var spans = document.getElementsByTagName("span"),
	startItem = null,endItem = null;

/*初始化单元格位置*/
Array.prototype.forEach.call(spans,function(span) {
    span.style.left = $(span).offset().left+"px";
    span.style.top = $(span).offset().top+"px";
});

/*开始拖拽*/
$("table").on("dragstart ","span",function(e){
	startItem = $(this);
	e.originalEvent.dataTransfer.effectAllowed = "move";
    
})
 /*拖拽元素在目标元素头上移动的时候*/
$("table").on("dragover","span",function(e){
	if (e.stopPropagation()) 
		e.stopPropagation();
    if (e.preventDefault) 
    	e.preventDefault();
	e.originalEvent.dataTransfer.dropEffect = 'move';
});

/*停放到对象上的时候*/
$("table").on("drop","span",function(e){
	endItem = $(this);
	var start_x = startItem.data("x"),start_y = startItem.data("y"),
		end_x = endItem.data("x"),end_y = endItem.data("y");
	
	/*如果既不同行也不同列（两个单元格交换）*/
	if(start_x != end_x && start_y != end_y){
		/*交换标识锚*/
		startItem.data("x",end_x).data("y",end_y);
		endItem.data("x",start_x).data("y",start_y);
		
		/*交换位置*/
		var temleft = startItem.offset().left,
			temtop = startItem.offset().top;
		startItem.css("left",endItem.offset().left+"px");
		startItem.css("top",endItem.offset().top+"px"),
		endItem.css("left",temleft+"px"),
		endItem.css("top",temtop+"px");
	}
	else{

		var start_mark = 0,end_mark = 0,option = 0;
		/*如果同行（两个单元格所在列交换）*/
		if(start_x==end_x){
			start_mark = start_y;
			end_mark = end_y;
			option = 1;
		}else{/*如果同列（两个单元格所在行交换）*/
			start_mark = start_x;
			end_mark = end_x;
			option = 2;
		}
		exchangeColum(start_mark,end_mark,option);
	}
});

/*执行交换*/
function exchangeColum(start_mark,end_mark,option){
		var start_items = null,end_items = null
		start_items = $("table").find("span").filter(function(item){
				if($(this).data("x")==start_mark && option==2)
					return true;
				if($(this).data("y")==start_mark && option==1)
					return true;
		})
		end_items = $("table").find("span").filter(function(item){
				if($(this).data("x")==end_mark && option==2)
					return true;
				if($(this).data("y")==end_mark && option==1)
					return true;
		})

		start_items = columSort(start_items);
		end_items = columSort(end_items);

		for(var i=0;i<start_items.length;i++){
			startItem = $(start_items[i]),
			endItem = $(end_items[i]);
			
			//列交换
			if(option==1){
				/*交换标识锚*/
				var ytem = startItem.data("y");
				startItem.data("y",endItem.data("y"));
				endItem.data("y",ytem);
			}

			//行交换
			if(option==2){
				var xtem = startItem.data("x");
				startItem.data("x",endItem.data("x"));
				endItem.data("x",xtem);
			}
			//交换位置
			var temleft = startItem.offset().left,
				temtop = startItem.offset().top;
			startItem.css("left",endItem.offset().left+"px"),
			startItem.css("top",endItem.offset().top+"px");
			endItem.css("left",temleft+"px"),
			endItem.css("top",temtop+"px");
			/*startItem.position(endItem.position());
			endItem.position(startItem.position());*/
		}
};

/*行列排序*/
function columSort(items){
	items.sort(function(a,b){
		if($(a).data("x")==$(b).data("x"))
			return $(a).data("y")-$(b).data("y");
		else
			return $(a).data("x")-$(b).data("x");
	});
	return items;
};