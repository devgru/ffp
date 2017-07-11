// Алгоритм FFP — Farthest Feasible Point, «самая дальняя подходящая точка».
// Фильтрует точки массива, выделяя тренды.
//
// Алгоритм работает с двумя основными (альфа и омега) и дополнительными (дельты) точками, формирующими коридор.
// Альфа и омега изначально указывают на стартовую точку.
// Дельты альфы или омеги — пары точки, отложенные от основной точки вверх и вниз на Δy.
// Линия между дельтами альфы формирует левую стену коридора.
// От дельт альфы до омеги откладываются линии-двери, нижняя и верхняя.
// Омегой по-очереди назначаются точки за альфой. Алгоритм движется только вперёд.
// Двери открываются так, чтобы все точки между альфой и омегой попадали в коридор.
//
// Коридор считается закрытым, когда двери пересекаются, тангенс нижней двери больше верхней.
// Последняя омега, при которой коридор был закрыт, считается подходящей точкой и назначается новой альфой.
// Алгоритм запускается циклично, пока коридор не достигнет последней точки.
export default function() {
  let getX = (value, index) => index;
  let getY = value => value;
  let getResult = value => value;
  
  let maxΔy = 1;
  
  // Компенсируем погрешность вычислений при сравнениях.
  let ε = Math.pow(2, -32);
  
  // Функция принимает на вход массив точек.
  // Возвращает массив объектов.
  function ffp(array) {
    
    // Текущая самая дальняя точка.
    let farthestFeasible = 0;
    
    // Тангенсы дверей коридора, нижней и верхней.
    let coridorDoors;
    
    // Альфа, индекс левой точки.
    let α;
    
    // Константы для обращения к границам тренда.
    const LOWER = 0;
    const UPPER = 1;
    
    // Добавление текущей точки в массив результатов.
    function pushPoint() {
      // «Скрещиваем» вектора границ тренда, чтобы их значения заменились на следующей точке.
      coridorDoors = [Infinity, -Infinity];
      // Текущую подходящую точку назначаем альфой.
      α = farthestFeasible;
      // Добавляем текущую подходящую точку в массив.
      result.push({
        index: farthestFeasible,
        item: array[farthestFeasible]
      });
    }
    
    // Массив результатов.
    const result = [];
    
    // Длина исходного массива.
    const length = array.length;
    
    // Начинаем алгоритм с добавления первой точки.
    pushPoint();
    
    // Алгоритм завершается, когда последней подходящей названа последняя точка массива.
    while (farthestFeasible < length - 1) {
      // Омега — текущая точка.
      let ω = α;
      // Пока не упёрлись в последнюю точку...
      while (ω < length) {
        const ωValue = array[ω];
        const αValue = array[α];
        // Расчитаем интересующие параметры:
        // - расстояние по оси абсцисс;
        const Δx = getX(ωValue, ω) - getX(αValue, α);
        // - расстояние по оси ординат;
        const Δy = getY(ωValue, ω) - getY(αValue, α);
        
        if (isNaN(Δx) || isNaN(Δy)) throw new Error('FFP error, value is NaN');
        
        // - тангенс линии между точками;
        const tg = Δy / Δx;
        // - изменение тангенса для дельта-точек;
        const tgΔy = maxΔy / Δx;
        // - тангенсы дверей коридора α-ω, нижней и верхней, тангенс нижней больше;
        const αωDoors = [
          tg + tgΔy,
          tg - tgΔy
        ];
        
        // Если нижняя дверь «смотрит» ниже двери коридора — подвинем дверь коридора.
        if (αωDoors[LOWER] < coridorDoors[LOWER] + ε) {
          coridorDoors[LOWER] = αωDoors[LOWER];
        }
        // Аналогично для верхней двери.
        if (coridorDoors[UPPER] < αωDoors[UPPER] + ε) {
          coridorDoors[UPPER] = αωDoors[UPPER];
        }
        if (coridorDoors[UPPER] < tg + ε && tg < coridorDoors[LOWER] + ε) {
          // Если омега попадает в коридор при текущем положении дверей — считаем её последней подходящей.
          farthestFeasible = ω;
        } else if (coridorDoors[LOWER] < coridorDoors[UPPER] + ε) {
          // Если двери коридора не пересекаются — сохраняем последнюю подходящую точку.
          pushPoint();
          // Повторяем алгоритм, откатываясь к этой точке.
          ω = α;
        }
        // В конце шага назначаем омегой следующую точку.
        ω++;
      }
      // Добавляем в результат последнюю точку массива.
      pushPoint();
    }
    
    // Возвращаем результат.
    return result.map(getResult);
  }
  
  ffp.maxDelta = function (newMaxDelta) {
    if (!arguments.length) return maxΔy;
    maxΔy = newMaxDelta;
    return ffp;
  };
  
  ffp.epsilon = function (newEpsilon) {
    if (!arguments.length) return ε;
    ε = newEpsilon;
    return ffp;
  };
  
  ffp.y = function (newGetter) {
    getY = newGetter;
    return ffp;
  };
  
  ffp.x = function (newGetter) {
    getX = newGetter;
    return ffp;
  };
  
  ffp.result = function (newGetter) {
    getResult = newGetter;
    return ffp;
  };
  
  return ffp;
}
