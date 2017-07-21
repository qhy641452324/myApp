;(function(M){
	M.define('index',{
		onOff:true,
		length:10,
		kind:25,
		defaults:{
			callback:function(){}
		},
		init:function(options){
			M.extend(true,this.defaults,options);
			this.container=M(document.body).children('div').eq(0);
			this.setBackground(this.container,'bg.jpg',function(){
				document.body.removeChild(document.getElementById('mt-loading-rotate'));
				this.container.addClass('in');
				if(M.cookie.read('_cache_')=='null'){
					this.showloading(function(){
						this._load();
					});
				}else{
					this._set(this._load);
				};
			});
			this.setBackground(M(document.getElementById('mt-mode-second')),'m5.jpg',function(){
				//M(document.getElementById('mt-mode-second')).stopPropagation();
			});
			$.weichatTools.share.init('farm');
		},
		_load:function(){
			//this.setMusic();
			document.getElementById('mt-mode-main').style.display='block';
			this._list=M.ui.list.init({
				start:0,
				number:this.length,
				url:M.path+'game_farm/load_data_4_farm',
				box:M('.mt-scroll-container'),
				isPull:true,
				text:'您的农场无菜可收，点击右上角【比布农场】，分享到好友圈，即可播种出菜喔！',
				isPreventDefault:false,
				enabled:false,
				n:0,
				callback:function(data,type,that){
					this.ops.n++;
					if(this.ops.n==1){
						that.avatar=that.setAvatarList(data.farm_downline_imglist);
						document.getElementById('name').innerHTML=data.userInfo.farmName;
						document.getElementById('ui_share_friend').href='share_4_other.html?idUser='+data.userInfo.idUser+'&idAppendUser='+data.append_user.idAppendUser;
						document.getElementById('ui_share_boy').href='share_4_boy.html?idUser='+data.userInfo.idUser+'&idAppendUser='+data.append_user.idAppendUser;
						document.getElementById('ui_share_girl').href='share_4_girl.html?idUser='+data.userInfo.idUser+'&idAppendUser='+data.append_user.idAppendUser;
						M(document.getElementById('share')).bind('click',function(e){
							e.stopPropagation();
							M(this).toggleClass('in');
							return false;
						});
						M(document).bind('click',function(){
							M(document.getElementById('share')).removeClass('in');	
						});
					};
					if(data.farm_frontpage.length){
						if(this.ops.n==1){
							M(document.getElementById('mt-wallet-button')).bind('click',{context:that,idUser:data.userInfo.idUser,idAppendUser:data.append_user.idAppendUser},that.showWallet);
							M(document.getElementById('explain')).bind('click',{context:that},that.showExplain);
							M(document.getElementById('head_name')).bind('click',{context:that,idUser:data.userInfo.idUser,idAppendUser:data.append_user.idAppendUser},that.showWallet);
							document.getElementById('avatar_list').innerHTML=that.getAvatarList(data.farm_downline_imglist);
							that.avatar_list_num=data.farm_downline_imglist.length;
						};
						M.delay(100,function(){
							this.scroll.ops.box.removeClass('ui-mode-box')[{normal:'html',up:'html',down:'append'}[type]](that.getList(data.farm_frontpage));
							this.scroll.refresh();
							that.addEvent();
						},this);	
					}else{
						if(this.ops.n==1){
							M(document.getElementById('mt-wallet-button')).bind('click',{context:that,idUser:data.userInfo.idUser,idAppendUser:data.append_user.idAppendUser},that.showWallet);
							M(document.getElementById('explain')).bind('click',{context:that},that.showExplain);
							M(document.getElementById('head_name')).bind('click',{context:that,idUser:data.userInfo.idUser,idAppendUser:data.append_user.idAppendUser},that.showWallet);
							document.getElementById('avatar_list').innerHTML=that.getAvatarList(data.farm_downline_imglist);
							that.avatar_list_num=data.farm_downline_imglist.length;
						};
						document.getElementById('list').innerHTML='';	
					};
				}
			},this);
		},
		setMusic:function(){
			var that=this;
			this.bg_music=document.getElementById('mt_background_music');
			this.btn_music=document.getElementById('mt_button_music');
			this.bg_music.src=M.getNormalPath('bg.mp3',5);
			this.btn_music.src=M.getNormalPath('click.mp3',5);
			if(M.browser.isIOS){
				this.bg_music.play();
				function _play(){
					that.bg_music.play();	
					document.getElementById('mt-mode-main').removeEventListener('touchstart',_play); 	
				};
				document.getElementById('mt-mode-main').addEventListener('touchstart',_play); 
			}else{
				this.bg_music.play();
			};
		},
		addEvent:function(){
			M('.ui-farm-big').unbind('click').bind('click',{context:this},this.showSecond);
			M('.ui-farm-small').unbind('click').bind('click',{context:this},this.showMain);
		},
		showMain:function(e){
//			e.data.context.btn_music.play();
			var _this=M(this),
				target=_this.parents('.ui-farm-item'),
				wallet=M(document.getElementById('mt-wallet-button')),
				idUser=target.attr('idUser'),
				idUserScore=_this.parents('span').attr("idUserScore"),
				idImg=target.attr('idImg');
			
			M.ui.ajax.init({
				url:M.path+'game_farm/load_data_4_harvest',
				data:{idUserScore:idUserScore},
				isload:true,
				success:function(data){
					document.getElementById('upline').src=M.getNormalPath('pic/A/m'+data.user_info_downline.idImageByUpline+'.png');
					document.getElementById('downline_harvest_user_name').innerHTML=data.user_info_downline.contactUser;
					document.getElementById('downline_harvest_time').innerHTML=data.unharvest_score_userscore.insertTimeStrFarm;
					document.getElementById('downlineHarvestScoreSum').innerHTML=M.setNumberPoint(data.unharvest_score_userscore.consumeScore);
					document.getElementById('upline-list').innerHTML=this.getUplineList(data.unharvest_score_userscore,data.user_info_downline.idImageByUpline);
					var main=M(document.getElementById('mt-mode-upline'));
					wallet.addClass('current');
					main.show().addClass('in').unbind('click').bind('click',function(){
						e.data.context.closeMain(main,wallet);
						return false;	
					}).children().stopPropagation('click');
					M('.ui-mode-close',main).unbind('click').bind('click',function(){
						e.data.context.closeMain(main,wallet);
						return false;	
					});
//					if(!!!this._upline&&data.unharvest_score_list.length>20){
//						this._upline=new iScroll('_upline',{
//							 hScroll:false,
//							 vScroll:true,
//							 hScrollbar:false,
//							 vScrollbar:false
//						});
//					}else{
						this._upline&&this._upline.refresh();
//					};
			   		M('.mt-upline-button').unbind('click').bind('click',{context:this,box:_this.parents('.ui-farm-list'),idImg:idImg,dealTarget:_this},this.moveKnife);
				},
				error:function(msg){
					M.ui.confirm.creat({
						text:msg,
						button:['确定']
					});	
					//M.ui.waiting.creat({status:false,text:msg,time:500});	
				}
			},e.data.context);	
			return false;	
		},
		/*showMain:function(e){
//			e.data.context.btn_music.play();
			var _this=M(this),
				target=_this.parents('.ui-farm-item'),
				wallet=M(document.getElementById('mt-wallet-button')),
				idUser=target.attr('idUser'),
				idImg=target.attr('idImg');
			M.ui.ajax.init({
				url:M.path+'game_farm/load_data_4_harvest',
				data:{downlineIdUser:idUser},
				isload:true,
				success:function(data){
					document.getElementById('upline').src=M.getNormalPath('pic/A/m'+data.user_info_downline.idImageByUpline+'.png');
					document.getElementById('downlineHarvestScoreSum').innerHTML=M.setNumberPoint(data.user_info_downline.downlineHarvestScoreSum);
					document.getElementById('upline-list').innerHTML=this.getUplineList(data.unharvest_score_list,data.user_info_downline.idImageByUpline);
					var main=M(document.getElementById('mt-mode-upline'));
					wallet.addClass('current');
					main.show().addClass('in').unbind('click').bind('click',function(){
						e.data.context.closeMain(main,wallet);
						return false;	
					}).children().stopPropagation('click');
					M('.ui-mode-close',main).unbind('click').bind('click',function(){
						e.data.context.closeMain(main,wallet);
						return false;	
					});
					if(!!!this._upline&&data.unharvest_score_list.length>20){
						this._upline=new iScroll('_upline',{
							 hScroll:false,
							 vScroll:true,
							 hScrollbar:false,
							 vScrollbar:false
						});
					}else{
						this._upline&&this._upline.refresh();
					};
					M('.mt-upline-button').unbind('click').bind('click',{context:this,box:_this.parent(),idImg:idImg},this.moveKnife);
				},
				error:function(msg){
					M.ui.confirm.creat({
						text:msg,
						button:['确定']
					});	
					//M.ui.waiting.creat({status:false,text:msg,time:500});	
				}
			},e.data.context);	
			return false;	
		},*/
		closeMain:function(o,m){
//			this.btn_music.play();
			o.addClass('out');
			m.removeClass('current');
			M(document.getElementById('knife')).remove();
			M.delay(300,function(){
				o.removeClass('out').removeClass('in').hide();
				M.index.onOff=true;
			});	
			this._upline&&delete this._upline;
			
		},
		moveKnife:function(e){
			if(!M.index.onOff)return;//防止多次点击开关
			M.index.onOff=false;
			that=e.data.context;

			var target=M(this),
				that=e.data.context,
				idUserScore=target.attr('idUserScore'),
				consumeScore=target.attr('consumeScore'),
				wallet=M(document.getElementById('mt-wallet-button')),
				box=M(document.getElementById('_knife_')),
				x=box.offset().left,
				y=box.offset().top;
			
			var main=M(document.getElementById('mt-mode-upline'));
			console.log(1);
//			that.btn_music.play();
			M.ui.ajax.init({
				url:M.path+'game_farm/upline_harvest',
				data:{idUserScore:idUserScore},
				//isload:false,
				success:function(data){
					
					var left=target.offset().left,
						top=target.offset().top,
						width=target.width(),
						height=target.height(),
						size=parseFloat(document.getElementsByTagName('html')[0].style.fontSize),
						score=M(M.creatlabel('span'),{
							class:'text-shadow mt-upline-score',
							css:{
								left:left-(8*size-width)*0.5,
								top:top-(1*size-height)*0.5,
								zIndex:M.now()
							},
							html:M.setNumberPoint(data.consumeScore)+'家元'	
						}),
						knife=M(M.creatlabel('img'),{
							class:'ui-upline-knife ani',
							src:M.getNormalPath('m10.png'),
							css:{
								position:'absolute',
								left:x,
								top:y,
								zIndex:M.now()
							}	
						});
					M(document.body).append(knife);
					box.addClass('current');
//					document.getElementById('downlineHarvestScoreSum').innerHTML=M.setNumberPoint(data.user_info_downline.downlineHarvestScoreSum);
					document.getElementById('downlineHarvestScoreSum').innerHTML='0.00';
					M.delay(10,function(){
						knife.css({
							left:left+width*0.4,
//							left:left,
							top:top-height*0.1
						});
						M.delay(300,function(){
							knife.addClass('in');
							M.delay(300,function(){
								target.addClass('current');	
								M(document.body).append(score);
								M.delay(800,function(){
									score.remove();
								});
								knife.removeClass('in').css({
									left:x,
									top:y
								});
								M.delay(300,function(){
									
									box.removeClass('current');
									knife.remove();	
								});
								var animate=M(M.creatlabel(),{
									class:'mt-upline-animate',
									css:{
										width:width*0.35,
										left:left+width*0.4,
										top:top+height*0.5,
										zIndex:M.now()
									},
									html:M(M.creatlabel('img'),{
										src:M.getNormalPath('pic/B/m'+e.data.idImg+'.png')
									})[0].outerHTML
								});
								M(document.body).append(animate);
								M.delay(10,function(){
									animate.css({
										opacity:0,
										left:wallet.offset().left+(wallet.width()-animate.width())*0.5,
										top:wallet.offset().top+(wallet.height()-animate.height())*0.5	
									});
									M.delay(500,function(){
										M.index.onOff=true;
										animate.remove();
										that.closeMain(main,wallet);
									});
									
								});
//								for(var j=0,str='';j<Math.min(10,data.user_info_downline.listByDownlineiduser.length);j++){
//									str+=M.template.resolve(that.renderImage(data.user_info_downline.listByDownlineiduser[j].insertTime),{idUserScore:data.user_info_downline.listByDownlineiduser[j].idUserScore,src:M.getNormalPath('pic/A_B/m'+e.data.idImg+'.png')});
//								};
//								for(var j=0,str='';j<data.user_info_downline.listByDownlineiduser.length;j++){
//									str+=M.template.resolve(that.renderImage(data.user_info_downline.listByDownlineiduser[j].insert_time),{id_user_score:data.user_info_downline.listByDownlineiduser[j].id_user_score,src:M.getNormalPath('pic/A_B/m'+e.data.id_img+'.png')});
//								};
								console.log(2);
								e.data.dealTarget.parent("span").remove();
								e.data.box.prev(".count").empty().append(data.user_info_downline.listByDownlineiduser.length)
//								e.data.box.html(str);
								that.addEvent();
							});
						});
					});
				},
				error:function(msg){
					M.index.onOff=true;
					M.ui.confirm.creat({
						text:msg,
						button:['确定']
					});	
					//M.ui.waiting.creat({status:false,text:msg,time:500});	
				}
			},that);
			return false;	
		},
		showWallet:function(e){
//			e.data.context.btn_music.play();
			var target=M(this);
			M.ui.ajax.init({
				url:M.path+'game_farm/harvest_score_detail',
				//isload:false,
				success:function(data){
					if(target.hasClass('current')){
						document.getElementById('knife')&&M(document.getElementById('knife')).remove();
						var inner=M(document.getElementById('mt-mode-upline'));
						inner.addClass('out');
						M.delay(300,function(){
							inner.hide().removeClass('in').removeClass('out');
						});
						target.removeClass('current');
					};
					document.getElementById('farm_all_wallet').innerHTML=M.setNumberPoint(data.farm_all_score);
					document.getElementById('farm_harvest_wallet').innerHTML=M.setNumberPoint(data.farm_all_score-data.farm_unharvest_score);
					document.getElementById('farm_unharvest_wallet').innerHTML=M.setNumberPoint(data.farm_unharvest_score);
					document.getElementById('registerTime').innerHTML=this.getDateInfo(data.userInfo.registerTimeMill);
					document.getElementById('farm_name_value').value=data.userInfo.farmName;
					document.getElementById('farmName').innerHTML=data.userInfo.farmName;
					var main=M(document.getElementById('mt-mode-wallet'));
					main.show().addClass('in').unbind('click').bind('click',function(){
						e.data.context.closeWallet(main);
						return false;	
					}).children().stopPropagation('click');
					M('.ui-mode-close',main).unbind('click').bind('click',function(){
						e.data.context.closeWallet(main);
						return false;	
					});
					M('.ui-wallet-edit').unbind('click').bind('click',{context:this},this.editName);
					M('.ui-wallet-share').unbind('click').bind('click',function(){
						window.location.href='share_4_other.html?idUser='+e.data.idUser+'&idAppendUser='+e.data.idAppendUser;
					});
				},
				error:function(msg){
					M.ui.confirm.creat({
						text:msg,
						button:['确定']
					});	
					//M.ui.waiting.creat({status:false,text:msg,time:500});	
				}
			},e.data.context);	
			return false;	
		},
		closeWallet:function(o){
//			this.btn_music.play();
			o.addClass('out');
			M.delay(300,function(){
				o.removeClass('out').removeClass('in').hide();
			});	
		},
		showExplain:function(e){
//			e.data.context.btn_music.play();
			var target=M(this);
			var main=M(document.getElementById('mt-mode-explain'));
			main.show().addClass('in').unbind('click').bind('click',function(){
				e.data.context.closeWallet(main);
				return false;	
			}).children().stopPropagation('click');
			M('.ui-mode-close',main).unbind('click').bind('click',function(){
				e.data.context.closeWallet(main);
				return false;	
			});	
			return false;	
		},
		closeExplain:function(o){
//			this.btn_music.play();
			o.addClass('out');
			M.delay(300,function(){
				o.removeClass('out').removeClass('in').hide();
			});	
		},
		editName:function(e){
//			e.data.context.btn_music.play();
			var target=M(this),
				list=target.siblings('span').children(),
				text=list.eq(0),
				input=list.eq(1);
			target.hide();
			text.hide();
			input.show();
			input.unbind('blur').bind('blur',function(){
//				e.data.context.btn_music.play();
				if(this.value.length){
					M.ui.ajax.init({
						url:M.path+'game_farm/upd_farm_name',
						data:{farmName:this.value},
						isload:false,
						success:function(data){
							text.html(data.userInfo.farmName).show();
							input.hide();
							target.show();
							document.getElementById('name').innerHTML=data.userInfo.farmName;
						},
						error:function(msg){
							M.ui.confirm.creat({
								text:msg,
								button:['确定'],
								sure:function(){
									return input.select();
								}
							});	
							//M.ui.waiting.creat({status:false,text:msg,time:500});
						}
					});	
				}else{
					target.show();
					text.show();
					this.value=text[0].innerHTML;
					input.hide();
				};	
			});
			return input.select();
		},
		showSecond:function(e){
			var target=M(this).parent(),
				idUser=target.attr('idUser'),
				idImg=target.attr('idImg'),
				info=document.getElementById('info'),
				main=M(document.getElementById('mt-mode-second'));
			M.ui.ajax.init({
				url:M.path+'game_farm/get_all_downline_img',
				data:{downlineIdUser:idUser},
				isload:true,
				success:function(data){
					document.getElementById('avatar').innerHTML=M.template.resolve(this.renderAvatar(),{src:M.getNormalPath('pic/A/m'+data.user_info_downline.idImageByUpline+'.png')});
					document.getElementById('farm_all_score').innerHTML=M.setNumberPoint(data.farm_all_score);
					document.getElementById('farm_harvest_score').innerHTML=M.setNumberPoint(data.farm_all_score-data.farm_unharvest_score);
					document.getElementById('farm_register_time').innerHTML=this.getDateInfo(data.user_info_downline.registerTimeMill);
					document.getElementById('farm_img_name').innerHTML=this.avatar[idImg];
					document.getElementById('farm_contact_user').innerHTML=data.user_info_downline.contactUser;
					M('.mt-avatar-change-'+idImg).addClass('current');
					main.addClass('in');
					if(!!!this._scroll){
						M('.ui-second-back').bind('click',function(){
//							e.data.context.btn_music.play();
							main.addClass('out');
							M.delay(300,function(){
								main.removeClass('out').removeClass('in');
								M('.mt-avatar-change').removeClass('current');
							});
							return false;	
						});
						/*this._scroll=new iScroll('_second',{
							 hScroll:false,
							 vScroll:true,
							 hScrollbar:false,
							 vScrollbar:false
						});*/
						this._scroll=true;
						/*M(document.getElementById('_avatar')).bind('touchstart',function(e){
							e.preventDefault();
							e.stopPropagation();
							return false;
						});*/
						if(this.avatar_list_num>10){
							this._avatar=new iScroll('_avatar',{
								 preventDefault:true,
								 eventPassthrough:true,
								 hScroll:false,
								 vScroll:true,
								 hScrollbar:false,
								 vScrollbar:false
							});
						};
					};
					M('.mt-avatar-change').unbind('click').bind('click',{context:this,box:target,idUser:data.user_info_downline.idUser},this.changeAvatar);
				},
				error:function(msg){
					M.ui.confirm.creat({
						text:msg,
						button:['确定']
					});	
					//M.ui.waiting.creat({status:false,text:msg,time:500});	
				}
			},e.data.context);	
			return false;
		},
		changeAvatar:function(e){
			e.preventDefault();
//			e.data.context.btn_music.play();
			e.stopPropagation();
			var target=M(this),idImg=target.attr('idImg');
			if(!target.hasClass('current')){
				M.ui.ajax.init({
					url:M.path+'game_farm/upd_downline_img',
					data:{downlineIdUser:e.data.idUser,idImg:idImg},
					isload:true,
					success:function(data){
						document.getElementById('avatar').innerHTML=M.template.resolve(this.renderAvatar(),{src:M.getNormalPath('pic/A/m'+data.user_info_downline.idImageByUpline+'.png')});
						e.data.box.attr('idImg',data.user_info_downline.idImageByUpline);
						M('.ui-farm-big',e.data.box).attr('src',M.getNormalPath('pic/A/m'+data.user_info_downline.idImageByUpline+'.png'));
						M('.ui-farm-small',e.data.box).attr('src',M.getNormalPath('pic/A_B/m'+data.user_info_downline.idImageByUpline+'.png'));
						document.getElementById('farm_img_name').innerHTML=this.avatar[data.user_info_downline.idImageByUpline];
						target.addClass('current').siblings().removeClass('current');
					},
					error:function(msg){
						M.ui.confirm.creat({
							text:msg,
							button:['确定']
						});	
						//M.ui.waiting.creat({status:false,text:msg,time:500});	
					}
				},e.data.context);
			};	
			return false;
		},
		setAvatarList:function(data){
			for(var i=0,o={};i<data.length;i++){
				o[data[i].idImg]=data[i].imgName;
			};
			return o;
		},
		setBackground:function(o,src,fn){
			var that=this;
			M(M.creatlabel('img'),{
				class:'width-auto',
				src:M.getNormalPath(src)	
			}).load(function(){	
				if(Math.floor(window.innerWidth*this.height/this.width)<window.innerHeight){
					this.style.height='100%';
				};
				o.prepend(this);
				fn.call(that);
			});	
		},
		showloading:function(fn){
			var loading=document.getElementById('loading'),span=M('span',loading),i=0,n=6,time;
			loading.style.display='block';	
			M(loading).addClass('in');
			time=setInterval(function(){
				i++;
				i==n&&(i=0);
				span.removeClass('current').eq(i).addClass('current');
			},200);
			this.cachePic(function(){
				clearInterval(time);
				M(loading).remove();
				M.cookie.set('_cache_',true,{expires:180})
				fn.call(this);
			});
		},
		cachePic:function(fn){
			for(var i=0,A=['A','B','C','A_B'],arr=[];i<A.length;i++){
				for(var j=1;j<=this.kind;j++){
					arr.push('pic/'+A[i]+'/m'+j+'.png');
				};
			};
			for(i=1;i<=13;i++){
				arr.push('m'+i+(i==5?'.jpg':'.png'));
			};
			M.ui.loadImage.init({
				pic:arr,
				//time:10,
				onProgress:function(index,length){
					document.getElementById('percent').innerHTML=Math.min(100,Math.ceil(index*100/length));
				},
				onComplete:function(that){
					that._set(fn);
				}
			},this);
		},
		_set:function(fn){
			for(var i=0,list=document.getElementsByClassName('mt-mode-load');i<list.length;i++){
				list[i].src=M.getNormalPath(list[i].getAttribute('data-src'));
			};
			fn.call(this);
		},
		getDateInfo:function(date){
			date=new Date(date);
			return date.getFullYear()+'年'+M.formatDate(date.getMonth()+1)+'月'+M.formatDate(date.getDate())+'日';
		},
		getAvatarList:function(data){
			for(var i=0,str='';i<data.length;i++){
				str+=M.template.resolve(this.renderChange(),{idImg:data[i].idImg,src:M.getNormalPath('pic/B/m'+data[i].idImg+'.png')});
			};
			return str+'<li></li><li></li><li></li><div class="clear"></div>';
		},
		getUplineList:function(data,id){
			var str='';
//			for(var i=0,str='';i<data.length;i++){
				str+=M.template.resolve(this.renderUpline(),{idUserScore:data.idUserScore,consumeScore:M.setNumberPoint(data.consumeScore),src:M.getNormalPath('pic/B/m'+id+'.png')});
//			};
			return '<ul>'+str+'<div class="clear"></div></ul>';
		},
		getList:function(data){
			for(var i=0,str='';i<data.length;i++){
				str+=this.getInner(data[i]);
			};
			return str;
		},
		getInner:function(data){
//			for(var j=0,str='';j<Math.min(10,data.listByDownlineiduser.length);j++){
//				str+=M.template.resolve(this.renderImage(data.listByDownlineiduser[j].insertTime),{idUserScore:data.listByDownlineiduser[j].idUserScore,src:M.getNormalPath('pic/A_B/m'+data.idImageByUpline+'.png')});
//			};
			for(var j=0,str='';j<data.listByDownlineiduser.length;j++){
				str+=M.template.resolve(this.renderImage(data.listByDownlineiduser[j].insertTime),{idUserScore:data.listByDownlineiduser[j].idUserScore,src:M.getNormalPath('pic/A_B/m'+data.idImageByUpline+'.png')});
			};
			return M.template.resolve(this.renderItem(),{idImg:data.idImageByUpline,idUser:data.idUser,list:str,src:M.getNormalPath('pic/A/m'+data.idImageByUpline+'.png'),list_length:data.listByDownlineiduser.length==0?"0":data.listByDownlineiduser.length});
		},
		renderUpline:function(){
			return '<li class="mt-upline-button" idUserScore="{{idUserScore}}" consumeScore="{{consumeScore}}"><img src="{{src}}" class="width-auto" /></li>';	
		},
		renderChange:function(){
			return '<li class="mt-avatar-change mt-avatar-change-{{idImg}}" idImg="{{idImg}}"><img src="{{src}}" class="width-auto" /></li>';
		},
		renderAvatar:function(){
			return '<img src="{{src}}" class="width-auto" />';	
		},
		renderItem:function(){
			return '<div class="ui-farm-item" idUser="{{idUser}}" idImg="{{idImg}}">\
				<img src="{{src}}" class="ui-farm-big"/>\
				<span class="count" style="display:none;">{{list_length}}</span>\
				<div class="ui-farm-list">{{list}}</div>\
			</div>';	
		},
		renderImage:function(time){
			var img_flag='';
			if(this.isNew(time)){
			   img_flag='<img class="small-new-flag" src="res/images/new.png">';
			}
			return '<span idUserScore="{{idUserScore}}"><img src="{{src}}" class="ui-farm-small"/>'+img_flag+'</span>';
		},
		isNew:function(time){
			var date=new Date(time);
			var now=new Date();
			var result=false;
			if(date.getFullYear()==now.getFullYear()&&date.getMonth()==now.getMonth()&&date.getDate()==now.getDate()){
				result=true;
			}
			return result;
		}
	}).ready(function(){
		M.use.init(['list','iscroll','weichatJsApi'],function(){
			M.ui.rotate.init(function(){
				M.index.init();0
			});
		});
	});
})(window.jQuery||window.Zepto||window.xQuery);