$(function(){
	init();
})
	
var idUser=getUrlPare("idUser"),idAppendUser=getUrlPare("idAppendUser");
function init(){

	$.ajax({
		url:'../login/share_product?idUser='+idUser+'&idAppendUser='+idAppendUser,
		type : 'post',
		dataType:"json",
		success:function(data){
			if(data.status==0){
				var userInfo=data.returnData.userInfo;
				var share_type=data.returnData.share_type;
				if(share_type=="0"){
					$("#btn1").show();
				}else if(share_type=="1"){
					$("#btn2").show();
				}
		}
			},
		error: function(){
		}
	});
}

function doShare(){
	$(".share-leader-pic").show();
	$(".share-leader-pic").bind('click',function(){//点击隐藏分享
		  $(".share-leader-pic").hide();
	});
}
function getShare(){//http://cs.jialebao.me/weichat/share.html?placeCode=6858_0002&is_login=true&id_user_1234=381583&idAppendUser=361568
	 window.location.href="../weichat/share.html?idUser="+idUser+"&placeCode=6858_0002&idAppendUser="+idAppendUser 
}