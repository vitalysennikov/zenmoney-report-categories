// Фиктивные данные в форме ответа ZenMoney API (/v8/diff/) — только для скриншотов README.
// Никаких реальных данных пользователя тут нет и не может быть.
"use strict";

const tag = [
  // Расходы
  { id: "cat-food", title: "Еда и рестораны", parent: null, color: 0xEF4444, icon: "1002_diningroom", showIncome: false, showOutcome: true },
  { id: "cat-food-groceries", title: "Продукты", parent: "cat-food", color: 0xEF4444, icon: "1001_bunch_ingredients", showIncome: false, showOutcome: true },
  { id: "cat-food-cafe", title: "Кафе и рестораны", parent: "cat-food", color: 0xEF4444, icon: "1013_sushi", showIncome: false, showOutcome: true },

  { id: "cat-transport", title: "Транспорт", parent: null, color: 0x3B82F6, icon: "3002_cars", showIncome: false, showOutcome: true },
  { id: "cat-transport-taxi", title: "Такси", parent: "cat-transport", color: 0x3B82F6, icon: "3004_taxi", showIncome: false, showOutcome: true },
  { id: "cat-transport-fuel", title: "Топливо", parent: "cat-transport", color: 0x3B82F6, icon: "3505_gasoline", showIncome: false, showOutcome: true },

  { id: "cat-entertainment", title: "Развлечения", parent: null, color: 0x8B5CF6, icon: "2003_film_reel", showIncome: false, showOutcome: true },
  { id: "cat-health", title: "Здоровье", parent: null, color: 0x10B981, icon: "6501_doctor_suitecase", showIncome: false, showOutcome: true },

  // Доходы
  { id: "cat-salary", title: "Зарплата", parent: null, color: 0xF59E0B, icon: "9002_money_bag", showIncome: true, showOutcome: false },
  { id: "cat-side-job", title: "Подработка", parent: null, color: 0xF59E0B, icon: "9013_portfolio", showIncome: true, showOutcome: false },

  // Проекты (tag[1], tag[2], ...) — тип не важен, это не категория транзакции
  { id: "proj-remont", title: "#Ремонт", parent: null, color: 0xEC4899 },
  { id: "proj-rabota", title: "#Работа", parent: null, color: 0xEC4899 }
];

const account = [
  { id: "acc-tinkoff", title: "Тинькофф Black", inBalance: true, archive: false },
  { id: "acc-cash", title: "Наличные", inBalance: true, archive: false },
  { id: "acc-stash", title: "Заначка (вклад)", inBalance: false, archive: false }
];

const instrument = [
  { id: "rub", title: "Российский рубль", shortTitle: "руб.", symbol: "₽", rate: 1 }
];

const merchant = [
  { id: "merch-wb", title: "Wildberries" },
  { id: "merch-lukoil", title: "АЗС Лукойл" }
];

function tx(id, date, fields) {
  return Object.assign({
    id, date, deleted: false,
    income: 0, incomeAccount: null, incomeInstrument: null,
    outcome: 0, outcomeAccount: null, outcomeInstrument: null,
    tag: null, payee: null, originalPayee: null, comment: null,
    merchant: null, mcc: null, hold: false, qrCode: false
  }, fields);
}

const transaction = [
  tx("t01", "2026-09-01", { tag: ["cat-food-groceries"], payee: "Пятёрочка", outcome: 1245, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub", mcc: 5411 }),
  tx("t02", "2026-09-01", { tag: ["cat-transport-taxi"], payee: "Яндекс Такси", comment: "до вокзала", outcome: 340, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub" }),
  tx("t03", "2026-09-02", { tag: ["cat-food-cafe"], payee: "Кафе «Правда»", outcome: 890, outcomeAccount: "acc-cash", outcomeInstrument: "rub" }),
  tx("t04", "2026-09-02", { tag: ["cat-entertainment"], payee: "Кинопоиск HD", comment: "подписка", outcome: 599, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub" }),
  tx("t05", "2026-09-03", { tag: ["cat-food-groceries", "proj-remont"], payee: "Wildberries", merchant: "merch-wb", outcome: 2130, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub" }),
  tx("t06", "2026-09-03", { tag: ["cat-transport-fuel"], payee: "АЗС Лукойл", merchant: "merch-lukoil", outcome: 2400, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub", mcc: 5541 }),
  tx("t07", "2026-09-04", { tag: ["cat-health"], payee: "Аптека «Ригла»", outcome: 560, outcomeAccount: "acc-cash", outcomeInstrument: "rub" }),
  tx("t08", "2026-09-04", { tag: ["cat-food-groceries"], comment: "продукты на неделю", outcome: 3120, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub" }),
  tx("t09", "2026-09-05", { tag: ["cat-salary", "proj-rabota"], payee: "ООО «Ромашка»", income: 85000, incomeAccount: "acc-tinkoff", incomeInstrument: "rub" }),
  tx("t10", "2026-09-05", { tag: ["cat-transport-taxi"], payee: "Максим", outcome: 250, outcomeAccount: "acc-cash", outcomeInstrument: "rub", hold: true }),
  tx("t11", "2026-09-06", { tag: ["cat-food-cafe"], payee: "Кофе с собой", outcome: 220, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub", qrCode: true }),
  // возврат: деньги пришли обратно в расходную категорию ("Продукты" — showOutcome=true/showIncome=false)
  tx("t12", "2026-09-06", { tag: ["cat-food-groceries"], payee: "Пятёрочка (возврат)", income: 350, incomeAccount: "acc-tinkoff", incomeInstrument: "rub" }),
  tx("t13", "2026-09-07", { tag: ["cat-entertainment"], payee: "Steam", comment: "игра со скидкой", outcome: 1499, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub" }),
  // перевод на счёт вне выборки по умолчанию (acc-stash не в балансе)
  tx("t14", "2026-09-07", { payee: "Перевод в заначку", outcome: 15000, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub", income: 15000, incomeAccount: "acc-stash", incomeInstrument: "rub" }),
  tx("t15", "2026-09-08", { tag: ["cat-transport-fuel"], payee: "АЗС Лукойл", outcome: 1800, outcomeAccount: "acc-cash", outcomeInstrument: "rub" }),
  tx("t16", "2026-09-09", { tag: ["cat-side-job"], payee: "Фриланс-заказ", income: 12000, incomeAccount: "acc-cash", incomeInstrument: "rub" }),
  tx("t17", "2026-09-09", { tag: ["cat-food-groceries"], payee: "Пятёрочка", outcome: 670, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub" }),
  tx("t18", "2026-09-10", { tag: ["cat-transport-taxi"], payee: "Яндекс Такси", outcome: 410, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub" }),
  tx("t19", "2026-09-11", { tag: ["cat-food-cafe"], payee: "Даблби кофе", outcome: 310, outcomeAccount: "acc-cash", outcomeInstrument: "rub" }),
  // без категории
  tx("t20", "2026-09-12", { payee: "Перевод другу", outcome: 2000, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub" }),
  tx("t21", "2026-09-14", { tag: ["cat-entertainment"], payee: "Яндекс Плюс", outcome: 399, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub" }),
  // перевод обратно из заначки (счёт вне выборки -> счёт в выборке)
  tx("t22", "2026-09-15", { payee: "Возврат из заначки", outcome: 5000, outcomeAccount: "acc-stash", outcomeInstrument: "rub", income: 5000, incomeAccount: "acc-tinkoff", incomeInstrument: "rub" }),
  tx("t23", "2026-09-16", { tag: ["cat-food-groceries"], payee: "Ашан", outcome: 4560, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub", mcc: 5411 }),
  tx("t24", "2026-09-18", { tag: ["cat-health"], payee: "Клиника «Здоровье»", outcome: 3200, outcomeAccount: "acc-tinkoff", outcomeInstrument: "rub" })
];

module.exports = { tag, account, instrument, merchant, transaction };
