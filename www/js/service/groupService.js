define(['app','service/exHttpService'],function(app){
	"use strict";
	app.register.service("groupAPI", groupAPI);
	
	groupAPI.$inject=['exHttp','$q'];
	
	function groupAPI(exHttp,$q){
		return{
			getGroupList:getGroupList,//获取团购商品列表
			getMyGroupList:getMyGroupList,//获取自己团购列表
			getGroupAndOrgs:getGroupAndOrgs,//获取拼团详细信息
		}
//		获取团购商品列表
		function getGroupList(panel){
			var def=$q.defer();
			exHttp.init({
				url:'/fightGroup/fightGroupsOnHome',
				method:'post',
				loading:'circle',
				loginTimeOut:true,
				params:{
					begin:panel.begin,
					length:panel.length,
				}
			}).then(function(response){
//				 console.log(response);
				 var result=response.returnData;
				 def.resolve(result);
			})
			return def.promise;
		}
		
//		获取自己团购列表
		function getMyGroupList(panel){
			var def=$q.defer();
			exHttp.init({
				url:'fightGroup/myFightGroupOrgs',
				method:'post',
				loading:'circle',
				loginTimeOut:true,
				params:{
					orgStatus:1,
					begin:panel.begin,
					length:panel.length
				}
			}).then(function(response){
				console.log(response);
				var result=response.returnData;
				def.resolve(result);
			})
			return def.promise;
		}
		//获取拼团详细信息
		function getGroupAndOrgs(id,panel){
			var def=$q.defer();
			exHttp.init({
				url:'fightGroup/getFightGroupAndOrgs',
				method:'post',
				loading:'circle',
				loginTimeOut:true,
				params:{
					idFightGroup:id,
					begin:panel.begin,
					length:panel.length
				}
			}).then(function(response){
//				console.log(response);
				var result=response.returnData;
				def.resolve(result);
			})
			return def.promise;
		}
	
	
	
	
	}
	
})
