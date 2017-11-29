var play = play || {};

play.init = function(){
	 play.my = 1;												//玩家
	 play.map = com.arr2Clone(com.initMap);						//初始化棋盘
	 play.nowManKey = false;									//现在要操作的棋子
	 play.pace = [];											//记录每一步
	 play.isPlay = true;										//是否能走棋
	 play.mans = com.mans;									
	 play.show = com.show;									
	 play.showPane = com.showPane;							

	 //初始化棋子
	 for(var i=0;i<3;i++){
	 	  for(var n=0;n<3;n++){
				var key = play.map[i][n];
				if(key){
					 com.mans[key].x = n;
					 com.mans[key].y = i;
					 com.mans[key].isShow = true;				
				}	 	  
	 	  }
	 }	 
	 
	 play.show();
	 com.canvas.addEventListener("click",play.clickCanvas);
	//电脑先走就模拟点击屏幕，然后把tmp4变为true
	 if(tmp4 == "false"){
		setTimeout(play.AIPlay,500);
		temp = "true";
	 }
	 console.log("play")
}

//绑定点击事件
play.clickCanvas = function(e){
	if(!play.isPlay){
		return;
	};

	var key = play.getClickMan(e);
	var point = play.getClickPoint(e);
	var x = Math.abs(point.x);
	var y = Math.abs(point.y);
	console.log(x,y);
	play.getWin();
	if(!tmp4){
		setTimeout(play.AIPlay,500);
		if(key){
			play.clickMan(key,x,y);
		}else{
			play.clickPoint(x,y);
			setTimeout(play.AIPlay,500);
		}
	}

	if(key){
		play.clickMan(key,x,y);
	}else{
		if(tmp4){
			var flag = play.clickPoint(x,y);
			if(flag == "yes"){
				setTimeout(play.AIPlay,500);
			}
		}
	}	
}

//点击并选中棋子
play.clickMan = function(key,x,y){
	var man = com.mans[key];
	if(man.my === 1){
		if(com.mans[play.nowManKey]){
			com.mans[play.nowManKey].alpha = 1;
			console.log(com.mans[play.nowManKey])
		}
		man.alpha = 0.6;
		com.pane.isShow = false;
		play.nowManKey = key;
		com.mans[key].ps = com.mans[key].bl();	//get all the seemly points
		com.show();
	}	
}

//click the vacant position
//点击空缺位置
play.clickPoint = function(x,y){
	var key = play.nowManKey;
	var man = com.mans[key];
	var flag = "no";
	if(play.nowManKey){
		if(play.indexOfPs(com.mans[key].ps,[x,y])){
			delete play.map[man.y][man.x];
			play.map[y][x] = key;
			com.showPane(man.x,man.y,x,y);
			man.x = x;
			man.y = y;
			man.alpha = 1;
			play.nowManKey = false;
			com.show();
			flag = "yes";
		}else{
			alert("can not step!")
		}
	}
	return flag;
}

//记录棋子可以走的位置
play.indexOfPs = function(ps,xy){
	for(var i=0;i<ps.length;i++){
		if(ps[i][0] == xy[0] && ps[i][1] == xy[1]){
			return true;
		}
	}
	return false;
}

//get the click vacant position
//得到点击的空缺位置
play.getClickPoint = function(e){
	var domXY = com.getDomXY(com.canvas);
	var x = Math.round((e.pageX-domXY.x-com.pointStartX-20)/com.spaceX);
	var y = Math.round((e.pageY-domXY.y-com.pointStartY-20)/com.spaceY);
	return {"x":x,"y":y};
	console.log("getClickPoint")
}

//get the man
play.getClickMan = function(e){
	var clickXY = play.getClickPoint(e);
	var x = clickXY.x;
	var y = clickXY.y;
	if(x<0||x>2||y<0||y>2){
		return false;
	}
	return(play.map[y][x] && play.map[y][x] != "0") ? play.map[y][x] : false;
	console.log("getClickMan")
}

play.AIPlay = function(){
	play.AI();
}

play.successCallback = function(){
	var circle = document.querySelector('.circle');
	circle.style.display = 'block';
	var win = document.querySelector('.win');
	var before = document.getElementsByClassName('before')[0];
	var after = document.getElementsByClassName('after')[0];
	before.style.animation = 'circleChange 2s infinite alternate';
	after.style.animation = 'circleChange 2s infinite alternate';
	win.style.animation = 'textChange 2s infinite alternate';
	setTimeout(function() {
		circle.style.display = 'none';
		location.href = "index.html";
	},5000);
};

play.computerWinCallback = function(){
	var circle = document.querySelector('.circle');
	circle.style.display = 'block';
	var win = document.querySelector('.win');
	win.innerHTML = "遗憾！你输了！";
	var before = document.getElementsByClassName('before')[0];
	var after = document.getElementsByClassName('after')[0];
	before.style.animation = 'circleChange 2s infinite alternate';
	after.style.animation = 'circleChange 2s infinite alternate';
	win.style.animation = 'textChange 2s infinite alternate';
	setTimeout(function() {
		circle.style.display = 'none';
		location.href = "index.html";
	},5000);
}	

play.getWin = function(){
	if(com.mans[play.map[0][0]] && com.mans[play.map[1][1]] && com.mans[play.map[2][2]] && (com.mans[play.map[0][0]].my ==1 && com.mans[play.map[1][1]].my == 1 && com.mans[play.map[2][2]].my == 1)){
		play.successCallback();
		play.isPlay = false;
	}else if(com.mans[play.map[0][0]] && com.mans[play.map[1][1]] && com.mans[play.map[2][2]] && (com.mans[play.map[0][0]].my == -1 && com.mans[play.map[1][1]].my == -1 && com.mans[play.map[2][2]].my == -1)){
		play.computerWinCallback();
		play.isPlay = false;
	}else if(com.mans[play.map[0][2]] && com.mans[play.map[1][1]] && com.mans[play.map[2][0]] && (com.mans[play.map[0][2]].my == 1 && com.mans[play.map[1][1]].my == 1 && com.mans[play.map[2][0]].my == 1)){
		play.successCallback();
		play.isPlay = false;
	}else if(com.mans[play.map[0][2]] && com.mans[play.map[1][1]] && com.mans[play.map[2][0]] && (com.mans[play.map[0][2]].my == -1 && com.mans[play.map[1][1]].my == -1 && com.mans[play.map[2][0]].my == -1)){
		play.computerWinCallback();
		play.isPlay = false;
	}

}

play.AI = function(){
	if(!play.isPlay){

		return;
	}
	play.getWin();

	var AImans = [];
    var AIkey = ["a0","a1","a2"];
    var mankey = [];				//存放有路走的	
    var gkey = [];					//存放无路可走走的棋子
    for(var i=0;i<3;i++){ 
        com.mans[AIkey[i]].ps = com.mans[AIkey[i]].bl();
        AImans.push(com.mans[AIkey[i]].ps);
        //console.log(AImans[i])
    }

    for(var i=0;i<3;i++){
    	if(AImans[i].length == 0){
    		gkey.push(AIkey[i]);
    	}else{
    		mankey.push(AIkey[i])
    	}
    }

//    console.log(mankey);


    if(mankey.length == 1){
    	var fp;
    	console.log(com.mans[mankey[0]].ps);
  		for(var i=0;i<com.mans[mankey[0]].ps.length;i++){
  			if((play.indexOfPs(com.mans[mankey[0]].ps,[0,0])) && (com.mans[play.map[1][0]] && com.mans[play.map[1][0]].my == 1) && (com.mans[play.map[0][1]] && com.mans[play.map[0][1]].my == 1)){ 
  				fp = [0,0]
  				//console.log("haha")
  				break;
  			}else if((play.indexOfPs(com.mans[mankey[0]].ps,[2,2])) && (com.mans[play.map[1][2]] && com.mans[play.map[1][2]].my == 1) && (com.mans[play.map[2][1]] && com.mans[play.map[2][1]].my == 1)){
  				fp = [2,2]
  				break;
  			}else if((play.indexOfPs(com.mans[mankey[0]].ps,[0,2])) && (com.mans[play.map[1][0]] && com.mans[play.map[1][0]].my == 1) && (com.mans[play.map[2][1]] && com.mans[play.map[2][1]].my == 1)){
  				fp = [0,2]
  				break;
  			}else if((play.indexOfPs(com.mans[mankey[0]].ps,[2,0])) && (com.mans[play.map[0][1]] && com.mans[play.map[0][1]].my == 1) && (com.mans[play.map[1][2]] && com.mans[play.map[1][2]].my == 1)){
  				fp = [2,0]
  				break;
  			}
  		}

  		console.log(fp);
  		if(fp){
  			play.nowManKey = mankey[0];
  			var man = com.mans[mankey[0]];
	    	delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
			play.map[fp[1]][fp[0]] = play.nowManKey;
			com.showPane(man.x,man.y,fp[0],fp[1]);
			man.x = fp[0];
			man.y = fp[1];
			play.nowManKey = false;
			com.show();
  		}else{
    		play.nowManKey = mankey[0];
	    	var man = com.mans[mankey[0]];
	    	delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
			play.map[com.mans[mankey[0]].ps[0][1]][com.mans[mankey[0]].ps[0][0]] = play.nowManKey;
			com.showPane(man.x,man.y,com.mans[mankey[0]].ps[0][0],com.mans[mankey[0]].ps[0][1].y);
			man.x = com.mans[mankey[0]].ps[0][0];
			man.y = com.mans[mankey[0]].ps[0][1];
			play.nowManKey = false;
			com.show();
		}	
    }

    if(!com.mans[play.map[1][1]]){
    	var p;
    	for(var i=2;i>=0;i--){
    		if((com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 0) || (com.mans[AIkey[i]].x == 0 && com.mans[AIkey[i]].y == 1) || (com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 2) || (com.mans[AIkey[i]].x == 2 && com.mans[AIkey[i]].y == 1)){
    			p = i;
    			break;
    		}
    	}	
		if(p){	
			play.nowManKey = AIkey[p];
	    	if(play.indexOfPs(com.mans[AIkey[p]].ps,[1,1])){
	    		var man = com.mans[AIkey[p]];
	    		delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
	    		play.map[1][1] = play.nowManKey;
	    		com.showPane(man.x,man.y,1,1);
	    		man.x = 1;
	    		man.y = 1;
	    		play.nowManKey = false;
	    		com.show();
	    	}	
		}else{
			for(var i=0;i<3;i++){
				play.nowManKey = AIkey[i];
		    	if(play.indexOfPs(com.mans[AIkey[i]].ps,[1,1])){
		    		var man = com.mans[AIkey[i]];
		    		delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
		    		play.map[1][1] = play.nowManKey;
		    		com.showPane(man.x,man.y,1,1);
		    		man.x = 1;
		    		man.y = 1;
		    		play.nowManKey = false;
		    		com.show();
		    		break;
		    	}	
		    }	
		}
    	
    }else if(com.mans[play.map[1][1]]){
	    if((com.mans[play.map[2][2]] && com.mans[play.map[1][1]]) && (com.mans[play.map[2][2]].my == 1 && com.mans[play.map[1][1]].my == 1)){
			if(com.mans[play.map[0][0]] && com.mans[play.map[0][0]].my == -1){
				AIkey.splice(com.mans[play.map[0][0]].indexing,1);
				AImans.splice(com.mans[play.map[0][0]].indexing,1);
				console.log(AIkey);
				console.log(AImans);
				var fp;
				for(var i=0;i<AIkey.length;i++){
					if(AImans[i].length == 1){
						fp = i

					}else if(AImans[i].length == 2){
						fp = i
					}else if(AImans[i].length == 3){
						fp = i
					}
				}
				play.nowManKey = AIkey[fp];
				if(play.indexOfPs(com.mans[AIkey[fp]].ps,[AImans[fp][0][0],AImans[fp][0][1]])){
					var man = com.mans[AIkey[fp]];
					console.log(man)
					delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
					play.map[AImans[fp][0][1]][AImans[fp][0][0]] = play.nowManKey;
					com.showPane(man.x,man.y,AImans[fp][0][0],AImans[fp][0][1]);
					man.x = AImans[fp][0][0];
					man.y = AImans[fp][0][1];
					play.nowManKey = false;
					com.show();
				}
			}else{
				var fp;
				for(var i=0;i<3;i++){
					if((com.mans[AIkey[i]].x == 0 && com.mans[AIkey[i]].y == 1) || (com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 0)){
						fp = i;
					}
				}	
				if(fp){	
					if(play.indexOfPs(com.mans[AIkey[fp]].ps,[0,0])){
						play.nowManKey = AIkey[fp];
						var man = com.mans[AIkey[fp]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[0][0] = play.nowManKey;
						com.showPane(man.x,man.y,0,0);
						man.x = 0;
						man.y = 0;
						play.nowManKey = false;
						com.show();
					} 
				}else{
					for(var i=2;i>=0;i--){
			    		if(AImans[i].length == 1){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    		if(AImans[i].length == 2){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    		if(AImans[i].length == 3){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    	}
			    	if(play.indexOfPs(com.mans[AIkey[i]].ps,[AImans[i][0][0],AImans[i][0][1]])){
						var man = com.mans[AIkey[i]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[AImans[i][0][1]][AImans[i][0][0]] = play.nowManKey;
						com.showPane(man.x,man.y,AImans[i][0][0],AImans[i][0][1]);
						man.x = AImans[i][0][0];
						man.y = AImans[i][0][1];
						play.nowManKey = false;
						com.show();   			
					}
				}	
			}	
		}else if((com.mans[play.map[0][0]] && com.mans[play.map[1][1]]) && (com.mans[play.map[0][0]].my == 1 && com.mans[play.map[1][1]].my == 1)){
			if(com.mans[play.map[2][2]] && com.mans[play.map[2][2]].my == -1){
				AIkey.splice(com.mans[play.map[2][2]].indexing,1);
				AImans.splice(com.mans[play.map[2][2]].indexing,1);
				console.log(AIkey);
				console.log(AImans);
				var fp;
				for(var i=0;i<AIkey.length;i++){
					if(AImans[i].length == 1){
						fp = i
					}else if(AImans[i].length == 2){
						fp = i
					}else if(AImans[i].length == 3){
						fp = i
					}
				}
				play.nowManKey = AIkey[fp];
				if(play.indexOfPs(com.mans[AIkey[fp]].ps,[AImans[fp][0][0],AImans[fp][0][1]])){
					var man = com.mans[AIkey[fp]];
					delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
					play.map[AImans[fp][0][1]][AImans[fp][0][0]] = play.nowManKey;
					com.showPane(man.x,man.y,AImans[fp][0][0],AImans[fp][0][1]);
					man.x = AImans[fp][0][0];
					man.y = AImans[fp][0][1];
					play.nowManKey = false;
					com.show();
				}

			}else{		
				var fp;
				for(var i=0;i<3;i++){
					if((com.mans[AIkey[i]].x == 2 && com.mans[AIkey[i]].y == 1) || (com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 2)){
						fp=i;
					}
				}

				if(fp){	
					if(play.indexOfPs(com.mans[AIkey[fp]].ps,[2,2])){
						play.nowManKey = AIkey[fp];
						var man = com.mans[AIkey[fp]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[2][2] = play.nowManKey;
						com.showPane(man.x,man.y,2,2);
						man.x = 2;
						man.y = 2;
						play.nowManKey = false;
						com.show();
					} 
				}else{
					for(var i=2;i>=0;i--){
			    		if(AImans[i].length == 1){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    		if(AImans[i].length == 2){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    		if(AImans[i].length == 3){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    	}
			    	if(play.indexOfPs(com.mans[AIkey[i]].ps,[AImans[i][0][0],AImans[i][0][1]])){
						var man = com.mans[AIkey[i]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[AImans[i][0][1]][AImans[i][0][0]] = play.nowManKey;
						com.showPane(man.x,man.y,AImans[i][0][0],AImans[i][0][1]);
						man.x = AImans[i][0][0];
						man.y = AImans[i][0][1];
						play.nowManKey = false;
						com.show();   			
					}
				}
						
			}	
		}else if((com.mans[play.map[2][0]] && com.mans[play.map[1][1]]) && (com.mans[play.map[2][0]].my == 1 && com.mans[play.map[1][1]].my == 1)){
			if(com.mans[play.map[0][2]] && com.mans[play.map[0][2]].my == -1){
				AIkey.splice(com.mans[play.map[0][2]].indexing,1);
				AImans.splice(com.mans[play.map[0][2]].indexing,1);
				console.log(AImans)
				var fp;
				for(var i=0;i<AIkey.length;i++){
					if(AImans[i].length == 1){
						fp = i;
						break;
					}else if(AImans[i].length == 2){
						fp = i;
						break;
					}else if(AImans[i].length == 3){
						fp = i;
						break;
					}
				}
				play.nowManKey = AIkey[fp];
				if(play.indexOfPs(com.mans[AIkey[fp]].ps,[AImans[fp][0][0],AImans[fp][0][1]])){
					var man = com.mans[AIkey[fp]];
					delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
					play.map[AImans[fp][0][1]][AImans[fp][0][0]] = play.nowManKey;
					com.showPane(man.x,man.y,AImans[fp][0][0],AImans[fp][0][1]);
					man.x = AImans[fp][0][0];
					man.y = AImans[fp][0][1];
					play.nowManKey = false;
					com.show();
				}	
			}else{	
				var fp;
				for(var i=0;i<3;i++){
					if((com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 0) || (com.mans[AIkey[i]].x == 2 && com.mans[AIkey[i]].y == 1)){
						fp = i;
						break;
						console.log(fp)
					}
				}	

				if(fp){	
					play.nowManKey = AIkey[fp];
					console.log(com.mans[AIkey[fp]].ps)
					if(play.indexOfPs(com.mans[AIkey[fp]].ps,[2,0])){
						console.log("huhu")
						var man = com.mans[AIkey[fp]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[0][2] = play.nowManKey;
						com.showPane(man.x,man.y,2,0);
						man.x = 2;
						man.y = 0;
						play.nowManKey = false;
						com.show();
					} 
				}else{
					for(var i=2;i>=0;i--){
			    		if(AImans[i].length == 1){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    		if(AImans[i].length == 2){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    		if(AImans[i].length == 3){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    	}
			    	if(play.indexOfPs(com.mans[AIkey[i]].ps,[AImans[i][0][0],AImans[i][0][1]])){
						var man = com.mans[AIkey[i]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[AImans[i][0][1]][AImans[i][0][0]] = play.nowManKey;
						com.showPane(man.x,man.y,AImans[i][0][0],AImans[i][0][1]);
						man.x = AImans[i][0][0];
						man.y = AImans[i][0][1];
						play.nowManKey = false;
						com.show();   			
					}
				}
			}
		}else if((com.mans[play.map[0][2]] && com.mans[play.map[1][1]]) && (com.mans[play.map[0][2]].my == 1 && com.mans[play.map[1][1]].my == 1)){
			if(com.mans[play.map[2][0]] && com.mans[play.map[2][0]].my == -1){
				AIkey.splice(com.mans[play.map[2][0]].indexing,1);
				AImans.splice(com.mans[play.map[2][0]].indexing,1);
				console.log(AIkey);
				console.log(AImans);
				var fp;
				for(var i=0;i<AIkey.length;i++){
					if(AImans[i].length == 1){
						fp = i
						break;
					}else if(AImans[i].length == 2){
						fp = i
						break;
					}else if(AImans[i].length == 3){
						fp = i
						break;
					}
				}
				play.nowManKey = AIkey[fp];
				console.log(AIkey[fp]);
				if(play.indexOfPs(com.mans[AIkey[fp]].ps,[AImans[fp][0][0],AImans[fp][0][1]])){
					var man = com.mans[AIkey[fp]];
					delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
					play.map[AImans[fp][0][1]][AImans[fp][0][0]] = play.nowManKey;
					com.showPane(man.x,man.y,AImans[fp][0][0],AImans[fp][0][1]);
					man.x = AImans[fp][0][0];
					man.y = AImans[fp][0][1];
					play.nowManKey = false;
					com.show();
				}	
			}else{	
				var fp;
				for(var i=0;i<3;i++){
					if((com.mans[AIkey[i]].x == 0 && com.mans[AIkey[i]].y == 1) || (com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 2)){
						fp = i;
					}	
				}	

				if(fp){	
					if(play.indexOfPs(com.mans[AIkey[fp]].ps,[0,2])){
						play.nowManKey = AIkey[fp];
						var man = com.mans[AIkey[fp]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[2][0] = play.nowManKey;
						com.showPane(man.x,man.y,0,2);
						man.x = 0;
						man.y = 2;
						play.nowManKey = false;
						com.show();
					} 
				}else{
					for(var i=2;i>=0;i--){
			    		if(AImans[i].length == 1){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    		if(AImans[i].length == 2){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    		if(AImans[i].length == 3){
			    			play.nowManKey = AIkey[i];
			    			break;
			    		}
			    	}
			    	if(play.indexOfPs(com.mans[AIkey[i]].ps,[AImans[i][0][0],AImans[i][0][1]])){
						var man = com.mans[AIkey[i]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[AImans[i][0][1]][AImans[i][0][0]] = play.nowManKey;
						com.showPane(man.x,man.y,AImans[i][0][0],AImans[i][0][1]);
						man.x = AImans[i][0][0];
						man.y = AImans[i][0][1];
						play.nowManKey = false;
						com.show();   			
					}
				}
			}
		}else if((com.mans[play.map[2][2]] && com.mans[play.map[0][0]]) && (com.mans[play.map[2][2]].my == 1 && com.mans[play.map[0][0]].my == 1)){
			if(com.mans[play.map[1][1]] && com.mans[play.map[1][1]].my == -1){
				AIkey.splice(com.mans[play.map[1][1]].indexing,1);
				AImans.splice(com.mans[play.map[1][1]].indexing,1);
				console.log(AIkey);
				console.log(AImans);
				var fp
				for(var i=0;i<AIkey.length;i++){
					if(AImans[i].length == 1){
						fp = i
						break;
					}else if(AImans[i].length == 2){
						fp = i
						break;
					}else if(AImans[i].length == 3){
						fp = i
						break;
					}
				}
				play.nowManKey = AIkey[fp];
				if(play.indexOfPs(com.mans[AIkey[fp]].ps,[AImans[fp][0][0],AImans[fp][0][1]])){
					var man = com.mans[AIkey[fp]];
					delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
					play.map[AImans[fp][0][1]][AImans[fp][0][0]] = play.nowManKey;
					com.showPane(man.x,man.y,AImans[fp][0][0],AImans[fp][0][1]);
					man.x = AImans[fp][0][0];
					man.y = AImans[fp][0][1];
					play.nowManKey = false;
					com.show();
				}	
			}	
		}else if((com.mans[play.map[2][0]] && com.mans[play.map[0][2]]) && (com.mans[play.map[2][0]].my == 1 && com.mans[play.map[0][2]].my == 1)){
			if(com.mans[play.map[1][1]] && com.mans[play.map[1][1]].my == -1){
				AIkey.splice(com.mans[play.map[1][1]].indexing,1);
				AImans.splice(com.mans[play.map[1][1]].indexing,1);
				var fp;
				for(var i=0;i<AIkey.length;i++){
					if(AImans[i].length == 1){
						fp = i
						break;
					}else if(AImans[i].length == 2){
						fp = i
						break;
					}else if(AImans[i].length == 3){
						fp = i
						break;
					}
				}
				play.nowManKey = AIkey[fp]
				if(play.indexOfPs(com.mans[AIkey[fp]].ps,[AImans[fp][0][0],AImans[fp][0][1]])){
					var man = com.mans[AIkey[fp]];
					console.log(man)
					delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
					play.map[AImans[fp][0][1]][AImans[fp][0][0]] = play.nowManKey;
					com.showPane(man.x,man.y,AImans[fp][0][0],AImans[fp][0][1]);
					man.x = AImans[fp][0][0];
					man.y = AImans[fp][0][1];
					play.nowManKey = false;
					com.show();
				}	
			}	
		}
		//棋子主动走赢
		else if(!com.mans[play.map[0][0]] && (com.mans[play.map[2][2]] && com.mans[play.map[1][1]]) && (com.mans[play.map[2][2]].my == -1 && com.mans[play.map[1][1]].my == -1) && ((com.mans[play.map[1][0]] && com.mans[play.map[1][0]].my == -1) || (com.mans[play.map[0][1]] && com.mans[play.map[0][1]].my == -1))){
			for(var i=0;i<3;i++){
				if((!com.mans[play.map[0][0]]) && ((com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 0) || (com.mans[AIkey[i]].x == 0 && com.mans[AIkey[i]].y == 1))){
					if(play.indexOfPs(com.mans[AIkey[i]].ps,[0,0])){
						play.nowManKey = AIkey[i];
						var man = com.mans[AIkey[i]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[0][0] = play.nowManKey;
						com.showPane(man.x,man.y,0,0);
						man.x = 0;
						man.y = 0;
						play.nowManKey = false;
						com.show();
						break;
					}
				}
			}	
		}else if(!com.mans[play.map[2][2]] && (com.mans[play.map[0][0]] && com.mans[play.map[1][1]]) && (com.mans[play.map[0][0]].my == -1 && com.mans[play.map[1][1]].my == -1) && ((com.mans[play.map[1][2]] && com.mans[play.map[1][2]].my == -1) || (com.mans[play.map[2][1]] && com.mans[play.map[2][1]].my == -1))){
			for(var i=0;i<3;i++){
				if((!com.mans[play.map[2][2]]) && ((com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 2) || (com.mans[AIkey[i]].x == 2 && com.mans[AIkey[i]].y == 1))){
					if(play.indexOfPs(com.mans[AIkey[i]].ps,[2,2])){
						play.nowManKey = AIkey[i];
						var man = com.mans[AIkey[i]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[2][2] = play.nowManKey;
						com.showPane(man.x,man.y,2,2);
						man.x = 2;
						man.y = 2;
						play.nowManKey = false;
						com.show();
						break;
					}
				}
			}	
		}else if(!com.mans[play.map[1][1]] && (com.mans[play.map[2][2]] && com.mans[play.map[0][0]]) && (com.mans[play.map[2][2]].my == -1 && com.mans[play.map[0][0]].my == -1) && ((com.mans[play.map[1][0]] && com.mans[play.map[1][0]].my == -1) || (com.mans[play.map[0][1]] && com.mans[play.map[0][1]].my == -1) || (com.mans[play.map[1][2]] && com.mans[play.map[1][2]].my == -1) || (com.mans[play.map[2][1]] && com.mans[play.map[2][1]].my == -1))){
			for(var i=0;i<3;i++){
				if((!com.mans[play.map[1][1]]) && ((com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 0) || (com.mans[AIkey[i]].x == 2 && com.mans[AIkey[i]].y == 1) || (com.mans[AIkey[i]].x == 2 && com.mans[AIkey[i]].y == 1) || (com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 2))){
					if(play.indexOfPs(com.mans[AIkey[i]].ps,[1,1])){
						play.nowManKey = AIkey[i];
						var man = com.mans[AIkey[i]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[1][1] = play.nowManKey;
						com.showPane(man.x,man.y,1,1);
						man.x = 1;
						man.y = 1;
						play.nowManKey = false;
						com.show();
						break;
					}
				}
			}	
		}else if(!com.mans[play.map[2][0]] && (com.mans[play.map[0][2]] && com.mans[play.map[1][1]]) && (com.mans[play.map[0][2]].my == -1 && com.mans[play.map[1][1]].my == -1) && ((com.mans[play.map[1][0]] && com.mans[play.map[1][0]].my == -1) || (com.mans[play.map[2][1]] && com.mans[play.map[2][1]].my == -1))){
			for(var i=0;i<3;i++){
				if((!com.mans[play.map[2][0]]) && ((com.mans[AIkey[i]].x == 0 && com.mans[AIkey[i]].y == 1) || (com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 2))){
					if(play.indexOfPs(com.mans[AIkey[i]].ps,[0,2])){
						play.nowManKey = AIkey[i];
						var man = com.mans[AIkey[i]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[2][0] = play.nowManKey;
						com.showPane(man.x,man.y,0,2);
						man.x = 0;
						man.y = 2;
						play.nowManKey = false;
						com.show();
						break;
					}
				}
			}	
		}else if(!com.mans[play.map[0][2]] && (com.mans[play.map[2][0]] && com.mans[play.map[1][1]]) && (com.mans[play.map[2][0]].my == -1 && com.mans[play.map[1][1]].my == -1) && ((com.mans[play.map[1][2]] && com.mans[play.map[1][2]].my == -1) || (com.mans[play.map[0][1]] && com.mans[play.map[0][1]].my == -1))){
			for(var i=0;i<3;i++){
				if((!com.mans[play.map[0][2]]) && ((com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 0) || (com.mans[AIkey[i]].x == 2 && com.mans[AIkey[i]].y == 1))){
					if(play.indexOfPs(com.mans[AIkey[i]].ps,[2,0])){
						play.nowManKey = AIkey[i];
						var man = com.mans[AIkey[i]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[0][2] = play.nowManKey;
						com.showPane(man.x,man.y,2,0);
						man.x = 2;
						man.y = 0;
						play.nowManKey = false;
						com.show();
						break;
					}
				}
			}	
		}else if(!com.mans[play.map[1][1]] && (com.mans[play.map[2][0]] && com.mans[play.map[0][2]]) && (com.mans[play.map[2][0]].my == -1 && com.mans[play.map[0][2]].my == -1) && ((com.mans[play.map[1][0]] && com.mans[play.map[1][0]].my == -1) || (com.mans[play.map[0][1]] && com.mans[play.map[0][1]].my == -1) || (com.mans[play.map[1][2]] && com.mans[play.map[1][2]].my == -1) || (com.mans[play.map[2][1]] && com.mans[play.map[2][1]].my == -1))){
			for(var i=0;i<3;i++){
				if((!com.mans[play.map[1][1]]) && ((com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 0) || (com.mans[AIkey[i]].x == 2 && com.mans[AIkey[i]].y == 1) || (com.mans[AIkey[i]].x == 1 && com.mans[AIkey[i]].y == 2) || (com.mans[AIkey[i]].x == 0 && com.mans[AIkey[i]].y == 1))){
					if(play.indexOfPs(com.mans[AIkey[i]].ps,[1,1])){
						play.nowManKey = AIkey[i];
						var man = com.mans[AIkey[i]];
						delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
						play.map[1][1] = play.nowManKey;
						com.showPane(man.x,man.y,1,1);
						man.x = 1;
						man.y = 1;
						play.nowManKey = false;
						com.show();
						break;
					}
				}
			}	
		}else{
	    	for(var i=2;i>=0;i--){
	    		if(AImans[i].length == 1){
	    			play.nowManKey = AIkey[i];
	    			break;
	    		}
	    		if(AImans[i].length == 2){
	    			play.nowManKey = AIkey[i];
	    			break;
	    		}
	    		if(AImans[i].length == 3){
	    			play.nowManKey = AIkey[i];
	    			break;
	    		}
	    	}
	    	if(play.indexOfPs(com.mans[AIkey[i]].ps,[AImans[i][0][0],AImans[i][0][1]])){
				var man = com.mans[AIkey[i]];
				delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
				play.map[AImans[i][0][1]][AImans[i][0][0]] = play.nowManKey;
				com.showPane(man.x,man.y,AImans[i][0][0],AImans[i][0][1]);
				man.x = AImans[i][0][0];
				man.y = AImans[i][0][1];
				play.nowManKey = false;
				com.show();   			
			}
	    }	
	}
}