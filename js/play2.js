var play = play || {};
var flag = 0;											//变量标志 用于控制同一个颜色的棋不能重复走两次
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
	if(!tmp4){
		if(key){
			play.clickMan(key,x,y);
		}else{
			play.clickPoint(x,y);
		}
	}

	if(key){
		play.clickMan(key,x,y);
	}else{
		if(tmp4){
			play.clickPoint(x,y);
		}
	}	
	play.getWin();  //每次移动完判定是否胜利
}

//点击并选中棋子
play.clickMan = function(key,x,y){
	var man = com.mans[key];
	if(man.my === 1 || man.my === -1){
		if(flag == 0 || flag != man.my){
			flag = man.my;
			if(com.mans[play.nowManKey]){
				com.mans[play.nowManKey].alpha = 1;
				console.log(com.mans[play.nowManKey])
			}
			man.alpha = 0.6;
			com.pane.isShow = false;
			play.nowManKey = key;
			com.mans[key].ps = com.mans[key].bl();	//get all the seemly points
			//com.dot.dots = com.mans[key].ps;
			com.show();
			console.log("man is clicked");
		}
	}
}

//click the vacant position
//点击空缺位置
play.clickPoint = function(x,y){
	var key = play.nowManKey;
	//console.log(key)
	var man = com.mans[key];
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
		}else{
			alert("can not step!")
		}
	}
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
	//alert(play.map[y][x]);
	return(play.map[y][x] && play.map[y][x] != "0") ? play.map[y][x] : false;
	console.log("getClickMan")
}

function successCallback() {
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
function computerWinCallback() {
			var circle = document.querySelector('.circle');
			circle.style.display = 'block';
			var win = document.querySelector('.win');
			win.innerHTML = "上方棋子胜利！"
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
		debugger
		successCallback();
		play.isPlay = false;
	}else if(com.mans[play.map[0][0]] && com.mans[play.map[1][1]] && com.mans[play.map[2][2]] && (com.mans[play.map[0][0]].my == -1 && com.mans[play.map[1][1]].my == -1 && com.mans[play.map[2][2]].my == -1)){
		computerWinCallback();
		play.isPlay = false;
	}else if(com.mans[play.map[0][2]] && com.mans[play.map[1][1]] && com.mans[play.map[2][0]] && (com.mans[play.map[0][2]].my == 1 && com.mans[play.map[1][1]].my == 1 && com.mans[play.map[2][0]].my == 1)){
		successCallback();
		play.isPlay = false;
	}else if(com.mans[play.map[0][2]] && com.mans[play.map[1][1]] && com.mans[play.map[2][0]] && (com.mans[play.map[0][2]].my == -1 && com.mans[play.map[1][1]].my == -1 && com.mans[play.map[2][0]].my == -1)){
		computerWinCallback();
		play.isPlay = false;
	}

}





/*


 play.js第186行var AIkey = ["c0","c1","c2"]改为var AIkey = ["a0","a1","a2"];








*/