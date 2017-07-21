define(['app'], function(app) {
		app.register.factory('modalAPI', ModalAPI);
		ModalAPI.$inject = ['$ionicModal'];

		function ModalAPI( $ionicModal) {
			return {
				initModal: initModal
			}
			function initModal($scope,modalTemplate) {
			var modal = $ionicModal.fromTemplateUrl(modalTemplate, {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function(modal) {
					$scope.modal = modal;
					return modal
				});
				$scope.openModal = function() {
					$scope.modal.show();
				};
				$scope.closeModal = function() {
					$scope.modal.hide();
				};
				$scope.$on('$destroy', function() {
					$scope.modal.remove();
				});
				return modal;
			};
		}

	})
	