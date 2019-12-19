const pattern = '5770-220205-1908192';

const patterns = {
  "^[0-9]{9}-[0-9]{6}$": "VIP internet",
  "^[0-9]{2}-[0-9]{6}-[0-9]{4}$": "UNIKOM",
  "^[0-9]{11}-[0-9]{4}-[0-9]{1}$": "HEP Toplinarstvo",
  "^[0-9]{6}-[0-9]{6}-[0-9]{3}$": "Pričuva",
  "^[0-9]{10}-[0-9]{6}-[0-9]{1}$": "HEP Struja",
  "^[0-9]{6}$": "Vodovod Osijek",
  "^[0-9]{4}-[0-9]{6}-[0-9]{7}$": "Komunalna naknada",
};

const regexStrings = Object.keys(patterns);
let arr = [];
for (let regexp of regexStrings) {
  arr.push(new RegExp(regexp));
}

for (let regexp of arr) {
  if(regexp.test(pattern)) {
      return patterns[regexp.source];
    }
}
