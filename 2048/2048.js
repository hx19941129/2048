window.onload=function(){

	function main(){
		initial() 	//初始化所有界面
		update() //更新界面
		timeGo() //计时功能
	}

	var second=0 	//秒
	var minute=0 	//分	
	var state="playing" 	//游戏处于什么状态
	var timer_go="" 	//计时是否开始
	var score=0 		//得到的分数

	var scoreShow=document.getElementById("score")
	//通过classname获取元素
	function elementByClass(classname){
		var objArr=new Array()		//数组：放置找到的符合要求的元素
		var index=0			//数组的下标

		var tag=document.getElementsByTagName("div")	//找页面中所有的元素
		for(var i=0;i<tag.length;i++){
			if(tag[i].getAttribute("class")==classname){ 	//如果元素属性class的值为你想要的值
				objArr[index]=tag[i] 			//放入数组中
				index=index+1 			//下标加1
			}
		}
		return objArr 						//返回数组
	}


	//放置所有方块的位置
	function gridPosition(){
		//var gridArr=elementByClass("grid")	//所有下层方块
		var cellArr=elementByClass("cell")  //通过调用自己写的方法找到所有的上层小方块
		var index=0		//数组下标
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				//gridArr[index].style.left=110*j+10+"px"
				//gridArr[index].style.top=110*i+10+"px"
				cellArr[index].style.left=110*j+10+"px" 	//设置距左距离
				cellArr[index].style.top=110*i+10+"px" //设置距上距离
				index++ 	//下标增加
			}
		}
	}


	var data=new Array()	
	data=[ [0,0,0,0],
	               [0,0,0,0],
	               [0,0,0,0],
	               [0,0,0,0] ]	

	//初始化游戏
	function initial(){
		gridPosition() 	//放置好前景格子
		randomNumber() 	//生成一个随机数
		randomNumber()	//生成一个随机数
		
	}

	//键盘检测
	document.onkeydown=function(ev){
		ev=ev||event
		if(state=="playing"){ 	//如果游戏状态是"游戏中"
			timer_go="start" 	//开始计时
			if(ev.keyCode==37){
				moveLeft()
				//console.log("左")
			}else if (ev.keyCode==38){
				moveUp()
				//console.log("右")
			}else if(ev.keyCode==39){
				moveRight()
				//console.log("上")
			}else if(ev.keyCode==40){
				moveDown()
				//console.log("下")
			}
		}
		
	}

	//判断数组是否满了
	function isFull(){
		for(var row=0;row<4;row++){ 	//4行
			for(var col=0;col<4;col++){  //4列
				if(data[row][col]==0){ //如果row行col列的值为0
					return false; //跳出函数，返回false，表示没满（还有0）
				}
			}
		}
		return true; //如果这16个值都不为0，返回true，表示满了（没有0）
	}

	//随机空白位置生成2或者4
	function randomNumber(){
		if(isFull()){return;} 	//如果二维数组中没有为0的，就不执行了
		else{
			while(true){ 	//一直循环
				var i=Math.round(Math.random()*3) //第几行
				var j=Math.round(Math.random()*3) //第几列
				if(data[i][j]==0){ 	//如果i行j列的那个数为0
					data[i][j]=Math.random()<=0.5?2:4  //随机数如果大于0.5，这个数赋值4，
									        //如果小于0.5，这个数赋值2
					break 	//跳出循环
				}		
			}
		}		

	}




	//左移动
	function moveLeft(){
		if(canLeft()){   //如果能左移
			for(var row=0;row<4;row++){
				moveLeftInRow(row) 	//一行一行的向左变化
			}
			animation() 	//播放动画
			setTimeout(function(){  //隔几秒之后
				randomNumber() //产生一个新的数字
				update() 	     //更新画面
			},zhenshu*zhenshuTime)  //帧的个数*每帧的时间

		}
	}

	//判断是否可以左移动
	function canLeft(){
		for(var row=0;row<4;row++){
			for(var col=1;col<4;col++){ 	//从第二列开始，因为第一列不能左移
				if(data[row][col]!=0){ 	//如果不为0
					//如果前一个数为0或者跟前一个数相等
					if(data[row][col-1]==0||data[row][col]==data[row][col-1]){
					return true 	//返回ture，表示可以移动
					}
				}

			}
		}
		return false 	//返回false，不可以移动
	}

	//获取当前元素向右的不为零的元素
	function nextRightValue(row,col){
		for(var i=col+1;i<4;i++){  //将列+1，就是看右侧的值
			if(data[row][i]!=0){ //如果值不为0
				return i 	       //返回这个不为0的列数
			}
		}
		return -1 		//如果没有，返回-1
	}

	//向左变化数组
	function moveLeftInRow(row){
		for(var col=0;col<3;col++){ 	//1-3列
			var nextNum=nextRightValue(row,col) //得到右侧的第一个有效值的列数
			if(nextNum==-1) { 	//如果没有有效值
				break 		//退出函数
			}else{
				if(data[row][col]==0){ 	//如果当前的数为0
					data[row][col]=data[row][nextNum] //把有效值移动过来
					data[row][nextNum]=0 	//把有效值的位置置为0
					addTask(""+row+nextNum,""+row+col) 
					col--
				}else if(data[row][col]==data[row][nextNum]) {  //如果当前的数与有效值相等
					data[row][col]*=2 		//将当前的数乘以2
					data[row][nextNum]=0 	//将有效值的位置置为0
					score+=data[row][col] 		//将合并的当前的数值加到分数上
					addTask(""+row+nextNum,""+row+col)
				}
			}
		}
	}

	

	//右移动
	function moveRight(){
		if(canRight()){
			for(var row=0;row<4;row++){
				moveRightInRow(row)
			}
			animation()
			setTimeout(function(){
				randomNumber()
				update()				
			},zhenshu*zhenshuTime)

		}
	}

	//是否能向右移动
	function canRight(){
		for(var row=0;row<4;row++){
			for(var col=2;col>=0;col--){
				if(data[row][col]!=0){
					if(data[row][col+1]==0||data[row][col]==data[row][col+1]){
						return true
					}
				}
			}
		}
		return false
	}

	//获取左侧的有效元素
	function nextLeftValue(row,col){
		for(var i=col-1;i>=0;i--){
			if(data[row][i]!=0){
				return i
			}
		}
		return -1
	}

	//向右变化数组
	function moveRightInRow(row){
		for(var col=3;col>0;col--){
			var nextLeftNum=nextLeftValue(row,col)
			if(nextLeftNum==-1){
				break
			}else{
				if(data[row][col]==0){
					data[row][col]=data[row][nextLeftNum]
					data[row][nextLeftNum]=0
					addTask(""+row+nextLeftNum,""+row+col)
					col++
				}else if(data[row][col]==data[row][nextLeftNum]){
					data[row][col]*=2
					data[row][nextLeftNum]=0
					score+=data[row][col]
					addTask(""+row+nextLeftNum,""+row+col)
				}
			}
		}
	}




	//上移动
	function moveUp(){
		if(canUp()){
			for(var col=0;col<4;col++){
				moveUpInCol(col)
			}
			animation()
			setTimeout(function(){
				randomNumber()
				update()
			},zhenshu*zhenshuTime)

		}
	}

	//是否能向上移动
	function canUp(){
		for(var col=0;col<4;col++){
			for(var row=1;row<4;row++){
				if(data[row][col]!=0){
					if(data[row-1][col]==0||data[row][col]==data[row-1][col]){
						return true
					}
				}
			}
		}
		return false
	}

	//获取向下的有效元素
	function nextDownValue(row,col){
		for(var i=row+1;i<4;i++){
			if(data[i][col]!=0){
				return i
			}
		}
		return -1
	}

	//向上变化数组
	function moveUpInCol(col){
		for(var row=0;row<3;row++){
			var nextDownNum=nextDownValue(row,col)
			if(nextDownNum==-1){
				break
			}else{
				if(data[row][col]==0){
					data[row][col]=data[nextDownNum][col]
					data[nextDownNum][col]=0
					addTask(""+nextDownNum+col,""+row+col)
					row--
				}else if(data[row][col]==data[nextDownNum][col]){
					data[row][col]*=2
					data[nextDownNum][col]=0
					score+=data[row][col]
					addTask(""+nextDownNum+col,""+row+col)
				}
			}
		}
	}




	//下移动
	function moveDown(){
		if(canDown()){
			for(var col=0;col<4;col++){
				moveDownInCol(col)
			}
			animation()
			setTimeout(function(){
				randomNumber()
				update()
			},zhenshu*zhenshuTime)
		}
	}

	//判断是否能向下移动
	function canDown(){
		for(var col=0;col<4;col++){
			for(var row=0;row<3;row++){
				if(data[row][col]!=0){
					if(data[row+1][col]==0||data[row][col]==data[row+1][col]){
						return true
					}
				}
			}
		}
		return false
	}

	//获取向上的有效元素
	function nextUpValue(row,col){
		for(var i=row-1;i>=0;i--){
			if(data[i][col]!=0){
				return i
			}
		}
		return -1
	}

	//向下变化的数组
	function moveDownInCol(col){
		for(var row=3;row>0;row--){
			var nextUpNum=nextUpValue(row,col)
			if(nextUpNum==-1){
				break
			}else{
				if(data[row][col]==0){
					data[row][col]=data[nextUpNum][col]
					data[nextUpNum][col]=0
					addTask(""+nextUpNum+col,""+row+col)
					row++
				}else if(data[row][col]==data[nextUpNum][col]){
					data[row][col]*=2
					data[nextUpNum][col]=0
					score+=data[row][col]
					addTask(""+nextUpNum+col,""+row+col)
				}
			}
		}
	}




	//将数组中的数字放入div中
	function update(){
		end() 	//判断游戏是否结束
		scoreShow.innerHTML=score  //将分数显示出来
		for(var row=0;row<4;row++){ //4行
			for(var col=0;col<4;col++){ //4列
				var cell=document.getElementById("c"+row+col)
				//row行col列是否等于0?等于0，什么都不显示 : 不等于0，将数显示出来
				cell.innerHTML=data[row][col]==0?"":data[row][col] 
				//row行col列是否等于0?等于0，class=cell : 不等于0，class=celln数值
				//不同的数的背景颜色显示
				cell.className=data[row][col]==0?"cell":"cell n"+data[row][col]
				achShow(row,col)
			}
		}
		
	}



	//动画部分

	//动画任务数组
	var tasks=[]
	var zhenshu=10 	//帧的个数
	var zhenshuTime=10 	//每帧的时间

	 //每一个动画数组的数据
	function animTask(obj,topDistance,leftDistance){
		this.obj=obj 		//这个div
		this.topDistance=topDistance 	//每次移动的top距离
		this.leftDistance=leftDistance 	//每次移动的left距离
		this.left=parseInt(getComputedStyle(obj).left) 	//初始的left位置
		this.top=parseInt(getComputedStyle(obj).top) 	//初始的top位置
	}

	 //每次移动的距离
	animTask.prototype.move=function(){
		var style=getComputedStyle(this.obj,null)
		var top=parseInt(style.top)
		var left=parseInt(style.left)
		this.obj.style.top=top+this.topDistance+"px"
		this.obj.style.left=left+this.leftDistance+"px"
	}

	 //返回原先的位置
	animTask.prototype.back=function(){
		this.obj.style.top=this.top+"px"
		this.obj.style.left=this.left+"px"
	}

	 //添加动画任务
	function addTask(source,target){
		var sourceDiv=document.getElementById("c"+source)
		var targetDiv=document.getElementById("c"+target)
		var sourceStyle=getComputedStyle(sourceDiv)
		var targetStyle=getComputedStyle(targetDiv)
		var topDis=(parseInt(targetStyle.top) - parseInt(sourceStyle.top))/zhenshu
		var leftDis=(parseInt(targetStyle.left) - parseInt(sourceStyle.left))/zhenshu
		var task=new animTask(sourceDiv,topDis,leftDis)
		tasks.push(task)
	}

	var timer=null
	 //播放动画
	function animation(){
		state="animating"
		timer=setInterval(function(){
			for(var i=0;i<tasks.length;i++){
				tasks[i].obj.style.zIndex=999
				tasks[i].move()
			} 
			zhenshu--
			if(zhenshu<=0){
				for(var i=0;i<tasks.length;i++){
					tasks[i].obj.style.zIndex=1
					tasks[i].back()		
				}
				state="playing"
				clearInterval(timer)
				timer=null
				tasks=[]
				zhenshu=10
			}
		},zhenshuTime)
	}

	//游戏结束
	function end(){
		// clearInterval(timerAll)
		if(!canDown()&&!canUp()&&!canRight()&&!canLeft()){
			clearInterval(timerAll)
			timerAll=null
			timer_go="end"
			state="end"
			var endScore=document.getElementById("highestScore")
			endScore.innerHTML="您的分数是:"+score 	//将分数放到结算面板上
			var endTime=document.getElementById("useTime")
			endTime.innerHTML="您的时间是:"+minute+"分"+second+"秒"
			var calHighestScore=document.getElementById("calHighestScore")
			setCookie(score)
			alert(document.cookie)
			var endView=document.getElementById("zhedang")
			endView.style.display="block" 	//让遮挡层显示出来
		}
	}

	//计时功能
	var timerAll=null
	function timeGo(){
		var timeShow=document.getElementById("timeShow") //找到显示时间的元素
		timerAll=setInterval(function(){ 
			if(timer_go=="start"){ //如果时间标志为"start"
				second++ 	//秒数+1
				if(second>59){ 	//秒数大于59
					minute++ //分钟加1
					second=0 //秒数为0
				}
				if(minute<=9&&second<=9){ //如果分数和秒数都小于9
					timeShow.innerHTML="0"+minute+":0"+second //显示0m:0s
				} 							    //例如09:09
				if(minute<=9&&second>9){
					timeShow.innerHTML="0"+minute+":"+second //显示0m:s
				} 							 //例如09:20
				if(minute>9&&second<=9){
					timeShow.innerHTML=minute+":0"+second //显示m:0s
				} 							 //例如10:09
				if(minute>9&&second>9){
					timeShow.innerHTML=minute+":"+second //显示m:s
										        //列入10:10
				}	
			}
			
		},1000) 	//每隔1000ms执行一次
	}

	//重新开始按钮
	var restart_button=document.getElementById("restart")
	restart_button.onclick=function(){
		var endView=document.getElementById("zhedang")
		endView.style.display="none"
		score=0
		var timeShow=document.getElementById("timeShow")
		timeShow.innerHTML="00:00"
		second=0
		minute=0
		achiveShow.innerHTML=""
		data=[ [0,0,0,0],
	               		[0,0,0,0],
	               		[0,0,0,0],
	               		[0,0,0,0] ]
	               	randomNumber()
	               	randomNumber()
	               	update()
	              	state="playing"
	              	timeGo()
	}

	//成就显示部分
	var achiveShow=document.getElementById("achivement")
	var maxNumber=0
	function achShow(row,col){
		if(data[row][col]>=8){
			if(data[row][col]>maxNumber){
				maxNumber=data[row][col]
				achiveShow.innerHTML="恭喜你合并出第一个"+maxNumber+"!"
				txtStatus="fadeIn"
				clearInterval(txtTimer)
				fade()
			}
		}
	}

	//文字淡入淡出效果
	var txtTimer=null
	var txtStatus="fadeIn"
	var num=0

	//淡入淡出函数
	function fade(){
			txtTimer=setInterval(function(){
				if(txtStatus=="fadeIn"){
					fadeIn()
				}
				if(txtStatus=="fadeOut"){
					fadeOut()
				}
			},100)		
	}

	//淡入函数
	function fadeIn(){
		num++
		achiveShow.style.opacity=num/10
		if(num>=10){
			txtStatus="fadeOut"
		}
	}

	//淡出函数
	function fadeOut(){
		num--
		achiveShow.style.opacity=num/10
		if(num<=0){
			clearInterval(txtTimer)
			txtStatus="fadeIn"
		}
	}

	//设置cookie
	function setCookie(value){
		var days=-20
		var exp=new Date()   //获取当前时间
		exp.setTime(exp.getTime()+days*24*60*60*1000)
		document.cookie="score"+"="+value+";expires="+exp.toGMTString()
	}

	//读取cookie
	function getCookie(){
		if(document.cookie.indexOf("score=")===-1){
			return false
		}else{
			return true
		}
	}
	main()
}