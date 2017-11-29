var com = com || {};

com.get = function(id){
	return document.getElementById(id);
}

com.stype = {
	stype1:{
		page:"commonImg"
	},
	stype2:{
		page:"warcraft"	
	}
}

com.init = function(stype){
	com.nowStype = stype || tmp2;
	var stype = com.stype[com.nowStype];
	com.spaceX = 148;				//着点X跨度
	com.spaceY = 148;				//着点Y跨度
	com.pointStartX = 20;			//第一个着点X坐标
	com.pointStartY = 20;			//第一个着点Y坐标
	com.page = stype.page;
	
	com.canvas = document.getElementById("miChess");
	com.ct = com.canvas.getContext("2d");
	
	com.childList = com.childList || [];

	com.loadImages(com.page);
}

com.loadImages = function(stype){

	//棋子
	for(var i in com.args){
		com[i] = {};
		com[i].img = new Image();
		com[i].img.src = "img/" + stype + "/" + com.args[i].img + ".png";	
	}
	
	//棋子外框
	com.paneImg = new Image();
	com.paneImg.src = "img/" + stype + "/box.png";
}

window.onload = function(){
	com.pane = new com.class.Pane();
	com.pane.isShow = false;
	
	com.childList = [com.pane];
	com.mans = {}								//棋子集合
	com.createMans(com.initMap);				//生成棋子

	if(confirm("Are you ready?")){
		play.isPlay = true;
		play.depth = 3;
		play.init();
	}
	console.log(com.mans)
}


//显示列表
com.show = function(){
	com.ct.clearRect(0,0,400,400);
	for(var i=0;i<com.childList.length;i++){
		com.childList[i].show();	
	}
}

//显示移动的棋子外框
com.showPane = function(x,y,newX,newY){
	com.pane.isShow = true;
	com.pane.x = x;
	com.pane.y = y;
	com.pane.newX = newX;
	com.pane.newY = newY;
}

//生成map里面所有的棋子
com.createMans = function(map){
	for(var i=0;i<map.length;i++){
		for(var n=0;n<map[i].length;n++){
			var key = map[i][n];
			if(key){
				com.mans[key] = new com.class.Man(key);
				com.mans[key].x = n;
				com.mans[key].y = i;
				com.childList.push(com.mans[key]);			
			}		
		}	
	}
}

//棋子们
com.args = {
	//text,图片地址/阵营/权重
	'a':{text:"a",img:'r_a',my:-1,bl:"a"},
	'b':{text:"b",img:'r_b',my:1,bl:"b"}
}


com.initMap = [
	['a0','a1','a2'],
	[	 ,	  ,    ],
	['b0','b1','b2']
]

//二维数组克隆
com.arr2Clone = function (arr){
	var newArr=[];
	for (var i=0; i<arr.length ; i++){	
		newArr[i] = arr[i].slice();
	}
	return newArr;
}

//get the px from this to the left
com.getDomXY = function(dom){
	var left = dom.offsetLeft;
	var top = dom.offsetTop;
	var current = dom.offsetParent;
	while(current !== null){
		left += current.offsetLeft;
		top += current.offsetTop;
		current = current.offsetParent;
	};
	return {x:left,y:top};
}

com.class = com.class || {};
com.class.Man = function(key,x,y){
	this.pater = key.slice(0,1);
	var o = com.args[this.pater];
	this.indexing = key.slice(1);
	this.x = x || 0;
	this.y = y || 0;
	this.key = key;
	this.my = o.my;
	this.text = o.text;
	this.value = o.value;
	this.isShow = true;
	this.alpha = 1;
	this.ps = [];		//着点

	this.pos = false;
	
	this.show = function(){
		if(this.isShow){
			com.ct.save();
			com.ct.globalAlpha = this.alpha;
			com.ct.drawImage(com[this.pater].img,com.spaceX * this.x + com.pointStartX,com.spaceY * this.y + com.pointStartY);
					
		}	
	}
	
	this.bl = function(map){
		var map = map || play.map;
		return com.bylaw(this.x,this.y,map,this.my);
		console.log(map)	
	}	
}

com.class.Pane = function(img,x,y){
	this.x = x || 0;
	this.y = y || 0;
	this.newX = x || 0;
	this.newY = y || 0;
	this.isShow = true;
	
	this.show = function(){
		if(this.isShow){
			com.ct.drawImage(com.paneImg, com.spaceX * this.x + com.pointStartX , com.spaceY *  this.y + com.pointStartY);
			com.ct.drawImage(com.paneImg, com.spaceX * this.newX + com.pointStartX  , com.spaceY *  this.newY + com.pointStartY);	
		}	
	} 
}

//棋子能走的着点
com.bylaw = function(x,y,map,my){
	var d =[];
	
	//左侧检索
	for(var i=x-1;i>=0;i--){
		if(map[y][i]){
			if(com.mans[map[y][i]].my != my){
			//	d.push([i,y]);			
				break;
			};
			break;		
		}else{
			d.push([i,y]);		
			break;
		}	
	}
	
	//右侧检索
	for(var i=x+1;i<=2;i++){
		if(map[y][i]){
			if(com.mans[map[y][i]].my != my){
			//	d.push([i,y]);			
				break;
			};
			break;
		}else{
			d.push([i,y]);
			break;		
		}
	}	
	
	//上检索
	for(var i=y-1;i>=0;i--){
		if(map[i][x]){
			if(com.mans[map[i][x]].my != my){
			//	d.push([x,i]);			
				break;
			}		
			break;
		}else{
			d.push([x,i]);
			break;		
		}
	}
	
	//下检索
	for(var i = y+1;i<=2;i++){
		if(map[i][x]){
			if(com.mans[map[i][x]].my != my){
			//	d.push([x,i]);			
				break
			};
			break;
		}else{
			d.push([x,i]);		
			break;
		}	
	}

	//right and bottom
	//4:30
	if(y+1<=2 && x+1<=2 && (!com.mans[map[y+1][x+1]])){
		if(x === y){
			d.push([x+1,y+1]);
		}
	};
	//7点半
	if(y+1<=2 && x-1>=0 && (!com.mans[map[y+1][x-1]])){
		if(x !== y+1){
			d.push([x-1,y+1]);
		}
	}
	//1点半
	if(y-1>=0 && x+1<=2 && (!com.mans[map[y-1][x+1]])){
		if(x !== y-1){
			d.push([x+1,y-1]);
		}
	}
	//10点半
	if(y-1>=0 && x-1>=0 && (!com.mans[map[y-1][x-1]])){
		if((x !== y-1) && (x !== y+1)){
			d.push([x-1,y-1]);
		}
	}
	return d;
}

com.init();


