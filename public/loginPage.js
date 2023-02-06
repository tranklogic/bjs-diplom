const userForm = new UserForm();
userForm.loginFormCallback = (data)=>{
	ApiConnector.login(data, (response)=>{
		response.success ?
		location.reload() : 
		userForm.setLoginErrorMessage(response.error)
	})
}

userForm.registerFormCallback = (data)=>{
	ApiConnector.register(data, (response)=>{
		console.log(response)
		response.success ?
		location.reload() : 
		userForm.setRegisterErrorMessage(response.error)
	})
}