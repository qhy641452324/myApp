define(["app","formDirective","commonService","decorator","service/accountService"],function(app){
	app.register.controller("registerCtrl",RegisterCtrl);
	RegisterCtrl.$inject=['$scope','accountAPI','publicToast','$state']
	function RegisterCtrl($scope,accountAPI,publicToast,$state){
	  var vm=this;
	  vm.buttonStatus="获取手机验证码";
	  vm.intervalCount=false;
	  var phone;
		$scope.sendCaptcha=sendCaptcha;
		vm.submitCapcha=submitCapcha;
		vm.appRegister=appRegister;
		init();
		
		function init(){
		  if($state.current.name=="registerPsw"){
		    phone=$state.params.phone;
		  }
		}
		
		function sendCaptcha(){
		  accountAPI.sendMessage(vm.phone).then(function(result){
		    vm.intervalCount=1;
		    timeCounter();
		    publicToast.show("验证码已发送，请在五分钟内完成验证。");
		  })
		}
		
		function timeCounter(){
		  timeCounter.n=61;
		  vm.intervalCount=setInterval(function(){
		    if(timeCounter.n<=1){
		      clearInterval(vm.intervalCount);
		      vm.buttonStatus="获取手机验证码";
		      vm.intervalCount=null;
		      $scope.$digest();
		      return ;
		    }
		    timeCounter.n--;
		    vm.buttonStatus=timeCounter.n+"s后再次发送";
		    $scope.$digest();
		  },1000);
		}
		
		function submitCapcha(valid){
		  if(valid){
		    accountAPI.checkMessage(vm.phone,vm.capcha).then(function(result){
		      $state.go("registerPsw",{phone:vm.phone});
		    });
		  }else{
		    publicToast.show("请填写正确的手机号或验证码。");
		  }
		}
		
		function appRegister(valid){
		  if(phone&&valid){
		    if(vm.password!=vm.passwordAgain){
		      publicToast.show("两次输入密码不一致。");
		      return ;
		    }
        accountAPI.appRegister(phone,vm.password,vm.passwordAgain,0).then(function(result){
          publicToast.show("注册完成。");
          accountAPI.login(phone, vm.password).then(function(){          
            setTimeout(function(){
              $state.go("tab.user");
            },2500);
          })
        });		    
		  }
		}
		
	}	
});