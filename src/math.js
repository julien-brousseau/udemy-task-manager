const calculateTip = (total, percent = .15) => total + total * percent;

const fahrenheitToCelsius = (temp) => (temp - 32) / 1.8;

const celsiusToFahrenheit = (temp) => (temp * 1.8) + 32;

module.exports = {
  calculateTip, fahrenheitToCelsius, celsiusToFahrenheit
}
