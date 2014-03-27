angular.module("mean.system").service("RegisterService", function ($http) {
	this.isUserNameFree = function (userName, callback) {
		console.log(userName);
		$http({
			method: "GET",
			url: "/members/isUserNameFree",
			params: {
				username: userName
			}
		}).success(function (data, status, headers, config) {
			callback(null, data);
		}).error(function (data, status, headers, config) {
			callback(data);
		});
	};
});

angular.module("mean.system").controller("RegisterFormController", function ($scope, $http, $upload, RegisterService) {
	// Constants
	var SUBMIT_URL = "members/register";
	var DRAG_DROP_NEUTRAL = "Drag & Drop Your Resume Here";
	var DRAG_DROP_STYLE_NEUTRAL = "";
	var DRAG_DROP_WRONG_TYPE = "Provided file was the wrong type";
	var DRAG_DROP_WRONG_SIZE = "Provided file was too big";
	var DRAG_DROP_STYLE_WRONG = "wrong";
	var DRAG_DROP_RIGHT = "Resume file \"%s\" is ready to upload";
	var DRAG_DROP_STYLE_RIGHT = "dropped";
	// Instance variables
	$scope.pendingFile = null;
	$scope.dragDropMessage = DRAG_DROP_NEUTRAL;
	$scope.dragDropStyle = DRAG_DROP_STYLE_NEUTRAL;

	$scope.submit = function (user) {
		if ($scope.registrationForm.$valid && $scope.pendingFile) {
			alert("BOYAH");
			if ($scope.pendingFile) {
				$scope.upload = $upload.upload({
					url: SUBMIT_URL,
					method: "POST",
					data: user,
					file: $scope.pendingFile,
					fileFormDataName: "resume"
				}).progress(function (evt) {
					console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
				}).success(function (data, status, headers, config) {
					// file is uploaded successfully
					console.log("Much success.");
					console.log(data);
				});
			}
		} else {
			$('#register-modal').modal("show");
		}
	};

	$scope.selectFile = function ($files, user) {
		//$files: an array of files selected, each file has name, size, and type.
		var file = $files[0]; // Assume just one file
		var extension = file.name.split(".").pop().toLowerCase();
		// Check extension
		if (extension !== "doc" && extension !== "docx" && extension !== "pdf") {
			$scope.dragDropStyle = DRAG_DROP_STYLE_WRONG;
			$scope.dragDropMessage = DRAG_DROP_WRONG_TYPE;
		} else if (file.size > 1048576) {
			$scope.dragDropStyle = DRAG_DROP_STYLE_WRONG;
			$scope.dragDropMessage = DRAG_DROP_WRONG_SIZE;
		} else {
			// Set the file instance variable
			$scope.pendingFile = file;
			// Cosmetics
			$scope.dragDropStyle = DRAG_DROP_STYLE_RIGHT;
			$scope.dragDropMessage = DRAG_DROP_RIGHT.replace("%s", file.name);
		}
	};

	$scope.onUserIdChanged = function () {
		var val = $("#userIdText").val();
		if (val && val.length >= 5 && val.length <= 15 && /^[a-z0-9\.]+$/i.test(val)) {
			RegisterService.isUserNameFree($("#userIdText").val(), function (err, isFree) {
				if (isFree) {
					$("#userIdIndicator").addClass("good");
					$("#userIdIndicator").html("This user id is available.");
					// Mark the field valid
					$scope.registrationForm.userId.$setValidity("id", true);
				} else {
					$("#userIdIndicator").removeClass("good");
					$("#userIdIndicator").html("This user id is taken.");
					// Mark the field invalid
					$scope.registrationForm.userId.$setValidity("id", false);
				}
			});
		} else {
			$("#userIdIndicator").removeClass("good");
			$("#userIdIndicator").html("User id format invalid.");
			// Mark the field invalid
			$scope.registrationForm.userId.$setValidity("id", false);
		}
	};

	$scope.onPasswordChanged = function () {
		var pass = $("#passwordText").val();
		var conf = $("#confirmPasswordText").val();
		if (/^(?=.*[^a-zA-Z])(?=.*[a-z])(?=.*[A-Z])\S{8,}$/.test(pass)) {
			RegisterService.isUserNameFree($("#userIdText").val(), function (err, isFree) {
				if (pass === conf) {
					$("#passwordIndicator").addClass("good");
					$("#passwordIndicator").html("This password is valid.");
					// Mark the field valid
					$scope.registrationForm.password.$setValidity("pass", true);
				} else {
					$("#passwordIndicator").removeClass("good");
					$("#passwordIndicator").html("The passwords don't match.");
					// Mark the field invalid
					$scope.registrationForm.password.$setValidity("pass", false);
				}
			});
		} else {
			$("#passwordIndicator").removeClass("good");
			$("#passwordIndicator").html("Password format invalid.");
			// Mark the field invalid
			$scope.registrationForm.password.$setValidity("pass", false);
		}
	};

	// Code to validate the form
	var validate = function () {

	};
});