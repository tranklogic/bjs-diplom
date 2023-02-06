let favorites = null, rates = null;
const ratesBoard = new RatesBoard();
const favoritesWidget = new FavoritesWidget();
const moneyManager = new MoneyManager();
const logoutButton = new LogoutButton();

// Выход
logoutButton.action = ()=>{
	ApiConnector.logout(response=>response.success && location.reload())
}

// Пользователь входит, заполняем интерфейс
ApiConnector.current(response=>{
	if (response.success) {
		ProfileWidget.showProfile(response.data);
		renderFavorites();
		setInterval(renderRatesBoard, 1000);
	}
	renderRatesBoard();
})

// Курсы валют
function renderRatesBoard() {
	ApiConnector.getStocks(response=>{
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
			rates = response.data;
		} else {
			console.log('getStocks error: ' + response.error)
		}
	})
}

// Денежные операции
moneyManager.addMoneyCallback = (data)=>{
	ApiConnector.addMoney(data, response=>{
		if (response.success) {
			ProfileWidget.showProfile(response.data)
			moneyManager.setMessage(response.success, `Пополнение на ${data.amount} ${data.currency}`)
		} else {
			moneyManager.setMessage(response.success, response.error)
		}
	})

}

 
moneyManager.conversionMoneyCallback = (data)=>{
	ApiConnector.convertMoney(data, response=>{
		if (response.success) {
			ProfileWidget.showProfile(response.data)
			moneyManager.setMessage(response.success, `Конвертация ${data.fromAmount} ${data.fromCurrency} в ${data.fromAmount/getRate(data.fromCurrency, data.targetCurrency)} ${data.targetCurrency}`)
		} else {
			moneyManager.setMessage(response.success, response.error)
		}
	})

}

moneyManager.sendMoneyCallback = (data)=>{
	console.log(data)
	ApiConnector.transferMoney(data, response=>{
		if (response.success) {
			console.log(favorites)
			ProfileWidget.showProfile(response.data)
			moneyManager.setMessage(response.success, `Перевод ${data.amount} ${data.currency} для ${favorites[data.to]} отправлен`)
		} else {
			moneyManager.setMessage(response.success, response.error)
		}
	})
}

// Адресная книга
function renderFavorites() {
	ApiConnector.getFavorites(response=>{
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favorites = response.data;
		}
	})
}

favoritesWidget.addUserCallback  = (data)=>{
	console.log(data)
	ApiConnector.addUserToFavorites(data, response=>{
		if (response.success) {
			renderFavorites();
			favoritesWidget.setMessage(response.success, `Пользователь ${data.name} добавлен`)
		} else {
			favoritesWidget.setMessage(response.success, response.error)
		}
	})
}

favoritesWidget.removeUserCallback  = (data)=>{
	console.log(data)
	ApiConnector.removeUserFromFavorites(data, response=>{
		if (response.success) {
			favoritesWidget.setMessage(response.success, `Пользователь ${favorites[data]} удалён`)
			renderFavorites();
		} else {
			favoritesWidget.setMessage(response.success, response.error)
		}
	})
}

function getRate(from, to) {
	return rates ? rates[from + '_' + to] : 0
}
